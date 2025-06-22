"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CustomerForm } from "@/components/customer-form"
import { useMenuItems } from "@/hooks/useMenuItems"
import { useTestimonials } from "@/hooks/useTestimonials"
import { useOrders } from "@/hooks/useOrders"
import type { MenuItem } from "@/lib/supabase"
import {
  Phone,
  MapPin,
  Clock,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  MenuIcon,
  X,
  Instagram,
  MessageCircle,
  Flame,
  Loader2,
} from "lucide-react"
import Image from "next/image"

// Remove the static menuItems and testimonials arrays - we'll get them from Supabase

export default function WarungSeblakLanding() {
  const [orderItems, setOrderItems] = useState<(MenuItem & { quantity: number })[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)

  const { menuItems, loading: menuLoading, error: menuError } = useMenuItems()
  const { testimonials, loading: testimonialsLoading } = useTestimonials()
  const { createOrder, loading: orderLoading } = useOrders()

  const addToOrder = (item: MenuItem) => {
    setOrderItems((prev) => {
      const existing = prev.find((orderItem) => orderItem.id === item.id)
      if (existing) {
        return prev.map((orderItem) =>
          orderItem.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id: number, change: number) => {
    setOrderItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    })
  }

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getSpiceIndicator = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < level ? "text-red-500" : "text-gray-300"}>
        🌶️
      </span>
    ))
  }

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleCustomerSubmit = async (customerData: { name: string; phone: string }) => {
    try {
      const orderData = {
        customerName: customerData.name,
        customerPhone: customerData.phone,
        items: orderItems.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: getTotalPrice(),
      }

      await createOrder(orderData)

      // Create WhatsApp message
      const orderText = orderItems
        .map((item) => `${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`)
        .join("\n")
      const total = formatPrice(getTotalPrice())
      const message = `Halo, saya ${customerData.name} ingin memesan:\n\n${orderText}\n\nTotal: ${total}\n\nNomor WhatsApp: ${customerData.phone}`

      window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, "_blank")

      // Reset order
      setOrderItems([])
      setShowCustomerForm(false)
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.")
    }
  }

  return (
    <div className="min-h-screen bg-[#fefae0]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#f4a261]/20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#e63946] to-[#f4a261] rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#432818]">Warung Seblak</h1>
                <p className="text-sm text-[#e63946] font-medium">Teh Imas</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-[#432818] hover:text-[#e63946] transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("menu")}
                className="text-[#432818] hover:text-[#e63946] transition-colors"
              >
                Menu
              </button>
              <button
                onClick={() => scrollToSection("promo")}
                className="text-[#432818] hover:text-[#e63946] transition-colors"
              >
                Promo
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-[#432818] hover:text-[#e63946] transition-colors"
              >
                Contact
              </button>
            </nav>

            {/* CTA Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button
                className="bg-[#e63946] hover:bg-[#d62d20] text-white hidden sm:flex items-center space-x-2"
                onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pesan Sekarang</span>
              </Button>

              {/* Mobile Menu Toggle */}
              <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-[#f4a261]/20 pt-4">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-left text-[#432818] hover:text-[#e63946] transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("menu")}
                  className="text-left text-[#432818] hover:text-[#e63946] transition-colors"
                >
                  Menu
                </button>
                <button
                  onClick={() => scrollToSection("promo")}
                  className="text-left text-[#432818] hover:text-[#e63946] transition-colors"
                >
                  Promo
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-left text-[#432818] hover:text-[#e63946] transition-colors"
                >
                  Contact
                </button>
                <Button
                  className="bg-[#e63946] hover:bg-[#d62d20] text-white w-full sm:hidden flex items-center justify-center space-x-2"
                  onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pesan Sekarang</span>
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 bg-gradient-to-br from-[#fefae0] to-[#f4a261]/10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold text-[#432818] leading-tight">
                Level Pedasnya
                <span className="block text-[#e63946]">Bikin Nagih!</span>
              </h2>
              <p className="text-lg text-[#432818]/80 max-w-md">
                Rasakan sensasi pedas yang tak terlupakan dengan seblak dan mie jontor terenak di kota!
              </p>
              <Button
                size="lg"
                className="bg-[#e63946] hover:bg-[#d62d20] text-white text-lg px-8 py-6"
                onClick={() => scrollToSection("menu")}
              >
                Lihat Menu
              </Button>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Seblak dan Mie Jontor"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-[#f4a261]/20 rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-[#432818] mb-4">Menu Pilihan</h3>
            <p className="text-lg text-[#432818]/70 max-w-2xl mx-auto">
              Pilih level pedasmu dan rasakan sensasi yang tak terlupakan!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#e63946]" />
              </div>
            ) : menuError ? (
              <div className="col-span-full text-center py-12 text-red-500">Error loading menu: {menuError}</div>
            ) : (
              menuItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow border-[#f4a261]/20">
                  <div className="relative">
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <div className="flex items-center space-x-1">{getSpiceIndicator(item.spice_level)}</div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-[#432818] mb-2">{item.name}</h4>
                    <p className="text-[#432818]/70 mb-4 text-sm">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#e63946]">{formatPrice(item.price)}</span>
                      <Button onClick={() => addToOrder(item)} className="bg-[#f4a261] hover:bg-[#e76f51] text-white">
                        Tambah ke Pesanan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section id="promo" className="py-16 bg-gradient-to-r from-[#e63946] to-[#f4a261]">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h3 className="text-3xl font-bold mb-6">Promo Spesial!</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-xl font-bold mb-2">Gratis Es Teh!</h4>
                <p>Untuk 3 pesanan seblak, dapatkan es teh gratis!</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-xl font-bold mb-2">Tantangan Level 5</h4>
                <p>Habiskan Mie Jontor Level 5 dan dapatkan stiker Teh Imas!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-[#fefae0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-[#432818] mb-4">Galeri Makanan</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="relative group overflow-hidden rounded-xl">
                <Image
                  src={`/placeholder.svg?height=250&width=250`}
                  alt={`Gallery ${i + 1}`}
                  width={250}
                  height={250}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-[#432818] mb-4">Kata Pelanggan</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {testimonialsLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#e63946]" />
              </div>
            ) : (
              testimonials.map((testimonial, index) => (
                <Card key={testimonial.id} className="p-6 border-[#f4a261]/20">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#e63946] to-[#f4a261] rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">
                          {testimonial.customer_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#432818]">{testimonial.customer_name}</h4>
                        <div className="flex">
                          {Array.from({ length: testimonial.rating }, (_, i) => (
                            <Star key={i} className="w-4 h-4 fill-[#f4a261] text-[#f4a261]" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-[#432818]/70 italic">"{testimonial.comment}"</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section id="contact" className="py-20 bg-[#fefae0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-[#432818] mb-4">Lokasi & Kontak</h3>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-[#e63946] mt-1" />
                <div>
                  <h4 className="font-bold text-[#432818] mb-2">Alamat</h4>
                  <p className="text-[#432818]/70">Jl. Raya Seblak No. 123, Bandung, Jawa Barat 40123</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-[#e63946] mt-1" />
                <div>
                  <h4 className="font-bold text-[#432818] mb-2">Jam Buka</h4>
                  <p className="text-[#432818]/70">Buka setiap hari 10.00 - 22.00</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-[#e63946] mt-1" />
                <div>
                  <h4 className="font-bold text-[#432818] mb-2">Kontak</h4>
                  <p className="text-[#432818]/70 mb-2">+62 812-3456-7890</p>
                  <Button
                    className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
                    onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat WhatsApp
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-xl h-80 flex items-center justify-center">
              <p className="text-gray-500">Google Maps Embed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#432818] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#e63946] to-[#f4a261] rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Warung Seblak</h1>
                  <p className="text-sm text-[#f4a261]">Teh Imas</p>
                </div>
              </div>
              <p className="text-white/70">Warung seblak terenak dengan level pedas yang bikin nagih sejak 2020.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Menu Favorit</h4>
              <ul className="space-y-2 text-white/70">
                <li>Seblak Original</li>
                <li>Mie Jontor Level 5</li>
                <li>Ceker Lava</li>
                <li>Basreng Gila</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/70">
            <p>&copy; 2024 Warung Seblak Parasmanan Teh Imas. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Order Summary */}
      {orderItems.length > 0 && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 bg-[#e63946] hover:bg-[#d62d20] text-white rounded-full w-16 h-16 shadow-lg z-40"
              size="icon"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <Badge className="absolute -top-2 -right-2 bg-[#f4a261] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center p-0">
                  {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-[#432818]">Pesanan Anda</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-[#fefae0] rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-[#432818]">{item.name}</h4>
                    <p className="text-[#e63946] font-bold">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-8 h-8"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-8 h-8"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-[#432818]">Total:</span>
                  <span className="text-xl font-bold text-[#e63946]">{formatPrice(getTotalPrice())}</span>
                </div>
                {showCustomerForm ? (
                  <CustomerForm onSubmit={handleCustomerSubmit} loading={orderLoading} />
                ) : (
                  <Button
                    className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                    onClick={() => setShowCustomerForm(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Checkout via WhatsApp
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
