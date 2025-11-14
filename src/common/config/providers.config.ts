import { TypeOptions } from '@/modules/auth/provider/provider.constants'
import { GoogleProvider } from '@/modules/auth/provider/services/google-provider/google.provider'

import { ConfigService } from '@nestjs/config'

export const getProvidersConfig = async (
	configService: ConfigService,
): Promise<TypeOptions> => ({
	baseUrl: configService.getOrThrow<string>('APPLICATION_URL'),
	services: [
		new GoogleProvider({
			client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
			client_secret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
			scope: ['email', 'profile'],
		}),
	],
})
