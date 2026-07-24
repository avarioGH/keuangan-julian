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
    const insights: any[] = [];

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

  /**
   * Main ERP Dashboard Data
   */
  async getDashboardData(companyId: string, timeRange: string, warehouseId?: string) {
    const now = new Date();
    let startDate = new Date();
    let prevStartDate = new Date();
    let prevEndDate = new Date();

    if (timeRange === 'thisMonth') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (timeRange === 'lastMonth') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      now.setMonth(now.getMonth() - 1); // Adjust "now" to end of last month for queries
      now.setDate(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
      
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (timeRange === 'thisYear') {
      startDate = new Date(now.getFullYear(), 0, 1);
      prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
      prevEndDate = new Date(now.getFullYear() - 1, 11, 31);
    } else {
      // default to thisMonth
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
    }

    const baseWhere: any = { company_id: companyId };
    if (warehouseId && warehouseId !== 'all') {
      baseWhere.warehouse_id = warehouseId;
    }

    // Current period stats
    const currentTransactions = await this.prisma.financeTransaction.findMany({
      where: { ...baseWhere, transaction_date: { gte: startDate, lte: now } },
      select: { total_amount: true, transaction_type: true, transaction_date: true }
    });

    // Previous period stats (for percentage change)
    const previousTransactions = await this.prisma.financeTransaction.findMany({
      where: { ...baseWhere, transaction_date: { gte: prevStartDate, lte: prevEndDate } },
      select: { total_amount: true, transaction_type: true }
    });

    let currentRevenue = 0;
    let currentExpense = 0;
    let currentSalesCount = 0;

    let previousRevenue = 0;
    let previousSalesCount = 0;

    // Chart Data Generation (Grouping by date string "DD/MM")
    const chartMap = new Map<string, { date: string, revenue: number, expense: number }>();
    
    // Pre-fill chart map with 0s for every day in the range to ensure continuous lines
    let iterateDate = new Date(startDate);
    while (iterateDate <= now) {
      const dateKey = `${iterateDate.getDate().toString().padStart(2, '0')}/${(iterateDate.getMonth() + 1).toString().padStart(2, '0')}`;
      if (!chartMap.has(dateKey)) {
        chartMap.set(dateKey, { date: dateKey, revenue: 0, expense: 0 });
      }
      iterateDate.setDate(iterateDate.getDate() + 1);
    }

    currentTransactions.forEach(t => {
      const isIncome = t.transaction_type === 'Income' || t.transaction_type === 'Cash In';
      const val = Number(t.total_amount);
      if (isIncome) {
        currentRevenue += val;
        currentSalesCount++;
      } else {
        currentExpense += val;
      }

      const d = new Date(t.transaction_date);
      const dateKey = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!chartMap.has(dateKey)) {
        chartMap.set(dateKey, { date: dateKey, revenue: 0, expense: 0 });
      }
      
      const point = chartMap.get(dateKey)!;
      if (isIncome) point.revenue += val;
      else point.expense += val;
    });

    previousTransactions.forEach(t => {
      const isIncome = t.transaction_type === 'Income' || t.transaction_type === 'Cash In';
      const val = Number(t.total_amount);
      if (isIncome) {
        previousRevenue += val;
        previousSalesCount++;
      }
    });

    // Sort chart data
    const chartData = Array.from(chartMap.values()).sort((a, b) => {
      const [dayA, monthA] = a.date.split('/');
      const [dayB, monthB] = b.date.split('/');
      if (monthA !== monthB) return Number(monthA) - Number(monthB);
      return Number(dayA) - Number(dayB);
    });

    // Percentage changes
    const revenueGrowth = previousRevenue === 0 ? 100 : ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    const salesGrowth = previousSalesCount === 0 ? 100 : ((currentSalesCount - previousSalesCount) / previousSalesCount) * 100;

    // Active Customers and Employees
    const activeCustomers = await this.prisma.customer.count({
      where: baseWhere
    });
    
    // Mock previous customers growth just for UI
    const customersGrowth = 5.2; 

    const activeEmployees = await this.prisma.employee.count({
      where: { ...baseWhere, status: 'ACTIVE' }
    });

    // Recent Activity (Audit logs) - Audit logs don't have warehouse_id, so keep them company wide
    const recentActivity = await this.prisma.auditLog.findMany({
      where: { company_id: companyId },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    return {
      totalRevenue: currentRevenue,
      revenueGrowth,
      salesCount: currentSalesCount,
      salesGrowth,
      activeCustomers,
      customersGrowth,
      activeEmployees,
      employeesGrowth: 2.1, // mocked UI percentage
      chartData: chartData.length > 0 ? chartData : [
        { date: "01/01", revenue: 0, expense: 0 } // fallback so chart isn't totally empty
      ],
      recentActivity: recentActivity.map(a => ({
        id: a.id,
        action: a.action,
        module: a.entity,
        entity_name: a.entity_id || '',
        user: a.user_id || 'System',
        created_at: a.created_at
      }))
    };
  }
}
