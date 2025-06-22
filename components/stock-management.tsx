"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useStockItems } from "@/hooks/useStockItems"
import { Plus, Edit, Package, AlertCircle } from "lucide-react"

// Data statis untuk demo jika database tidak tersedia
const defaultStockItems = [
  { id: 1, name: "Kerupuk Putih", current_stock: 50, minimum_stock: 10, unit: "kg", price_per_unit: 15000 },
  { id: 2, name: "Makaroni", current_stock: 30, minimum_stock: 5, unit: "kg", price_per_unit: 12000 },
  { id: 3, name: "Mie Instan", current_stock: 100, minimum_stock: 20, unit: "bungkus", price_per_unit: 3000 },
  { id: 4, name: "Ceker Ayam", current_stock: 25, minimum_stock: 5, unit: "kg", price_per_unit: 35000 },
  { id: 5, name: "Bakso Sapi", current_stock: 40, minimum_stock: 10, unit: "kg", price_per_unit: 45000 },
]

const defaultToppings = [
  { id: 1, name: "Ceker", current_stock: 50, minimum_stock: 10 },
  { id: 2, name: "Telur", current_stock: 60, minimum_stock: 15 },
  { id: 3, name: "Bakso", current_stock: 40, minimum_stock: 10 },
  { id: 4, name: "Sosis", current_stock: 30, minimum_stock: 5 },
  { id: 5, name: "Makaroni", current_stock: 35, minimum_stock: 8 },
]

const defaultVariations = [
  { id: 1, name: "Seblak Original", current_stock: 50, minimum_stock: 5 },
  { id: 2, name: "Seblak Mie", current_stock: 45, minimum_stock: 5 },
  { id: 3, name: "Seblak Makaroni", current_stock: 40, minimum_stock: 5 },
  { id: 4, name: "Seblak Bakso", current_stock: 35, minimum_stock: 5 },
]

export function StockManagement() {
  const { stockItems, loading: stockLoading, error: stockError, updateStock, addStockItem } = useStockItems()
  const [editingStock, setEditingStock] = useState<{ id: number; value: string } | null>(null)
  const [newStockItem, setNewStockItem] = useState({
    name: "",
    current_stock: 0,
    minimum_stock: 5,
    unit: "kg",
    price_per_unit: 0,
    is_active: true,
  })

  // Gunakan data default jika ada error atau loading
  const displayStockItems = stockError || stockLoading ? defaultStockItems : stockItems
  const displayToppings = defaultToppings
  const displayVariations = defaultVariations

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStockStatus = (current: number, minimum: number) => {
    if (current <= 0) return { label: "Habis", variant: "destructive" as const, color: "text-red-600" }
    if (current <= minimum) return { label: "Menipis", variant: "secondary" as const, color: "text-orange-600" }
    return { label: "Aman", variant: "default" as const, color: "text-green-600" }
  }

  const handleStockUpdate = async (id: number, newStock: number) => {
    try {
      await updateStock(id, newStock)
      setEditingStock(null)
    } catch (error) {
      console.error("Error updating stock:", error)
      alert("Gagal mengupdate stok. Silakan coba lagi.")
    }
  }

  const handleAddStockItem = async () => {
    try {
      await addStockItem(newStockItem)
      setNewStockItem({
        name: "",
        current_stock: 0,
        minimum_stock: 5,
        unit: "kg",
        price_per_unit: 0,
        is_active: true,
      })
    } catch (error) {
      console.error("Error adding stock item:", error)
      alert("Gagal menambah item stok. Silakan coba lagi.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#432818]">Manajemen Stok</h2>
          <p className="text-[#432818]/70">Kelola stok bahan dan topping</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#e63946] hover:bg-[#d62d20] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Bahan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Bahan Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Bahan</Label>
                <Input
                  id="name"
                  value={newStockItem.name}
                  onChange={(e) => setNewStockItem((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: Kerupuk Putih"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stok Awal</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newStockItem.current_stock}
                    onChange={(e) =>
                      setNewStockItem((prev) => ({ ...prev, current_stock: Number.parseInt(e.target.value) || 0 }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="minimum">Stok Minimum</Label>
                  <Input
                    id="minimum"
                    type="number"
                    value={newStockItem.minimum_stock}
                    onChange={(e) =>
                      setNewStockItem((prev) => ({ ...prev, minimum_stock: Number.parseInt(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">Satuan</Label>
                  <Input
                    id="unit"
                    value={newStockItem.unit}
                    onChange={(e) => setNewStockItem((prev) => ({ ...prev, unit: e.target.value }))}
                    placeholder="kg, pcs, liter"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Harga per Satuan</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newStockItem.price_per_unit}
                    onChange={(e) =>
                      setNewStockItem((prev) => ({ ...prev, price_per_unit: Number.parseInt(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handleAddStockItem}
                className="w-full bg-[#e63946] hover:bg-[#d62d20] text-white"
                disabled={!newStockItem.name}
              >
                Tambah Bahan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Banner */}
      {stockError && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <p className="text-sm text-orange-800">
                <strong>Peringatan:</strong> Koneksi database bermasalah. Menampilkan data demo. {stockError}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seblak Variations Stock */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#432818] flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Stok Variasi Seblak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Variasi</TableHead>
                <TableHead>Stok Saat Ini</TableHead>
                <TableHead>Stok Minimum</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayVariations.map((variation) => {
                const status = getStockStatus(variation.current_stock, variation.minimum_stock)
                return (
                  <TableRow key={variation.id}>
                    <TableCell className="font-medium">{variation.name}</TableCell>
                    <TableCell>
                      <span className={status.color}>{variation.current_stock} porsi</span>
                    </TableCell>
                    <TableCell>{variation.minimum_stock} porsi</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Toppings Stock */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#432818] flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Stok Topping
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Topping</TableHead>
                <TableHead>Stok Saat Ini</TableHead>
                <TableHead>Stok Minimum</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayToppings.map((topping) => {
                const status = getStockStatus(topping.current_stock, topping.minimum_stock)
                return (
                  <TableRow key={topping.id}>
                    <TableCell className="font-medium">{topping.name}</TableCell>
                    <TableCell>
                      <span className={status.color}>{topping.current_stock} pcs</span>
                    </TableCell>
                    <TableCell>{topping.minimum_stock} pcs</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Raw Materials Stock */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#432818] flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Stok Bahan Baku
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Bahan</TableHead>
                <TableHead>Stok Saat Ini</TableHead>
                <TableHead>Stok Minimum</TableHead>
                <TableHead>Harga/Satuan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayStockItems.map((item) => {
                const status = getStockStatus(item.current_stock, item.minimum_stock)
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <span className={status.color}>
                        {item.current_stock} {item.unit}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.minimum_stock} {item.unit}
                    </TableCell>
                    <TableCell>{formatPrice(item.price_per_unit)}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
