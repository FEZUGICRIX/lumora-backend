import { Field, InputType } from '@nestjs/graphql'
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator'

@InputType()
export class LoginInput {
	@Field()
	@IsEmail({}, { message: 'Invalid email format' })
	@IsString({ message: 'Email must be a string' })
	@IsNotEmpty({ message: 'Email is required' })
	email: string

	@Field()
	@IsString({ message: 'Password must be a string' })
	@IsNotEmpty({ message: 'Password is required' })
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	password: string

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	code?: string
}
