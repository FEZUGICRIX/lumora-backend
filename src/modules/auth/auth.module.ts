import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@/modules/user/user.module';
import { UserService } from '../user/user.service';
import { AuthResolver } from '@/modules/auth/auth.resolver';
import { HashService } from './services/hash.service';

@Module({
  imports: [UserModule],
  providers: [AuthService, AuthResolver, UserService, HashService],
  exports: [AuthService],
  
})
export class AuthModule {}
