import { NotFoundException } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { UserService } from './user.service'

import { UpdateUserInput } from './dto/update-user.input'

import { Authorization } from '../auth/decorators/auth.decorator'
import { Authorized } from '../auth/decorators/authorized.decorator'

import { User } from './entities/user.entity'

@Resolver()
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Authorization()
	@Query(() => User)
	async findProfile(@Authorized('id') userId: string) {
		const user = this.userService.findUserById(userId)
		if (!user) throw new NotFoundException('Пользователь не найден')

		return user
	}

	@Mutation(() => User)
	@Authorization()
	async updateProfile(
		@Args('updateProfileInput') dto: UpdateUserInput,
		@Authorized('id') userId: string,
	) {
		return this.userService.updateUser(userId, dto)
	}
}
