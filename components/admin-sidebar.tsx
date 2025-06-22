"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  ShoppingCart,
  ChefHat,
  Package,
  Star,
  Gift,
  Settings,
  User,
  LogOut,
  Flame,
} from "lucide-react"

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
  adminName: string
}

const menuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "orders",
    title: "Pesanan Masuk",
    icon: ShoppingCart,
  },
  {
    id: "menu",
    title: "Menu & Harga",
    icon: ChefHat,
  },
  {
    id: "stock",
    title: "Stok Bahan",
    icon: Package,
  },
  {
    id: "testimonials",
    title: "Testimoni",
    icon: Star,
  },
  {
    id: "promos",
    title: "Promo",
    icon: Gift,
  },
  {
    id: "settings",
    title: "Pengaturan",
    icon: Settings,
  },
  {
    id: "profile",
    title: "Profil Admin",
    icon: User,
  },
]

export function AdminSidebar({ activeTab, onTabChange, onLogout, adminName }: AdminSidebarProps) {
  return (
    <Sidebar className="border-r-0 bg-gradient-to-b from-white to-gray-50 shadow-xl">
      <SidebarHeader className="border-b border-red-100 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="flex items-center space-x-3 p-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-sm text-red-500 font-medium">Warung Seblak Premium</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className={`transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:text-red-600 ${
                      activeTab === item.id ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg" : ""
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User className="w-4 h-4" />
                  <span>{adminName}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
