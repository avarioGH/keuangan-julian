"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function CashManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cash Management</h1>
          <p className="text-muted-foreground">Manage your cash-in and cash-out transactions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950">
            <ArrowDownRight className="mr-2 h-4 w-4" />
            New Cash Out
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            New Cash In
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View all recent cash movements.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="p-4 text-center text-sm text-muted-foreground">
              Transaction data will be fetched from the API here.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
