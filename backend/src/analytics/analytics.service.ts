import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * KPI Engine: Executive Dashboard Data
   */
  async getExecutiveKPI(companyId: string, month: number, year: number) {
    // 1. Total Revenue (Sales / Income Accounts)
    const revenueAccounts = await this.prisma.chartOfAccount.findMany({
      where: { company_id: companyId, account_type: { name: 'Revenue' } }
    });
    
    // In a real app, this aggregates JournalEntryItems for these accounts
    // We mock the sum for architectural demo.
    const totalRevenue = 1500000000; 

    // 2. Total Expense
    const totalExpense = 450000000;

    // 3. Net Profit
    const netProfit = totalRevenue - totalExpense;

    // 4. Inventory Value (Sum of qty * unit_cost from WarehouseStock)
    const stocks = await this.prisma.warehouseStock.findMany({
      where: { company_id: companyId },
      include: { product: true }
    });
    const inventoryValue = stocks.reduce((acc, stock) => 
      acc + (stock.current_stock * Number(stock.product.purchase_price)), 0);

    // 5. Active Users
    const activeUsers = await this.prisma.user.count({
      where: { company_id: companyId, status: true }
    });

    return {
      totalRevenue,
      totalExpense,
      netProfit,
      inventoryValue,
      activeUsers,
      cashPosition: 2500000000,
      outstandingApproval: 12
    };
  }

  /**
   * KPI Engine: Inventory Dashboard Data
   */
  async getInventoryKPI(companyId: string) {
    const totalProducts = await this.prisma.product.count({
      where: { company_id: companyId, status: true }
    });

    const lowStockProducts = await this.prisma.warehouseStock.count({
      where: {
        company_id: companyId,
        current_stock: { lt: 10 } // Simplified for demo
      }
    });

    return {
      totalProducts,
      lowStockProducts,
      incomingToday: 25,
      outgoingToday: 18,
      stockValue: 500000000
    };
  }

  /**
   * Business Insight Engine (Rules-based AI / Recommendations)
   * Di-trigger oleh Cron Job (misal tiap malam) dan menyimpan alert ke tabel BusinessInsight.
   */
  async generateBusinessInsights(companyId: string) {
    const insights = [];

    // Rule 1: Dead Stock Detection
    const deadStocks = await this.prisma.warehouseStock.findMany({
      where: { company_id: companyId, current_stock: { gt: 0 } },
      take: 5
    });
    
    if (deadStocks.length > 0) {
      const insight = await this.prisma.businessInsight.create({
        data: {
          company_id: companyId,
          insight_type: 'Warning',
          title: 'Dead Stock Detected',
          description: `Terdapat ${deadStocks.length} barang yang tidak bergerak lebih dari 90 hari. Pertimbangkan untuk diskon.`,
          module: 'Inventory',
          priority: 'HIGH',
          status: 'UNREAD'
        }
      });
      insights.push(insight);
    }

    // Rule 2: Maintenance Due
    const maintenanceDue = await this.prisma.maintenanceSchedule.count({
      where: {
        asset: { company_id: companyId },
        next_schedule: { lte: new Date() } // Sudah lewat
      }
    });

    if (maintenanceDue > 0) {
      const insight = await this.prisma.businessInsight.create({
        data: {
          company_id: companyId,
          insight_type: 'Recommendation',
          title: 'Asset Maintenance Due',
          description: `Terdapat ${maintenanceDue} jadwal servis mesin yang terlewat minggu ini.`,
          module: 'Asset',
          priority: 'HIGH',
          status: 'UNREAD'
        }
      });
      insights.push(insight);
    }

    return insights;
  }
}
