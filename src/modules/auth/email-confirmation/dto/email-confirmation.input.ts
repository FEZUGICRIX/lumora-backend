import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ConfirmationInput {
  @Field({ description: 'Email confirmation' })
  @IsString({ message: 'Токен должен быть строкой.' })
  @IsNotEmpty({ message: 'Поле токен не может быть пустым' })
  token: string;
}
