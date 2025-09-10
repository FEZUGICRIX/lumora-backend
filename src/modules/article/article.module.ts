import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleResolver } from './article.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { ContentProcessorService } from './services/content-processor.service';

@Module({
  providers: [ArticleResolver, ArticleService, ContentProcessorService],
  imports: [PrismaModule],
})
export class ArticleModule {}
