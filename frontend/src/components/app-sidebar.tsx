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
} from "@/components/ui/sidebar"
import { LayoutDashboard, Users, Box, Calculator, Settings, Building2, Briefcase, Plug, Activity } from "lucide-react"

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Finance", url: "/finance", icon: Calculator },
  { title: "Inventory", url: "/inventory", icon: Box },
  { title: "HR & Payroll", url: "/hr", icon: Users },
  { title: "CRM", url: "/crm", icon: Briefcase },
]

const settings = [
  { title: "Platform Services", url: "/platform", icon: Settings },
  { title: "Tenants", url: "/platform/tenants", icon: Building2 },
  { title: "AI Insights", url: "/platform/ai", icon: Activity },
  { title: "Integrations", url: "/platform/integrations", icon: Plug },
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
      <SidebarFooter className="p-4 border-t">
        <div className="text-xs text-muted-foreground">Version 1.0.0 (SaaS)</div>
      </SidebarFooter>
    </Sidebar>
  )
}
