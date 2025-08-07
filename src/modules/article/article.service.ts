import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleInput } from './dto/create-article.input';
import { UpdateArticleInput } from './dto/update-article.input';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArticleInput: CreateArticleInput) {
    const { authorId, categoryId, ...articleData } = createArticleInput;

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

  findAll() {
    return this.prisma.article.findMany({
      include: {
        author: true,
        category: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });
  }

  async findOne(slug: string) {
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
      },
    });

    if (!article) {
      throw new NotFoundException(`Article with id ${slug} not found`);
    }

    return article;
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
