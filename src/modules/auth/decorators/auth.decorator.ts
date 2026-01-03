import { UserRole } from '@prisma/generated'

import { applyDecorators, UseGuards } from '@nestjs/common'

import { AuthGuard } from '../guards/auth.guard'
import { RolesGuard } from '../guards/roles.guard'
import { AuthOptions } from './auth-options.decorator'
import { Roles } from './roles.decorator'

interface AuthorizationParams {
	roles?: UserRole[]
	optional?: boolean
}

export const Authorization = ({
	roles,
	optional = false,
}: AuthorizationParams = {}) => {
	const decorators = [AuthOptions({ optional }), UseGuards(AuthGuard)]

	if (roles?.length) {
		decorators.push(Roles(...roles))
		decorators.push(UseGuards(RolesGuard))
	}

	return applyDecorators(...decorators)
}
