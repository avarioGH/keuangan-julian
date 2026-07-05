"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Box, Home, ArrowRightLeft } from "lucide-react"
import { useEffect, useState } from "react"

export default function InventoryDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ products: 0, warehouses: 0, movements: 0 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("erp_token")
        
        const [pRes, wRes, mRes] = await Promise.all([
          fetch("http://194.233.85.181:3001/inventory/products", { headers: { "Authorization": `Bearer ${token}` } }),
          fetch("http://194.233.85.181:3001/inventory/warehouses", { headers: { "Authorization": `Bearer ${token}` } }),
          fetch("http://194.233.85.181:3001/inventory/transactions", { headers: { "Authorization": `Bearer ${token}` } })
        ])

        const products = await pRes.json()
        const warehouses = await wRes.json()
        const movements = await mRes.json()

        setStats({
          products: products.length || 0,
          warehouses: warehouses.length || 0,
          movements: movements.length || 0
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Dashboard</h1>
        <p className="text-muted-foreground">Overview of products, warehouses, and stock movements.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Box className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.products}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Warehouses</CardTitle>
            <Home className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.warehouses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Stock Movements</CardTitle>
            <ArrowRightLeft className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.movements}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
