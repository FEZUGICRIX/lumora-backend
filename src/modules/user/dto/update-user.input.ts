import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class UpdateUserInput {
	@Field()
	@IsString()
	displayName: string

	@Field()
	@IsNotEmpty()
	@IsBoolean({ message: 'isTwoFactorEnabled Должен быть строкой' })
	isTwoFactorEnabled: boolean
}
