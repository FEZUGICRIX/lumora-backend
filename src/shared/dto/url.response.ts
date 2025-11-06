import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UrlResponse {
  @Field()
  url: string;
}
