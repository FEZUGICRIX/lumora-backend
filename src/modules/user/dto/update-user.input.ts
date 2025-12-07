import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator'

@InputType()
export class UpdateUserInput {
	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	username?: string

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	displayName?: string

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	bio?: string

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	location?: string

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	@IsUrl()
	coverUrl?: string

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	@IsUrl()
	avatarUrl?: string

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	@IsUrl()
	websiteUrl?: string

	@Field({ nullable: true })
	@IsOptional()
	@IsBoolean({ message: 'isTwoFactorEnabled Должен быть строкой' })
	isTwoFactorEnabled?: boolean
}
