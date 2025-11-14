import { Field, ID, ObjectType } from '@nestjs/graphql'
import { AuthMethod, UserRole } from '@prisma/client'

@ObjectType()
export class User {
	@Field(() => ID)
	id: string

	@Field()
	username: string

	@Field()
	email: string

	@Field()
	firstName: string

	@Field({ nullable: true })
	lastName?: string

	@Field({ nullable: true })
	avatar?: string

	@Field(() => UserRole)
	role: UserRole

	@Field(() => AuthMethod)
	method: AuthMethod

	@Field()
	emailVerified: boolean

	@Field()
	isTwoFactorEnabled: boolean

	@Field()
	createdAt: Date
}
