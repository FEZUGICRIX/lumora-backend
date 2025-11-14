import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsString({ message: 'Password must be a string' })
	@IsNotEmpty({ message: 'Password is required' })
	@MinLength(6, { message: 'Password m ust be at least 6 characters long' })
	password: string

	@Field({ description: 'Reset password token' })
	@IsString({ message: 'Токен должен быть строкой.' })
	@IsNotEmpty({ message: 'Поле токен не может быть пустым' })
	token: string
}
