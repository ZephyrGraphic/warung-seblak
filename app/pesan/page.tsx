"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { CustomerForm } from "@/components/customer-form"
import { useSeblakVariations } from "@/hooks/useSeblakVariations"
import { useToppings } from "@/hooks/useToppings"
import { useOrders } from "@/hooks/useOrders"
import {
  Flame,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Sparkles,
  ChefHat,
  Star,
  Clock,
  Users,
  Award,
  MessageCircle,
  Loader2,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

// Animated floating elements component
function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-20 left-10 w-20 h-20 bg-red-400/10 rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-orange-400/10 rounded-full animate-float delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-yellow-400/10 rounded-full animate-float delay-2000"></div>
      <div className="absolute bottom-20 right-10 w-12 h-12 bg-red-300/10 rounded-full animate-float delay-3000"></div>
    </div>
  )
}

export default function PesanSeblakPage() {
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null)
  const [selectedToppings, setSelectedToppings] = useState<{ [key: number]: number }>({})
  const [levelPedas, setLevelPedas] = useState([3])
  const [penyajian, setPenyajian] = useState("kuah")
  const [caraMakan, setCaraMakan] = useState("di-tempat")
  const [selectedSayur, setSelectedSayur] = useState<string[]>([])
  const [selectedRasa, setSelectedRasa] = useState<string[]>([])
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  const { variations, loading: variationsLoading } = useSeblakVariations()
  const { toppings, loading: toppingsLoading } = useToppings()
  const { createOrder, loading: orderLoading } = useOrders()

  const sayurOptions = ["Kangkung", "Tauge", "Kol", "Sawi", "Bayam"]
  const rasaOptions = ["Original", "Keju", "Pedas Manis", "Asam Pedas", "Gurih"]

  const calculateTotal = () => {
    let total = 0

    if (selectedVariation) {
      const variation = variations.find((v) => v.id === selectedVariation)
      if (variation) total += variation.base_price
    }

    Object.entries(selectedToppings).forEach(([toppingId, quantity]) => {
      const topping = toppings.find((t) => t.id === Number.parseInt(toppingId))
      if (topping) total += topping.price * quantity
    })

    return total
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getSpiceIndicator = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`transition-all duration-300 ${i < level ? "text-red-500 scale-110" : "text-gray-300"}`}>
        🌶️
      </span>
    ))
  }

  const handleToppingChange = (toppingId: number, change: number) => {
    setSelectedToppings((prev) => {
      const current = prev[toppingId] || 0
      const newQuantity = Math.max(0, current + change)

      if (newQuantity === 0) {
        const { [toppingId]: removed, ...rest } = prev
        return rest
      }

      return { ...prev, [toppingId]: newQuantity }
    })
  }

  const handleSayurChange = (sayur: string, checked: boolean) => {
    setSelectedSayur((prev) => (checked ? [...prev, sayur] : prev.filter((s) => s !== sayur)))
  }

  const handleRasaChange = (rasa: string, checked: boolean) => {
    setSelectedRasa((prev) => (checked ? [...prev, rasa] : prev.filter((r) => r !== rasa)))
  }

  const handleCustomerSubmit = async (customerData: { name: string; phone: string }) => {
    try {
      setOrderError(null)

      const selectedVariationData = variations.find((v) => v.id === selectedVariation)
      const selectedToppingsData = Object.entries(selectedToppings)
        .map(([toppingId, quantity]) => {
          const topping = toppings.find((t) => t.id === Number.parseInt(toppingId))
          return { topping, quantity }
        })
        .filter((item) => item.topping)

      const orderData = {
        customerName: customerData.name,
        customerPhone: customerData.phone,
        variationId: selectedVariation,
        toppings: selectedToppingsData.map((item) => ({
          topping_id: item.topping!.id,
          quantity: item.quantity,
          price: item.topping!.price,
        })),
        levelPedas: `Level ${levelPedas[0]}`,
        penyajian,
        caraMakan,
        sayur: selectedSayur,
        rasa: selectedRasa,
        totalPrice: calculateTotal(),
      }

      try {
        await createOrder(orderData)
      } catch (dbError) {
        console.warn("Database order creation failed, continuing with WhatsApp:", dbError)
      }

      // Create WhatsApp message
      const message = `Halo, saya ${customerData.name} ingin memesan Seblak Parasmanan:

🍜 *DETAIL PESANAN:*
${selectedVariationData ? `• ${selectedVariationData.name} - ${formatPrice(selectedVariationData.base_price)}` : ""}

${
  selectedToppingsData.length > 0
    ? `🥘 *TOPPING TAMBAHAN:*
${selectedToppingsData.map((item) => `• ${item.topping!.name} x${item.quantity} - ${formatPrice(item.topping!.price * item.quantity)}`).join("\n")}`
    : ""
}

🌶️ *SPESIFIKASI:*
• Level Pedas: ${levelPedas[0]}/5
• Penyajian: ${penyajian}
• Cara Makan: ${caraMakan}
${selectedSayur.length > 0 ? `• Sayuran: ${selectedSayur.join(", ")}` : ""}
${selectedRasa.length > 0 ? `• Rasa: ${selectedRasa.join(", ")}` : ""}

💰 *TOTAL: ${formatPrice(calculateTotal())}*

📞 WhatsApp: ${customerData.phone}`

      window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, "_blank")

      // Reset form
      setSelectedVariation(null)
      setSelectedToppings({})
      setLevelPedas([3])
      setPenyajian("kuah")
      setCaraMakan("di-tempat")
      setSelectedSayur([])
      setSelectedRasa([])
      setShowCustomerForm(false)
      setOrderError(null)
    } catch (error) {
      console.error("Error processing order:", error)
      setOrderError("Terjadi kesalahan saat memproses pesanan. Pesanan akan tetap dikirim ke WhatsApp.")
    }
  }

  if (variationsLoading || toppingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Memuat menu seblak...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 relative">
      <FloatingElements />

      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-orange-200/50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300 transform hover:scale-110"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Seblak Parasmanan
                  </h1>
                  <p className="text-sm text-orange-600">Customize Your Seblak</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Buka Sekarang
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <Card className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-8 relative">
                <div className="absolute top-4 right-4 opacity-20">
                  <ChefHat className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-6 h-6" />
                    <span className="font-medium">Seblak Premium Experience</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Buat Seblak Impianmu!</h2>
                  <p className="text-lg opacity-90 mb-6">
                    Pilih variasi, topping, dan level pedas sesuai seleramu. Dijamin nagih!
                  </p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>15-20 menit</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>1000+ puas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4" />
                      <span>Premium Quality</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pilih Variasi Seblak */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                <CardTitle className="text-2xl text-gray-800 flex items-center">
                  <ChefHat className="w-6 h-6 mr-2 text-red-500" />
                  Pilih Variasi Seblak
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {variations.map((variation) => (
                    <div
                      key={variation.id}
                      className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                        selectedVariation === variation.id
                          ? "border-red-500 bg-gradient-to-br from-red-50 to-orange-50 shadow-xl"
                          : "border-gray-200 bg-white hover:border-red-300 hover:shadow-lg"
                      }`}
                      onClick={() => setSelectedVariation(variation.id)}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors duration-300">
                              {variation.name}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-3">{variation.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-600">{formatPrice(variation.base_price)}</div>
                            <Badge
                              variant={variation.is_available ? "default" : "secondary"}
                              className={variation.is_available ? "bg-green-100 text-green-700" : ""}
                            >
                              {variation.is_available ? "Tersedia" : "Habis"}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">Stok: {variation.current_stock} porsi</div>
                          {selectedVariation === variation.id && (
                            <div className="flex items-center text-red-500">
                              <CheckCircle className="w-5 h-5 mr-1" />
                              <span className="font-medium">Dipilih</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedVariation === variation.id && (
                        <div className="absolute inset-0 border-2 border-red-500 rounded-2xl pointer-events-none">
                          <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Topping Tambahan */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-100">
                <CardTitle className="text-2xl text-gray-800 flex items-center">
                  <Plus className="w-6 h-6 mr-2 text-orange-500" />
                  Topping Tambahan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {toppings.map((topping) => (
                    <div
                      key={topping.id}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                          {topping.name}
                        </h4>
                        <p className="text-orange-600 font-bold">{formatPrice(topping.price)}</p>
                        <p className="text-xs text-gray-500">Stok: {topping.current_stock}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 border-orange-300 text-orange-600 hover:bg-orange-50"
                          onClick={() => handleToppingChange(topping.id, -1)}
                          disabled={!selectedToppings[topping.id]}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>

                        <span className="w-8 text-center font-medium text-gray-800">
                          {selectedToppings[topping.id] || 0}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 border-orange-300 text-orange-600 hover:bg-orange-50"
                          onClick={() => handleToppingChange(topping.id, 1)}
                          disabled={!topping.is_available}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customization Options */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Level Pedas */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
                  <CardTitle className="text-xl text-gray-800 flex items-center">
                    <Flame className="w-5 h-5 mr-2 text-red-500" />
                    Level Pedas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="flex space-x-1">{getSpiceIndicator(levelPedas[0])}</div>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-red-600">Level {levelPedas[0]}</span>
                    </div>
                    <Slider
                      value={levelPedas}
                      onValueChange={setLevelPedas}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Mild</span>
                      <span>Medium</span>
                      <span>Hot</span>
                      <span>Very Hot</span>
                      <span>Extreme</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Penyajian */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                  <CardTitle className="text-xl text-gray-800">Penyajian</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <RadioGroup value={penyajian} onValueChange={setPenyajian}>
                    <div className="space-y-3">
                      {[
                        { value: "kuah", label: "Berkuah", desc: "Dengan kuah yang banyak" },
                        { value: "kering", label: "Kering", desc: "Kuah sedikit, lebih kental" },
                      ].map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                            <div className="font-medium text-gray-800">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.desc}</div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Cara Makan & Sayuran */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Cara Makan */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                  <CardTitle className="text-xl text-gray-800">Cara Makan</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <RadioGroup value={caraMakan} onValueChange={setCaraMakan}>
                    <div className="space-y-3">
                      {[
                        { value: "di-tempat", label: "Makan di Tempat", desc: "Dine in" },
                        { value: "bungkus", label: "Dibungkus", desc: "Take away" },
                      ].map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors duration-300"
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                            <div className="font-medium text-gray-800">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.desc}</div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Pilihan Sayuran */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-green-50 to-lime-50 border-b border-green-100">
                  <CardTitle className="text-xl text-gray-800">Pilihan Sayuran</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {sayurOptions.map((sayur) => (
                      <div
                        key={sayur}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-green-50 transition-colors duration-300"
                      >
                        <Checkbox
                          id={sayur}
                          checked={selectedSayur.includes(sayur)}
                          onCheckedChange={(checked) => handleSayurChange(sayur, checked as boolean)}
                        />
                        <Label htmlFor={sayur} className="flex-1 cursor-pointer font-medium text-gray-800">
                          {sayur}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pilihan Rasa */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                <CardTitle className="text-xl text-gray-800">Pilihan Rasa</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {rasaOptions.map((rasa) => (
                    <div
                      key={rasa}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors duration-300"
                    >
                      <Checkbox
                        id={rasa}
                        checked={selectedRasa.includes(rasa)}
                        onCheckedChange={(checked) => handleRasaChange(rasa, checked as boolean)}
                      />
                      <Label htmlFor={rasa} className="flex-1 cursor-pointer font-medium text-gray-800">
                        {rasa}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                  <CardTitle className="text-xl flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Ringkasan Pesanan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {selectedVariation && (
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-gray-800">
                          {variations.find((v) => v.id === selectedVariation)?.name}
                        </p>
                        <p className="text-sm text-gray-600">Base seblak</p>
                      </div>
                      <p className="font-bold text-red-600">
                        {formatPrice(variations.find((v) => v.id === selectedVariation)?.base_price || 0)}
                      </p>
                    </div>
                  )}

                  {Object.entries(selectedToppings).map(([toppingId, quantity]) => {
                    const topping = toppings.find((t) => t.id === Number.parseInt(toppingId))
                    if (!topping || quantity === 0) return null

                    return (
                      <div
                        key={toppingId}
                        className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{topping.name}</p>
                          <p className="text-sm text-gray-600">x{quantity}</p>
                        </div>
                        <p className="font-bold text-orange-600">{formatPrice(topping.price * quantity)}</p>
                      </div>
                    )
                  })}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-gray-800">Total:</span>
                      <span className="text-2xl text-red-600">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>

                  {/* Customization Summary */}
                  {(levelPedas[0] !== 3 ||
                    penyajian !== "kuah" ||
                    caraMakan !== "di-tempat" ||
                    selectedSayur.length > 0 ||
                    selectedRasa.length > 0) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Customization:</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>• Level Pedas: {levelPedas[0]}/5</p>
                        <p>• Penyajian: {penyajian}</p>
                        <p>• Cara Makan: {caraMakan}</p>
                        {selectedSayur.length > 0 && <p>• Sayuran: {selectedSayur.join(", ")}</p>}
                        {selectedRasa.length > 0 && <p>• Sayuran: {selectedSayur.join(", ")}</p>}
                        {selectedRasa.length > 0 && <p>• Rasa: {selectedRasa.join(", ")}</p>}
                      </div>
                    </div>
                  )}

                  {showCustomerForm ? (
                    <CustomerForm onSubmit={handleCustomerSubmit} loading={orderLoading} />
                  ) : (
                    <Button
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 h-12"
                      onClick={() => setShowCustomerForm(true)}
                      disabled={!selectedVariation || calculateTotal() === 0}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Pesan via WhatsApp
                    </Button>
                  )}

                  {orderError && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm text-orange-800">{orderError}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Promo Info */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Promo Spesial!</h3>
                  <p className="text-sm text-gray-600 mb-4">Pesan 3 seblak parasmanan, dapatkan es teh gratis!</p>
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Terbatas
                  </Badge>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Butuh Bantuan?</h3>
                  <p className="text-sm text-gray-600 mb-4">Tim kami siap membantu Anda 24/7</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-600 hover:bg-green-50"
                    onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat Admin
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
