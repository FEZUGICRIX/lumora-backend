import { Module } from '@nestjs/common';
import { ArticleTestService } from './article-test.service';
import { ArticleTestResolver } from './article-test.resolver';

@Module({
  providers: [ArticleTestResolver, ArticleTestService],
})
export class ArticleTestModule {}
