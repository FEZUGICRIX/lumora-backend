import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  app.use(
    graphqlUploadExpress({
      maxFileSize: 10_000_000, // 10 MB
      maxFiles: 10,
    }),
  );

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
