import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { PrismaModule } from '@/modules/prisma/prisma.module';
import { ArticleModule } from '@/modules/article/article.module';
import { UserModule } from '@/modules/user/user.module';
import { CommentModule } from '@/modules/comment/comment.module';
import { CategoryModule } from '@/modules/category/category.module';
import { UploadModule } from '@/modules/upload/upload.module';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      resolvers: { Upload: GraphQLUpload },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/static',
    }),
    PrismaModule,
    ArticleModule,
    UserModule,
    CommentModule,
    CategoryModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
