"use client"

import { useState } from "react"
import { supabase, type CustomOrder } from "@/lib/supabase"

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

  const validateOrderData = (orderData: CustomOrder | OrderData): string[] => {
    const errors: string[] = []

    // Validate customer data
    if (!orderData.customerName || orderData.customerName.trim().length === 0) {
      errors.push("Nama pelanggan harus diisi")
    }
    if (!orderData.customerPhone || orderData.customerPhone.trim().length === 0) {
      errors.push("Nomor WhatsApp harus diisi")
    }
    if (orderData.customerPhone && !/^[0-9+\-\s()]+$/.test(orderData.customerPhone)) {
      errors.push("Format nomor WhatsApp tidak valid")
    }

    // Validate total price
    if (!orderData.totalPrice || orderData.totalPrice <= 0) {
      errors.push("Total harga harus lebih dari 0")
    }

    return errors
  }

  const createOrder = async (orderData: OrderData) => {
    setLoading(true)
    setError(null)

    try {
      // Validate input data
      const validationErrors = validateOrderData(orderData)
      if (validationErrors.length > 0) {
        throw new Error(`Data tidak valid: ${validationErrors.join(", ")}`)
      }

      // Sanitize input data
      const sanitizedData = {
        customer_name: orderData.customerName.trim(),
        customer_phone: orderData.customerPhone.trim(),
        total_price: Math.round(orderData.totalPrice),
        status: "pending" as const,
      }

      // Insert order with error handling
      const { data: order, error: orderError } = await supabase.from("orders").insert(sanitizedData).select().single()

      if (orderError) {
        console.error("Order creation error:", orderError)
        throw new Error(`Gagal membuat pesanan: ${orderError.message}`)
      }

      if (!order) {
        throw new Error("Pesanan berhasil dibuat tapi tidak ada data yang dikembalikan")
      }

      // Insert order items if any
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map((item) => ({
          order_id: order.id,
          menu_item_id: item.menu_item_id,
          quantity: Math.max(1, Math.round(item.quantity)),
          price: Math.max(0, Math.round(item.price)),
        }))

        const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

        if (itemsError) {
          console.error("Order items creation error:", itemsError)
          // Don't throw here, order is already created
          console.warn("Order created but items failed to save:", itemsError.message)
        }
      }

      return order
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui"
      console.error("Create order error:", err)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createCustomOrder = async (orderData: CustomOrder) => {
    setLoading(true)
    setError(null)

    try {
      // Validate input data
      const validationErrors = validateOrderData(orderData)
      if (validationErrors.length > 0) {
        throw new Error(`Data tidak valid: ${validationErrors.join(", ")}`)
      }

      // Validate seblak variation if provided
      if (orderData.seblakVariationId) {
        const { data: variation, error: variationError } = await supabase
          .from("seblak_variations")
          .select("id, name, is_available")
          .eq("id", orderData.seblakVariationId)
          .single()

        if (variationError || !variation) {
          throw new Error("Variasi seblak tidak ditemukan")
        }

        if (!variation.is_available) {
          throw new Error(`${variation.name} sedang tidak tersedia`)
        }
      }

      // Sanitize and prepare order data
      const sanitizedOrderData = {
        customer_name: orderData.customerName.trim(),
        customer_phone: orderData.customerPhone.trim(),
        seblak_variation_id: orderData.seblakVariationId || null,
        total_price: Math.round(orderData.totalPrice),
        status: "pending" as const,
        level_pedas: orderData.levelPedas?.trim() || null,
        sayur: orderData.sayur && orderData.sayur.length > 0 ? orderData.sayur : null,
        rasa: orderData.rasa && orderData.rasa.length > 0 ? orderData.rasa : null,
        penyajian: orderData.penyajian?.trim() || null,
        cara_makan: orderData.caraMakan?.trim() || null,
        notes: orderData.notes?.trim() || null,
      }

      // Insert order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(sanitizedOrderData)
        .select()
        .single()

      if (orderError) {
        console.error("Custom order creation error:", orderError)
        throw new Error(`Gagal membuat pesanan: ${orderError.message}`)
      }

      if (!order) {
        throw new Error("Pesanan berhasil dibuat tapi tidak ada data yang dikembalikan")
      }

      // Insert toppings if any
      if (orderData.selectedToppings && orderData.selectedToppings.length > 0) {
        const orderToppings = orderData.selectedToppings.map((topping) => ({
          order_id: order.id,
          topping_id: topping.topping_id,
          quantity: Math.max(1, Math.round(topping.quantity)),
          price: Math.max(0, Math.round(topping.price)),
        }))

        const { error: toppingsError } = await supabase.from("order_toppings").insert(orderToppings)

        if (toppingsError) {
          console.error("Order toppings creation error:", toppingsError)
          // Don't throw here, order is already created
          console.warn("Order created but toppings failed to save:", toppingsError.message)
        }
      }

      return order
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui"
      console.error("Create custom order error:", err)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    createOrder,
    createCustomOrder,
    loading,
    error,
    clearError,
  }
}
