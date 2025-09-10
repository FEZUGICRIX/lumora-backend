import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [CategoryResolver, CategoryService],
  // imports: [PrismaModule],
})
export class CategoryModule {}
