import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { UserRole } from '@prisma/client'

import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		const ctx = GqlExecutionContext.create(context)
		const { req } = ctx.getContext()

		const userId = req.session?.userId
		if (!userId) {
			throw new UnauthorizedException('User not authenticated.')
		}

		if (!roles) return true

		if (!roles.includes(req.user.role)) {
			throw new ForbiddenException(
				'You do not have permission to access this resource. You do not have the required role.',
			)
		}

		return true
	}
}
