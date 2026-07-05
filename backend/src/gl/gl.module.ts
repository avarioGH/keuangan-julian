import { Module } from '@nestjs/common';
import { GlService } from './gl.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GlService],
  exports: [GlService]
})
export class GlModule {}
