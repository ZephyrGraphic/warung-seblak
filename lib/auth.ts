"use client"

// Simple client-side authentication for demo
// In production, use proper authentication like NextAuth.js or Supabase Auth

export interface AdminUser {
  username: string
  full_name: string
}

const ADMIN_CREDENTIALS = {
  username: "tehimas",
  password: "tehimas123", // In production, this should be hashed and stored securely
  full_name: "Teh Imas",
}

export const authenticateAdmin = (username: string, password: string): AdminUser | null => {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    return {
      username: ADMIN_CREDENTIALS.username,
      full_name: ADMIN_CREDENTIALS.full_name,
    }
  }
  return null
}

export const getAdminSession = (): AdminUser | null => {
  if (typeof window === "undefined") return null

  const session = localStorage.getItem("admin_session")
  if (session) {
    try {
      return JSON.parse(session)
    } catch {
      return null
    }
  }
  return null
}

export const setAdminSession = (user: AdminUser): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin_session", JSON.stringify(user))
  }
}

export const clearAdminSession = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_session")
  }
}
