import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import cookieParser from 'cookie-parser';

import { AppModule } from '@/app.module';
import { GlobalValidationPipe } from '@/common/pipes/global-validation.pipe';
import { GraphQLValidationFilter } from '@/common/filters/graphql-validation.filter';
import { createCorsOptions, createSessionMiddleware } from './common/config';
import '@/common/enums/graphql-enums';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));
  app.useGlobalPipes(new GlobalValidationPipe());
  app.useGlobalFilters(new GraphQLValidationFilter());
  app.use(createSessionMiddleware(config));
  app.enableCors(createCorsOptions(config));
  app.use(graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 10 }));

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}
bootstrap();
