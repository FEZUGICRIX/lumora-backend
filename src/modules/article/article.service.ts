import { Injectable, NotFoundException } from '@nestjs/common'
import { ReactionTargetType } from '@prisma/client'

import { ReactionService } from '../reaction/reaction.service'
import { ContentProcessorService } from './services/content-processor.service'
import { PrismaService } from '@/core/prisma/prisma.service'

import { CreateArticleInput } from './dto/create-article.input'
import { GetArticlesArgs } from './dto/get-articles.args'
import { UpdateArticleInput } from './dto/update-article.input'

import { ArticleSortBy } from './enums/article.enums'
import { SortOrder } from '@/core/graphql/enums'

import { generateSlug, hoursAgo } from '@/shared/utils'

@Injectable()
export class ArticleService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly contentProcessor: ContentProcessorService,
		private readonly reactionService: ReactionService,
	) {}

	async create(input: CreateArticleInput) {
		const { authorId, categoryId, title, content, ...articleData } = input
		const slug = generateSlug(title, true)

		// TODO: НЕ ИСПОЛЬЗОВАТЬ ТАКОЙ МЕТОД ПРОВЕРКИ
		// const existingArticle = await this.findBySlug(slug);

		// TODO: Обработка и загрузка обложки, если есть
		if (input.coverImage) {
			// const fileUrl = await this.uploadService.saveFile(input.coverImage);
			// articleData.coverImage = fileUrl;
			// if (existingArticle.coverImage) {
			//   await this.uploadService.deleteFile(existingArticle.coverImage);
			// }
			// // TODO: Удаление старой обложки, если нужно
			// articleData.coverImage = input.coverImage;
		}

		// Обработка контента - преобразуем JSON в три формата
		const processedContent = await this.contentProcessor.processContent(content)

		// Проверка связей
		await this.validateRelations(authorId, categoryId)

		return this.prisma.article.create({
			data: {
				slug,
				title,
				contentJson: content, // Сохраняем оригинальный JSON
				contentHtml: processedContent.html, // Генерируем HTML
				contentText: processedContent.text, // Генерируем текстовую версию
				readingTime: processedContent.stats.readingTime,
				...articleData,
				author: {
					connect: { id: authorId },
				},
				category: categoryId
					? {
							connect: { id: categoryId },
						}
					: undefined,
			},
			include: {
				comments: true,
				author: true,
				category: true,
			},
		})
	}

	async update(slug: string, input: UpdateArticleInput) {
		// проверка на существование
		await this.findBySlug(slug)

		let processedContent
		if (input.content) {
			processedContent = await this.contentProcessor.processContent(
				input.content,
			)
		}

		const data = {
			...(input.title && { title: input.title }),
			...(input.coverImage
				? { coverImage: input.coverImage }
				: { coverImage: null }),
			...(input.description !== undefined && {
				description: input.description,
			}),
			...(input.tags && { tags: input.tags }),
			...(input.categoryId && { categoryId: input.categoryId }),
			...(processedContent && {
				contentJson: processedContent.json,
				contentHtml: processedContent.html,
				contentText: processedContent.text,
				readingTime: processedContent.stats.readingTime,
				// wordCount: processedContent.wordCount,
				// characterCount: processedContent.characterCount,
			}),
		}

		return this.prisma.article.update({
			where: { slug },
			data,
			include: {
				author: true,
				category: true,
				comments: true,
			},
		})
	}

	async findAll(args?: GetArticlesArgs) {
		const {
			categorySlugs,
			dateFrom,
			dateTo,
			sortBy = ArticleSortBy.CREATED_AT,
			order = SortOrder.DESC,
			take,
			skip,
			search,
		} = args || {}

		// --- Построение where для Prisma ---
		const where: any = {}

		if (categorySlugs?.length) {
			where.category = { slug: { in: categorySlugs } }
		}

		if (search) {
			where.OR = [
				{ title: { contains: search, mode: 'insensitive' } },
				{ description: { contains: search, mode: 'insensitive' } },
				{ content: { contains: search, mode: 'insensitive' } },
			]
		}

		if (dateFrom || dateTo) {
			where.createdAt = {}
			if (dateFrom) where.createdAt.gte = new Date(dateFrom)
			if (dateTo) where.createdAt.lte = new Date(dateTo)
		}

		// --- Построение orderBy ---
		const orderDir: 'asc' | 'desc' = order === SortOrder.ASC ? 'asc' : 'desc'
		const orderBy: any[] = []

		switch (sortBy) {
			case ArticleSortBy.UPDATED_AT:
				orderBy.push({ updatedAt: orderDir })
				break
			case ArticleSortBy.CREATED_AT:
				orderBy.push({ createdAt: orderDir })
				break
			case ArticleSortBy.VIEWS:
				orderBy.push({ views: orderDir })
				break
			case ArticleSortBy.COMMENTS:
				// сортировка по количеству комментариев (relation)
				orderBy.push({ comments: { _count: orderDir } })
				break
			default:
				orderBy.push({ createdAt: orderDir })
		}

		// --- Выполняем запрос к Prisma ---
		const articles = await this.prisma.article.findMany({
			where,
			orderBy,
			take,
			skip,
			include: {
				author: true,
				category: true,
				comments: {
					include: { author: true },
				},
				_count: {
					select: { comments: true },
				},
			},
		})

		const articleIds = articles.map(a => a.id)

		const reactionsMap =
			await this.reactionService.getReactionsSummaryForTargets(
				ReactionTargetType.ARTICLE,
				articleIds,
			)

		return articles.map(a => ({
			...a,
			commentsCount: a._count?.comments ?? 0,
			reactions: reactionsMap[a.id] ?? {},
		}))
	}

	async findBySlug(slug: string, userId?: string) {
		const article = await this.prisma.article.findUnique({
			where: { slug },
			include: {
				author: true,
				category: true,
				comments: {
					include: {
						author: true,
					},
				},
				_count: {
					select: { comments: true },
				},
			},
		})

		if (!article) {
			throw new NotFoundException(`Article with slug ${slug} not found`)
		}

		// --- Article reactions ---
		const articleReactions =
			await this.reactionService.getReactionsSummaryForTargets(
				ReactionTargetType.ARTICLE,
				[article.id],
			)

		// --- Comment reactions ---
		const commentIds = article.comments.map(c => c.id)
		const commentReactions =
			commentIds.length > 0
				? await this.reactionService.getReactionsSummaryForTargets(
						ReactionTargetType.COMMENT,
						commentIds,
					)
				: {}

		let myCommentReactions: Record<string, Record<string, boolean>> = {}
		let myArticleReactions: Record<string, Record<string, boolean>> = {}

		if (userId) {
			const [myCommentReactionsRes, myArticleReactionsRes] = await Promise.all([
				commentIds.length > 0
					? this.reactionService.getUserReactionsForTargets(
							userId,
							ReactionTargetType.COMMENT,
							commentIds,
						)
					: {},
				this.reactionService.getUserReactionsForTargets(
					userId,
					ReactionTargetType.ARTICLE,
					[article.id],
				),
			])

			myCommentReactions = myCommentReactionsRes
			myArticleReactions = myArticleReactionsRes
		}

		return {
			...article,
			commentsCount: article._count?.comments ?? 0,
			reactions: articleReactions[article.id] ?? {},
			myReactions: myArticleReactions[article.id] ?? {},

			comments: article.comments.map(comment => ({
				...comment,
				reactions: commentReactions[comment.id] ?? {},
				myReactions: myCommentReactions[comment.id] ?? {},
			})),
		}
	}

	async remove(slug: string): Promise<boolean> {
		const article = await this.findBySlug(slug)

		// Атомарно удаляем и статью и все связанные c ней реакции
		await this.prisma.$transaction([
			this.prisma.reaction.deleteMany({
				where: {
					targetType: ReactionTargetType.ARTICLE,
					targetId: article.id,
				},
			}),
			this.prisma.article.delete({
				where: { slug },
			}),
		])

		return true
	}

	async trackView({
		articleId,
		userId,
		ip,
		userAgent,
	}: {
		articleId: string
		userId?: string
		ip?: string
		userAgent?: string
	}) {
		const article = await this.prisma.article.findUnique({
			where: { id: articleId },
			select: { id: true },
		})

		if (!article) throw new NotFoundException('Статья не найдена')

		const or: any[] = []
		if (userId) or.push({ userId })
		if (ip) or.push({ ip })

		const alreadyViewed = await this.prisma.articleView.findFirst({
			where: {
				articleId,
				createdAt: { gte: hoursAgo(new Date(), 24) },
				OR: or.length > 0 ? or : undefined,
			},
		})

		if (alreadyViewed) return

		await this.prisma.$transaction([
			this.prisma.articleView.create({
				data: {
					articleId,
					userId,
					ip,
					userAgent,
				},
			}),
			this.prisma.article.update({
				where: { id: articleId },
				data: { views: { increment: 1 } },
			}),
		])
	}

	private async validateRelations(
		authorId: string,
		categoryId?: string,
	): Promise<void> {
		const [author, category] = await Promise.all([
			this.prisma.user.findUnique({ where: { id: authorId } }),
			categoryId
				? this.prisma.category.findUnique({ where: { id: categoryId } })
				: null,
		])

		if (!author) {
			throw new NotFoundException(`Author with id ${authorId} not found`)
		}

		if (categoryId && !category) {
			throw new NotFoundException(`Category with id ${categoryId} not found`)
		}
	}
}
