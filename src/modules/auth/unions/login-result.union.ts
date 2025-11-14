import { User } from '@/modules/user/entities/user.entity'

import { createUnionType } from '@nestjs/graphql'

import { MessageResponse } from '@/shared/dto'

export const LoginResult = createUnionType({
	name: 'LoginResult',
	types: () => [User, MessageResponse] as const,
	resolveType(value) {
		if ('email' in value) {
			return User
		}
		if ('message' in value) {
			return MessageResponse
		}
		return null
	},
})
