import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { GraphQLJSON } from 'graphql-scalars'

import { Category } from '@/modules/category/entities/category.entity'
import { Comment } from '@/modules/comment/entities/comment.entity'
import { UserProfile } from '@/modules/user/entities/user-profile.entity'

@ObjectType()
export class Article {
	@Field(() => ID)
	id: string

	@Field()
	title: string

	@Field()
	slug: string

	@Field()
	description: string

	@Field(() => GraphQLJSON)
	contentJson: any

	@Field(() => String)
	contentHtml: string

	@Field(() => String)
	contentText: string

	@Field(() => [String])
	tags: string[]

	@Field({ nullable: true })
	coverImage?: string

	@Field()
	published: boolean

	@Field({ nullable: true })
	publishedAt?: Date

	@Field()
	readingTime: number

	@Field()
	views: number

	@Field()
	likes: number

	@Field(() => Int, { nullable: true })
	commentsCount?: number

	@Field()
	createdAt: Date

	@Field()
	updatedAt: Date

	@Field({ nullable: true })
	deletedAt?: Date

	// 🔗 Автор
	@Field(() => UserProfile)
	author: UserProfile

	// 🔗 Категория
	@Field(() => Category)
	category: Category

	// 🔗 Комментарии
	@Field(() => [Comment])
	comments: Comment[] = []
}
