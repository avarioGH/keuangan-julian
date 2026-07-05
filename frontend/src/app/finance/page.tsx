"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"

export default function FinanceDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
        <p className="text-muted-foreground">Overview of your company's financial health.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Cash Balance</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 125.000.000</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Income (MTD)</CardTitle>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 45.000.000</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Expenses (MTD)</CardTitle>
            <ArrowDownRight className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 12.400.000</div>
            <p className="text-xs text-muted-foreground">-4% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Net Profit (MTD)</CardTitle>
            <Activity className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 32.600.000</div>
            <p className="text-xs text-muted-foreground">+25% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Cash Flow Overview</CardTitle>
            <CardDescription>Income vs Expenses over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground border-t border-dashed mt-4 mx-6">
            [Chart Placeholder]
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest cash movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mr-4">
                  <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none">Invoice Payment INV-001</p>
                  <p className="text-sm text-muted-foreground">PT. ABC Jaya</p>
                </div>
                <div className="font-medium text-emerald-500">+Rp 15.000.000</div>
              </div>
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center mr-4">
                  <ArrowDownRight className="w-5 h-5 text-rose-500" />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none">Office Supplies</p>
                  <p className="text-sm text-muted-foreground">Operational Expense</p>
                </div>
                <div className="font-medium text-rose-500">-Rp 2.400.000</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
