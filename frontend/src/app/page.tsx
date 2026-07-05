"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CreditCard, DollarSign, Users, ChevronRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h2>
        <p className="text-muted-foreground text-sm">Welcome back, Admin! Here's what's happening with your business today.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">Rp 45.231.890</div>
            <p className="text-xs font-medium text-emerald-500 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">Active Tenants</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">2.350</div>
            <p className="text-xs font-medium text-emerald-500 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +180 new tenants
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">12.234</div>
            <p className="text-xs font-medium text-emerald-500 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">573</div>
            <p className="text-xs font-medium text-emerald-500 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-slate-200 dark:border-slate-800 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Overview</CardTitle>
            <div className="text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full cursor-pointer">
              This Month <ChevronRight className="inline h-3 w-3" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
            {/* Minimalist placeholder for the Line Chart representing Revenue & Expenses */}
            <div className="w-full h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="text-center">
                <Activity className="w-10 h-10 mx-auto text-primary opacity-50 mb-2" />
                <p className="text-sm font-medium text-slate-500">Revenue & Expenses Line Chart</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 shadow-sm border-slate-200 dark:border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</CardTitle>
            <CardDescription className="text-slate-500 text-sm">You have 265 pending actions.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <div className="ml-4 space-y-1 flex-1">
                  <div className="flex justify-between w-full">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Subscription Paid</p>
                    <p className="text-sm font-bold text-emerald-600">+$299.00</p>
                  </div>
                  <p className="text-xs text-slate-500">PT Alpha Technology renewed their Pro Plan.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                <div className="ml-4 space-y-1 flex-1">
                  <div className="flex justify-between w-full">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">New User Registered</p>
                    <p className="text-xs text-slate-400">2m ago</p>
                  </div>
                  <p className="text-xs text-slate-500">John Doe joined your company.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-amber-500 flex-shrink-0" />
                <div className="ml-4 space-y-1 flex-1">
                  <div className="flex justify-between w-full">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Inventory Updated</p>
                    <p className="text-xs text-slate-400">15m ago</p>
                  </div>
                  <p className="text-xs text-slate-500">Product "Printer Canon G-2010" stock updated.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                <div className="ml-4 space-y-1 flex-1">
                  <div className="flex justify-between w-full">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Payment Received</p>
                    <p className="text-xs text-slate-400">1h ago</p>
                  </div>
                  <p className="text-xs text-slate-500">Invoice #INV-2024-0123 has been paid.</p>
                </div>
              </div>
              
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
