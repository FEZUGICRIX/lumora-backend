import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field({ nullable: true })
  content: string;

  @Field()
  authorId: string;

  @Field()
  articleId: string;
}
