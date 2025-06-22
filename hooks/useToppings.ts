"use client"

import { useState, useEffect } from "react"
import { supabase, type Topping } from "@/lib/supabase"

export function useToppings() {
  const [toppings, setToppings] = useState<Topping[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchToppings() {
      try {
        const { data, error } = await supabase.from("toppings").select("*").eq("is_available", true).order("name")

        if (error) throw error
        setToppings(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchToppings()
  }, [])

  return { toppings, loading, error }
}
