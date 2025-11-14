import { Article } from '@/modules/article/entities/article.entity'
import { User } from '@/modules/user/entities/user.entity'

import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Comment {
	@Field(() => ID)
	id: string

	@Field()
	content: string

	@Field()
	createdAt: Date

	@Field()
	updatedAt: Date

	@Field(() => User)
	author: User

	@Field(() => ID)
	authorId: string

	@Field(() => Article)
	article: Article

	@Field(() => ID)
	articleId: string
}
