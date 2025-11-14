import { Module } from '@nestjs/common'

import { PrismaModule } from '../../core/prisma/prisma.module'

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
	imports: [PrismaModule],
})
export class ArticleModule {}
