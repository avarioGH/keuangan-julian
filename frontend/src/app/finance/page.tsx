"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity, TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function FinanceDashboard() {
  const [summary, setSummary] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("erp_token") || localStorage.getItem("token")
        
        // Fetch Summary
        const summaryRes = await fetch("http://194.233.85.181:3001/finance/summary", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (summaryRes.ok) {
          setSummary(await summaryRes.json())
        }
        
        // Fetch Transactions
        const txRes = await fetch("http://194.233.85.181:3001/finance/transactions", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (txRes.ok) {
          setTransactions(await txRes.json())
        }
      } catch (e) {
        console.error("Failed to fetch finance data", e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount)
  }

  const renderGrowth = (growth: number | undefined) => {
    if (growth === undefined) return <span className="text-xs text-muted-foreground">Calculating...</span>;
    const isPositive = growth >= 0;
    return (
      <p className={`text-xs font-medium flex items-center mt-2 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {isPositive ? '+' : ''}{growth.toFixed(1)}% from last month
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
        <p className="text-muted-foreground">Overview of your company's financial health.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Cash Balance</CardTitle>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <DollarSign className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : formatCurrency(summary?.totalCash || 0)}</div>
            {renderGrowth(summary?.cashGrowth)}
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Income (MTD)</CardTitle>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : formatCurrency(summary?.totalIncomeMtd || 0)}</div>
            {renderGrowth(summary?.incomeGrowth)}
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Expenses (MTD)</CardTitle>
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
              <ArrowDownRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : formatCurrency(summary?.totalExpensesMtd || 0)}</div>
            {renderGrowth(summary?.expensesGrowth)}
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Net Profit (MTD)</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : formatCurrency(summary?.netProfitMtd || 0)}</div>
            {renderGrowth(summary?.profitGrowth)}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Cash Flow Overview</CardTitle>
            <CardDescription>Income vs Expenses over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {loading ? (
               <div className="w-full h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                 Loading chart...
               </div>
            ) : summary?.chartData && summary.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} minTickGap={20} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    tickFormatter={(value) => `Rp ${value / 1000000}M`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(Number(value)), undefined]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                <Activity className="w-10 h-10 mx-auto text-primary opacity-50 mb-2" />
                <p className="text-sm font-medium">No chart data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 shadow-sm border-slate-200 dark:border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest cash movements</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[350px] pr-2">
            <div className="space-y-6">
              {loading ? (
                <div className="text-center text-sm text-muted-foreground pt-4">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground pt-4">No transactions found.</div>
              ) : (
                transactions.map((tx) => {
                  const isCashIn = tx.transaction_type === 'Cash In' || tx.transaction_type === 'Income';
                  return (
                    <div key={tx.id} className="flex items-center group">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-transform group-hover:scale-110 ${isCashIn ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-rose-100 dark:bg-rose-900/30'}`}>
                        {isCashIn ? (
                          <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        )}
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-none truncate dark:text-white">{tx.description || tx.transaction_no}</p>
                        <p className="text-xs text-muted-foreground truncate">{tx.cash_account?.name || 'Cash Account'}</p>
                      </div>
                      <div className={`font-semibold ml-2 ${isCashIn ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isCashIn ? '+' : '-'}{formatCurrency(tx.total_amount)}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
