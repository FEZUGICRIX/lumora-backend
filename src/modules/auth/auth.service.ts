import { AuthMethod, Prisma, User, UserRole } from '@prisma/generated'

import {
	BadRequestException,
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request, Response } from 'express'

import { UserService } from '@/modules/user/user.service'

import { EmailConfirmationService } from './email-confirmation/email-confirmation.service'
import { ProviderService } from './provider/provider.service'
import { BaseOAuthService } from './provider/services/base-oauth.service'
import { HashService } from './services/hash.service'
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service'
import { PrismaService } from '@/core/prisma/prisma.service'

import { LoginInput } from './dto/login.input'
import { RegisterInput } from './dto/register.input'
import { MessageResponse } from '@/shared/dto'

import type { AuthenticatedRequest } from '@/core/types'

import { isDev, parseBoolean } from '@/shared/utils'

import type { TypeUserInfo } from './provider/services/types'

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly providerService: ProviderService,
		private readonly usersService: UserService,
		private readonly hash: HashService,
		private readonly configService: ConfigService,
		@Inject(forwardRef(() => EmailConfirmationService))
		private readonly emailConfirmationService: EmailConfirmationService,
		private readonly twoFactorAuthService: TwoFactorAuthService,
	) {}

	async register(dto: RegisterInput): Promise<MessageResponse> {
		await this.usersService.checkUser(dto.username, dto.email)

		if (dto.password !== dto.passwordRepeat) {
			throw new ConflictException('Passwords do not match')
		}

		const newUser = await this.usersService.createUser({
			username: dto.username,
			displayName: dto.displayName,
			passwordHash: await this.hash.hashPassword(dto.password),
			email: dto.email,
			emailVerified: false,
			method: AuthMethod.CREDENTIALS,
			role: UserRole.USER,
		})

		await this.emailConfirmationService.sendVerificationToken(newUser.email)

		return {
			message:
				'Вы успешно зарегистрировались. Пожалуйста, подтвердите ваш email. Письмо было отправлено на ваш почтовый адрес',
		}
	}

	async login(dto: LoginInput, req: Request): Promise<User | MessageResponse> {
		const user = await this.validateUser(dto.email, dto.password)

		if (!user) {
			throw new UnauthorizedException('Invalid email or password')
		}

		// TODO: Вынести в отдельный метод
		if (user.isTwoFactorEnabled) {
			if (!dto.code) {
				await this.twoFactorAuthService.sendTwoFactorToken(user.email)

				return {
					message:
						'Проверьте вашу почту. Требуется код двухфакторной аутентификации',
				}
			}

			await this.twoFactorAuthService.validateTwoFactorToken(
				dto.email,
				dto.code,
			)
		}

		await this.saveSession(req, user)
		return user
	}

	async extractProfileFromCode(
		req: Request,
		provider: string,
		code: string,
	): Promise<User> {
		const providerInstance = this.getProviderInstance(provider)
		const profile = await this.getUserProfile(providerInstance, code)

		return await this.prisma.$transaction(async tx => {
			const existingUser = await this.findExistingUser(tx, profile)

			if (existingUser) {
				await this.saveSession(req, existingUser)
				return existingUser
			}

			return await this.createNewUserWithAccount(tx, req, profile)
		})
	}

	async logout(req: Request, res: Response): Promise<boolean> {
		try {
			await new Promise<void>((resolve, reject) => {
				req.session.destroy(error => (error ? reject(error) : resolve()))
			})

			const SESSION_NAME = this.configService.getOrThrow<string>('SESSION_NAME')

			const isProduction = !isDev(this.configService)
			const domain = isProduction ? undefined : 'localhost'

			const cookieOptions = {
				path: '/',
				secure: isProduction,
				sameSite: isProduction
					? 'none'
					: ('lax' as boolean | 'lax' | 'strict' | 'none' | undefined),
				domain: domain,
				httpOnly: parseBoolean(
					this.configService.getOrThrow<string>('SESSION_HTTP_ONLY'),
				),
			}

			res.clearCookie(SESSION_NAME, cookieOptions)
			return true
		} catch (error) {
			throw new InternalServerErrorException('Logout failed')
		}
	}

	async saveSession(req: AuthenticatedRequest, user: User): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			try {
				req.session.userId = user.id
				req.session.username = user.username
				req.session.role = user.role

				req.session.save(err => {
					if (err) {
						console.error('Failed to save session for user', user.id, err)
						return reject(
							new InternalServerErrorException('Session save failed'),
						)
					}
					resolve()
				})
			} catch (e) {
				reject(e)
			}
		})
	}

	private getProviderInstance(provider: string): BaseOAuthService {
		const providerInstance = this.providerService.findByService(provider)
		if (!providerInstance) {
			throw new NotFoundException(`Provider ${provider} not found`)
		}
		return providerInstance
	}

	private async getUserProfile(
		providerInstance: BaseOAuthService,
		code: string,
	): Promise<TypeUserInfo> {
		const profile = await providerInstance.findUserByCode(code)
		if (!profile) {
			throw new BadRequestException('Failed to extract profile from code')
		}
		return profile
	}

	private async createNewUserWithAccount(
		tx: Prisma.TransactionClient,
		req: Request,
		profile: TypeUserInfo,
	): Promise<User> {
		const authMethod = this.validateAuthMethod(profile.provider)

		// Проверяем юзера по email — ВСЕ в рамках транзакции
		const existingUser = await tx.user.findUnique({
			where: { email: profile.email },
			include: { accounts: true },
		})

		// Если уже есть юзер с таким email
		if (existingUser) {
			const hasProvider = existingUser.accounts.some(
				acc => acc.provider === profile.provider,
			)

			if (!hasProvider) {
				await this.createAccount(tx, existingUser.id, profile)
			}

			await this.saveSession(req, existingUser)
			return existingUser
		}

		const user = await tx.user.create({
			data: {
				email: profile.email,
				username: profile.email.split('@')[0],
				method: authMethod,
				displayName: profile.name,
				passwordHash: null,
				avatarUrl: profile.picture,
				emailVerified: true,

				// ✅ Чистый способ создать User и Account одной транзакцией
				accounts: {
					create: {
						type: 'oauth',
						provider: profile.provider,
						providerAccountId: profile.id,
						accessToken: profile.accessToken,
						refreshToken: profile.refreshToken,
						expiresAt: profile.expiresAt,
						// ... другие поля токенов
					},
				},
			},
		})

		await this.saveSession(req, user)
		return user
	}

	private async validateUser(
		email: string,
		password: string,
	): Promise<User | null> {
		const user = await this.usersService.findUserByEmail(email)

		// ✅ Защита от OAuth логина по паролю
		if (!user || user.method !== AuthMethod.CREDENTIALS) return null
		if (!password || !user.passwordHash) return null

		const isPasswordValid = await this.hash.verifyPassword(
			user.passwordHash,
			password,
		)

		if (!isPasswordValid) return null

		if (!user.emailVerified) {
			await this.emailConfirmationService.sendVerificationToken(user.email)
			throw new UnauthorizedException(
				'Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите адрес.',
			)
		}

		return user
	}

	private validateAuthMethod(provider: string): AuthMethod {
		const authMethod = AuthMethod[provider.toUpperCase()]
		if (!authMethod) {
			throw new BadRequestException(`Unsupported provider: ${provider}`)
		}
		return authMethod
	}

	private async createAccount(
		tx: Prisma.TransactionClient,
		userId: string,
		profile: TypeUserInfo,
	): Promise<void> {
		// ✅ Строгая проверка наличия критического ID
		// Это предотвратит ошибку Prisma, если провайдер не вернул ID.
		if (!profile.id || typeof profile.id !== 'string') {
			throw new InternalServerErrorException(
				`OAuth provider '${profile.provider}' did not return a valid unique ID.`,
			)
		}

		await tx.account.create({
			data: {
				userId,
				type: 'oauth',
				provider: profile.provider,

				providerAccountId: profile.id,

				accessToken: profile.accessToken,
				refreshToken: profile.refreshToken,
				expiresAt: profile.expiresAt,
			},
		})
	}

	private async findExistingUser(
		tx: Prisma.TransactionClient,
		profile: TypeUserInfo,
	): Promise<User | null> {
		// 1. Поиск Account по композитному уникальному ключу
		const account = await tx.account.findFirst({
			where: {
				provider: profile.provider,
				providerAccountId: profile.id, // ID провайдера, полученный из профиля (Google ID, GitHub ID и т.д.)
			},
			select: {
				userId: true, // Нам нужен только ID пользователя для дальнейшего поиска
			},
		})

		if (!account?.userId) {
			return null
		}

		// 2. Поиск User по найденному userId
		// Используем findUnique с явным указанием id для максимальной надежности
		return await tx.user.findUnique({ where: { id: account.userId } })
	}
}
