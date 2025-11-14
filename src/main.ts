import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'

import { CoreModule } from '@/core/core.module'

import '@/core/graphql/enums'

import { GraphQLValidationFilter } from '@/core/filters/graphql-validation.filter'
import { GlobalValidationPipe } from '@/core/pipes/global-validation.pipe'

import { createCorsOptions, createSessionMiddleware } from './core/config'

async function bootstrap() {
	const app: INestApplication = await NestFactory.create(CoreModule)
	const config = app.get(ConfigService)

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))
	app.useGlobalPipes(new GlobalValidationPipe())
	app.useGlobalFilters(new GraphQLValidationFilter())
	app.use(createSessionMiddleware(config))
	app.enableCors(createCorsOptions(config))
	app.use(graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 10 }))

	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
}
bootstrap()
