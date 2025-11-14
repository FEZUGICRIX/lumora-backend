import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Query,
	Req,
	Res,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request, Response } from 'express'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	@Get('/oauth/callback/:provider')
	async callback(
		@Req() req: Request,
		@Res() res: Response,
		@Query('code') code: string,
		@Param('provider') provider: string,
	) {
		if (!code) {
			throw new BadRequestException('Не был предоставлен код авторизации.')
		}

		await this.authService.extractProfileFromCode(req, provider, code)

		// TODO: подставить лучше адрес фронта
		return res.redirect(
			`${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`,
		)
	}
}
