"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, PackageSearch, Tag, Edit, Trash2 } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
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
        alert("Gagal menambahkan produk, pastikan kode produk unik.")
      }
    } catch (e) {
      console.error(e)
      alert("Terjadi kesalahan jaringan.")
    }
  }

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(amount))
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Product Catalog
          </h1>
          <p className="text-muted-foreground mt-1">Manage your item catalog, pricing, and details.</p>
        </div>
        
        <Button onClick={() => setShowForm(!showForm)} className="shadow-lg hover:shadow-primary/25 transition-all">
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Cancel" : "Add New Product"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-t-4 border-t-primary shadow-lg animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSave}>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>
                Enter the details of your new product. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Purchase Price <span className="text-red-500">*</span></Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={formData.purchasePrice} 
                    onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-2">
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
                <Button type="submit">Save Product</Button>
              </div>
            </CardContent>
          </form>
        </Card>
      )}

      <Card className="border-t-4 border-t-primary shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <PackageSearch className="w-5 h-5 text-primary" />
            All Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-pulse">
              <PackageSearch className="w-12 h-12 mb-4 opacity-20" />
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <Tag className="w-12 h-12 mb-4 opacity-20" />
              <p>No products found in your catalog.</p>
              <Button variant="link" onClick={() => setShowForm(true)} className="mt-2">
                Add your first product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="p-4 text-left font-semibold">SKU Code</th>
                    <th className="p-4 text-left font-semibold">Product Name</th>
                    <th className="p-4 text-right font-semibold">Purchase Price</th>
                    <th className="p-4 text-right font-semibold">Selling Price</th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="p-4 font-mono text-xs text-muted-foreground">{p.code}</td>
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4 text-right text-red-500/80 font-medium">{formatCurrency(p.purchase_price)}</td>
                      <td className="p-4 text-right text-emerald-500 font-bold">{formatCurrency(p.selling_price)}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
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
