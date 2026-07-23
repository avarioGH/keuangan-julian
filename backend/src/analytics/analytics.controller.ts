import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboardData(@Request() req, @Query('timeRange') timeRange: string, @Query('warehouseId') warehouseId?: string) {
    const companyId = req.user.company_id || req.user.companyId;
    return this.analyticsService.getDashboardData(companyId, timeRange || 'thisMonth', warehouseId);
  }
}
