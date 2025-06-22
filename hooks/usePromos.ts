"use client"

import { useState, useEffect } from "react"
import { supabase, type Promo } from "@/lib/supabase"

export function usePromos() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPromos()
  }, [])

  const fetchPromos = async () => {
    try {
      const { data, error } = await supabase.from("promos").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setPromos(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const togglePromo = async (id: number, isActive: boolean) => {
    try {
      const { error } = await supabase.from("promos").update({ is_active: !isActive }).eq("id", id)

      if (error) throw error
      await fetchPromos()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update promo")
    }
  }

  const addPromo = async (promo: Omit<Promo, "id" | "created_at">) => {
    try {
      const { error } = await supabase.from("promos").insert(promo)
      if (error) throw error
      await fetchPromos()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add promo")
    }
  }

  return { promos, loading, error, togglePromo, addPromo, refetch: fetchPromos }
}
