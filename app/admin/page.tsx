"use client"

import { useState, useEffect } from "react"
import { AdminGuard } from "@/components/admin-guard"
import { AdminSidebar } from "@/components/admin-sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { useMenuItems } from "@/hooks/useMenuItems"
import { useTestimonials } from "@/hooks/useTestimonials"
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import type { AdminUser } from "@/lib/auth"

export default function AdminPage() {
  return <AdminGuard>{(user, logout) => <AdminDashboard user={user} onLogout={logout} />}</AdminGuard>
}

function AdminDashboard({ user, onLogout }: { user: AdminUser; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const { menuItems, loading: menuLoading } = useMenuItems()
  const { testimonials, loading: testimonialsLoading } = useTestimonials()

  // Fetch orders
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            menu_items (name)
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)

      if (error) throw error
      fetchOrders() // Refresh orders
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const toggleTestimonialVisibility = async (testimonialId: number, isVisible: boolean) => {
    try {
      const { error } = await supabase.from("testimonials").update({ is_visible: !isVisible }).eq("id", testimonialId)

      if (error) throw error
      // Refresh testimonials would need to be implemented
    } catch (error) {
      console.error("Error updating testimonial:", error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Baru", variant: "destructive" as const },
      confirmed: { label: "Dikonfirmasi", variant: "default" as const },
      preparing: { label: "Diproses", variant: "default" as const },
      ready: { label: "Siap", variant: "secondary" as const },
      completed: { label: "Selesai", variant: "outline" as const },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: "default" as const }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  const dashboardStats = {
    todayOrders: orders.filter((order) => new Date(order.created_at).toDateString() === new Date().toDateString())
      .length,
    todayRevenue: orders
      .filter((order) => new Date(order.created_at).toDateString() === new Date().toDateString())
      .reduce((sum, order) => sum + order.total_price, 0),
    popularItem: "Seblak Original",
    lowStock: 3,
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview stats={dashboardStats} />

      case "orders":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-[#432818]">Pesanan Masuk</h2>
              <p className="text-[#432818]/70">Kelola pesanan pelanggan</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-[#432818]">Daftar Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#e63946]" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No. Pesanan</TableHead>
                        <TableHead>Nama Pemesan</TableHead>
                        <TableHead>Menu</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-[#432818]/70">
                            Belum ada pesanan
                          </TableCell>
                        </TableRow>
                      ) : (
                        orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>#{order.id.toString().padStart(3, "0")}</TableCell>
                            <TableCell>{order.customer_name}</TableCell>
                            <TableCell>
                              {order.order_items
                                ?.map((item: any) => `${item.quantity}x ${item.menu_items?.name}`)
                                .join(", ")}
                            </TableCell>
                            <TableCell>{formatPrice(order.total_price)}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {order.status === "pending" && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateOrderStatus(order.id, "confirmed")}
                                    className="bg-[#f4a261] hover:bg-[#e76f51] text-white"
                                  >
                                    Konfirmasi
                                  </Button>
                                )}
                                {order.status === "confirmed" && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateOrderStatus(order.id, "preparing")}
                                    className="bg-[#e63946] hover:bg-[#d62d20] text-white"
                                  >
                                    Proses
                                  </Button>
                                )}
                                {order.status === "preparing" && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateOrderStatus(order.id, "ready")}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    Siap
                                  </Button>
                                )}
                                {order.status === "ready" && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateOrderStatus(order.id, "completed")}
                                    variant="outline"
                                  >
                                    Selesai
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case "menu":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#432818]">Menu & Harga</h2>
                <p className="text-[#432818]/70">Kelola menu makanan dan minuman</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#e63946] hover:bg-[#d62d20] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Menu
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Menu Baru</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama Menu</Label>
                      <Input id="name" placeholder="Contoh: Seblak Special" />
                    </div>
                    <div>
                      <Label htmlFor="description">Deskripsi</Label>
                      <Textarea id="description" placeholder="Deskripsi menu..." />
                    </div>
                    <div>
                      <Label htmlFor="price">Harga</Label>
                      <Input id="price" type="number" placeholder="15000" />
                    </div>
                    <div>
                      <Label htmlFor="spice">Level Pedas (1-5)</Label>
                      <Input id="spice" type="number" min="1" max="5" placeholder="3" />
                    </div>
                    <Button className="w-full bg-[#e63946] hover:bg-[#d62d20] text-white">Simpan Menu</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Card>
              <CardContent className="p-6">
                {menuLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#e63946]" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Menu</TableHead>
                        <TableHead>Harga</TableHead>
                        <TableHead>Level Pedas</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menuItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>{formatPrice(item.price)}</TableCell>
                          <TableCell>
                            <div className="flex">
                              {Array.from({ length: item.spice_level }, (_, i) => (
                                <span key={i} className="text-red-500">
                                  🌶️
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.is_active ? "default" : "secondary"}>
                              {item.is_active ? "Aktif" : "Tidak Aktif"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case "testimonials":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-[#432818]">Testimoni</h2>
              <p className="text-[#432818]/70">Kelola review dan testimoni pelanggan</p>
            </div>
            <Card>
              <CardContent className="p-6">
                {testimonialsLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#e63946]" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Pelanggan</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Komentar</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testimonials.map((testimonial) => (
                        <TableRow key={testimonial.id}>
                          <TableCell>{testimonial.customer_name}</TableCell>
                          <TableCell>
                            <div className="flex">
                              {Array.from({ length: testimonial.rating }, (_, i) => (
                                <span key={i} className="text-yellow-500">
                                  ⭐
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{testimonial.comment}</TableCell>
                          <TableCell>
                            <Badge variant={testimonial.is_visible ? "default" : "secondary"}>
                              {testimonial.is_visible ? "Tampil" : "Tersembunyi"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleTestimonialVisibility(testimonial.id, testimonial.is_visible)}
                            >
                              {testimonial.is_visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-[#432818]/70">Fitur {activeTab} sedang dalam pengembangan</p>
          </div>
        )
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#fefae0]">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout} adminName={user.full_name} />
        <SidebarInset className="flex-1">
          <div className="p-6">{renderContent()}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
