"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  // Form Data
  const [employeeId, setEmployeeId] = useState("")
  const [status, setStatus] = useState("PRESENT")

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("erp_token")
      
      const [attRes, empRes] = await Promise.all([
        fetch("http://194.233.85.181:3001/hr/attendance", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch("http://194.233.85.181:3001/hr/employees", { headers: { "Authorization": `Bearer ${token}` } })
      ])
      
      if (attRes.ok) setAttendances(await attRes.json())
      if (empRes.ok) setEmployees(await empRes.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("erp_token")
      const res = await fetch("http://194.233.85.181:3001/hr/attendance", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          employeeId,
          date: new Date().toISOString(),
          status,
          checkIn: new Date().toISOString()
        })
      })
      if (res.ok) {
        setShowForm(false)
        setEmployeeId("")
        setStatus("PRESENT")
        fetchData()
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Track employee presence and absences.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Log Attendance
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSave}>
            <CardHeader>
              <CardTitle>Log Today's Attendance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Employee</Label>
                  <Select value={employeeId} onValueChange={(val) => setEmployeeId(val || "")} required>
                    <SelectTrigger><SelectValue placeholder="Select Employee" /></SelectTrigger>
                    <SelectContent>
                      {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(val) => setStatus(val || "")} required>
                    <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRESENT">Present</SelectItem>
                      <SelectItem value="LATE">Late</SelectItem>
                      <SelectItem value="SICK">Sick</SelectItem>
                      <SelectItem value="LEAVE">Leave</SelectItem>
                      <SelectItem value="ABSENT">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </CardContent>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Attendance Log</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
          ) : attendances.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No attendance records found.</p>
          ) : (
            <div className="border rounded-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Date</th>
                    <th className="p-3 text-left font-medium">Employee</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium">Check In</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.map((a) => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-3">{new Date(a.date).toLocaleDateString()}</td>
                      <td className="p-3 font-medium">{a.employee?.first_name} {a.employee?.last_name}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted">
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{a.check_in ? new Date(a.check_in).toLocaleTimeString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
