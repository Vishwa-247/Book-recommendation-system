"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Sparkles } from "lucide-react"

export function PurchaseSuccess() {
  const [showBoom, setShowBoom] = useState(false)

  useEffect(() => {
    // Trigger boom effect after a short delay
    const timer = setTimeout(() => {
      setShowBoom(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center text-white relative">
        {/* Boom Effect */}
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            showBoom ? "scale-150 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <div className="text-8xl animate-bounce">💥</div>
        </div>

        {/* Success Content */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            showBoom ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <div className="relative">
            <CheckCircle className="h-24 w-24 text-green-400 mx-auto mb-6 animate-pulse" />
            <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 animate-spin" />
            <Sparkles className="absolute -bottom-2 -left-2 h-6 w-6 text-blue-400 animate-ping" />
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Purchase Successful! 🎉
          </h1>

          <p className="text-xl mb-6 text-gray-300">Your book has been added to your library</p>

          <div className="flex justify-center space-x-4 text-2xl animate-bounce">
            <span>📚</span>
            <span>✨</span>
            <span>🎊</span>
            <span>📖</span>
            <span>🌟</span>
          </div>

          <p className="text-sm text-gray-400 mt-6">Redirecting to your journal collection...</p>
        </div>
      </div>
    </div>
  )
}
