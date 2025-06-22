"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminLogin } from "@/components/admin-login"
import { getAdminSession, setAdminSession, clearAdminSession, authenticateAdmin } from "@/lib/auth"
import type { AdminUser } from "@/lib/auth"

interface AdminGuardProps {
  children: (user: AdminUser, logout: () => void) => React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getAdminSession()
    setUser(session)
    setLoading(false)
  }, [])

  const handleLogin = async (credentials: { username: string; password: string }) => {
    const authenticatedUser = authenticateAdmin(credentials.username, credentials.password)
    if (authenticatedUser) {
      setAdminSession(authenticatedUser)
      setUser(authenticatedUser)
      return true
    }
    return false
  }

  const handleLogout = () => {
    clearAdminSession()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefae0] flex items-center justify-center">
        <div className="text-[#432818]">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return <>{children(user, handleLogout)}</>
}
