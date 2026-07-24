"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function SettingsBarcode() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Barcode</h1>
        <p className="text-muted-foreground">Manage barcode data here.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Barcode Overview</CardTitle>
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
