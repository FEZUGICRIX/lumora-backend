import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/generated'

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor(private readonly config: ConfigService) {
		const databaseUrl = config.get<string>('POSTGRES_URI')

		const adapter = new PrismaPg({
			connectionString: databaseUrl,
		})

		super({ adapter })
	}

	async onModuleInit(): Promise<void> {
		await this.$connect()
	}

	async onModuleDestroy(): Promise<void> {
		await this.$disconnect()
	}
}
