import { Field, ID, InputType, PartialType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

import { CreateCommentInput } from './create-comment.input'

@InputType()
export class UpdateCommentInput extends PartialType(CreateCommentInput) {
	@Field(() => ID)
	@IsString()
	id: string
}
