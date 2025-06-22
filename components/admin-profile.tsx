"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Camera,
  Lock,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Calendar,
  Mail,
  Phone,
} from "lucide-react"
import type { AdminUser } from "@/lib/auth"

interface AdminProfileProps {
  user: AdminUser
}

export function AdminProfile({ user }: AdminProfileProps) {
  const [profileData, setProfileData] = useState({
    username: user.username,
    full_name: user.full_name,
    email: "tehimas@warungseblak.com",
    phone: "+62 812-3456-7890",
    bio: "Admin Warung Seblak Teh Imas - Melayani dengan sepenuh hati sejak 2020",
    avatar: "/placeholder.svg?height=150&width=150",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setMessage({ type: "success", text: "Profil berhasil diperbarui!" })
    } catch (error) {
      setMessage({ type: "error", text: "Gagal memperbarui profil. Silakan coba lagi." })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Password baru dan konfirmasi password tidak cocok!" })
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password baru minimal 6 karakter!" })
      setLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setMessage({ type: "success", text: "Password berhasil diperbarui!" })
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      setMessage({ type: "error", text: "Gagal memperbarui password. Silakan coba lagi." })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          avatar: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-red-100">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 border-4 border-gradient-to-r from-red-500 to-orange-500 shadow-xl">
                <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.full_name} />
                <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white text-2xl font-bold">
                  {profileData.full_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                {profileData.full_name}
              </h1>
              <p className="text-gray-600 mb-2">@{profileData.username}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Super Admin</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Bergabung sejak 2020</span>
                </div>
              </div>
              <Badge className="mt-2 bg-green-100 text-green-700 hover:bg-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Aktif
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert
          className={`${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"} animate-fade-in`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-700" : "text-red-700"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
          >
            <User className="w-4 h-4 mr-2" />
            Informasi Profil
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
          >
            <Lock className="w-4 h-4 mr-2" />
            Keamanan
          </TabsTrigger>
        </TabsList>

        {/* Profile Information Tab */}
        <TabsContent value="profile">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
              <CardTitle className="text-2xl text-gray-800 flex items-center">
                <User className="w-6 h-6 mr-2 text-red-500" />
                Informasi Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-700 font-medium">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, username: e.target.value }))}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500 transition-all duration-300"
                      placeholder="Masukkan username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-gray-700 font-medium">
                      Nama Lengkap
                    </Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, full_name: e.target.value }))}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500 transition-all duration-300"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                        className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500 transition-all duration-300"
                        placeholder="Masukkan email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Nomor Telepon
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500 transition-all duration-300"
                        placeholder="Masukkan nomor telepon"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-700 font-medium">
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-red-500 transition-all duration-300 resize-none"
                    rows={3}
                    placeholder="Ceritakan tentang diri Anda..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {loading ? (
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
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
              <CardTitle className="text-2xl text-gray-800 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-red-500" />
                Keamanan Akun
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-gray-700 font-medium">
                    Password Saat Ini
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      className="pr-10 border-gray-300 focus:border-red-500 focus:ring-red-500 transition-all duration-300"
                      placeholder="Masukkan password saat ini"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                    Password Baru
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                      className="pr-10 border-gray-300 focus:border-red-500 focus:ring-red-500 transition-all duration-300"
                      placeholder="Masukkan password baru"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">Password minimal 6 karakter</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    Konfirmasi Password Baru
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pr-10 border-gray-300 focus:border-red-500 focus:ring-red-500 transition-all duration-300"
                      placeholder="Konfirmasi password baru"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Tips Keamanan</h4>
                      <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                        <li>• Gunakan kombinasi huruf besar, kecil, angka, dan simbol</li>
                        <li>• Jangan gunakan informasi pribadi yang mudah ditebak</li>
                        <li>• Ganti password secara berkala</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Memperbarui...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Perbarui Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
