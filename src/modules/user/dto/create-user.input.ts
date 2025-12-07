import { Field, InputType } from '@nestjs/graphql'
import { AuthMethod, UserRole } from '@prisma/client'
import {
	IsBoolean,
	IsEmail,
	IsEnum,
	IsOptional,
	Matches,
	MinLength,
} from 'class-validator'

@InputType()
export class CreateUserInput {
	// 🧩 Основная информация
	@Field()
	@Matches(/^[a-zA-Z0-9_]{3,20}$/, { message: 'Invalid username' })
	username?: string

	@Field()
	@IsEmail()
	email: string

	@Field(() => AuthMethod)
	@IsEnum(AuthMethod)
	method: AuthMethod

	@Field()
	@MinLength(6)
	passwordHash: string

	// 👤 Персональные данные
	@Field()
	displayName: string

	@Field({ nullable: true })
	@IsOptional()
	avatarUrl?: string

	// ⚙️ Системные поля
	@Field(() => UserRole, { defaultValue: UserRole.USER })
	@IsEnum(UserRole)
	role?: UserRole

	@Field({ defaultValue: false })
	@IsBoolean()
	emailVerified: boolean
}
