"use client"

import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar"
import { LayoutDashboard, Users, Box, Calculator, Settings, Activity, Briefcase } from "lucide-react"

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { 
    title: "Finance", 
    url: "/finance", 
    icon: Calculator,
    subItems: [
      { title: "Cash Management", url: "/finance/cash" },
      { title: "General Ledger", url: "/finance/gl" }
    ]
  },
  { 
    title: "Inventory", 
    url: "/inventory", 
    icon: Box,
    subItems: [
      { title: "Products", url: "/inventory/products" },
      { title: "Warehouses", url: "/inventory/warehouses" },
      { title: "Movements", url: "/inventory/movements" }
    ]
  },
  { 
    title: "HR & Payroll", 
    url: "/hr", 
    icon: Users,
    subItems: [
      { title: "Employees", url: "/hr/employees" },
      { title: "Attendance", url: "/hr/attendance" },
      { title: "Payroll", url: "/hr/payroll" }
    ]
  },
  { 
    title: "CRM", 
    url: "/crm", 
    icon: Briefcase,
    subItems: [
      { title: "Customers", url: "/crm/customers" },
      { title: "Sales Orders", url: "/crm/orders" }
    ]
  },
]

const settings = [
  { title: "Platform Services", url: "/platform", icon: Settings },
  { title: "Users & Roles", url: "/settings/users", icon: Users },
  { title: "AI Insights", url: "/platform/ai", icon: Activity },
]

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = (url: string) => {
    if (url === "/" && pathname !== "/") return false
    return pathname.startsWith(url)
  }

  return (
    <Sidebar className="border-r border-slate-200 dark:border-slate-800">
      <SidebarHeader className="p-4 flex flex-row items-center gap-3">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-sm shadow-primary/25">
          E
        </div>
        <span className="font-bold text-lg tracking-tight">Avario ERP</span>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mt-2">Core Modules</SidebarGroupLabel>
          <SidebarGroupContent className="mt-1">
            <SidebarMenu>
              {items.map((item) => {
                const active = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={active}
                      className={`font-medium transition-colors ${active ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                      render={
                        <a href={item.url} className="flex items-center gap-3">
                          <item.icon className={`h-4 w-4 ${active ? 'text-primary' : ''}`} />
                          <span>{item.title}</span>
                        </a>
                      }
                    />
                    {item.subItems && (
                      <SidebarMenuSub className="border-l-slate-200 dark:border-l-slate-700 ml-5 mt-1">
                        {item.subItems.map((subItem) => {
                          const subActive = pathname === subItem.url
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <a href={subItem.url}>
                                <SidebarMenuSubButton 
                                  isActive={subActive}
                                  className={`text-sm ${subActive ? 'text-primary font-medium bg-transparent' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}
                                >
                                  <span>{subItem.title}</span>
                                </SidebarMenuSubButton>
                              </a>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">System & Platform</SidebarGroupLabel>
          <SidebarGroupContent className="mt-1">
            <SidebarMenu>
              {settings.map((item) => {
                const active = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={active}
                      className={`font-medium transition-colors ${active ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                      render={
                        <a href={item.url} className="flex items-center gap-3">
                          <item.icon className={`h-4 w-4 ${active ? 'text-primary' : ''}`} />
                          <span>{item.title}</span>
                        </a>
                      }
                    />
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="text-[11px] text-slate-400 font-medium">Version 1.0.0 (Internal ERP)</div>
      </SidebarFooter>
    </Sidebar>
  )
}
