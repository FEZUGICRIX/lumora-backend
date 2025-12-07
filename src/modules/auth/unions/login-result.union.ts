import { createUnionType } from '@nestjs/graphql'

import { UserProfile } from '@/modules/user/entities/user-profile.entity'

import { MessageResponse } from '@/shared/dto'

export const LoginResult = createUnionType({
	name: 'LoginResult',
	types: () => [UserProfile, MessageResponse] as const,
	resolveType(value) {
		if ('email' in value) {
			return UserProfile
		}
		if ('message' in value) {
			return MessageResponse
		}
		return null
	},
})
