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

export interface Order {
  id: number
  customer_name: string
  customer_phone: string
  items: OrderItem[]
  total_price: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed"
  created_at: string
}

export interface OrderItem {
  menu_item_id: number
  quantity: number
  price: number
  menu_item: MenuItem
}

export interface Testimonial {
  id: number
  customer_name: string
  rating: number
  comment: string
  is_visible: boolean
  created_at: string
}
