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

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArticleInput: CreateArticleInput) {
    const { authorId, categoryId, title, ...articleData } = createArticleInput;
    const slug = generateSlug(title, true);

    // Проверка на существование связей
    const [author, category] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: authorId } }),
      this.prisma.category.findUnique({ where: { id: categoryId } }),
    ]);

    if (!author) {
      throw new NotFoundException(`Author with id ${authorId} not found`);
    }

    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    return this.prisma.article.create({
      data: {
        slug,
        title,
        ...articleData,
        author: {
          connect: { id: authorId },
        },
        category: {
          connect: { id: categoryId },
        },
      },
      include: {
        comments: true,
        author: true,
        category: true,
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
        orderBy.push({ _count: { comments: orderDir } });
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

  async findOne(slug: string) {
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

  async update(slug: string, updateArticleInput: UpdateArticleInput) {
    // проверка на существование
    await this.findOne(slug);

    return this.prisma.article.update({
      where: { slug },
      data: updateArticleInput,
    });
  }

  async remove(slug: string) {
    // проверка на существование
    await this.findOne(slug);

    return this.prisma.article.delete({
      where: { slug },
    });
  }
}
