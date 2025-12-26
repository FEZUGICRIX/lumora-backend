import { Field, Int, ObjectType } from '@nestjs/graphql'
import { ReactionType } from '@prisma/client'

@ObjectType()
export class ReactionSummaryDto {
	@Field(() => ReactionType)
	type: ReactionType

	@Field(() => Int)
	count: number

	@Field()
	isActive: boolean // поставил ли текущий пользователь
}
