"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Download, Search, Filter, Edit, Trash2, Tag, ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [formData, setFormData] = useState({ 
    code: "",
    name: "", 
    purchasePrice: "", 
    sellingPrice: "",
    description: ""
  })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("erp_token")
      const res = await fetch("http://194.233.85.181:3001/inventory/products", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) setProducts(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("erp_token")
      const res = await fetch("http://194.233.85.181:3001/inventory/products", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code: formData.code,
          name: formData.name,
          purchasePrice: Number(formData.purchasePrice),
          sellingPrice: Number(formData.sellingPrice),
          description: formData.description
        })
      })
      if (res.ok) {
        setShowForm(false)
        setFormData({ code: "", name: "", purchasePrice: "", sellingPrice: "", description: "" })
        fetchProducts()
      } else {
        alert("Failed to add product.")
      }
    } catch (e) {
      console.error(e)
    }
  }

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(amount))
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Product Catalog</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your item catalog, pricing, and details.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? "Cancel" : "Add Product"}
          </Button>
          <Button variant="outline" className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSave}>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>
                Enter the details of your new product. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SKU / Product Code (Optional)</Label>
                  <Input 
                    placeholder="e.g. PRD-001" 
                    value={formData.code} 
                    onChange={(e) => setFormData({...formData, code: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Product Name <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="Enter product name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Purchase Price <span className="text-red-500">*</span></Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={formData.purchasePrice} 
                    onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Selling Price <span className="text-red-500">*</span></Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={formData.sellingPrice} 
                    onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  placeholder="Brief description about the product" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary text-white">Save Product</Button>
              </div>
            </CardContent>
          </form>
        </Card>
      )}

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-[350px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search product name, SKU, or barcode..." className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="h-10 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 text-slate-500 flex items-center min-w-[140px] justify-between cursor-pointer">
                All Categories <ChevronRight className="w-4 h-4 opacity-50 rotate-90" />
              </div>
              <div className="h-10 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 text-slate-500 flex items-center min-w-[120px] justify-between cursor-pointer">
                All Status <ChevronRight className="w-4 h-4 opacity-50 rotate-90" />
              </div>
              <Button variant="outline" className="h-10 border-slate-200 dark:border-slate-800">
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-pulse">
              <p>Loading catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Tag className="w-10 h-10 mb-4 opacity-20" />
              <p className="text-sm font-medium">No products found in your catalog.</p>
              <Button variant="link" onClick={() => setShowForm(true)} className="mt-2 text-primary">
                Add your first product
              </Button>
            </div>
          ) : (
            <>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <th className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300">SKU / Code</th>
                    <th className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300">Product Name</th>
                    <th className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300">Category</th>
                    <th className="p-4 text-center font-semibold text-slate-600 dark:text-slate-300">Stock</th>
                    <th className="p-4 text-right font-semibold text-slate-600 dark:text-slate-300">Selling Price</th>
                    <th className="p-4 text-center font-semibold text-slate-600 dark:text-slate-300">Status</th>
                    <th className="p-4 text-center font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((p, i) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                      <td className="p-4 font-mono text-xs text-slate-500">{p.code || `PRD-00${i+1}`}</td>
                      <td className="p-4 font-medium text-slate-900 dark:text-slate-100">{p.name}</td>
                      <td className="p-4 text-slate-500">Uncategorized</td>
                      <td className="p-4 text-center font-medium">{Math.floor(Math.random() * 100) + 10}</td>
                      <td className="p-4 text-right font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(p.selling_price)}</td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Active
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-slate-500">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, products.length)} to {Math.min(currentPage * itemsPerPage, products.length)} of {products.length} results
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded border-slate-200 dark:border-slate-700"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="h-8 w-8 flex items-center justify-center rounded bg-primary text-white text-sm font-medium">
                  {currentPage}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded border-slate-200 dark:border-slate-700"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(products.length / itemsPerPage)))}
                  disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
