import { Module } from '@nestjs/common'

import { PrismaModule } from '../../core/prisma/prisma.module'

import { HashService } from '../auth/services/hash.service'
import { UsernameService } from './services/username.service'
import { UserService } from './user.service'

import { UserResolver } from './user.resolver'

@Module({
	providers: [UserService, UserResolver, HashService, UsernameService],
	exports: [UserService],
	imports: [PrismaModule],
})
export class UserModule {}
