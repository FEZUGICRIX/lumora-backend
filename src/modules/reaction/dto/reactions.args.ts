import { ArgsType, Field } from '@nestjs/graphql'
import { ReactionTargetType } from '@prisma/client'
import { IsEnum, IsUUID } from 'class-validator'

@ArgsType()
export class ReactionsArgs {
	@Field()
	@IsUUID()
	targetId: string

	@Field(() => ReactionTargetType)
	@IsEnum(ReactionTargetType)
	targetType: ReactionTargetType
}
