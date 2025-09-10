import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Article } from '@/modules/article/entities/article.entity';

@ObjectType()
export class Category {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field(() => [Article])
  articles: Article[];
}
