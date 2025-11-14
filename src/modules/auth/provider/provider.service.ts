import { Inject, Injectable, OnModuleInit } from '@nestjs/common'

import { BaseOAuthService } from './services/base-oauth.service'

import { ProviderOptionsSymbol, type TypeOptions } from './provider.constants'

@Injectable()
export class ProviderService implements OnModuleInit {
	constructor(
		@Inject(ProviderOptionsSymbol) private readonly options: TypeOptions,
	) {}

	onModuleInit() {
		for (const provider of this.options.services) {
			provider.baseUrl = this.options.baseUrl
		}
	}

	findByService(service: string): BaseOAuthService | null {
		return this.options.services.find(s => s.name === service) ?? null
	}
}
