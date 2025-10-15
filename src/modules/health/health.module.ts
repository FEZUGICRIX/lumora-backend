import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, HttpModule, PrismaModule],
  controllers: [HealthController],
})
export class HealthModule {}
