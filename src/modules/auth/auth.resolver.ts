import { BadRequestException, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { Request, Response } from 'express'

import { AuthService } from './auth.service'
import { ProviderService } from './provider/provider.service'

import { AuthMinimalData } from './dto/auth-minimal-data.input'
import { LoginInput } from './dto/login.input'
import { RegisterInput } from './dto/register.input'
import { LoginResult } from './unions/login-result.union'
import { MessageResponse, UrlResponse } from '@/shared/dto'

import { Authorization } from './decorators/auth.decorator'
import { Authorized } from './decorators/authorized.decorator'
import { AuthProviderGuard } from './guards/provider.guard'

@Resolver()
export class AuthResolver {
	constructor(
		private readonly authService: AuthService,
		private readonly providerService: ProviderService,
	) {}

	@Mutation(() => MessageResponse)
	register(@Args('registerInput') dto: RegisterInput) {
		return this.authService.register(dto)
	}

	@Mutation(() => LoginResult)
	login(
		@Args('loginInput') dto: LoginInput,
		@Context() context: { req: Request },
	) {
		return this.authService.login(dto, context.req)
	}

	@UseGuards(AuthProviderGuard)
	@Query(() => UrlResponse)
	async connect(@Args('provider') provider: string) {
		const providerInstance = this.providerService.findByService(provider)

		if (!providerInstance) {
			throw new BadRequestException(`Provider '${provider}' is not supported`)
		}

		return {
			url: providerInstance.getAuthUrl(),
		}
	}

	// НОВЫЙ МИНИМАЛЬНЫЙ РЕЗОЛВЕР ДЛЯ RSC
	@Authorization()
	@Query(() => AuthMinimalData)
	async currentAuthMinimal(
		@Authorized('id') userId: string,
		@Authorized('username') username: string,
	) {
		// ВАЖНО: Тут мы не делаем запрос в БД!
		// Если AuthGuard успешно сработал, то userId и username доступны.
		// Если Guard не сработал (нет куки), то @Authorization() выбросит ошибку Unauthorized,
		// и этот код не выполнится.

		return { id: userId, username }
	}

	@Mutation(() => Boolean)
	logout(@Context() context: { req: Request; res: Response }) {
		return this.authService.logout(context.req, context.res)
	}
}
