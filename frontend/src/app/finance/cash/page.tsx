"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, ChevronRight, Activity, ChevronLeft } from "lucide-react"

export default function CashManagementPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [summary, setSummary] = useState<any>({ totalCash: 0 })
  const [loading, setLoading] = useState(true)
  
  const [showIn, setShowIn] = useState(false)
  const [showOut, setShowOut] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const [formData, setFormData] = useState({ amount: "", description: "" })

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("erp_token")
      
      const [txRes, sumRes] = await Promise.all([
        fetch("http://194.233.85.181:3001/finance/transactions", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch("http://194.233.85.181:3001/finance/summary", { headers: { "Authorization": `Bearer ${token}` } })
      ])
      
      if (txRes.ok) setTransactions(await txRes.json())
      if (sumRes.ok) setSummary(await sumRes.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent, type: 'cash-in' | 'cash-out') => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("erp_token")
      const res = await fetch(`http://194.233.85.181:3001/finance/${type}`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: Number(formData.amount),
          description: formData.description,
          transactionNo: `CSH-${Date.now()}`,
          transactionDate: new Date().toISOString()
        })
      })
      if (res.ok) {
        setShowIn(false)
        setShowOut(false)
        setFormData({ amount: "", description: "" })
        fetchData()
      } else {
        const err = await res.json()
        alert(`Error: ${err.message}`)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount || 0)
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Finance Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Overview of your company's financial health.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-rose-600 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:text-rose-700 shadow-sm" onClick={() => setShowOut(true)}>
            <ArrowDownRight className="mr-2 h-4 w-4" />
            Cash Out
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm" onClick={() => setShowIn(true)}>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Cash In
          </Button>
        </div>
      </div>

      <Dialog open={showOut} onOpenChange={setShowOut}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={(e) => handleSubmit(e, 'cash-out')}>
            <DialogHeader>
              <DialogTitle>Record Cash Out</DialogTitle>
              <DialogDescription>Record a new expense or cash disbursement.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setShowOut(false)}>Cancel</Button>
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white">Save Cash Out</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showIn} onOpenChange={setShowIn}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={(e) => handleSubmit(e, 'cash-in')}>
            <DialogHeader>
              <DialogTitle>Record Cash In</DialogTitle>
              <DialogDescription>Record a new cash receipt or income.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setShowIn(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">Save Cash In</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Cash Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(summary.totalCash)}</div>
            <p className="text-xs font-medium text-emerald-500 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +4.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Income (MTD)</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">Rp 245.670.000</div>
            <p className="text-xs font-medium text-emerald-500 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +10% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Expenses (MTD)</CardTitle>
            <TrendingDown className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">Rp 120.220.000</div>
            <p className="text-xs font-medium text-rose-500 flex items-center mt-1">
              <TrendingDown className="w-3 h-3 mr-1" /> -6% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">Net Profit (MTD)</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">Rp 125.450.000</div>
            <p className="text-xs font-medium text-emerald-500 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +25% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3 shadow-sm border-slate-200 dark:border-slate-800 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Cash Flow Overview</CardTitle>
              <CardDescription className="text-slate-500 text-sm mt-1">Income vs Expenses over the last 30 days</CardDescription>
            </div>
            <div className="text-xs text-slate-500 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full cursor-pointer">
              Last 30 Days <ChevronRight className="inline h-3 w-3" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-full h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="text-center">
                <Activity className="w-10 h-10 mx-auto text-primary opacity-50 mb-2" />
                <p className="text-sm font-medium text-slate-500">Cash Flow Bar Chart</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-4 shadow-sm border-slate-200 dark:border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</CardTitle>
            <CardDescription className="text-slate-500 text-sm">Latest cash movements</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            {loading ? (
              <div className="flex justify-center p-8 text-muted-foreground animate-pulse">Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                No transactions recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                      <th className="py-3 text-left font-semibold">Date</th>
                      <th className="py-3 text-left font-semibold">Description</th>
                      <th className="py-3 text-center font-semibold">Type</th>
                      <th className="py-3 text-right font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 pr-2 text-slate-500 text-xs">{new Date(tx.transaction_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}</td>
                        <td className="py-3 px-2 font-medium text-slate-900 dark:text-slate-100">{tx.description}</td>
                        <td className="py-3 px-2 text-center">
                          {tx.transaction_type === 'Cash In' ? (
                            <span className="text-xs font-semibold text-emerald-500">Income</span>
                          ) : (
                            <span className="text-xs font-semibold text-rose-500">Expense</span>
                          )}
                        </td>
                        <td className="py-3 pl-2 text-right font-semibold text-slate-900 dark:text-slate-100">
                          {tx.transaction_type === 'Cash In' ? '+' : '-'}{formatCurrency(tx.total_amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination Controls inside the Card */}
            {transactions.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500">
                <Button variant="ghost" className="text-primary p-0 hover:bg-transparent hover:text-primary/80">
                  View all transactions <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-7 w-7 rounded border-slate-200 dark:border-slate-700" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-7 w-7 rounded border-slate-200 dark:border-slate-700" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(transactions.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(transactions.length / itemsPerPage)}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
