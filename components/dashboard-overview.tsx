"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { ShoppingCart, DollarSign, TrendingUp, Flame, Loader2, RefreshCw, AlertCircle } from "lucide-react"

export function DashboardOverview() {
  const { stats, loading, error, refetch } = useDashboardStats()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#e63946] mx-auto mb-4" />
          <p className="text-[#432818]/70">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#432818] mb-2">Gagal Memuat Dashboard</h3>
          <p className="text-[#432818]/70 mb-4">{error}</p>
          <Button
            onClick={refetch}
            variant="outline"
            className="border-[#e63946] text-[#e63946] hover:bg-[#e63946] hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    )
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
            <p className="text-xs text-[#432818]/70">
              {stats.todayOrders > 0 ? "+12% dari kemarin" : "Belum ada pesanan hari ini"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#432818]">Pendapatan Hari Ini</CardTitle>
            <DollarSign className="h-4 w-4 text-[#f4a261]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#432818]">{formatPrice(stats.todayRevenue)}</div>
            <p className="text-xs text-[#432818]/70">
              {stats.todayRevenue > 0 ? "+8% dari kemarin" : "Belum ada pendapatan hari ini"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#432818]">Menu Terlaris</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#e63946]" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-[#432818]">{stats.popularVariation}</div>
            <p className="text-xs text-[#432818]/70">Variasi paling diminati</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#432818]">Topping Favorit</CardTitle>
            <Flame className="h-4 w-4 text-[#e63946]" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-[#432818]">{stats.popularTopping}</div>
            <p className="text-xs text-[#432818]/70">Topping paling dipilih</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#432818]">Penjualan 7 Hari Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.weeklyRevenue.map((revenue, index) => {
                const date = new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000)
                const dayName = date.toLocaleDateString("id-ID", { weekday: "short" })
                const maxRevenue = Math.max(...stats.weeklyRevenue, 1)
                const percentage = (revenue / maxRevenue) * 100

                return (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-12 text-sm text-[#432818]/70">{dayName}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#e63946] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-20 text-sm text-[#432818] text-right">{formatPrice(revenue)}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Order Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#432818]">Distribusi Pesanan Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#e63946]">{stats.orderDistribution.kuah}</div>
                  <div className="text-sm text-[#432818]/70">Kuah</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#f4a261]">{stats.orderDistribution.kering}</div>
                  <div className="text-sm text-[#432818]/70">Kering</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#e63946]">{stats.orderDistribution.bungkus}</div>
                  <div className="text-sm text-[#432818]/70">Dibungkus</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#f4a261]">{stats.orderDistribution.makan_ditempat}</div>
                  <div className="text-sm text-[#432818]/70">Makan Ditempat</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#432818]">Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="bg-[#e63946] hover:bg-[#d62d20] text-white">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Lihat Pesanan
            </Button>
            <Button variant="outline" className="border-[#f4a261] text-[#f4a261] hover:bg-[#f4a261] hover:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Update Stok
            </Button>
            <Button variant="outline" className="border-[#e63946] text-[#e63946] hover:bg-[#e63946] hover:text-white">
              <Flame className="w-4 h-4 mr-2" />
              Tambah Menu
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-blue-800">
              <strong>Tips:</strong> Dashboard ini menampilkan data real-time dari database Supabase. Jika ada masalah
              koneksi, data akan menampilkan nilai default.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
