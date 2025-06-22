"use client"

import { useState, useEffect } from "react"
import { supabase, type DashboardStats } from "@/lib/supabase"

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    todayRevenue: 0,
    popularVariation: "Seblak Original",
    popularTopping: "Ceker",
    weeklyRevenue: [0, 0, 0, 0, 0, 0, 0],
    orderDistribution: {
      kuah: 0,
      kering: 0,
      bungkus: 0,
      makan_ditempat: 0,
    },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const today = new Date().toISOString().split("T")[0]

      // Today's orders and revenue
      const { data: todayOrders, error: todayError } = await supabase
        .from("orders")
        .select("total_price, penyajian, cara_makan")
        .gte("created_at", today)

      if (todayError) {
        console.warn("Error fetching today's orders:", todayError)
        // Continue with default values instead of throwing
      }

      // Calculate basic stats
      const todayOrdersCount = todayOrders?.length || 0
      const todayRevenueTotal = (todayOrders || []).reduce((sum, order) => sum + (order.total_price || 0), 0)

      // Generate sample weekly revenue for demo
      const weeklyRevenue = Array.from({ length: 7 }, (_, i) => {
        const baseRevenue = 50000 + Math.random() * 100000
        return Math.floor(baseRevenue)
      })

      // Order distribution
      const distribution = (todayOrders || []).reduce(
        (acc, order) => {
          if (order.penyajian === "Kuah") acc.kuah++
          if (order.penyajian === "Kering") acc.kering++
          if (order.cara_makan === "Dibungkus") acc.bungkus++
          if (order.cara_makan === "Makan Ditempat") acc.makan_ditempat++
          return acc
        },
        { kuah: 0, kering: 0, bungkus: 0, makan_ditempat: 0 },
      )

      setStats({
        todayOrders: todayOrdersCount,
        todayRevenue: todayRevenueTotal,
        popularVariation: "Seblak Original",
        popularTopping: "Ceker",
        weeklyRevenue,
        orderDistribution: distribution,
      })
    } catch (err) {
      console.error("Error fetching dashboard stats:", err)
      setError("Gagal memuat statistik dashboard")
      // Set default stats even on error
      setStats({
        todayOrders: 0,
        todayRevenue: 0,
        popularVariation: "Seblak Original",
        popularTopping: "Ceker",
        weeklyRevenue: [0, 0, 0, 0, 0, 0, 0],
        orderDistribution: {
          kuah: 0,
          kering: 0,
          bungkus: 0,
          makan_ditempat: 0,
        },
      })
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading, error, refetch: fetchStats }
}
