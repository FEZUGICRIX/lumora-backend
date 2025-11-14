import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { Token, TokenType } from '@prisma/client'

import { PrismaService } from '@/core/prisma/prisma.service'
import { MailService } from '@/modules/mail/mail.service'

@Injectable()
export class TwoFactorAuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly mailService: MailService,
	) {}

	async validateTwoFactorToken(email: string, code: string): Promise<boolean> {
		const existingToken = await this.prisma.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR,
			},
		})

		if (!existingToken)
			throw new UnauthorizedException(
				'Токен не найден. Пожалуйста, проверьте правильность введенного токена или запросите новый.',
			)

		if (existingToken.token !== code)
			throw new BadRequestException(
				'Неверный код двухфакторной аутентификации. Пожалуйста, проверьте введенный код и попробуйте снова. ',
			)

		const isExpired = new Date() > new Date(existingToken.expiresAt)
		if (isExpired)
			throw new BadRequestException(
				'Срок действия токена двухфакторной аутентификации истек. Пожалуйста, запросите новый токен.',
			)

		await this.prisma.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.TWO_FACTOR,
			},
		})

		return true
	}

	async sendTwoFactorToken(email: string): Promise<boolean> {
		const { token: twoFactorToken } = await this.generateTwoFactorToken(email)
		await this.mailService.sendTwoFactorTokenEmail(email, twoFactorToken)

		return true
	}

	private async generateTwoFactorToken(email: string): Promise<Token> {
		const token = Math.floor(
			Math.random() * (1000000 - 100000) + 100000,
		).toString()
		const expiresAt = new Date(new Date().getTime() + 300000) // 15 min

		const existingToken = await this.prisma.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR,
			},
		})

		if (existingToken) {
			await this.prisma.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.TWO_FACTOR,
				},
			})
		}

		const twoFactorToken = await this.prisma.token.create({
			data: {
				email,
				token,
				expiresAt,
				type: TokenType.TWO_FACTOR,
			},
		})

		return twoFactorToken
	}
}
