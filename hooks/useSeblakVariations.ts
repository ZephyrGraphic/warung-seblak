"use client"

import { useState, useEffect } from "react"
import { supabase, type SeblakVariation } from "@/lib/supabase"

export function useSeblakVariations() {
  const [variations, setVariations] = useState<SeblakVariation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVariations() {
      try {
        const { data, error } = await supabase
          .from("seblak_variations")
          .select("*")
          .eq("is_available", true)
          .order("base_price")

        if (error) throw error
        setVariations(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchVariations()
  }, [])

  return { variations, loading, error }
}
