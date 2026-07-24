import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PosService } from './pos.service';

@UseGuards(JwtAuthGuard)
@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Post('checkout')
  async checkout(@Request() req, @Body() data: any) {
    try {
      data.companyId = req.user.company_id || req.user.companyId;
      data.userId = req.user.userId || req.user.id;
      return await this.posService.processCheckout(data);
    } catch (error) {
      console.error('POS Checkout Error:', error);
      throw error;
    }
  }
}
