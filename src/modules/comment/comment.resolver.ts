import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CommentService } from './comment.service'

import { CreateCommentInput } from './dto/create-comment.input'
import { UpdateCommentInput } from './dto/update-comment.input'

import { Authorization } from '../auth/decorators/auth.decorator'
import { Authorized } from '../auth/decorators/authorized.decorator'

import { Comment } from './entities/comment.entity'

@Resolver(() => Comment)
export class CommentResolver {
	constructor(private readonly commentService: CommentService) {}

	@Authorization()
	@Mutation(() => Comment)
	createComment(
		@Authorized('id') authorId: string,
		@Args('createCommentInput') createCommentInput: CreateCommentInput,
	) {
		return this.commentService.create(authorId, createCommentInput)
	}

	
	@Query(() => Comment, { name: 'comment' })
	getComment(@Args('id', { type: () => Int }) id: string) {
		return this.commentService.getComment(id)
	}

	@Authorization()
	@Mutation(() => Comment)
	updateComment(
		@Authorized('id') userId: string,
		@Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
	) {
		return this.commentService.update(
			updateCommentInput.id,
			updateCommentInput,
			userId,
		)
	}

	@Authorization()
	@Mutation(() => Boolean)
	removeComment(
		@Authorized('id') userId: string,
		@Args('id', { type: () => String }) id: string,
	) {
		return this.commentService.remove(id, userId)
	}
}
