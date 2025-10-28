import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { googleRecaptchaConfig, getProvidersConfig } from '@/common/config';

import { ProviderModule } from './provider/provider.module';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { HashService } from './services/hash.service';

import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { UsernameService } from '../user/services/username.service';

@Module({
  imports: [
    ProviderModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getProvidersConfig,
      inject: [ConfigService],
    }),
    GoogleRecaptchaModule.forRootAsync(googleRecaptchaConfig),
  ],
  providers: [
    AuthService,
    AuthResolver,
    UserService,
    HashService,
    UsernameService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
