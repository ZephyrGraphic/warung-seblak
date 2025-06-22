import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  spice_level: number
  image_url: string
  is_active: boolean
  created_at: string
}

export interface SeblakVariation {
  id: number
  name: string
  description: string
  base_price: number
  image_url: string
  is_available: boolean
  current_stock: number
  minimum_stock: number
  created_at: string
}

export interface Topping {
  id: number
  name: string
  price: number
  image_url: string
  is_available: boolean
  current_stock: number
  minimum_stock: number
  created_at: string
}

export interface StockItem {
  id: number
  name: string
  current_stock: number
  minimum_stock: number
  unit: string
  price_per_unit: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Promo {
  id: number
  title: string
  description: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
}

export interface WarungSetting {
  id: number
  setting_key: string
  setting_value: string
  updated_at: string
}

export interface Order {
  id: number
  customer_name: string
  customer_phone: string
  seblak_variation_id?: number
  seblak_variations?: SeblakVariation
  items: OrderItem[]
  total_price: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed"
  level_pedas?: string
  sayur?: string[]
  rasa?: string[]
  penyajian?: string
  cara_makan?: string
  notes?: string
  created_at: string
}

export interface OrderItem {
  menu_item_id: number
  quantity: number
  price: number
  menu_item: MenuItem
}

export interface OrderTopping {
  order_id: number
  topping_id: number
  quantity: number
  topping: Topping
}

export interface Testimonial {
  id: number
  customer_name: string
  rating: number
  comment: string
  is_visible: boolean
  created_at: string
}

export interface CustomOrder {
  customerName: string
  customerPhone: string
  seblakVariationId: number
  levelPedas: string
  sayur: string[]
  rasa: string[]
  penyajian: string
  caraMakan: string
  selectedToppings: Array<{
    topping_id: number
    quantity: number
    price: number
  }>
  totalPrice: number
  notes?: string
}

export interface DashboardStats {
  todayOrders: number
  todayRevenue: number
  popularVariation: string
  popularTopping: string
  weeklyRevenue: number[]
  orderDistribution: {
    kuah: number
    kering: number
    bungkus: number
    makan_ditempat: number
  }
}
