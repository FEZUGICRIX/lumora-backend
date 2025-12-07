import { NotFoundException } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { UserService } from './user.service'

import { UpdateUserInput } from './dto/update-user.input'

import { Authorization } from '../auth/decorators/auth.decorator'
import { Authorized } from '../auth/decorators/authorized.decorator'

import { UserProfile } from './entities/user-profile.entity'
import { UserPublicProfile } from './entities/user-public-profile.entity'

@Resolver()
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	// Метод для авторизованного пользователя (получение своего профиля)
	@Authorization()
	@Query(() => UserProfile)
	async findProfile(@Authorized('id') userId: string) {
		const user = this.userService.findUserById(userId)
		if (!user) throw new NotFoundException('Пользователь не найден')

		return user
	}

	// Метод для получения любого профиля по ID (публичный доступ)
	@Query(() => UserPublicProfile, { name: 'user' })
	async user(@Args('username', { type: () => String }) username: string) {
		const user = await this.userService.findUserByUsername(username)

		if (!user) {
			throw new NotFoundException(
				`Пользователь с username ${username} не найден`,
			)
		}

		return user
	}

	// Метод для обновления профиля
	@Mutation(() => UserProfile)
	@Authorization()
	async updateProfile(
		@Args('updateProfileInput') dto: UpdateUserInput,
		@Authorized('id') userId: string,
	) {
		return this.userService.updateUser(userId, dto)
	}
}
