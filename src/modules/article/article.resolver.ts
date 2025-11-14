import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { ArticleService } from './article.service'

import { CreateArticleInput } from './dto/create-article.input'
import { GetArticlesArgs } from './dto/get-articles.args'
import { UpdateArticleInput } from './dto/update-article.input'

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

	@Query(() => Article, { name: 'getArticleBySlug' })
	findOne(@Args('slug', { type: () => String }) slug: string) {
		return this.articleService.findBySlug(slug)
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

	@Mutation(() => Article)
	removeArticle(@Args('slug', { type: () => String }) slug: string) {
		return this.articleService.remove(slug)
	}
}
