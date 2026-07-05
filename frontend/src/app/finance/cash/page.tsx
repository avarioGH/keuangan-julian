"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function CashManagementPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [summary, setSummary] = useState<any>({ totalCash: 0 })
  const [loading, setLoading] = useState(true)
  
  const [showIn, setShowIn] = useState(false)
  const [showOut, setShowOut] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Cash Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage your cash-in and cash-out transactions effortlessly.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-rose-600 border-rose-200 hover:text-rose-700 hover:bg-rose-50 shadow-sm" onClick={() => setShowOut(true)}>
            <ArrowDownRight className="mr-2 h-4 w-4" />
            New Cash Out
          </Button>
          <Dialog open={showOut} onOpenChange={setShowOut}>
            <DialogContent>
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
                  <Button type="submit" className="bg-rose-600 hover:bg-rose-700">Save Cash Out</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md" onClick={() => setShowIn(true)}>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            New Cash In
          </Button>
          <Dialog open={showIn} onOpenChange={setShowIn}>
            <DialogContent>
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
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Save Cash In</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Cash Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalCash)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all accounts</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View all recent cash movements.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8 text-muted-foreground animate-pulse">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="border rounded-md overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="p-4 text-left font-semibold">Date</th>
                    <th className="p-4 text-left font-semibold">Transaction No</th>
                    <th className="p-4 text-left font-semibold">Description</th>
                    <th className="p-4 text-right font-semibold">Amount</th>
                    <th className="p-4 text-center font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4">{new Date(tx.transaction_date).toLocaleDateString()}</td>
                      <td className="p-4 font-mono text-xs text-muted-foreground">{tx.transaction_no}</td>
                      <td className="p-4 font-medium">{tx.description}</td>
                      <td className="p-4 text-right font-bold">{formatCurrency(tx.total_amount)}</td>
                      <td className="p-4 text-center">
                        {tx.transaction_type === 'Cash In' ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Cash In
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-800 dark:bg-rose-900/30 dark:text-rose-400">
                            Cash Out
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination Controls */}
          {transactions.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <div>
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, transactions.length)} to {Math.min(currentPage * itemsPerPage, transactions.length)} of {transactions.length} entries
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(transactions.length / itemsPerPage)))}
                  disabled={currentPage === Math.ceil(transactions.length / itemsPerPage)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
