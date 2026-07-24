"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CreditCard, DollarSign, Users, ChevronRight, TrendingUp, TrendingDown, Clock, Globe } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Dashboard() {
  const { t, language, setLanguage } = useLanguage()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("thisMonth")
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [warehouseId, setWarehouseId] = useState("all")

  const timeRangeLabels: Record<string, string> = {
    thisMonth: t("dashboard.thisMonth"),
    lastMonth: t("dashboard.lastMonth"),
    thisYear: t("dashboard.thisYear")
  }

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("erp_token")
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
        const token = localStorage.getItem("token") || localStorage.getItem("erp_token")
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
    return new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
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
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t("sidebar.dashboard")}</h2>
          <p className="text-muted-foreground text-sm">Welcome back! Here's what's happening with your business.</p>
        </div>
        
        {/* Language Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 h-8 px-3 text-sm font-medium border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Globe className="h-4 w-4" />
            <span>{language.toUpperCase()}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'font-bold' : ''}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('id')} className={language === 'id' ? 'font-bold' : ''}>
              Indonesia
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">{t("dashboard.totalRevenue")}</CardTitle>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data ? formatCurrency(data.totalRevenue) : 'Rp 0'}</div>
            <p className={`text-xs font-medium flex items-center mt-2 ${data?.revenueGrowth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {data?.revenueGrowth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {data?.revenueGrowth?.toFixed(1) || 0}% {t("dashboard.fromPreviousPeriod")}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">{t("dashboard.activeCustomers")}</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data?.activeCustomers || 0}</div>
            <p className="text-xs font-medium text-emerald-500 flex items-center mt-2">
              <TrendingUp className="w-3 h-3 mr-1" /> +{data?.customersGrowth || 0}% {t("dashboard.newCustomers")}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">{t("dashboard.salesTransactions")}</CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data?.salesCount || 0}</div>
            <p className={`text-xs font-medium flex items-center mt-2 ${data?.salesGrowth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {data?.salesGrowth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {data?.salesGrowth?.toFixed(1) || 0}% {t("dashboard.fromPreviousPeriod")}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">{t("dashboard.activeEmployees")}</CardTitle>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data?.activeEmployees || 0}</div>
            <p className="text-xs font-medium text-emerald-500 flex items-center mt-2">
              <TrendingUp className="w-3 h-3 mr-1" /> +{data?.employeesGrowth || 0}% {t("dashboard.sinceLastPeriod")}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-slate-200 dark:border-slate-800 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">{t("dashboard.overview")}</CardTitle>
            
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    {warehouseId === "all" ? t("dashboard.allWarehouses") : warehouses.find(w => w.id === warehouseId)?.name || t("dashboard.selectWarehouse")} <ChevronRight className="inline h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setWarehouseId("all")}>{t("dashboard.allWarehouses")}</DropdownMenuItem>
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
                  <DropdownMenuItem onClick={() => setTimeRange("thisMonth")}>{t("dashboard.thisMonth")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange("lastMonth")}>{t("dashboard.lastMonth")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange("thisYear")}>{t("dashboard.thisYear")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            {data && data.chartData && data.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" name={t("dashboard.totalRevenue")} stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="expense" name="Expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                <Activity className="w-10 h-10 mx-auto text-primary opacity-50 mb-2" />
                <p className="text-sm font-medium">{t("dashboard.noChartData")}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 shadow-sm border-slate-200 dark:border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">{t("dashboard.recentActivity")}</CardTitle>
            <CardDescription className="text-slate-500 text-sm">Latest updates from your team.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              {data?.recentActivity?.length > 0 ? (
                data.recentActivity.map((activity: any, idx: number) => (
                  <div key={activity.id || idx} className="flex items-start group">
                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 transition-transform group-hover:scale-125 ${
                      activity.module === 'Finance' ? 'bg-emerald-500' : 
                      activity.module === 'Inventory' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div className="ml-4 space-y-1 flex-1">
                      <div className="flex justify-between w-full">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{activity.action}</p>
                        <p className="text-xs text-slate-400 flex items-center"><Clock className="w-3 h-3 mr-1"/> {formatRelativeTime(activity.created_at)}</p>
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">{activity.user} performed {activity.action} on {activity.module}. {activity.entity_name && `(${activity.entity_name})`}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500 text-center mt-10">No recent activity found.</div>
              )}
            </div>
            
            <Button variant="ghost" className="w-full mt-6 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              View all activity <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
