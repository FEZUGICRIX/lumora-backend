import { Module } from '@nestjs/common'

import { UserModule } from '../user/user.module'

import { ReactionService } from './reaction.service'

import { ReactionResolver } from './reaction.resolver'

@Module({
	imports: [UserModule],
	providers: [ReactionService, ReactionResolver],
	exports: [ReactionService],
})
export class ReactionModule {}
