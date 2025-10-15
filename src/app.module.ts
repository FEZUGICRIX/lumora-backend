import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';

// Configuration
import { appConfig, graphqlConfig } from '@/common/config';

// Application Modules
import {
  PrismaModule,
  HealthModule,
  AuthModule,
  UserModule,
  ArticleModule,
  CategoryModule,
  CommentModule,
  UploadModule,
} from '@/modules';

@Module({
  imports: [
    // Framework Modules
    ConfigModule.forRoot(appConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>(graphqlConfig),

    // Application Modules
    PrismaModule,
    HealthModule,
    AuthModule,
    UserModule,
    ArticleModule,
    CategoryModule,
    CommentModule,
    UploadModule,
  ],
})
export class AppModule {}
