"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CreditCard, DollarSign, Users, ChevronRight, TrendingUp, TrendingDown, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("thisMonth")
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [warehouseId, setWarehouseId] = useState("all")

  const timeRangeLabels: Record<string, string> = {
    thisMonth: "This Month",
    lastMonth: "Last Month",
    thisYear: "This Year"
  }

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://194.233.85.181:3001/inventory/warehouses`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.ok) {
          const wData = await res.json()
          setWarehouses(wData)
        }
      } catch (e) {
        console.error("Failed to fetch warehouses:", e)
      }
    }
    fetchWarehouses()
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://194.233.85.181:3001/analytics/dashboard?timeRange=${timeRange}&warehouseId=${warehouseId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.status === 401) {
          window.location.href = '/login'
          return
        }
        if (res.ok) {
          setData(await res.json())
        }
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [timeRange, warehouseId])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
  }

  const formatRelativeTime = (dateString: string) => {
    const diff = (new Date().getTime() - new Date(dateString).getTime()) / 1000 / 60
    if (diff < 60) return `${Math.round(diff)}m ago`
    if (diff < 1440) return `${Math.round(diff / 60)}h ago`
    return `${Math.round(diff / 1440)}d ago`
  }

  if (loading && !data) {
    return <div className="p-8 flex items-center justify-center w-full h-full text-slate-500">Loading dashboard...</div>
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h2>
        <p className="text-muted-foreground text-sm">Welcome back! Here's what's happening with your business.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data ? formatCurrency(data.totalRevenue) : 'Rp 0'}</div>
            <p className={`text-xs font-medium flex items-center mt-1 ${data?.revenueGrowth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {data?.revenueGrowth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {data?.revenueGrowth?.toFixed(1) || 0}% from previous period
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data?.activeCustomers || 0}</div>
            <p className="text-xs font-medium text-emerald-500 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +{data?.customersGrowth || 0}% new customers
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">Sales Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data?.salesCount || 0}</div>
            <p className={`text-xs font-medium flex items-center mt-1 ${data?.salesGrowth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {data?.salesGrowth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {data?.salesGrowth?.toFixed(1) || 0}% from previous period
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">Active Employees</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data?.activeEmployees || 0}</div>
            <p className="text-xs font-medium text-emerald-500 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +{data?.employeesGrowth || 0}% since last period
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-slate-200 dark:border-slate-800 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Overview</CardTitle>
            
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    {warehouseId === "all" ? "Semua Gudang" : warehouses.find(w => w.id === warehouseId)?.name || "Pilih Gudang"} <ChevronRight className="inline h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setWarehouseId("all")}>Semua Gudang</DropdownMenuItem>
                  {warehouses.map(w => (
                    <DropdownMenuItem key={w.id} onClick={() => setWarehouseId(w.id)}>{w.name}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    {timeRangeLabels[timeRange]} <ChevronRight className="inline h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTimeRange("thisMonth")}>This Month</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange("lastMonth")}>Last Month</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange("thisYear")}>This Year</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            {data && data.chartData && data.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                    tickFormatter={(value) => `Rp ${value / 1000000}M`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(Number(value)), undefined]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="expense" name="Expenses" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
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
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</CardTitle>
            <CardDescription className="text-slate-500 text-sm">Latest updates from your team.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              {data?.recentActivity?.length > 0 ? (
                data.recentActivity.map((activity: any, idx: number) => (
                  <div key={activity.id || idx} className="flex items-start">
                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                      activity.module === 'Finance' ? 'bg-emerald-500' : 
                      activity.module === 'Inventory' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div className="ml-4 space-y-1 flex-1">
                      <div className="flex justify-between w-full">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{activity.action}</p>
                        <p className="text-xs text-slate-400 flex items-center"><Clock className="w-3 h-3 mr-1"/> {formatRelativeTime(activity.created_at)}</p>
                      </div>
                      <p className="text-xs text-slate-500">{activity.user} performed {activity.action} on {activity.module}. {activity.entity_name && `(${activity.entity_name})`}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500 text-center mt-10">No recent activity found.</div>
              )}
            </div>
            
            <Button variant="ghost" className="w-full mt-6 text-slate-600 dark:text-slate-400 hover:text-primary">
              View all activity <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
