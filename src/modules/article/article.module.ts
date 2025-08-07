import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleResolver } from './article.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [ArticleResolver, ArticleService],
  imports: [PrismaModule],
})
export class ArticleModule {}
