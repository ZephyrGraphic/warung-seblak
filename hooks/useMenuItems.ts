"use client"

import { useState, useEffect } from "react"
import { supabase, type MenuItem } from "@/lib/supabase"

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const { data, error } = await supabase.from("menu_items").select("*").eq("is_active", true).order("id")

        if (error) throw error
        setMenuItems(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  return { menuItems, loading, error }
}
