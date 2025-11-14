import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator'

import { ArticleSortBy } from '../enums/article.enums'
import { SortOrder } from '@/core/graphql/enums'

@ArgsType()
export class GetArticlesArgs {
	@Field(() => [String], {
		nullable: true,
		description: 'filter by category slug',
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	categorySlugs?: string[]

	@Field(() => String, {
		nullable: true,
		description: 'ISO date string, from (inclusive)',
	})
	@IsOptional()
	@IsString()
	dateFrom?: string

	@Field(() => String, {
		nullable: true,
		description: 'ISO date string, to (inclusive)',
	})
	@IsOptional()
	@IsString()
	dateTo?: string

	@Field(() => ArticleSortBy, {
		nullable: true,
		defaultValue: ArticleSortBy.CREATED_AT,
	})
	@IsOptional()
	@IsEnum(ArticleSortBy)
	sortBy?: ArticleSortBy

	@Field(() => SortOrder, { nullable: true, defaultValue: SortOrder.DESC })
	@IsOptional()
	@IsEnum(SortOrder)
	order?: SortOrder

	@Field(() => Int, { nullable: true, description: 'limit' })
	@IsOptional()
	@IsInt()
	take?: number

	@Field(() => Int, { nullable: true, description: 'offset' })
	@IsOptional()
	@IsInt()
	skip?: number

	@Field(() => String, {
		nullable: true,
		description: 'simple text search in title/description/content',
	})
	@IsOptional()
	@IsString()
	search?: string
}
