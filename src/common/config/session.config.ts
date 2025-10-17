import session from 'express-session';
import connectRedis from 'connect-redis';
import IORedis from 'ioredis';
import { type ConfigService } from '@nestjs/config';
import { type RequestHandler } from 'express';
import { parseBoolean } from '@/common/utils';

export const createSessionMiddleware = (
  config: ConfigService,
): RequestHandler => {
  const RedisStore = connectRedis(session);
  const redisClient = new IORedis(config.getOrThrow<string>('REDIS_URI'));

  return session({
    secret: config.getOrThrow<string>('SESSION_SECRET'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      domain: config.getOrThrow<string>('SESSION_DOMAIN'),
      maxAge: config.getOrThrow<number>('SESSION_MAX_AGE'),
      httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
      secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
      sameSite: 'none',
    },
    store: new RedisStore({
      client: redisClient,
      disableTouch: true,
      prefix: config.getOrThrow<string>('SESSION_FOLDER'),
    }),
  });
};
