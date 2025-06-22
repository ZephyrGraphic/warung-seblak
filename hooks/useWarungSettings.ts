"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function useWarungSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("warung_settings").select("*")

      if (error) throw error

      const settingsMap = (data || []).reduce(
        (acc, setting) => {
          acc[setting.setting_key] = setting.setting_value
          return acc
        },
        {} as Record<string, string>,
      )

      setSettings(settingsMap)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase.from("warung_settings").upsert({
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      await fetchSettings()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update setting")
    }
  }

  return { settings, loading, error, updateSetting, refetch: fetchSettings }
}
