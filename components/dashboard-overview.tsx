"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"

interface DashboardStats {
  todayOrders: number
  todayRevenue: number
  popularItem: string
  lowStock: number
}

interface DashboardOverviewProps {
  stats: DashboardStats
}

export function DashboardOverview({ stats }: DashboardOverviewProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#432818]">Dashboard</h2>
        <p className="text-[#432818]/70">Selamat datang kembali, Teh Imas!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#432818]">Pesanan Hari Ini</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[#e63946]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">{stats.todayOrders}</div>
            <p className="text-xs text-[#432818]/70">+12% dari kemarin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#432818]">Pendapatan Hari Ini</CardTitle>
            <DollarSign className="h-4 w-4 text-[#f4a261]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">{formatPrice(stats.todayRevenue)}</div>
            <p className="text-xs text-[#432818]/70">+8% dari kemarin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#432818]">Menu Terlaris</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#e63946]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">{stats.popularItem}</div>
            <p className="text-xs text-[#432818]/70">25 porsi terjual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#432818]">Stok Hampir Habis</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">{stats.lowStock}</div>
            <p className="text-xs text-[#432818]/70">Item perlu restok</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#432818]">Pesanan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: "#001", customer: "Andi Pratama", items: "2x Seblak Original", total: 20000, status: "pending" },
              { id: "#002", customer: "Sari Dewi", items: "1x Mie Jontor", total: 15000, status: "preparing" },
              { id: "#003", customer: "Budi Santoso", items: "3x Cireng Crispy", total: 24000, status: "ready" },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-[#fefae0] rounded-lg">
                <div>
                  <p className="font-medium text-[#432818]">
                    {order.id} - {order.customer}
                  </p>
                  <p className="text-sm text-[#432818]/70">{order.items}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#e63946]">{formatPrice(order.total)}</p>
                  <Badge
                    variant={
                      order.status === "pending"
                        ? "destructive"
                        : order.status === "preparing"
                          ? "default"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {order.status === "pending" ? "Baru" : order.status === "preparing" ? "Diproses" : "Siap"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
