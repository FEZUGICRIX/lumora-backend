import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthResolver } from '@/modules/auth/auth.resolver';
import { HashService } from './services/hash.service';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { googleRecaptchaConfig } from '@/common/config';

@Module({
  imports: [GoogleRecaptchaModule.forRootAsync(googleRecaptchaConfig)],
  providers: [AuthService, AuthResolver, UserService, HashService],
  exports: [AuthService],
})
export class AuthModule {}
