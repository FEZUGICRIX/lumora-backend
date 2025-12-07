import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Article } from '@/modules/article/entities/article.entity'
import { UserProfile } from '@/modules/user/entities/user-profile.entity'

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

	@Field(() => UserProfile)
	author: UserProfile

	@Field(() => ID)
	authorId: string

	@Field(() => Article)
	article: Article

	@Field(() => ID)
	articleId: string
}
