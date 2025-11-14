import { Injectable } from '@nestjs/common'
import * as argon2 from 'argon2'
import { createHash } from 'crypto'

@Injectable()
export class HashService {
	// Argon2id params — конфигурируй через ENV под вашу infra
	private readonly argonOptions = {
		type: argon2.argon2id,
		memoryCost: 2 ** 16, // 64 MiB
		timeCost: 3,
		parallelism: 1,
	}

	async hashPassword(password: string): Promise<string> {
		return argon2.hash(password, this.argonOptions)
	}

	async verifyPassword(hash: string, plain: string): Promise<boolean> {
		return argon2.verify(hash, plain)
	}

	// быстрый, но криптографически стойкий хеш для токенов
	hashRefreshToken(randomHex: string): string {
		return createHash('sha256').update(randomHex).digest('hex')
	}
}
