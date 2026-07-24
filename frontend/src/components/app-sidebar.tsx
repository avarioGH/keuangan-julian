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
import { useLanguage } from "@/contexts/LanguageContext"
import { TranslationKey } from "@/i18n/dictionaries"

type MenuItem = {
  titleKey: string;
  url: string;
  icon: any;
  subItems?: { titleKey: string; url: string }[];
}

const items: MenuItem[] = [
  { titleKey: "sidebar.dashboard", url: "/", icon: LayoutDashboard },
  { 
    titleKey: "sidebar.finance", 
    url: "/finance", 
    icon: Calculator,
    subItems: [
      { titleKey: "Cash Management", url: "/finance/cash" },
      { titleKey: "General Ledger", url: "/finance/gl" }
    ]
  },
  { 
    titleKey: "sidebar.inventory", 
    url: "/inventory", 
    icon: Box,
    subItems: [
      { titleKey: "Products", url: "/inventory/products" },
      { titleKey: "Warehouses", url: "/inventory/warehouses" },
      { titleKey: "Movements", url: "/inventory/movements" }
    ]
  },
  { 
    titleKey: "sidebar.hr", 
    url: "/hr", 
    icon: Users,
    subItems: [
      { titleKey: "Employees", url: "/hr/employees" },
      { titleKey: "Attendance", url: "/hr/attendance" },
      { titleKey: "Payroll", url: "/hr/payroll" }
    ]
  },
  { 
    titleKey: "sidebar.crm", 
    url: "/crm", 
    icon: Briefcase,
    subItems: [
      { titleKey: "Customers", url: "/crm/customers" },
      { titleKey: "Sales Orders", url: "/crm/orders" }
    ]
  },
]

const settings: MenuItem[] = [
  { titleKey: "Platform Services", url: "/platform", icon: Settings },
  { titleKey: "sidebar.settings", url: "/settings/users", icon: Users },
  { titleKey: "AI Insights", url: "/platform/ai", icon: Activity },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const isActive = (url: string) => {
    if (url === "/" && pathname !== "/") return false
    return pathname.startsWith(url)
  }

  const getTitle = (key: string) => {
    // If it's a known translation key, translate it, else return the key string
    return key.includes(".") ? t(key as TranslationKey) : key
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
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton
                      isActive={active}
                      className={`font-medium transition-colors ${active ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                      render={
                        <a href={item.url} className="flex items-center gap-3">
                          <item.icon className={`h-4 w-4 ${active ? 'text-primary' : ''}`} />
                          <span>{getTitle(item.titleKey)}</span>
                        </a>
                      }
                    />
                    {item.subItems && (
                      <SidebarMenuSub className="border-l-slate-200 dark:border-l-slate-700 ml-5 mt-1">
                        {item.subItems.map((subItem) => {
                          const subActive = pathname === subItem.url
                          return (
                            <SidebarMenuSubItem key={subItem.titleKey}>
                              <a href={subItem.url}>
                                <SidebarMenuSubButton 
                                  isActive={subActive}
                                  className={`text-sm ${subActive ? 'text-primary font-medium bg-transparent' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}
                                >
                                  <span>{getTitle(subItem.titleKey)}</span>
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
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton
                      isActive={active}
                      className={`font-medium transition-colors ${active ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                      render={
                        <a href={item.url} className="flex items-center gap-3">
                          <item.icon className={`h-4 w-4 ${active ? 'text-primary' : ''}`} />
                          <span>{getTitle(item.titleKey)}</span>
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
      
      <SidebarFooter className="border-t border-slate-200 dark:border-slate-800 p-4">
        <a href="/login" className="flex items-center gap-3 text-slate-500 hover:text-rose-600 font-medium transition-colors" onClick={() => localStorage.removeItem("erp_token")}>
          <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
          </div>
          <span>{t("sidebar.logout" as TranslationKey)}</span>
        </a>
      </SidebarFooter>
    </Sidebar>
  )
}
