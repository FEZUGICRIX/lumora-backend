import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

export const appConfig: ConfigModuleOptions = {
  isGlobal: true,
  ignoreEnvFile: false,
  envFilePath: '.env',

  // Валидация переменных окружения
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'docker')
      .default('development'),
    APPLICATION_PORT: Joi.number().default(4200),
    APPLICATION_URL: Joi.string().uri().required(),
    ALLOWED_ORIGIN: Joi.string().uri().required(),

    // Database
    POSTGRES_URI: Joi.string().uri().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_PORT: Joi.number().default(5432),
    POSTGRES_DB: Joi.string().required(),

    // Redis
    REDIS_URI: Joi.string().uri().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().default(6379),
    REDIS_PASSWORD: Joi.string().required(),

    // Session & Cookies
    COOKIES_SECRET: Joi.string().required(),
    SESSION_SECRET: Joi.string().required(),
    SESSION_NAME: Joi.string().default('sid'),
    SESSION_DOMAIN: Joi.string().required(),
    SESSION_MAX_AGE: Joi.number().default(30600000),
    SESSION_HTTP_ONLY: Joi.boolean().default(true),
    SESSION_SECURE: Joi.boolean().default(false),
    SESSION_PATH: Joi.string().default('/'),
    SESSION_FOLDER: Joi.string().default('sessions:'),

    // AWS S3
    AWS_S3_REGION: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_BUCKET_NAME: Joi.string().required(),
    AWS_PUBLIC_URL: Joi.string().uri().required(),

    // Google RECAPTCHA
    GOOGLE_RECAPTCHA_SECRET_KEY: Joi.string().required(),

    // Google OAuth
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),

    // Resend & email configuration
    RESEND_API_KEY: Joi.string().required(),
    MAIL_FROM: Joi.string().required(),
  }),

  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
};
