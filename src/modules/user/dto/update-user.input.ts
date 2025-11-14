import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class UpdateUserInput {
	@Field()
	@IsString()
	firstName: string

	@Field()
	@IsString()
	lastName: string

	@Field()
	@IsNotEmpty()
	@IsBoolean({ message: 'isTwoFactorEnabled Должен быть строкой' })
	isTwoFactorEnabled: boolean
}
