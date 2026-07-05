"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Bell, Search, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "./theme-toggle"

export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] px-4 shadow-sm z-10">
      <SidebarTrigger className="-ml-1 text-slate-500" />
      <Separator orientation="vertical" className="mx-2 h-4 bg-slate-200 dark:bg-slate-700" />
      <div className="flex flex-1 items-center gap-4 px-2">
        <div className="flex h-10 w-full max-w-md items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1e293b] px-3 text-slate-500 focus-within:bg-white dark:focus-within:bg-[#0f172a] focus-within:ring-1 focus-within:ring-primary transition-colors">
          <Search className="h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search modules, companies, or commands (Ctrl+K)" 
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-500 border-2 border-white dark:border-[#0f172a]"></span>
        </button>
        <div className="flex items-center gap-3 ml-2 cursor-pointer group">
          <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">AD</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex items-center gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">Admin</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  )
}
