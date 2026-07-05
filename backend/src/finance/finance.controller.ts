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
    // 1. Total Cash from all Cash Accounts
    const cashAccounts = await this.prisma.cashAccount.findMany({
      where: { company_id: companyId }
    });
    
    const totalCash = cashAccounts.reduce((sum, acc) => sum + Number(acc.current_balance), 0);
    
    // 2. Month-to-Date (MTD) calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const mtdTransactions = await this.prisma.financeTransaction.findMany({
      where: {
        company_id: companyId,
        transaction_date: {
          gte: startOfMonth
        },
        status: {
          in: ['Approved', 'COMPLETED']
        }
      }
    });

    let totalIncomeMtd = 0;
    let totalExpensesMtd = 0;

    for (const tx of mtdTransactions) {
      if (tx.transaction_type === 'Cash In' || tx.transaction_type === 'Income') {
        totalIncomeMtd += Number(tx.total_amount);
      } else if (tx.transaction_type === 'Cash Out' || tx.transaction_type === 'Expense') {
        totalExpensesMtd += Number(tx.total_amount);
      }
    }

    const netProfitMtd = totalIncomeMtd - totalExpensesMtd;

    return {
      totalCash,
      totalIncomeMtd,
      totalExpensesMtd,
      netProfitMtd
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
      transactionNo: data.transactionNo || `CI-${Date.now()}`,
      transactionDate: data.transactionDate ? new Date(data.transactionDate) : new Date(),
      amount: Number(data.amount),
      description: data.description,
      cashAccountId: data.cashAccountId,
      categoryId: data.categoryId,
      debitAccountId: data.debitAccountId,
      creditAccountId: data.creditAccountId,
    };
    return this.financeService.createCashIn(dto);
  }

  @Post('cash-out')
  async createCashOut(@Request() req, @Body() data: any) {
    const dto: FinanceTransactionDto = {
      companyId: req.user.company_id,
      userId: req.user.userId,
      transactionNo: data.transactionNo || `CO-${Date.now()}`,
      transactionDate: data.transactionDate ? new Date(data.transactionDate) : new Date(),
      amount: Number(data.amount),
      description: data.description,
      cashAccountId: data.cashAccountId,
      categoryId: data.categoryId,
      debitAccountId: data.debitAccountId,
      creditAccountId: data.creditAccountId,
    };
    return this.financeService.createCashOut(dto);
  }
}
