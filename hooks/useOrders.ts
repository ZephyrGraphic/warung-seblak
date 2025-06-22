"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

interface OrderData {
  customerName: string
  customerPhone: string
  items: Array<{
    menu_item_id: number
    quantity: number
    price: number
  }>
  totalPrice: number
}

export function useOrders() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = async (orderData: OrderData) => {
    setLoading(true)
    setError(null)

    try {
      // Insert order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: orderData.customerName,
          customer_phone: orderData.customerPhone,
          total_price: orderData.totalPrice,
          status: "pending",
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Insert order items
      const orderItems = orderData.items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      return order
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { createOrder, loading, error }
}
