"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTestimonials } from "@/hooks/useTestimonials"
import { useOrders } from "@/hooks/useOrders"
import {
  Phone,
  MapPin,
  Clock,
  Star,
  Plus,
  MenuIcon,
  X,
  Instagram,
  MessageCircle,
  Flame,
  Loader2,
  ChefHat,
  Heart,
  Award,
  Users,
  Sparkles,
  ArrowRight,
  Play,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Menu seblak dengan animasi dan interaktivitas
const seblakMenu = [
  {
    id: 1,
    name: "Seblak Original",
    description:
      "Seblak kerupuk klasik dengan bumbu rahasia yang bikin nagih! Resep turun temurun dengan cita rasa autentik.",
    price: 10000,
    spice_level: 3,
    image_url: "/placeholder.svg?height=300&width=400",
    is_active: true,
    popular: true,
    new: false,
    ingredients: ["Kerupuk", "Telur", "Sayuran", "Bumbu Rahasia"],
  },
  {
    id: 2,
    name: "Seblak Mie",
    description: "Kombinasi sempurna mie kenyal dengan kuah seblak yang gurih pedas. Favorit anak muda!",
    price: 10000,
    spice_level: 3,
    image_url: "/placeholder.svg?height=300&width=400",
    is_active: true,
    popular: false,
    new: true,
    ingredients: ["Mie Instan", "Telur", "Sayuran", "Bumbu Spesial"],
  },
  {
    id: 3,
    name: "Seblak Makaroni",
    description: "Makaroni lembut berpadu dengan kuah seblak yang kaya rasa. Tekstur unik yang memanjakan lidah.",
    price: 10000,
    spice_level: 3,
    image_url: "/placeholder.svg?height=300&width=400",
    is_active: true,
    popular: false,
    new: false,
    ingredients: ["Makaroni", "Telur", "Sayuran", "Bumbu Khas"],
  },
  {
    id: 4,
    name: "Seblak Bakso",
    description: "Bakso sapi premium dalam kuah seblak yang menggoda. Protein tinggi dengan rasa yang tak terlupakan.",
    price: 10000,
    spice_level: 3,
    image_url: "/placeholder.svg?height=300&width=400",
    is_active: true,
    popular: true,
    new: false,
    ingredients: ["Bakso Sapi", "Telur", "Sayuran", "Bumbu Premium"],
  },
]

// Stats data untuk animasi counter
const statsData = [
  { label: "Pelanggan Puas", value: 1000, suffix: "+", icon: Users },
  { label: "Menu Varian", value: 15, suffix: "+", icon: ChefHat },
  { label: "Rating Bintang", value: 4.9, suffix: "/5", icon: Star },
  { label: "Tahun Berpengalaman", value: 5, suffix: "+", icon: Award },
]

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  spice_level: number
  image_url: string
  is_active: boolean
  popular?: boolean
  new?: boolean
  ingredients?: string[]
}

export default function WarungSeblakLanding() {
  const [orderItems, setOrderItems] = useState<(MenuItem & { quantity: number })[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [animatedStats, setAnimatedStats] = useState(statsData.map(() => 0))

  const { testimonials, loading: testimonialsLoading } = useTestimonials()
  const { createOrder, loading: orderLoading } = useOrders()

  // Animated counter effect
  useEffect(() => {
    const animateCounters = () => {
      statsData.forEach((stat, index) => {
        let start = 0
        const end = stat.value
        const duration = 2000
        const increment = end / (duration / 16)

        const timer = setInterval(() => {
          start += increment
          if (start >= end) {
            setAnimatedStats((prev) => {
              const newStats = [...prev]
              newStats[index] = end
              return newStats
            })
            clearInterval(timer)
          } else {
            setAnimatedStats((prev) => {
              const newStats = [...prev]
              newStats[index] = Math.floor(start)
              return newStats
            })
          }
        }, 16)
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters()
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )

    const statsElement = document.getElementById("stats-section")
    if (statsElement) {
      observer.observe(statsElement)
    }

    return () => observer.disconnect()
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [testimonials.length])

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const parallax = document.querySelectorAll(".parallax")
      parallax.forEach((element) => {
        const speed = 0.5
        const yPos = -(scrolled * speed)
        ;(element as HTMLElement).style.transform = `translateY(${yPos}px)`
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

    // Add animation feedback
    const button = document.querySelector(`[data-menu-id="${item.id}"]`)
    if (button) {
      button.classList.add("animate-pulse")
      setTimeout(() => button.classList.remove("animate-pulse"), 300)
    }
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
      <span key={i} className={`transition-all duration-300 ${i < level ? "text-red-500 scale-110" : "text-gray-300"}`}>
        🌶️
      </span>
    ))
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setIsMenuOpen(false)
    }
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
      setOrderError(null)

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

      try {
        await createOrder(orderData)
      } catch (dbError) {
        console.warn("Database order creation failed, continuing with WhatsApp:", dbError)
      }

      const orderText = orderItems
        .map((item) => `${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`)
        .join("\n")
      const total = formatPrice(getTotalPrice())
      const message = `Halo, saya ${customerData.name} ingin memesan:

🍜 SEBLAK MENU:
${orderText}

💰 Total: ${total}

📞 WhatsApp: ${customerData.phone}

*Catatan: Harga sudah termasuk topping standar. Untuk request topping tambahan, bisa disampaikan di chat ini ya!*`

      window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, "_blank")

      setOrderItems([])
      setShowCustomerForm(false)
      setOrderError(null)
    } catch (error) {
      console.error("Error processing order:", error)
      setOrderError("Terjadi kesalahan saat memproses pesanan. Pesanan akan tetap dikirim ke WhatsApp.")

      const orderText = orderItems
        .map((item) => `${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`)
        .join("\n")
      const total = formatPrice(getTotalPrice())
      const message = `Halo, saya ${customerData.name} ingin memesan:

🍜 SEBLAK MENU:
${orderText}

💰 Total: ${total}

📞 WhatsApp: ${customerData.phone}`

      window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, "_blank")

      setTimeout(() => {
        setOrderItems([])
        setShowCustomerForm(false)
        setOrderError(null)
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Modern Header with Glass Effect */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-orange-200/50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Animated Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Flame className="w-7 h-7 text-white animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Seblak Teh Imas
                </h1>
                <p className="text-sm text-orange-600 font-medium">Cafe Seblak Premium</p>
              </div>
            </div>

            {/* Desktop Navigation with Hover Effects */}
            <nav className="hidden md:flex items-center space-x-8">
              {[
                { label: "Home", id: "home" },
                { label: "Menu", id: "menu" },
                { label: "Promo", id: "promo" },
                { label: "Testimoni", id: "testimonials" },
                { label: "Kontak", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative text-gray-700 hover:text-red-600 transition-all duration-300 font-medium group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
            </nav>

            {/* CTA Button with Animation */}
            <div className="flex items-center space-x-4">
              <Button
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white hidden sm:flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pesan Sekarang</span>
                <Sparkles className="w-4 h-4 animate-pulse" />
              </Button>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-orange-100 transition-colors duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation with Slide Animation */}
          <div
            className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <nav className="mt-4 pb-4 border-t border-orange-200/50 pt-4">
              <div className="flex flex-col space-y-4">
                {[
                  { label: "Home", id: "home" },
                  { label: "Menu", id: "menu" },
                  { label: "Promo", id: "promo" },
                  { label: "Testimoni", id: "testimonials" },
                  { label: "Kontak", id: "contact" },
                ].map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-gray-700 hover:text-red-600 transition-all duration-300 font-medium transform hover:translate-x-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item.label}
                  </button>
                ))}
                <Button
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white w-full sm:hidden flex items-center justify-center space-x-2 mt-4"
                  onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pesan Sekarang</span>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Video Background Effect */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-yellow-500/10">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20 parallax"></div>
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-red-400/20 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-orange-400/20 rounded-full animate-bounce delay-2000"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-yellow-400/20 rounded-full animate-bounce delay-3000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content with Animations */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-orange-100 px-4 py-2 rounded-full border border-red-200 animate-fade-in">
                  <Sparkles className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-red-700 font-medium text-sm">Cafe Seblak Premium #1 di Bandung</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent animate-gradient">
                    Level Pedasnya
                  </span>
                  <br />
                  <span className="text-gray-800 animate-slide-up">Bikin Nagih!</span>
                </h1>

                <p className="text-xl text-gray-600 max-w-lg leading-relaxed animate-fade-in-delay">
                  Rasakan sensasi pedas yang tak terlupakan dengan seblak premium terenak di kota!
                  <span className="font-bold text-red-600">Harga flat 10.000</span> sudah termasuk topping standar.
                </p>
              </div>

              {/* CTA Buttons with Hover Effects */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg px-8 py-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => scrollToSection("menu")}
                >
                  <ChefHat className="w-5 h-5 mr-2" />
                  Lihat Menu
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <Link href="/pesan">
                    <Flame className="w-5 h-5 mr-2" />
                    Pesan Parasmanan
                  </Link>
                </Button>
              </div>

              {/* Stats with Animated Counters */}
              <div id="stats-section" className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {statsData.map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={index} className="text-center group">
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <IconComponent className="w-8 h-8 text-red-500 mx-auto mb-2 group-hover:animate-bounce" />
                        <div className="text-2xl font-bold text-gray-800">
                          {animatedStats[index]}
                          {stat.suffix}
                        </div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Hero Image with Interactive Elements */}
            <div className="relative">
              <div className="relative z-10 group">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-400 to-orange-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Seblak Teh Imas Premium"
                    width={800}
                    height={600}
                    className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Floating Price Tag */}
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
                    <span className="font-bold">Mulai Rp 10.000</span>
                  </div>

                  {/* Interactive Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 group"
                    >
                      <Play className="w-8 h-8 text-red-500 ml-1 group-hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-400 rounded-full animate-bounce delay-1000 shadow-lg"></div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-red-400 rounded-full animate-bounce delay-2000 shadow-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section with Advanced Interactions */}
      <section id="menu" className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-orange-100 px-4 py-2 rounded-full border border-red-200 mb-4">
              <ChefHat className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-red-700 font-medium text-sm">Menu Signature</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Menu Seblak{" "}
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Premium</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Semua menu seblak dengan harga flat <span className="font-bold text-red-600">Rp 10.000</span> sudah
              termasuk topping standar! Rasakan kelezatan yang tak terlupakan.
            </p>

            <div className="mt-8 inline-flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-3 rounded-2xl border border-yellow-200 shadow-lg">
              <Heart className="w-5 h-5 text-red-500 mr-2 animate-pulse" />
              <span className="text-gray-700 font-medium">💡 Ingin topping tambahan? Request via WhatsApp ya!</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {seblakMenu.map((item, index) => (
              <Card
                key={item.id}
                className={`group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50 transform hover:scale-105 ${
                  hoveredCard === item.id ? "shadow-2xl scale-105" : "shadow-lg"
                }`}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.name}
                    width={400}
                    height={300}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay with Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {item.popular && (
                      <Badge className="bg-red-500 text-white shadow-lg animate-pulse">
                        <Flame className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {item.new && (
                      <Badge className="bg-green-500 text-white shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" />
                        New
                      </Badge>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {formatPrice(item.price)}
                  </div>

                  {/* Spice Level */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                    <div className="flex items-center space-x-1">{getSpiceIndicator(item.spice_level)}</div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors duration-300">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{item.description}</p>
                  </div>

                  {/* Ingredients */}
                  {item.ingredients && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.ingredients.map((ingredient, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-red-600">{formatPrice(item.price)}</span>
                      <p className="text-xs text-gray-500">*Sudah termasuk topping standar</p>
                    </div>

                    <Button
                      data-menu-id={item.id}
                      onClick={() => addToOrder(item)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah ke Keranjang
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Box with Animation */}
          <div className="mt-16 max-w-5xl mx-auto">
            <Card className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <ChefHat className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-4">🍜 Topping Standar Sudah Termasuk:</h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Setiap menu seblak sudah dilengkapi dengan topping standar seperti telur, kerupuk, dan sayuran segar
                  pilihan.
                </p>

                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {["🥚 Telur", "🍘 Kerupuk", "🥬 Sayuran", "🧄 Bumbu Rahasia"].map((topping, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-red-300 text-red-600 bg-white/50 px-4 py-2 text-sm hover:bg-red-100 transition-colors duration-300"
                    >
                      {topping}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-gray-500 bg-white/70 rounded-lg p-4 border border-red-200">
                  💡 <strong>Pro Tip:</strong> Ingin tambahan ceker, bakso, atau topping lainnya? Langsung request via
                  WhatsApp saat pesan! Kami siap customize sesuai selera kamu 📱
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Promo Section with Animated Cards */}
      <section
        id="promo"
        className="py-20 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-float delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white mb-12">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="font-medium text-sm">Promo Spesial</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">Promo Menggiurkan!</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">Jangan sampai terlewat promo spesial dari kami</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Gratis Es Teh Manis!",
                description:
                  "Untuk 3 pesanan seblak, dapatkan es teh manis gratis! Segar dan manis, cocok untuk netralkan pedas.",
                icon: "🧊",
                gradient: "from-blue-400 to-cyan-400",
              },
              {
                title: "Harga Hemat Banget!",
                description:
                  "Semua menu seblak cuma 10.000 aja, sudah termasuk topping standar! Murah meriah, rasa premium.",
                icon: "💰",
                gradient: "from-green-400 to-emerald-400",
              },
              {
                title: "Challenge Level 5!",
                description:
                  "Berani coba Level 5? Habiskan dan dapatkan sticker eksklusif Teh Imas! Buktikan kehebatanmu!",
                icon: "🔥",
                gradient: "from-red-400 to-pink-400",
              },
            ].map((promo, index) => (
              <div key={index} className="group" style={{ animationDelay: `${index * 200}ms` }}>
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:rotate-1">
                  <CardContent className="p-8 text-center text-white">
                    <div className="text-6xl mb-4 animate-bounce">{promo.icon}</div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                      {promo.title}
                    </h3>
                    <p className="opacity-90 leading-relaxed">{promo.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Gallery Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-orange-100 px-4 py-2 rounded-full border border-red-200 mb-4">
              <Award className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-red-700 font-medium text-sm">Gallery Premium</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Galeri{" "}
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Makanan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Lihat kelezatan yang menggugah selera</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Image
                  src={`/placeholder.svg?height=300&width=300&text=Gallery${i + 1}`}
                  alt={`Gallery ${i + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay with Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-bold">Seblak Special</h4>
                    <p className="text-sm opacity-90">Level Pedas: 🌶️🌶️🌶️</p>
                  </div>

                  <div className="absolute top-4 right-4">
                    <Heart className="w-6 h-6 text-white hover:text-red-400 cursor-pointer transition-colors duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials with Carousel */}
      <section id="testimonials" className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full border border-yellow-200 mb-4">
              <Star className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-orange-700 font-medium text-sm">Testimoni Pelanggan</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Kata{" "}
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Pelanggan
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dengar langsung dari mereka yang sudah merasakan kelezatan seblak kami
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
          ) : testimonials.length > 0 ? (
            <div className="relative max-w-4xl mx-auto">
              {/* Main Testimonial Card */}
              <Card className="bg-gradient-to-br from-white to-gray-50 shadow-2xl border-0 overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="text-center">
                    {/* Customer Avatar */}
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="text-white font-bold text-2xl">
                        {testimonials[currentTestimonial]?.customer_name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex justify-center mb-6">
                      {Array.from({ length: testimonials[currentTestimonial]?.rating || 5 }, (_, i) => (
                        <Star
                          key={i}
                          className="w-6 h-6 fill-yellow-400 text-yellow-400 mx-1 animate-pulse"
                          style={{ animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-6 min-h-[100px] flex items-center justify-center">
                      "{testimonials[currentTestimonial]?.comment}"
                    </blockquote>

                    {/* Customer Name */}
                    <div className="text-lg font-bold text-gray-800">
                      {testimonials[currentTestimonial]?.customer_name}
                    </div>
                    <div className="text-sm text-gray-500">Pelanggan Setia</div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Dots */}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? "bg-red-500 scale-125" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              {/* Thumbnail Testimonials */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {testimonials.slice(0, 3).map((testimonial, index) => (
                  <Card
                    key={testimonial.id}
                    className="p-6 border-red-200 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                    onClick={() => setCurrentTestimonial(index)}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {testimonial.customer_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{testimonial.customer_name}</h4>
                          <div className="flex">
                            {Array.from({ length: testimonial.rating }, (_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 italic text-sm line-clamp-3">"{testimonial.comment}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Belum ada testimoni</p>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-red-500/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-orange-500/10 rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="font-medium text-sm">Lokasi & Kontak</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Kunjungi{" "}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Kami</span>
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Temukan lokasi kami dan hubungi untuk informasi lebih lanjut
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              {[
                {
                  icon: MapPin,
                  title: "Alamat Lengkap",
                  content: "Jl. Raya Seblak No. 123, Bandung, Jawa Barat 40123",
                  subtext: "Dekat dengan kampus dan pusat kota",
                },
                {
                  icon: Clock,
                  title: "Jam Operasional",
                  content: "Buka setiap hari 10.00 - 22.00",
                  subtext: "Siap melayani dari pagi hingga malam",
                },
                {
                  icon: Phone,
                  title: "Kontak WhatsApp",
                  content: "+62 812-3456-7890",
                  subtext: "Fast response untuk pemesanan",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-6 group"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-red-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-lg opacity-90 mb-1">{item.content}</p>
                    <p className="text-sm opacity-70">{item.subtext}</p>
                  </div>
                </div>
              ))}

              {/* CTA Button */}
              <div className="pt-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat WhatsApp Sekarang
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Interactive Map Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl h-96 flex items-center justify-center shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="text-center relative z-10">
                  <MapPin className="w-16 h-16 text-red-400 mx-auto mb-4 animate-bounce" />
                  <p className="text-xl font-bold mb-2">Interactive Map</p>
                  <p className="opacity-70">Google Maps Integration</p>
                  <Button
                    variant="outline"
                    className="mt-4 border-white/30 text-white hover:bg-white/10"
                    onClick={() => window.open("https://maps.google.com", "_blank")}
                  >
                    Buka di Google Maps
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-black text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6 group">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    Seblak Teh Imas
                  </h1>
                  <p className="text-sm text-orange-400">Cafe Seblak Premium</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                Warung seblak premium dengan cita rasa autentik dan harga terjangkau. Melayani dengan sepenuh hati sejak
                2020 dengan komitmen kualitas terbaik.
              </p>

              {/* Social Media */}
              <div className="flex space-x-4">
                {[
                  { icon: Instagram, label: "Instagram", color: "from-pink-500 to-purple-500" },
                  { icon: MessageCircle, label: "WhatsApp", color: "from-green-500 to-green-600" },
                ].map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className={`border-white/20 text-white hover:bg-gradient-to-r hover:${social.color} hover:border-transparent transition-all duration-300 transform hover:scale-110`}
                  >
                    <social.icon className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Menu Favorit */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-red-400">Menu Favorit</h3>
              <ul className="space-y-3">
                {[
                  "Seblak Original - 10.000",
                  "Seblak Mie - 10.000",
                  "Seblak Makaroni - 10.000",
                  "Seblak Bakso - 10.000",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-orange-400">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { label: "Menu", id: "menu" },
                  { label: "Promo", id: "promo" },
                  { label: "Testimoni", id: "testimonials" },
                  { label: "Kontak", id: "contact" },
                ].map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2024 Warung Seblak Parasmanan Teh Imas. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-gray-400 text-sm">in Bandung</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
