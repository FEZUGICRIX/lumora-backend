import { ArgsType, Field, Int, registerEnumType } from '@nestjs/graphql';

export enum ArticleSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  LIKES = 'likes',
  VIEWS = 'views',
  COMMENTS = 'comments',
}
registerEnumType(ArticleSortBy, { name: 'ArticleSortBy' });

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
registerEnumType(SortOrder, { name: 'SortOrder' });

@ArgsType()
export class GetArticlesArgs {
  @Field(() => [String], {
    nullable: true,
    description: 'filter by category slug',
  })
  categorySlugs?: string[];

  @Field(() => String, {
    nullable: true,
    description: 'ISO date string, from (inclusive)',
  })
  dateFrom?: string;

  @Field(() => String, {
    nullable: true,
    description: 'ISO date string, to (inclusive)',
  })
  dateTo?: string;

  @Field(() => ArticleSortBy, {
    nullable: true,
    defaultValue: ArticleSortBy.CREATED_AT,
  })
  sortBy?: ArticleSortBy;

  @Field(() => SortOrder, { nullable: true, defaultValue: SortOrder.DESC })
  order?: SortOrder;

  @Field(() => Int, { nullable: true, description: 'limit' })
  take?: number;

  @Field(() => Int, { nullable: true, description: 'offset' })
  skip?: number;

  @Field(() => String, {
    nullable: true,
    description: 'simple text search in title/description/content',
  })
  search?: string;
}
