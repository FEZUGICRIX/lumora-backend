import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthMessageResponse {
  @Field()
  message: string;
}
