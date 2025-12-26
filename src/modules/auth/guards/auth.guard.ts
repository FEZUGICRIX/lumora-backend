import {
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { UserService } from '@/modules/user/user.service'

import {
	AUTH_OPTIONS_KEY,
	AuthOptions,
} from '../decorators/auth-options.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly userService: UserService,
		private readonly reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const { req } = ctx.getContext()

		const { optional } =
			this.reflector.getAllAndOverride<AuthOptions>(AUTH_OPTIONS_KEY, [
				context.getHandler(),
				context.getClass(),
			]) ?? {}

		const userId = req.session?.userId

		if (!userId) {
			if (optional) return true
			throw new UnauthorizedException('User not authenticated')
		}

		const user = await this.userService.findUserById(userId)
		if (!user) throw new NotFoundException('User not found')

		req.user = user
		return true
	}
}
