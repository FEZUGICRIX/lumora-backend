import { registerEnumType } from '@nestjs/graphql'

export enum ArticleSortBy {
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
	LIKES = 'likes',
	VIEWS = 'views',
	COMMENTS = 'comments',
}
registerEnumType(ArticleSortBy, { name: 'ArticleSortBy' })
