import { ConfigService } from '@nestjs/config'

export function createCorsOptions(config: ConfigService) {
	return {
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie'],
	}
}
