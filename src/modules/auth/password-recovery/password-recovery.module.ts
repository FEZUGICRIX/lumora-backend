import { Module } from '@nestjs/common';

import { PasswordRecoveryResolver } from './password-recovery.resolver';

import { PasswordRecoveryService } from './password-recovery.service';
import { UserService } from '@/modules/user/user.service';
import { MailService } from '@/modules/mail/mail.service';
import { UsernameService } from '@/modules/user/services/username.service';
import { HashService } from '../services/hash.service';

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
