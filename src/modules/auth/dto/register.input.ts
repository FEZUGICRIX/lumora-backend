import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  Validate,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field(() => String)
  @IsString({ message: 'First name must be a string' })
  @Matches(/^[a-zA-Z0-9_]{3,20}$/, { message: 'Invalid username' })
  username: string;

  @Field(() => String)
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @Field(() => String)
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @Field(() => String)
  @IsEmail({}, { message: 'Invalid email format' })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Field(() => String)
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Field(() => String)
  @IsString({ message: 'Password repeat must be a string' })
  @IsNotEmpty({ message: 'Password repeat is required' })
  @MinLength(6, {
    message: 'Password repeat must be at least 6 characters long',
  })
  @Validate((o) => o.password === o.passwordRepeat, {
    message: 'Passwords do not match',
  })
  passwordRepeat: string;

  @Field(() => String, { nullable: true })
  @IsString({ message: 'Avatar must be a string' })
  @IsNotEmpty({ message: 'Avatar cannot be empty', each: true })
  @IsOptional()
  avatar?: string;
}
