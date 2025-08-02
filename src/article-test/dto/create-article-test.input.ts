import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateArticleTestInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
