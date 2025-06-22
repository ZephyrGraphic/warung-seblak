"use client"

import { useEffect, useState } from "react"

export function FloatingElements() {
  const [elements, setElements] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])

  useEffect(() => {
    const generateElements = () => {
      const newElements = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 60 + 20,
        delay: Math.random() * 5000,
      }))
      setElements(newElements)
    }

    generateElements()
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute rounded-full bg-gradient-to-br from-red-400/10 to-orange-400/10 animate-float"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            animationDelay: `${element.delay}ms`,
            animationDuration: `${6000 + Math.random() * 4000}ms`,
          }}
        />
      ))}
    </div>
  )
}
