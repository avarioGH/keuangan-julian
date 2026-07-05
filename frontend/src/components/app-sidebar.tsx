"use client"

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
import { ThemeToggle } from "./theme-toggle"

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
  { title: "AI Insights", url: "/platform/ai", icon: Activity },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex flex-row items-center gap-2">
        <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
          E
        </div>
        <span className="font-semibold text-lg">Avario ERP</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Core Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    }
                  />
                  {item.subItems && (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <a href={subItem.url}>
                            <SidebarMenuSubButton>
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </a>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>System & Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settings.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t flex flex-row items-center justify-between">
        <div className="text-xs text-muted-foreground">Version 1.0.0 (Internal ERP)</div>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
