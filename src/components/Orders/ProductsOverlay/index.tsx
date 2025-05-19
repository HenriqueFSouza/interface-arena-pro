"use client"

import { useSalesStore } from "@/stores/sales-store"
import { useEffect } from "react"
import CartSummary from "../CartSummary"
import CategoryFilter from "../CategoryFilter"
import OrderProductsList from "../OrderProductsList"

export default function ProductsOverlay() {
  const { isOverlayOpen, setIsOverlayOpen, selectedClient, selectedCategory, setSelectedCategory } = useSalesStore()

  // Close overlay with escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOverlayOpen(false)
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [setIsOverlayOpen])

  if (!isOverlayOpen || !selectedClient) return null

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex rounded-lg">
      <div className="w-3/4 h-full bg-background border-r overflow-auto">
        <div className="p-4 border-b sticky z-10 bg-background">
          <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        </div>

        <div className="p-4">
          <OrderProductsList />
        </div>
      </div>

      <div className="w-1/4 h-full bg-muted">
        <CartSummary />
      </div>
    </div>
  )
}
