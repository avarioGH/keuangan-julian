import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlatformService } from './platform.service';

@UseGuards(JwtAuthGuard)
@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get('settings')
  async getSettings(@Request() req) {
    return this.platformService.getSettings(req.user.company_id);
  }

  @Post('settings')
  async updateSettings(@Request() req, @Body() data: any) {
    return this.platformService.updateSettings(req.user.company_id, data);
  }

  @Get('api-keys')
  async getApiKeys(@Request() req) {
    return this.platformService.getApiKeys(req.user.company_id);
  }

  @Post('api-keys')
  async createApiKey(@Request() req, @Body() data: any) {
    return this.platformService.createApiKey(req.user.company_id, data);
  }
}
