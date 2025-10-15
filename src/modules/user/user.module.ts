import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserResolver } from './user.resolver';
import { HashService } from '../auth/services/hash.service';

@Module({
  providers: [UserResolver, UserService, HashService],
  exports: [UserService],
  imports: [PrismaModule],
})
export class UserModule {}
