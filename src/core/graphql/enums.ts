import {
	AuthMethod,
	ReactionTargetType,
	ReactionType,
	UserRole,
} from '@prisma/generated'

import { registerEnumType } from '@nestjs/graphql'

registerEnumType(UserRole, {
	name: 'UserRole',
	description: 'Defines roles available in the system',
})

registerEnumType(AuthMethod, {
	name: 'AuthMethod',
	description: 'Supported authentication methods',
})

registerEnumType(ReactionTargetType, {
	name: 'ReactionTargetType',
	description: 'Target entity type for reactions',
})

registerEnumType(ReactionType, {
	name: 'ReactionType',
	description: 'Reaction type enum',
})

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}
registerEnumType(SortOrder, { name: 'SortOrder' })
