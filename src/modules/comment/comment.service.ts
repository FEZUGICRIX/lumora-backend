import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Comment } from '@prisma/client'

import { PrismaService } from '../../core/prisma/prisma.service'

import { CreateCommentInput } from './dto/create-comment.input'
import { UpdateCommentInput } from './dto/update-comment.input'

@Injectable()
export class CommentService {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		authorId: string,
		createCommentInput: CreateCommentInput,
	): Promise<Comment> {
		// Проверка существования статьи (Самая важная часть)
		const article = await this.prisma.article.findUnique({
			where: { id: createCommentInput.articleId },
			select: { id: true }, // Оптимизация: запрашиваем только ID
		})

		if (!article) {
			throw new NotFoundException(
				`Article with ID ${createCommentInput.articleId} not found.`,
			)
		}

		return this.prisma.comment.create({
			data: { ...createCommentInput, authorId },
		})
	}

	findAll() {
		return this.prisma.comment.findMany()
	}

	findOne(id: string) {
		return this.prisma.comment.findUnique({
			where: { id },
		})
	}

	async update(
		id: string,
		updateCommentInput: UpdateCommentInput,
		userId: string,
	) {
		const comment = await this.prisma.comment.findUnique({ where: { id } })
		if (!comment) throw new NotFoundException('Comment not found')
		if (comment.authorId !== userId) throw new ForbiddenException('Not allowed')

		return this.prisma.comment.update({
			where: { id },
			data: updateCommentInput,
		})
	}

	async remove(id: string, userId: string) {
		const comment = await this.prisma.comment.findUnique({ where: { id } })
		if (!comment) throw new NotFoundException('Comment not found')
		if (comment.authorId !== userId) throw new ForbiddenException('Not allowed')

		return this.prisma.comment.delete({ where: { id } })
	}
}
