"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [currentUserRole, setCurrentUserRole] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    modules: [] as string[]
  })

  const AVAILABLE_MODULES = [
    { id: "dashboard", label: "Dashboard" },
    { id: "finance", label: "Finance" },
    { id: "inventory", label: "Inventory" },
    { id: "hr", label: "HR" },
    { id: "crm", label: "CRM" },
    { id: "settings", label: "Settings" }
  ]

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("token") || localStorage.getItem("erp_token")
    }
    return null
  }

  useEffect(() => {
    const token = getToken()
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload && payload.role) {
          setCurrentUserRole(payload.role)
        }
      } catch (e) {
        console.error("Failed to parse token payload", e)
      }
    }
  }, [])

  const fetchUsers = async () => {
    try {
      const token = getToken()
      const res = await fetch("http://194.233.85.181:3001/users", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.status === 401) {
        window.location.href = "/login"
        return
      }
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreateAdmin = async () => {
    if (!formData.name || !formData.username || !formData.password || !formData.email) {
      alert("Please fill all required fields")
      return
    }

    try {
      const token = getToken()
      const res = await fetch("http://194.233.85.181:3001/users/admin", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (res.status === 401) {
        window.location.href = "/login"
        return
      }
      
      if (res.ok) {
        setOpen(false)
        fetchUsers()
        setFormData({ name: "", username: "", email: "", password: "", modules: [] })
      } else {
        const err = await res.json()
        alert(err.message)
      }
    } catch (e) {
      console.error(e)
      alert("Gagal membuat admin")
    }
  }

  const toggleModule = (moduleId: string) => {
    setFormData(prev => {
      if (prev.modules.includes(moduleId)) {
        return { ...prev, modules: prev.modules.filter(m => m !== moduleId) }
      } else {
        return { ...prev, modules: [...prev.modules, moduleId] }
      }
    })
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        
        {currentUserRole === "Owner" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button>+ Create Admin</Button>} />
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Admin</DialogTitle>
                <DialogDescription>
                  Create a new admin account to manage this tenant.
                </DialogDescription>
              </DialogHeader>
              
              {/* Form replaced with div to fix Next.js server action errors on submit */}
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input 
                    value={formData.username} 
                    onChange={e => setFormData({...formData, username: e.target.value})} 
                    className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800"
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800"
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input 
                    type="password" 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800"
                    placeholder="Enter secure password"
                  />
                </div>
                
                <div className="space-y-3 pt-2">
                  <Label>Accessible Modules</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {AVAILABLE_MODULES.map(mod => (
                      <div key={mod.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={mod.id} 
                          checked={formData.modules.includes(mod.id)}
                          onCheckedChange={() => toggleModule(mod.id)}
                        />
                        <label
                          htmlFor={mod.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {mod.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleCreateAdmin}>Save Admin</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Users</CardTitle>
          <CardDescription>Manage your team members and their roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-4">Loading...</TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-4">No users found</TableCell></TableRow>
              ) : users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Badge variant={user.role?.name === "Owner" ? "default" : "secondary"}>
                      {user.role?.name || "User"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status ? "outline" : "destructive"}>
                      {user.status ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
