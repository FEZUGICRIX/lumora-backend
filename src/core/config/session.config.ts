import { type ConfigService } from '@nestjs/config'
import connectRedis from 'connect-redis'
import { type RequestHandler } from 'express'
import session from 'express-session'
import IORedis from 'ioredis'

import { isDev, parseBoolean } from '@/shared/utils'

export const createSessionMiddleware = (
	config: ConfigService,
): RequestHandler => {
	const RedisStore = connectRedis(session)
	const redisClient = new IORedis(config.getOrThrow<string>('REDIS_URI'))
	const dev = isDev(config)

	const domain = dev ? 'localhost' : undefined

	return session({
		resave: false,
		saveUninitialized: false,
		secret: config.getOrThrow<string>('SESSION_SECRET'),
		name: config.getOrThrow<string>('SESSION_NAME'),
		cookie: {
			domain,
			maxAge: config.getOrThrow<number>('SESSION_MAX_AGE'),
			httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),

			secure: !dev, // dev = HTTP, prod = HTTPS

			/**
			 * Dev: фронт и бэк часто на localhost:3000 и localhost:5000 → sameSite=lax работает
			 * Prod: разные домены → нужно none
			 */
			sameSite: dev ? 'lax' : 'none',
		},
		store: new RedisStore({
			client: redisClient,
			disableTouch: true,
			prefix: config.getOrThrow<string>('SESSION_FOLDER'),
		}),
	})
}
