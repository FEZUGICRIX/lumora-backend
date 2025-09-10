import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserResolver } from './user.resolver';

@Module({
  providers: [UserResolver, UserService],
  imports: [PrismaModule],
})
export class UserModule {}
