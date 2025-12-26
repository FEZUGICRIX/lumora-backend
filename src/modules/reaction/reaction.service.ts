import { Injectable, NotFoundException } from '@nestjs/common'
import { ReactionTargetType } from '@prisma/client'

import { PrismaService } from '@/core/prisma/prisma.service'

import { ToggleReactionInput } from './dto/toggle-reaction.input'

@Injectable()
export class ReactionService {
	constructor(private readonly prisma: PrismaService) {}

	// Change or toggle reaction
	async toggle(userId: string, input: ToggleReactionInput) {
		const { targetId, targetType, type } = input

		await this.ensureTargetExists(targetId, targetType)

		const existing = await this.prisma.reaction.findUnique({
			where: {
				userId_targetId_targetType: {
					userId,
					targetId,
					targetType,
				},
			},
		})

		if (existing) {
			if (existing.type === type) {
				// если такая же реакция, удаляем
				await this.prisma.reaction.delete({
					where: {
						userId_targetId_targetType: {
							userId,
							targetId,
							targetType,
						},
					},
				})
				return { added: false }
			} else {
				// если реакция другая, обновляем type
				await this.prisma.reaction.update({
					where: {
						userId_targetId_targetType: {
							userId,
							targetId,
							targetType,
						},
					},
					data: { type },
				})
				return { added: true }
			}
		}

		// если реакции не было, создаем
		await this.prisma.reaction.create({
			data: {
				userId,
				targetId,
				targetType,
				type,
			},
		})

		return { added: true }
	}

	// Get reactions on target
	async getReactionsSummaryForTargets(
		targetType: ReactionTargetType,
		targetIds: string[],
	): Promise<Record<string, Record<string, number>>> {
		if (!targetIds.length) return {}

		const grouped = await this.prisma.reaction.groupBy({
			by: ['targetId', 'type'],
			where: {
				targetType,
				targetId: { in: targetIds },
			},
			_count: { type: true },
		})

		/**
		 * Результат:
		 * {
		 *   articleId: { LIKE: 10, FIRE: 2 }
		 * }
		 */
		return grouped.reduce(
			(acc, row) => {
				acc[row.targetId] ??= {}
				acc[row.targetId][row.type] = row._count.type
				return acc
			},
			{} as Record<string, Record<string, number>>,
		)
	}

	// Get user's reaction on target
	async getUserReactionsForTargets(
		userId: string,
		targetType: ReactionTargetType,
		targetIds: string[],
	): Promise<Record<string, Record<string, boolean>>> {
		if (!targetIds.length) return {}

		const rows = await this.prisma.reaction.findMany({
			where: {
				userId,
				targetType,
				targetId: { in: targetIds },
			},
			select: {
				targetId: true,
				type: true,
			},
		})

		return rows.reduce(
			(acc, r) => {
				acc[r.targetId] ??= {}
				acc[r.targetId][r.type] = true
				return acc
			},
			{} as Record<string, Record<string, boolean>>,
		)
	}

	async getReactions(targetId: string, targetType: ReactionTargetType) {
		return this.prisma.reaction.findMany({
			where: { targetId, targetType },
			include: { user: true },
			orderBy: { createdAt: 'desc' },
		})
	}

	// ???
	async getSummary(targetId: string, targetType: ReactionTargetType) {
		const grouped = await this.prisma.reaction.groupBy({
			by: ['type'],
			where: { targetId, targetType },
			_count: true,
		})

		return grouped.map(r => ({
			type: r.type,
			count: r._count,
		}))
	}

	// ???
	async getUserReactions(userId: string) {
		return this.prisma.reaction.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
		})
	}

	// Remove all reactions for target
	async deleteByTarget(targetType: ReactionTargetType, targetId: string) {
		await this.prisma.reaction.deleteMany({
			where: {
				targetType,
				targetId,
			},
		})
	}

	private async ensureTargetExists(
		targetId: string,
		targetType: ReactionTargetType,
	) {
		switch (targetType) {
			case ReactionTargetType.ARTICLE:
				await this.prisma.article
					.findUnique({ where: { id: targetId } })
					.then(r => r ?? Promise.reject())
				break

			case ReactionTargetType.COMMENT:
				await this.prisma.comment
					.findUnique({ where: { id: targetId } })
					.then(r => r ?? Promise.reject())
				break

			case ReactionTargetType.PROFILE:
				await this.prisma.user
					.findUnique({ where: { id: targetId } })
					.then(r => r ?? Promise.reject())
				break

			default:
				throw new NotFoundException('Invalid reaction target')
		}
	}
}
