"use client"

import { useState, useEffect } from "react"
import { supabase, type StockItem } from "@/lib/supabase"

export function useStockItems() {
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStockItems()
  }, [])

  const fetchStockItems = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from("stock_items")
        .select("*")
        .eq("is_active", true)
        .order("name")

      if (fetchError) {
        throw fetchError
      }

      setStockItems(data || [])
    } catch (err) {
      console.error("Error fetching stock items:", err)
      setError(err instanceof Error ? err.message : "Gagal memuat data stok")
      // Set default data on error
      setStockItems([])
    } finally {
      setLoading(false)
    }
  }

  const updateStock = async (id: number, newStock: number) => {
    try {
      setError(null)

      const { error: updateError } = await supabase
        .from("stock_items")
        .update({
          current_stock: newStock,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (updateError) {
        throw updateError
      }

      await fetchStockItems()
    } catch (err) {
      console.error("Error updating stock:", err)
      setError(err instanceof Error ? err.message : "Gagal mengupdate stok")
      throw err
    }
  }

  const addStockItem = async (item: Omit<StockItem, "id" | "created_at" | "updated_at">) => {
    try {
      setError(null)

      const { error: insertError } = await supabase.from("stock_items").insert(item)

      if (insertError) {
        throw insertError
      }

      await fetchStockItems()
    } catch (err) {
      console.error("Error adding stock item:", err)
      setError(err instanceof Error ? err.message : "Gagal menambah item stok")
      throw err
    }
  }

  return { stockItems, loading, error, updateStock, addStockItem, refetch: fetchStockItems }
}
