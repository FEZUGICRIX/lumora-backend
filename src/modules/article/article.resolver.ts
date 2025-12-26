import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { ArticleService } from './article.service'

import { CreateArticleInput } from './dto/create-article.input'
import { GetArticlesArgs } from './dto/get-articles.args'
import { UpdateArticleInput } from './dto/update-article.input'

import { Authorization } from '../auth/decorators/auth.decorator'
import { Authorized } from '../auth/decorators/authorized.decorator'

import { Article } from './entities/article.entity'

@Resolver(() => Article)
export class ArticleResolver {
	constructor(private readonly articleService: ArticleService) {}

	@Mutation(() => Article)
	createArticle(
		@Args('createArticleInput')
		createArticleInput: CreateArticleInput,
	) {
		return this.articleService.create(createArticleInput)
	}

	@Query(() => [Article], { name: 'getArticles' })
	findFiltered(@Args() args: GetArticlesArgs) {
		return this.articleService.findAll(args)
	}

	@Authorization({ optional: true })
	@Query(() => Article, { name: 'getArticleBySlug' })
	findOne(
		@Args('slug', { type: () => String }) slug: string,
		@Authorized('id') userId?: string,
	) {
		return this.articleService.findBySlug(slug, userId)
	}

	@Mutation(() => Article)
	updateArticle(
		@Args('updateArticleInput')
		updateArticleInput: UpdateArticleInput,
	) {
		return this.articleService.update(
			updateArticleInput.slug,
			updateArticleInput,
		)
	}

	@Mutation(() => Boolean)
	removeArticle(@Args('slug', { type: () => String }) slug: string) {
		return this.articleService.remove(slug)
	}
}
