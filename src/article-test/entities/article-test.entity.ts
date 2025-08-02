import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ArticleTest {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
