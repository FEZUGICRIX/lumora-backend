import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session'; // ← ИСПРАВЛЕННЫЙ ИМПОРТ
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Global, ValidationPipe } from '@nestjs/common';
import IORedis from 'ioredis';
import { parseBoolean } from '@/common/utils';
import { RedisStore } from 'connect-redis'; 
import { GlobalValidationPipe } from '@/common/pipes/global-validation.pipe';
import { GraphQLValidationFilter } from '@/common/filters/graphql-validation.filter';
import '@/common/enums/graphql-enums';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const redis = new IORedis(config.getOrThrow<string>('REDIS_URI'));

  app.setGlobalPrefix('api');
  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  app.useGlobalPipes(new GlobalValidationPipe());

  app.useGlobalFilters(new GraphQLValidationFilter());

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        // maxAge: config.getOrThrow<number>('SESSION_MAX_AGE'), // TODO: решить проблему с куками
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
        sameSite: 'none',
      },
      store: new RedisStore({
        client: redis,
        disableTouch: true,
        prefix: config.getOrThrow<string>('SESSION_FOLDER'),
      }),
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  app.use(
    graphqlUploadExpress({
      maxFileSize: 10_000_000, // 10 MB
      maxFiles: 10,
    }),
  );

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}
bootstrap();
