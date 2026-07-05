"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"
import { useEffect, useState } from "react"

export default function FinanceDashboard() {
  const [summary, setSummary] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("erp_token")
        
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
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)
  }

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
            <div className="text-2xl font-bold">{loading ? "..." : formatCurrency(summary?.totalCash || 0)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Income (MTD)</CardTitle>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : formatCurrency(summary?.totalIncomeMtd || 0)}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Expenses (MTD)</CardTitle>
            <ArrowDownRight className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : formatCurrency(summary?.totalExpensesMtd || 0)}</div>
            <p className="text-xs text-muted-foreground">-4% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Net Profit (MTD)</CardTitle>
            <Activity className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : formatCurrency(summary?.netProfitMtd || 0)}</div>
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
              {loading ? (
                <div className="text-center text-sm text-muted-foreground pt-4">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground pt-4">No transactions found.</div>
              ) : (
                transactions.map((tx) => {
                  const isCashIn = tx.transaction_type === 'Cash In';
                  return (
                    <div key={tx.id} className="flex items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-4 ${isCashIn ? 'bg-emerald-100 dark:bg-emerald-900/20' : 'bg-rose-100 dark:bg-rose-900/20'}`}>
                        {isCashIn ? (
                          <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-rose-500" />
                        )}
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium leading-none">{tx.description || tx.transaction_no}</p>
                        <p className="text-sm text-muted-foreground">{tx.cash_account?.name || 'Cash Account'}</p>
                      </div>
                      <div className={`font-medium ${isCashIn ? 'text-emerald-500' : 'text-rose-500'}`}>
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
