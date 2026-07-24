"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function FinanceCashOut() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cash Out</h1>
        <p className="text-muted-foreground">Manage cash out data here.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cash Out Overview</CardTitle>
          <CardDescription>This page is currently under construction.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-slate-400">
            Coming Soon in Phase 2/3
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
