import { Module } from '@nestjs/common'

import { PrismaModule } from '../../core/prisma/prisma.module'

import { CategoryService } from './category.service'

import { CategoryResolver } from './category.resolver'

@Module({
	providers: [CategoryResolver, CategoryService],
	// imports: [PrismaModule],
})
export class CategoryModule {}
