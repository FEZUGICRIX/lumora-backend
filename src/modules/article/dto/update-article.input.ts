import { Field, InputType, PartialType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

import { CreateArticleInput } from './create-article.input'

@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleInput) {
	@Field(() => String)
	@IsString()
	slug: string
}
