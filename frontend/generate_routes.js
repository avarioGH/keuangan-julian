const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'app');

const routes = {
  inventory: ['categories', 'brands', 'units', 'suppliers', 'stock-in', 'stock-out', 'stock-transfer', 'stock-adjustment', 'stock-opname', 'barcode', 'purchase-history', 'reports'],
  finance: ['cash-in', 'cash-out', 'transfer', 'expense', 'income', 'budget', 'reports'],
  pos: ['', 'new-transaction', 'hold-order', 'order-history', 'refund', 'shift', 'cash-drawer', 'closing-shift', 'reports'],
  customers: ['', 'list', 'membership', 'loyalty', 'point', 'voucher', 'transaction-history', 'top-customer', 'reports'],
  ai: ['', 'chat', 'inventory-analysis', 'finance-analysis', 'sales-analysis', 'customer-analysis', 'prediction', 'reports'],
  hr: ['attendance', 'shift', 'roles', 'permission', 'performance', 'activity'],
  monitoring: ['', 'live-pos', 'live-transaction', 'admin-activity', 'login-history', 'audit-log', 'inventory-movement', 'cash-movement', 'deleted-data', 'reports'],
  reports: ['', 'sales', 'inventory', 'finance', 'profit', 'customer', 'employee', 'pos', 'warehouse', 'stock', 'product', 'ai-summary'],
  settings: ['company', 'printer', 'barcode', 'numbering', 'backup', 'security', 'notification', 'whatsapp', 'email', 'database', 'ai']
};

for (const [module, subPaths] of Object.entries(routes)) {
  for (const sub of subPaths) {
    const dirPath = path.join(baseDir, module, sub);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    const filePath = path.join(dirPath, 'page.tsx');
    if (!fs.existsSync(filePath)) {
      const componentName = `${module.charAt(0).toUpperCase()}${module.slice(1)}${sub ? sub.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('') : 'Dashboard'}`;
      const title = sub ? sub.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : `${module} Dashboard`;
      
      const content = `"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ${componentName.replace(/[^a-zA-Z0-9_]/g, '')}() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">${title}</h1>
        <p className="text-muted-foreground">Manage ${title.toLowerCase()} data here.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>${title} Overview</CardTitle>
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
`;
      fs.writeFileSync(filePath, content);
      console.log(`Created ${module}/${sub}`);
    }
  }
}
console.log('All routes generated successfully.');
