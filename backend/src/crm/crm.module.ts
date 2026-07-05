import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CustomerController } from './customer.controller';
import { OrderController } from './order.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController, OrderController],
})
export class CrmModule {}
