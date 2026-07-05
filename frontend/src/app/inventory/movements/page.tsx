"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ArrowDown, ArrowUp } from "lucide-react"

export default function MovementsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState<"inbound" | "outbound">("inbound")
  
  // Form Data
  const [warehouseId, setWarehouseId] = useState("")
  const [productId, setProductId] = useState("")
  const [qty, setQty] = useState("")
  const [unitCost, setUnitCost] = useState("")
  const [notes, setNotes] = useState("")

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("erp_token")
      
      const [tRes, pRes, wRes] = await Promise.all([
        fetch("http://194.233.85.181:3001/inventory/transactions", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch("http://194.233.85.181:3001/inventory/products", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch("http://194.233.85.181:3001/inventory/warehouses", { headers: { "Authorization": `Bearer ${token}` } })
      ])
      
      if (tRes.ok) setTransactions(await tRes.json())
      if (pRes.ok) setProducts(await pRes.json())
      if (wRes.ok) setWarehouses(await wRes.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("erp_token")
      const endpoint = type === "inbound" ? "inbound" : "outbound"
      
      const res = await fetch(`http://194.233.85.181:3001/inventory/${endpoint}`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          warehouseId,
          notes,
          items: [{
            productId,
            qty: Number(qty),
            unitCost: Number(unitCost)
          }]
        })
      })
      
      if (res.ok) {
        setShowForm(false)
        setWarehouseId("")
        setProductId("")
        setQty("")
        setUnitCost("")
        setNotes("")
        fetchData()
      } else {
        const err = await res.json()
        alert(err.message || "Failed to save transaction")
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Movements</h1>
          <p className="text-muted-foreground">Manage inbound and outbound inventory.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setType("inbound"); setShowForm(true) }} className="bg-emerald-600 hover:bg-emerald-700">
            <ArrowDown className="mr-2 h-4 w-4" /> Stock In
          </Button>
          <Button onClick={() => { setType("outbound"); setShowForm(true) }} variant="destructive">
            <ArrowUp className="mr-2 h-4 w-4" /> Stock Out
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className={type === "inbound" ? "border-emerald-500/50" : "border-rose-500/50"}>
          <form onSubmit={handleSave}>
            <CardHeader>
              <CardTitle>{type === "inbound" ? "Stock In (Restock)" : "Stock Out (Usage)"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Warehouse</Label>
                  <Select value={warehouseId} onValueChange={(val) => setWarehouseId(val || "")} required>
                    <SelectTrigger><SelectValue placeholder="Select Warehouse" /></SelectTrigger>
                    <SelectContent>
                      {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select value={productId} onValueChange={(val) => setProductId(val || "")} required>
                    <SelectTrigger><SelectValue placeholder="Select Product" /></SelectTrigger>
                    <SelectContent>
                      {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Unit Cost / Value</Label>
                  <Input type="number" min="0" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit">Submit</Button>
              </div>
            </CardContent>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No transactions found.</p>
          ) : (
            <div className="border rounded-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Tx No</th>
                    <th className="p-3 text-left font-medium">Date</th>
                    <th className="p-3 text-left font-medium">Type</th>
                    <th className="p-3 text-left font-medium">Warehouse</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-3 font-medium">{t.transaction_no}</td>
                      <td className="p-3 text-muted-foreground">{new Date(t.transaction_date).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.transaction_type === 'IN' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                          {t.transaction_type}
                        </span>
                      </td>
                      <td className="p-3">{t.warehouse?.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
