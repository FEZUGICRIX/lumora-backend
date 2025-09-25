import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ArticleResolver } from './article.resolver';
import { ArticleService } from './article.service';
import { ContentProcessorService } from './services/content-processor.service';
import { UploadService } from '../upload/upload.service';

@Module({
  providers: [ArticleResolver, ArticleService, ContentProcessorService, UploadService],
  imports: [PrismaModule],
})
export class ArticleModule {}
