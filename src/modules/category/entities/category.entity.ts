import { Article } from '@/modules/article/entities/article.entity'

import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Category {
	@Field(() => ID)
	id: string

	@Field()
	name: string

	@Field()
	slug: string

	@Field(() => [Article])
	articles: Article[]
}
