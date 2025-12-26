import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Comment, ReactionTargetType } from '@prisma/client'

import { PrismaService } from '../../core/prisma/prisma.service'
import { ReactionService } from '../reaction/reaction.service'

import { CreateCommentInput } from './dto/create-comment.input'
import { UpdateCommentInput } from './dto/update-comment.input'

@Injectable()
export class CommentService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly reactionService: ReactionService,
	) {}

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

	async getComment(id: string) {
		const comment = await this.prisma.comment.findUnique({
			where: { id },
		})

		if (!comment) {
			throw new NotFoundException(`Comment with id ${id} not found`)
		}

		const reactions = await this.reactionService.getReactionsSummaryForTargets(
			ReactionTargetType.COMMENT,
			[comment.id],
		)

		return {
			...comment,
			reactions: reactions[comment.id] ?? {},
		}
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

	async remove(id: string, userId: string): Promise<boolean> {
		const comment = await this.prisma.comment.findUnique({ where: { id } })
		if (!comment) throw new NotFoundException('Comment not found')
		if (comment.authorId !== userId) throw new ForbiddenException('Not allowed')

		await this.prisma.$transaction([
			this.prisma.reaction.deleteMany({
				where: {
					targetType: ReactionTargetType.COMMENT,
					targetId: comment.id,
				},
			}),
			this.prisma.comment.delete({
				where: { id },
			}),
		])

		return true
	}
}
