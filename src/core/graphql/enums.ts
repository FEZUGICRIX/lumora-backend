import { registerEnumType } from '@nestjs/graphql'
import { AuthMethod, UserRole } from '@prisma/client'

registerEnumType(UserRole, {
	name: 'UserRole',
	description: 'Defines roles available in the system',
})

registerEnumType(AuthMethod, {
	name: 'AuthMethod',
	description: 'Supported authentication methods',
})

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}
registerEnumType(SortOrder, { name: 'SortOrder' })
