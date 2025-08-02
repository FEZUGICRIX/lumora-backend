import { CreateArticleTestInput } from './create-article-test.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateArticleTestInput extends PartialType(CreateArticleTestInput) {
  @Field(() => Int)
  id: number;
}
