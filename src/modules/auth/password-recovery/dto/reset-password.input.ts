import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class ResetPasswordInput {
	@Field(() => String)
	@IsEmail({}, { message: 'Invalid email format' })
	@IsString({ message: 'Email must be a string' })
	@IsNotEmpty({ message: 'Email is required' })
	email: string
}
