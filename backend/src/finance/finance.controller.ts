import { Controller, Post, Get, Body, UseGuards, Request, Param } from '@nestjs/common';
import { FinanceService, FinanceTransactionDto } from './finance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('finance')
export class FinanceController {
  constructor(
    private readonly financeService: FinanceService,
    private readonly prisma: PrismaService
  ) {}

  @Get('summary')
  async getSummary(@Request() req) {
    const companyId = req.user.company_id;
    // Basic aggregation for dashboard
    const cashAccounts = await this.prisma.cashAccount.findMany({
      where: { company_id: companyId }
    });
    
    const totalCash = cashAccounts.reduce((sum, acc) => sum + Number(acc.current_balance), 0);
    
    // In a real app, calculate MTD Income/Expenses from GL or Transactions
    // Placeholder logic for now:
    return {
      totalCash,
      totalIncomeMtd: 45000000,
      totalExpensesMtd: 12400000,
      netProfitMtd: 32600000
    };
  }

  @Get('transactions')
  async getTransactions(@Request() req) {
    return this.prisma.financeTransaction.findMany({
      where: { company_id: req.user.company_id },
      orderBy: { transaction_date: 'desc' },
      take: 20,
      include: {
        cash_account: true
      }
    });
  }

  @Post('cash-in')
  async createCashIn(@Request() req, @Body() data: any) {
    const dto: FinanceTransactionDto = {
      companyId: req.user.company_id,
      userId: req.user.userId,
      ...data
    };
    return this.financeService.createCashIn(dto);
  }

  @Post('cash-out')
  async createCashOut(@Request() req, @Body() data: any) {
    const dto: FinanceTransactionDto = {
      companyId: req.user.company_id,
      userId: req.user.userId,
      ...data
    };
    return this.financeService.createCashOut(dto);
  }
}
