import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ReactionTargetType, ReactionType } from '@prisma/client'
import { IsEnum } from 'class-validator'

import { UserPublicProfile } from '@/modules/user/entities/user-public-profile.entity'

@ObjectType('Reaction')
export class ReactionEntity {
	@Field(() => ID)
	id: string

	@Field(() => ReactionType)
	type: ReactionType

	@Field(() => ReactionTargetType)
	@IsEnum(ReactionTargetType)
	targetType: ReactionTargetType

	@Field()
	targetId: string

	@Field()
	createdAt: Date

	@Field(() => UserPublicProfile)
	user: UserPublicProfile
}
