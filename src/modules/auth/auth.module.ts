import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'

import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module'
import { ProviderModule } from './provider/provider.module'

import { MailService } from '../mail/mail.service'
import { UsernameService } from '../user/services/username.service'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service'
import { HashService } from './services/hash.service'
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service'

import { AuthController } from './auth.controller'
import { AuthResolver } from './auth.resolver'

import { getProvidersConfig, googleRecaptchaConfig } from '@/common/config'

@Module({
	imports: [
		forwardRef(() => EmailConfirmationModule),
		GoogleRecaptchaModule.forRootAsync(googleRecaptchaConfig),
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getProvidersConfig,
			inject: [ConfigService],
		}),
	],
	providers: [
		AuthService,
		AuthResolver,
		UserService,
		HashService,
		UsernameService,
		EmailConfirmationService,
		MailService,
		TwoFactorAuthService,
	],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
