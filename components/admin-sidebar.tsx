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
]

export function AdminSidebar({ activeTab, onTabChange, onLogout, adminName }: AdminSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 p-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#e63946] to-[#f4a261] rounded-full flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#432818]">Admin Panel</h1>
            <p className="text-xs text-[#e63946]">Warung Seblak</p>
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
                  <SidebarMenuButton onClick={() => onTabChange(item.id)} isActive={activeTab === item.id}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
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
