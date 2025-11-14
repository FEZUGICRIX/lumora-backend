import { BaseOAuthService } from '../base-oauth.service'

import type { TypeUserInfo } from '../types'
import type {
	GoogleProfile,
	TypeGoogleProviderOption,
} from './google-provider.types'

export class GoogleProvider extends BaseOAuthService {
	constructor(options: TypeGoogleProviderOption) {
		super({
			name: 'google',
			authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
			access_url: 'https://oauth2.googleapis.com/token',
			profile_url: 'https://www.googleapis.com/oauth2/v3/userinfo',
			scope: options.scope,
			client_id: options.client_id,
			client_secret: options.client_secret,
		})
	}

	protected async extractUserInfo(data: GoogleProfile): Promise<TypeUserInfo> {
		return super.extractUserInfo({
			email: data.email,
			name: data.name,
			picture: data.picture,
		})
	}
}
