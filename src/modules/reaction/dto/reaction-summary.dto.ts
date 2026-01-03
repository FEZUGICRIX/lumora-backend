import { ReactionType } from '@prisma/generated'

import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ReactionSummaryDto {
	@Field(() => ReactionType)
	type: ReactionType

	@Field(() => Int)
	count: number

	@Field()
	isActive: boolean // поставил ли текущий пользователь
}
