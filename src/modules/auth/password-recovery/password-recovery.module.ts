import { Module } from '@nestjs/common'

import { HashService } from '../services/hash.service'
import { PasswordRecoveryService } from './password-recovery.service'
import { MailService } from '@/modules/mail/mail.service'
import { UsernameService } from '@/modules/user/services/username.service'
import { UserService } from '@/modules/user/user.service'

import { PasswordRecoveryResolver } from './password-recovery.resolver'

@Module({
	providers: [
		PasswordRecoveryResolver,
		PasswordRecoveryService,
		UserService,
		MailService,
		UsernameService,
		HashService,
	],
})
export class PasswordRecoveryModule {}
