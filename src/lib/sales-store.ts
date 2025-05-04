"use client"

import { Client } from "@/@types/client"
import { OrderItem } from "@/@types/order"
import { Product } from "@/@types/product"
import { create } from "zustand"

export interface CartItem {
  id?: string
  product: Product
  quantity: number
}

interface SalesStore {
  selectedClient: Client | null
  setSelectedClient: (client: Client | null) => void

  isOverlayOpen: boolean
  setIsOverlayOpen: (isOpen: boolean) => void

  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void

  cartItems: CartItem[]
  newCartItems: CartItem[]
  addToCart: (product: Product) => void
  initializeCart: (items: OrderItem[]) => void
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  removeFromCart: (productId: string) => void
  getTotalPrice: () => number
  clearCart: () => void
}

export const useSalesStore = create<SalesStore>((set, get) => ({
  selectedClient: null,
  setSelectedClient: (client) => set({ selectedClient: client, }),

  isOverlayOpen: false,
  setIsOverlayOpen: (isOpen) => set({ isOverlayOpen: isOpen }),

  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  cartItems: [],
  newCartItems: [],
  addToCart: (product) => {
    const { cartItems, newCartItems } = get()
    const existingItem = cartItems.find((item) => item.product.id === product.id)

    if (existingItem) {
      set({
        cartItems: cartItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
        newCartItems: [...newCartItems, { product, quantity: 1 }],
      })
    } else {
      set({
        cartItems: [...cartItems, { product, quantity: 1 }],
        newCartItems: [...newCartItems, { product, quantity: 1 }]
      })
    }
  },

  increaseQuantity: (productId) => {
    const { cartItems, newCartItems } = get()

    // Check if product exists in cartItems
    const existingItem = cartItems.find(item => item.product.id === productId)

    if (existingItem) {
      // Update cartItems
      const updatedCartItems = cartItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )

      // Add to newCartItems
      const updatedNewCartItems = [...newCartItems, {
        product: existingItem.product,
        quantity: 1
      }]

      set({
        cartItems: updatedCartItems,
        newCartItems: updatedNewCartItems
      })
    }
  },

  decreaseQuantity: (productId) => {
    const { cartItems, newCartItems } = get()

    const itemToDecrease = cartItems.find(item => item.product.id === productId && item.quantity > 1)

    if (itemToDecrease) {
      set({
        cartItems: cartItems.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        ),
      })
    }
  },

  removeFromCart: (productId) => {
    const { cartItems, newCartItems } = get()

    set({
      cartItems: cartItems.filter((item) => item.product.id !== productId),
      // Filter out any new items with this product ID
      newCartItems: newCartItems.filter((item) => item.product.id !== productId),
    })
  },

  clearCart: () => {
    set({ cartItems: [], newCartItems: [] })
  },

  initializeCart: (items: OrderItem[]) => {
    set({
      cartItems: items.map((item) => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        categoryId: item.product.categoryId
      })),
      newCartItems: []
    })
  },

  getTotalPrice: () => {
    const { cartItems } = get()
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  },
}))
