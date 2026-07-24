"use client"

import { useState } from "react"
import { 
  Card, CardContent
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { 
  Search, Download, ShieldAlert, Filter, Clock, Eye
} from "lucide-react"

// Mock Data
const auditLogs = [
  { 
    id: "LOG-001", time: "14:25:30", date: "26 Jul 2026", 
    admin: "Budi Santoso", role: "Manager", 
    action: "DELETE", module: "Inventory", 
    details: "Menghapus produk 'Gelas Kaca 200ml' (SKU: GLS-001)",
    ip: "192.168.1.45"
  },
  { 
    id: "LOG-002", time: "14:10:05", date: "26 Jul 2026", 
    admin: "Siti Aminah", role: "Kasir", 
    action: "CREATE", module: "POS", 
    details: "Membuat transaksi baru INV-2607-089 senilai Rp 150.000",
    ip: "192.168.1.12"
  },
  { 
    id: "LOG-003", time: "13:55:12", date: "26 Jul 2026", 
    admin: "Siti Aminah", role: "Kasir", 
    action: "LOGIN", module: "System", 
    details: "Berhasil login ke sistem",
    ip: "192.168.1.12"
  },
  { 
    id: "LOG-004", time: "11:30:45", date: "26 Jul 2026", 
    admin: "Budi Santoso", role: "Manager", 
    action: "UPDATE", module: "Finance", 
    details: "Menyetujui pengeluaran kas 'Beli Tinta Printer' Rp 200.000",
    ip: "192.168.1.45"
  },
  { 
    id: "LOG-005", time: "09:15:00", date: "26 Jul 2026", 
    admin: "Agus (Gudang)", role: "Staff Gudang", 
    action: "UPDATE", module: "Inventory", 
    details: "Menyesuaikan stok 'Kopi Arabica' +50 pcs di Gudang A",
    ip: "192.168.1.88"
  },
  { 
    id: "LOG-006", time: "08:00:22", date: "26 Jul 2026", 
    admin: "System", role: "System", 
    action: "BACKUP", module: "System", 
    details: "Database berhasil dicadangkan ke Cloud Storage",
    ip: "127.0.0.1"
  }
]

export default function AuditLogMonitoring() {
  const [searchQuery, setSearchQuery] = useState("")

  const getActionBadge = (action: string) => {
    switch(action) {
      case 'CREATE': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 border-none">CREATE</Badge>
      case 'UPDATE': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 border-none">UPDATE</Badge>
      case 'DELETE': return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 border-none shadow-sm shadow-rose-200/50">DELETE</Badge>
      case 'LOGIN': return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 border-none">LOGIN</Badge>
      default: return <Badge variant="outline" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-none">{action}</Badge>
    }
  }

  const getModuleBadge = (module: string) => {
    switch(module) {
      case 'Inventory': return <span className="text-amber-600 dark:text-amber-400 font-medium text-sm flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>{module}</span>
      case 'POS': return <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>{module}</span>
      case 'Finance': return <span className="text-emerald-600 dark:text-emerald-400 font-medium text-sm flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>{module}</span>
      case 'System': return <span className="text-slate-600 dark:text-slate-400 font-medium text-sm flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>{module}</span>
      default: return <span className="text-slate-600 font-medium text-sm">{module}</span>
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-rose-600 dark:text-rose-500" /> Audit Log & Monitoring
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Pantau seluruh aktivitas pengguna dan pergerakan data sensitif dalam sistem.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* FILTERS */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-4 justify-between bg-slate-50/50 dark:bg-[#0F172A]/50">
          <div className="relative w-full lg:w-[350px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari admin, aktivitas, atau detail..." 
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select defaultValue="all-module">
              <SelectTrigger className="w-[150px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <SelectValue placeholder="Semua Modul" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-module">Semua Modul</SelectItem>
                <SelectItem value="pos">POS Kasir</SelectItem>
                <SelectItem value="inventory">Inventaris</SelectItem>
                <SelectItem value="finance">Keuangan</SelectItem>
                <SelectItem value="system">Sistem</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-action">
              <SelectTrigger className="w-[150px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <SelectValue placeholder="Semua Aksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-action">Semua Aksi</SelectItem>
                <SelectItem value="create">CREATE</SelectItem>
                <SelectItem value="update">UPDATE</SelectItem>
                <SelectItem value="delete">DELETE</SelectItem>
                <SelectItem value="login">LOGIN</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
              <TableRow className="border-slate-100 dark:border-slate-800">
                <TableHead className="w-[180px] font-semibold">Waktu</TableHead>
                <TableHead className="font-semibold">Pengguna (Admin)</TableHead>
                <TableHead className="font-semibold">Modul</TableHead>
                <TableHead className="font-semibold">Aksi</TableHead>
                <TableHead className="w-[350px] font-semibold">Detail Aktivitas</TableHead>
                <TableHead className="text-right font-semibold">IP Address</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{log.time}</p>
                        <p className="text-xs text-slate-500">{log.date}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{log.admin}</p>
                      <p className="text-xs text-slate-500">{log.role}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getModuleBadge(log.module)}
                  </TableCell>
                  <TableCell>
                    {getActionBadge(log.action)}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug truncate max-w-[300px]" title={log.details}>
                      {log.details}
                    </p>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-slate-500">
                    {log.ip}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
