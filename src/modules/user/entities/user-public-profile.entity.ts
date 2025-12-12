import { Field, ID, ObjectType } from '@nestjs/graphql'
import { UserRole } from '@prisma/client'
import { GraphQLJSON } from 'graphql-scalars'

// Назначение: Публичное представление профиля. Используется для отображения
// данных любого пользователя (например, автора статьи или списка пользователей).
// Исключает все чувствительные поля (email, методы аутентификации, статус 2FA),
// обеспечивая безопасность и минимализм схемы.
@ObjectType('UserPublicProfile')
export class UserPublicProfile {
	@Field(() => ID)
	id: string

	@Field()
	username: string

	@Field()
	displayName: string

	@Field(() => GraphQLJSON, { nullable: true })
	readmeContent?: any // TODO: поставить нормальный тип

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

	@Field()
	createdAt: Date
}
