import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class CreateCommentInput {
	@Field()
	@IsString()
	content: string

	@Field()
	@IsString()
	articleId: string
}
