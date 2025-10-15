import { InputType, Field } from '@nestjs/graphql';
import { AuthMethod, UserRole } from '@prisma/client';
import {
  IsEmail,
  Matches,
  MinLength,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  // 🧩 Основная информация
  @Field()
  @Matches(/^[a-zA-Z0-9_]{3,20}$/, { message: 'Invalid username' })
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => AuthMethod)
  @IsEnum(AuthMethod)
  method: AuthMethod;

  @Field()
  @MinLength(6)
  password: string;

  // 👤 Персональные данные
  @Field()
  firstName: string;

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  avatar?: string;

  // ⚙️ Системные поля
  @Field(() => UserRole, { defaultValue: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;

  @Field({ defaultValue: false })
  @IsBoolean()
  emailVerified: boolean;
}
