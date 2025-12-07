import { Field, ID, ObjectType } from '@nestjs/graphql'
import { AuthMethod, UserRole } from '@prisma/client'

// Назначение: Полный, приватный профиль. Используется исключительно для запросов
// авторизованного пользователя, запрашивающего СВОИ данные (например, Query findProfile).
// Включает чувствительную информацию, необходимую для управления аккаунтом.
@ObjectType()
export class UserProfile {
	@Field(() => ID)
	id: string

	@Field()
	username: string

	@Field()
	email: string

	@Field()
	displayName: string

	@Field({ nullable: true })
	bio?: string

	@Field({ nullable: true })
	location?: string

	@Field({ nullable: true })
	websiteUrl?: string

	@Field({ nullable: true })
	avatarUrl?: string

	@Field({ nullable: true })
	coverUrl?: string

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
