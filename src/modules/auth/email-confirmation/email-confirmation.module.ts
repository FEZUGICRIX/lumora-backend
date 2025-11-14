import { forwardRef, Module } from '@nestjs/common'

import { AuthModule } from '../auth.module'
import { MailModule } from '@/modules/mail/mail.module'
import { UserModule } from '@/modules/user/user.module'

import { EmailConfirmationService } from './email-confirmation.service'
import { MailService } from '@/modules/mail/mail.service'

import { EmailConfirmationResolver } from './email-confirmation.resolver'

@Module({
	imports: [forwardRef(() => AuthModule), MailModule, UserModule],
	providers: [EmailConfirmationResolver, EmailConfirmationService, MailService],
	exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
