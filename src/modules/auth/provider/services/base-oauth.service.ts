import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'

import type { TypeBaseProviderOption, TypeUserInfo } from './types'

@Injectable()
export class BaseOAuthService {
	private BASE_URL: string

	constructor(private readonly options: TypeBaseProviderOption) {}

	protected async extractUserInfo(data): Promise<TypeUserInfo> {
		return {
			...data,
			provider: this.options.name,
		}
	}

	getAuthUrl() {
		const query = new URLSearchParams({
			response_type: 'code',
			client_id: this.options.client_id,
			redirect_uri: this.getRedirectUrl(),
			scope: (this.options.scope ?? []).join(' '),
			access_type: 'offline',
			prompt: 'select_account',
		})

		return `${this.options.authorize_url}?${query}`
	}

	async findUserByCode(code: string): Promise<TypeUserInfo> {
		const client_id = this.options.client_id
		const client_secret = this.options.client_secret

		const tokenQuery = new URLSearchParams({
			client_id,
			client_secret,
			redirect_uri: this.getRedirectUrl(),
			grant_type: 'authorization_code',
			code: code,
		})

		const tokenRequest = await fetch(this.options.access_url, {
			method: 'POST',
			body: tokenQuery,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json',
			},
		})

		// Проверяем HTTP статус
		if (!tokenRequest.ok) {
			throw new BadRequestException(`Ошибка`)
		}

		const tokens = await tokenRequest.json()

		// 1. ИЗВЛЕЧЕНИЕ ID ПРОВАЙДЕРА ИЗ ID_TOKEN
		let providerAccountId: string | undefined

		if (tokens.id_token) {
			const decodedToken = this.decodeJwtPayload(tokens.id_token)
			// 'sub' - стандартное поле для уникального ID пользователя в OIDC ID Tokens
			providerAccountId = decodedToken?.sub
		}

		if (!providerAccountId) {
			// Если ID не найден в токене, это критическая ошибка для OAuth
			throw new BadRequestException(
				`Failed to extract unique user ID (sub) from provider's token.`,
			)
		}

		if (!tokens.access_token) {
			throw new BadRequestException(
				`Нет токенов с ${this.options.access_url}. Убедитесь что код авторизации действителен.`,
			)
		}

		const userRequest = await fetch(this.options.profile_url, {
			headers: {
				Authorization: `Bearer ${tokens.access_token}`,
			},
		})

		if (!userRequest.ok) {
			throw new UnauthorizedException(`
        Не удалось получить пользователя с ${this.options.profile_url}. Проверьте правильность токена доступа`)
		}

		const user = await userRequest.json()
		const userData = await this.extractUserInfo(user)

		return {
			...userData,
			id: providerAccountId,
			accessToken: tokens.access_token,
			refreshToken: tokens.refresh_token,
			expiresAt: tokens.expires_at,
			provider: this.options.name,
		}
	}

	getRedirectUrl() {
		return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`
	}

	/**
	 * Вспомогательный метод для декодирования JWT (для извлечения payload, не для безопасности).
	 */
	private decodeJwtPayload(token: string): any {
		try {
			// JWT состоит из header.payload.signature
			const payloadBase64 = token.split('.')[1]
			// Node.js Buffer для декодирования Base64 URL-safe строки
			const payloadJson = Buffer.from(payloadBase64, 'base64').toString()
			return JSON.parse(payloadJson)
		} catch (error) {
			console.error('Error decoding JWT payload:', error)
			return null
		}
	}

	set baseUrl(value: string) {
		this.BASE_URL = value
	}

	get name() {
		return this.options.name
	}

	get access_url() {
		return this.options.access_url
	}

	get profile_url() {
		return this.options.profile_url
	}

	get scopes() {
		return this.options.scope
	}
}
