import {
	BadRequestException,
	ConflictException,
	Injectable,
} from '@nestjs/common'
import { AuthMethod, Prisma, User } from '@prisma/client'

import { UsernameService } from './services/username.service'
import { PrismaService } from '@/core/prisma/prisma.service'

import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly usernameService: UsernameService,
	) {}

	async findUserById(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
			include: { accounts: true },
		})

		return user
	}

	async findUserByEmail(email: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { email },
			include: { accounts: true },
		})

		return user
	}

	async findUserByUsername(username: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { username },
			include: { accounts: true },
		})

		return user
	}

	async createUser(createUserInput: CreateUserInput): Promise<User> {
		const username =
			createUserInput.username ??
			(await this.usernameService.generateUniqueUsername(
				createUserInput.email,
				username => this.isUsernameAvailable(username),
			))

		// 🔧 Логика: для OAUTH → passwordHash = null
		const passwordHash =
			createUserInput.method === AuthMethod.CREDENTIALS
				? createUserInput.passwordHash
				: null

		const user = await this.prisma.user.create({
			data: {
				...createUserInput,
				username,
				passwordHash,
			},
			include: { accounts: true },
		})

		return user
	}

	async checkUser(username: string, email?: string): Promise<void> {
		const existingUser = await this.prisma.user.findFirst({
			where: { OR: [{ email }, { username }] },
		})

		if (existingUser) {
			if (existingUser.email === email)
				throw new ConflictException('User with this email already exists')
			if (existingUser.username === username)
				throw new ConflictException('User with this username already exists')
		}
	}

	async isUsernameAvailable(username: string): Promise<boolean> {
		const user = await this.prisma.user.findFirst({
			where: { username },
		})

		return user ? true : false
	}

	async updateUser(userId: string, dto: UpdateUserInput): Promise<User> {
		const user = await this.findUserById(userId)
		if (!user) throw new BadRequestException('Пользователь не найден')

		if (
			dto.username &&
			dto.username !== user.username &&
			(await this.isUsernameAvailable(dto.username))
		) {
			throw new ConflictException('This username is already taken')
		}

		// Очистка и преобразование DTO
		// Преобразуем пустые строки (для очистки URL/Bio) в null, как того требует String? в Prisma
		const dataToUpdate: Prisma.UserUpdateInput = Object.keys(dto).reduce(
			(acc, key) => {
				const value = dto[key as keyof UpdateUserInput]

				// Важная момент: если поле равно '', преобразуем его в null.
				// Это позволяет очистить опциональные поля (URL, Bio) на фронтенде.
				if (value === '') {
					acc[key] = null
				} else if (value !== undefined) {
					// Если поле передано и не является undefined (то есть имеет значение или null)
					acc[key] = value
				}

				return acc
			},
			{} as Prisma.UserUpdateInput,
		)

		const updatedUser = await this.prisma.user.update({
			where: { id: user.id },
			data: dataToUpdate,
		})

		return updatedUser
	}
}
