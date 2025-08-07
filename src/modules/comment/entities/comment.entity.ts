import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Article } from '@/modules/article/entities/article.entity';
import { User } from '@/modules/user/entities/user.entity';

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  author: User;

  @Field(() => ID)
  authorId: string;

  @Field(() => Article)
  article: Article;

  @Field(() => ID)
  articleId: string;
}
