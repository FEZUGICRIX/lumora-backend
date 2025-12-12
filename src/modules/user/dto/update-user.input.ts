import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator'
import { GraphQLJSON } from 'graphql-scalars'

import { IsTipTapDoc } from '@/shared/validators'

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

	@Field(() => GraphQLJSON, { nullable: true })
	@IsTipTapDoc() // Валидацию структуры контента
	@IsOptional()
	readmeContent?: any // TODO: поставить нормальный тип

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
