"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Plus, Flame, Sparkles, Eye } from "lucide-react"
import Image from "next/image"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  spice_level: number
  image_url: string
  popular?: boolean
  new?: boolean
  ingredients?: string[]
}

interface InteractiveMenuCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
  onViewDetails: (item: MenuItem) => void
}

export function InteractiveMenuCard({ item, onAddToCart, onViewDetails }: InteractiveMenuCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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

  return (
    <Card
      className={`group overflow-hidden transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50 transform hover:scale-105 ${
        isHovered ? "shadow-2xl scale-105" : "shadow-lg"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              onClick={() => onViewDetails(item)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Lihat Detail
            </Button>
          </div>
        </div>

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

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-300 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-600"}`}
          />
        </button>

        {/* Spice Level */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
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
                <span
                  key={idx}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors duration-300"
                >
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
            onClick={() => onAddToCart(item)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah ke Keranjang
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
