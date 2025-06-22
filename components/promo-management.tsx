"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { usePromos } from "@/hooks/usePromos"
import { Plus, Edit, Gift, Eye, EyeOff, Loader2 } from "lucide-react"

export function PromoManagement() {
  const { promos, loading, togglePromo, addPromo } = usePromos()
  const [newPromo, setNewPromo] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    is_active: true,
  })

  const handleAddPromo = async () => {
    await addPromo(newPromo)
    setNewPromo({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      is_active: true,
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#e63946]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#432818]">Manajemen Promo</h2>
          <p className="text-[#432818]/70">Kelola promo dan penawaran khusus</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#e63946] hover:bg-[#d62d20] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Promo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Promo Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Promo</Label>
                <Input
                  id="title"
                  value={newPromo.title}
                  onChange={(e) => setNewPromo((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Contoh: Gratis Es Teh"
                />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={newPromo.description}
                  onChange={(e) => setNewPromo((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Deskripsi promo..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Tanggal Mulai</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={newPromo.start_date}
                    onChange={(e) => setNewPromo((prev) => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">Tanggal Selesai</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={newPromo.end_date}
                    onChange={(e) => setNewPromo((prev) => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>
              <Button
                onClick={handleAddPromo}
                className="w-full bg-[#e63946] hover:bg-[#d62d20] text-white"
                disabled={!newPromo.title || !newPromo.description}
              >
                Tambah Promo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#432818] flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            Daftar Promo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Promo</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-[#432818]/70">
                    Belum ada promo
                  </TableCell>
                </TableRow>
              ) : (
                promos.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{promo.description}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {promo.start_date && new Date(promo.start_date).toLocaleDateString("id-ID")} -{" "}
                        {promo.end_date && new Date(promo.end_date).toLocaleDateString("id-ID")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={promo.is_active ? "default" : "secondary"}>
                        {promo.is_active ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => togglePromo(promo.id, promo.is_active)}>
                          {promo.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
