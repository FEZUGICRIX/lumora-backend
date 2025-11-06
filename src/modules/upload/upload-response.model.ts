import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UploadResponse {
  @Field()
  message: string;

  @Field()
  url: string;
}
