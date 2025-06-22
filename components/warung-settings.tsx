"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useWarungSettings } from "@/hooks/useWarungSettings"
import { Settings, Save, Loader2 } from "lucide-react"

export function WarungSettings() {
  const { settings, loading, updateSetting } = useWarungSettings()
  const [formData, setFormData] = useState({
    warung_name: "",
    whatsapp_number: "",
    address: "",
    opening_hours: "",
    is_open: "true",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (settings) {
      setFormData({
        warung_name: settings.warung_name || "",
        whatsapp_number: settings.whatsapp_number || "",
        address: settings.address || "",
        opening_hours: settings.opening_hours || "",
        is_open: settings.is_open || "true",
      })
    }
  }, [settings])

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const [key, value] of Object.entries(formData)) {
        await updateSetting(key, value)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#e63946]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#432818]">Pengaturan Warung</h2>
        <p className="text-[#432818]/70">Kelola informasi dan pengaturan warung</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#432818] flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Informasi Warung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="warung_name">Nama Warung</Label>
            <Input
              id="warung_name"
              value={formData.warung_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, warung_name: e.target.value }))}
              placeholder="Nama warung"
            />
          </div>

          <div>
            <Label htmlFor="whatsapp_number">Nomor WhatsApp</Label>
            <Input
              id="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp_number: e.target.value }))}
              placeholder="628123456789"
            />
          </div>

          <div>
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Alamat lengkap warung"
            />
          </div>

          <div>
            <Label htmlFor="opening_hours">Jam Operasional</Label>
            <Input
              id="opening_hours"
              value={formData.opening_hours}
              onChange={(e) => setFormData((prev) => ({ ...prev, opening_hours: e.target.value }))}
              placeholder="10:00 - 22:00"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_open"
              checked={formData.is_open === "true"}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_open: checked ? "true" : "false" }))}
            />
            <Label htmlFor="is_open">Warung sedang buka</Label>
          </div>

          <Button onClick={handleSave} className="w-full bg-[#e63946] hover:bg-[#d62d20] text-white" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
