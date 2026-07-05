import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('gl')
export class GlController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('journals')
  async getJournals(@Request() req) {
    return this.prisma.journalEntry.findMany({
      where: { company_id: req.user.company_id },
      orderBy: { entry_date: 'desc' },
      take: 50,
      include: {
        items: true
      }
    });
  }
}
