import { Field, ID, ObjectType } from '@nestjs/graphql'
import { GraphQLJSON } from 'graphql-scalars'

import { Article } from '@/modules/article/entities/article.entity'
import { UserPublicProfile } from '@/modules/user/entities/user-public-profile.entity'

@ObjectType()
export class Comment {
	@Field(() => ID)
	id: string

	@Field()
	content: string

	@Field(() => GraphQLJSON, { nullable: true })
	reactions?: Record<string, number> // { LIKE: 10, LOVE: 5, FIRE: 2 }

	@Field(() => GraphQLJSON, { nullable: true })
	myReactions?: Record<string, boolean> // { LIKE: true }

	@Field()
	createdAt: Date

	@Field()
	updatedAt: Date

	@Field(() => UserPublicProfile)
	author: UserPublicProfile

	@Field(() => ID)
	authorId: string

	@Field(() => Article)
	article: Article

	@Field(() => ID)
	articleId: string
}
