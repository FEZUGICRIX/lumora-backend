import { SetMetadata } from '@nestjs/common'

export const AUTH_OPTIONS_KEY = 'auth_options'

export interface AuthOptions {
	optional?: boolean
}

export const AuthOptions = (options: AuthOptions) =>
	SetMetadata(AUTH_OPTIONS_KEY, options)
