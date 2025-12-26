import { Module } from '@nestjs/common'

import { ReactionModule } from '../reaction/reaction.module'
import { UserModule } from '../user/user.module'

import { UploadService } from '../upload/upload.service'
import { ArticleService } from './article.service'
import { ContentProcessorService } from './services/content-processor.service'

import { ArticleResolver } from './article.resolver'

@Module({
	providers: [
		ArticleResolver,
		ArticleService,
		ContentProcessorService,
		UploadService,
	],
	imports: [ReactionModule, UserModule],
})
export class ArticleModule {}
