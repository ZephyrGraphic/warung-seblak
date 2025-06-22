"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Loader2 } from "lucide-react"

interface CustomerFormProps {
  onSubmit: (customerData: { name: string; phone: string }) => void
  loading?: boolean
}

export function CustomerForm({ onSubmit, loading = false }: CustomerFormProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && phone.trim()) {
      onSubmit({ name: name.trim(), phone: phone.trim() })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#432818]">Data Pemesan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-[#432818]">
              Nama Lengkap
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-[#432818]">
              Nomor WhatsApp
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              required
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
            disabled={loading || !name.trim() || !phone.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4 mr-2" />
                Lanjut ke WhatsApp
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
