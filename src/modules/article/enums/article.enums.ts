import { registerEnumType } from '@nestjs/graphql'

export enum ArticleSortBy {
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
	VIEWS = 'views',
	COMMENTS = 'comments',
}
registerEnumType(ArticleSortBy, { name: 'ArticleSortBy' })
