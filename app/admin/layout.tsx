import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - Warung Seblak Teh Imas",
  description: "Dashboard admin untuk mengelola warung seblak",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
