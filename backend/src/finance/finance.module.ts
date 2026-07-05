import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';

import { PrismaModule } from '../prisma/prisma.module';
import { GlModule } from '../gl/gl.module';

@Module({
  imports: [PrismaModule, GlModule],
  controllers: [FinanceController],
  providers: [FinanceService]
})
export class FinanceModule {}
