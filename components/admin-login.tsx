"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Flame, Loader2, Eye, EyeOff, Shield, Sparkles } from "lucide-react"

interface AdminLoginProps {
  onLogin: (credentials: { username: string; password: string }) => Promise<boolean>
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const success = await onLogin({ username, password })
      if (!success) {
        setError("Username atau password salah")
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-400/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-orange-400/10 rounded-full animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/10 rounded-full animate-float delay-2000"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/80 backdrop-blur-lg">
        <CardHeader className="text-center pb-8">
          {/* Animated Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <Flame className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce">
                <Sparkles className="w-4 h-4 text-white m-1" />
              </div>
            </div>
          </div>

          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </CardTitle>
          <p className="text-gray-600 font-medium">Warung Seblak Teh Imas</p>

          {/* Security Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-orange-100 px-3 py-1 rounded-full border border-red-200 mt-4">
            <Shield className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-red-700 font-medium text-sm">Secure Login</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                className="border-gray-300 focus:border-red-500 focus:ring-red-500 transition-all duration-300 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="pr-12 border-gray-300 focus:border-red-500 focus:ring-red-500 transition-all duration-300 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50 animate-fade-in">
                <AlertDescription className="text-red-700 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white h-12 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Masuk...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Masuk ke Dashboard
                </>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
            <div className="text-center">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center justify-center">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-600" />
                Demo Login
              </h4>
              <div className="space-y-2 text-sm">
                <div className="bg-white/70 rounded-lg p-3 border border-yellow-200">
                  <p className="font-medium text-gray-700">
                    Username: <code className="bg-gray-100 px-2 py-1 rounded text-red-600">tehimas</code>
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg p-3 border border-yellow-200">
                  <p className="font-medium text-gray-700">
                    Password: <code className="bg-gray-100 px-2 py-1 rounded text-red-600">tehimas123</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
