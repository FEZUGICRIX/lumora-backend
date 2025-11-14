import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { Token, TokenType } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

import { HashService } from '../services/hash.service'
import { PrismaService } from '@/core/prisma/prisma.service'
import { MailService } from '@/modules/mail/mail.service'
import { UserService } from '@/modules/user/user.service'

import { NewPasswordInput } from './dto/new-password.input'
import { ResetPasswordInput } from './dto/reset-password.input'

@Injectable()
export class PasswordRecoveryService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
		private readonly mailService: MailService,
		private readonly hashService: HashService,
	) {}

	async resetPassword(dto: ResetPasswordInput): Promise<boolean> {
		const user = await this.userService.findUserByEmail(dto.email)
		if (!user)
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста проверьте адрес электронной почты и попробуйте снова',
			)

		const { token, email } = await this.generateResetPasswordToken(user.email)
		await this.mailService.sendResetPasswordEmail(email, token)

		return true
	}

	async newPassword(dto: NewPasswordInput): Promise<boolean> {
		const existingToken = await this.prisma.token.findFirst({
			where: {
				token: dto.token,
				type: TokenType.PASSWORD_RESET,
			},
		})

		if (!existingToken)
			throw new UnauthorizedException(
				'Токен не найден. Пожалуйста, проверьте правильность введенного токена или запросите новый.',
			)

		const isExpired = new Date() > new Date(existingToken.expiresAt)
		if (isExpired)
			throw new BadRequestException(
				'Токен подтверждения истек. Пожалуйста, запросите новый токен для сброса пароля',
			)

		const existingUser = await this.userService.findUserByEmail(
			existingToken.email,
		)
		if (!existingUser)
			throw new NotFoundException(
				'Пользователь с указанным адресом электронной почты не найден. Пожалуйста, убедитесь, что вы ввели правильный email',
			)

		await this.prisma.user.update({
			where: {
				email: existingToken.email,
			},
			data: {
				passwordHash: await this.hashService.hashPassword(dto.password),
			},
		})

		await this.prisma.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.PASSWORD_RESET,
			},
		})

		return true
	}

	private async generateResetPasswordToken(email: string): Promise<Token> {
		const token = uuidv4()
		const expiresAt = new Date(new Date().getTime() + 3600 * 1000) // 1 hour

		const existingToken = await this.prisma.token.findFirst({
			where: {
				email,
				type: TokenType.PASSWORD_RESET,
			},
		})

		if (existingToken) {
			await this.prisma.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.PASSWORD_RESET,
				},
			})
		}

		const passwordResetToken = await this.prisma.token.create({
			data: {
				email,
				token,
				expiresAt,
				type: TokenType.PASSWORD_RESET,
			},
		})

		return passwordResetToken
	}
}
