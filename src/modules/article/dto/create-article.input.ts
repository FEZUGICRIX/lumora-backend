import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsArray,
  IsInt,
} from 'class-validator';

@InputType()
export class CreateArticleInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  slug: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Field()
  @IsString()
  content: string;

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  coverImage?: string; // Было coverImageUrl — теперь как в модели Prisma

  @Field({ defaultValue: false })
  @IsBoolean()
  published: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  publishedAt?: Date;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  readingTime: number;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  views: number;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  likes: number;

  @Field()
  @IsString()
  authorId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
