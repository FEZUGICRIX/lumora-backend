import { Field, ID, InputType } from '@nestjs/graphql'
import { ReactionTargetType, ReactionType } from '@prisma/client'
import { IsEnum, IsUUID } from 'class-validator'

@InputType()
export class ToggleReactionInput {
	@Field(() => ID)
	@IsUUID()
	targetId: string

	@Field(() => ReactionTargetType)
	@IsEnum(ReactionTargetType)
	targetType: ReactionTargetType

	@Field(() => ReactionType)
	@IsEnum(ReactionType)
	type: ReactionType
}
