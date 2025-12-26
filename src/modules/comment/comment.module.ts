import { Module } from '@nestjs/common'

import { ReactionModule } from '../reaction/reaction.module'
import { UserModule } from '../user/user.module'

import { CommentService } from './comment.service'

import { CommentResolver } from './comment.resolver'

@Module({
	providers: [CommentResolver, CommentService],
	exports: [CommentService, CommentResolver],
	imports: [UserModule, ReactionModule],
})
export class CommentModule {}
