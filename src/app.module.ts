import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { PrismaModule } from './modules/prisma/prisma.module';
import { ArticleModule } from '@/modules/article/article.module';
import { UserModule } from '@/modules/user/user.module';
import { CommentModule } from '@/modules/comment/comment.module';
import { CategoryModule } from '@/modules/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    PrismaModule,
    ArticleModule,
    UserModule,
    CommentModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
