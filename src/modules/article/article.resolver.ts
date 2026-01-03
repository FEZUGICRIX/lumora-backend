import { type User } from '@prisma/generated'

import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Request } from 'express'

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

	@Authorization()
	@Mutation(() => Boolean)
	async trackArticleView(
		@Args('articleId') articleId: string,
		@Authorized() user: User,
		@Context() context: { req: Request },
	) {
		// Отправляем данные в сервис, чтобы увеличить счетчик просмотров статьи
		// и при необходимости сохраняем мета-информацию для анализа (userId, IP, user-agent)
		await this.articleService.trackView({
			articleId,
			userId: user?.id,
			ip: context.req.ip,
			userAgent: context.req.headers['user-agent'],
		})

		return true
	}
}
