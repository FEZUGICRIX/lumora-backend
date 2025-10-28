import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { HashService } from '../auth/services/hash.service';
import { UsernameService } from './services/username.service';

@Module({
  providers: [UserService, HashService, UsernameService],
  exports: [UserService],
  imports: [PrismaModule],
})
export class UserModule {}
