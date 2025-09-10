import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateArticleInput } from './create-article.input';
import { IsString } from 'class-validator';

@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleInput) {
  @Field(() => String)
  @IsString()
  slug: string;
}
