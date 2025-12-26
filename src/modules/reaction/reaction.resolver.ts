import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { ReactionService } from './reaction.service'

import { ReactionSummaryDto } from './dto/reaction-summary.dto'
import { ReactionsArgs } from './dto/reactions.args'
import { ToggleReactionInput } from './dto/toggle-reaction.input'

import { Authorization } from '../auth/decorators/auth.decorator'
import { Authorized } from '../auth/decorators/authorized.decorator'

import { ReactionEntity } from './entities/reaction.entity'

@Resolver(() => ReactionEntity)
export class ReactionResolver {
	constructor(private readonly reactionService: ReactionService) {}

	@Authorization()
	@Mutation(() => Boolean)
	async toggleReaction(
		@Authorized('id') userId: string,
		@Args('input') input: ToggleReactionInput,
	) {
		const result = await this.reactionService.toggle(userId, input)
		return result.added
	}

	@Query(() => [ReactionEntity])
	reactions(@Args() args: ReactionsArgs) {
		return this.reactionService.getReactions(args.targetId, args.targetType)
	}

	@Query(() => [ReactionSummaryDto])
	reactionSummary(@Args() args: ReactionsArgs) {
		return this.reactionService.getSummary(args.targetId, args.targetType)
	}

	@Authorization()
	@Query(() => [ReactionEntity])
	myReactions(@Authorized('id') userId: string) {
		return this.reactionService.getUserReactions(userId)
	}
}
