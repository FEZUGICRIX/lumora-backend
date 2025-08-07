import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '@/modules/user/entities/user.entity';
import { Comment } from '@/modules/comment/entities/comment.entity';
import { Category } from '@/modules/category/entities/category.entity';

@ObjectType()
export class Article {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field()
  description: string;

  @Field()
  content: string;

  @Field(() => [String])
  tags: string[];

  @Field({ nullable: true })
  coverImage?: string;

  @Field()
  published: boolean;

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field()
  readingTime: number;

  @Field()
  views: number;

  @Field()
  likes: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt?: Date;

  // 🔗 Автор
  @Field(() => User)
  author: User;

  // // 🔗 Категория
  @Field(() => Category)
  category: Category;

  // 🔗 Комментарии
  @Field(() => [Comment])
  comments: Comment[] = [];
}
