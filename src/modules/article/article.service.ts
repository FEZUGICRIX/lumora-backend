import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleInput } from './dto/create-article.input';
import { UpdateArticleInput } from './dto/update-article.input';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { generateSlug } from '@/shared/utils';
import {
  ArticleSortBy,
  GetArticlesArgs,
  SortOrder,
} from './dto/get-articles.args';
import { ContentProcessorService } from './services/content-processor.service';

@Injectable()
export class ArticleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentProcessor: ContentProcessorService,
  ) {}

  async create(input: CreateArticleInput) {
    const { authorId, categoryId, title, content, ...articleData } = input;
    const slug = generateSlug(title, true);

    // Обработка контента - преобразуем JSON в три формата
    const processedContent =
      await this.contentProcessor.processContent(content);

    // Проверка связей
    await this.validateRelations(authorId, categoryId);

    return this.prisma.article.create({
      data: {
        slug,
        title,
        contentJson: content, // Сохраняем оригинальный JSON
        contentHtml: processedContent.html, // Генерируем HTML
        contentText: processedContent.text, // Генерируем текстовую версию
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
    });
  }

  async update(slug: string, input: UpdateArticleInput) {
    // проверка на существование
    await this.findBySlug(slug);

    let processedContent;
    if (input.content) {
      processedContent = await this.contentProcessor.processContent(
        input.content,
      );
    }

    const data: any = {
      ...(input.title && { title: input.title }),
      ...(input.coverImage && {coverImage: input.coverImage}),
      // ...(newSlug && { slug: newSlug }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.tags && { tags: input.tags }),
      ...(input.categoryId && { categoryId: input.categoryId }),
      // ...(input.status && { status: input.status }),
      ...(processedContent && {
        contentJson: processedContent.json,
        contentHtml: processedContent.html,
        contentText: processedContent.text,
        wordCount: processedContent.wordCount,
        characterCount: processedContent.characterCount,
        readingTime: processedContent.readingTime,
      }),
    };

    return this.prisma.article.update({
      where: { slug },
      data,
      include: {
        author: true,
        category: true,
        comments: true,
      },
    });
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
    } = args || {};

    // --- Построение where для Prisma ---
    const where: any = {};

    if (categorySlugs?.length) {
      where.category = { slug: { in: categorySlugs } };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    // --- Построение orderBy ---
    const orderDir: 'asc' | 'desc' = order === SortOrder.ASC ? 'asc' : 'desc';
    const orderBy: any[] = [];

    switch (sortBy) {
      case ArticleSortBy.UPDATED_AT:
        orderBy.push({ updatedAt: orderDir });
        break;
      case ArticleSortBy.CREATED_AT:
        orderBy.push({ createdAt: orderDir });
        break;
      case ArticleSortBy.LIKES:
        orderBy.push({ likes: orderDir });
        break;
      case ArticleSortBy.VIEWS:
        orderBy.push({ views: orderDir });
        break;
      case ArticleSortBy.COMMENTS:
        // сортировка по количеству комментариев (relation)
        orderBy.push({ comments: { _count: orderDir } });
        break;
      default:
        orderBy.push({ createdAt: orderDir });
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
    });

    // Мапим результат, чтобы в GraphQL отдавать удобное поле commentsCount
    return articles.map((a) => {
      const commentsCount =
        (a as any)._count?.comments ?? a.comments?.length ?? 0;
      return {
        ...a,
        commentsCount,
      };
    });
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        comments: { include: { author: true } },
        _count: { select: { comments: true } },
      },
    });

    if (!article) {
      throw new NotFoundException(`Article with id ${slug} not found`);
    }

    return {
      ...article,
      commentsCount:
        (article as any)._count?.comments ?? article.comments?.length ?? 0,
    };
  }

  async remove(slug: string) {
    // проверка на существование
    await this.findBySlug(slug);

    return this.prisma.article.delete({
      where: { slug },
    });
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
    ]);

    if (!author) {
      throw new NotFoundException(`Author with id ${authorId} not found`);
    }

    if (categoryId && !category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }
  }
}
