import { Module } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { MailService } from '@/modules/mail/mail.service';

@Module({
  providers: [TwoFactorAuthService, MailService],
})
export class TwoFactorAuthModule {}
