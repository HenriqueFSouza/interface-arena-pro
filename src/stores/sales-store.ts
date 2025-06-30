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
  initialCartItems: CartItem[] // Estado inicial para calcular diferenças
  addToCart: (product: Product) => void
  initializeCart: (items: OrderItem[]) => void
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  removeFromCart: (productId: string) => void
  getTotalPrice: () => number
  clearCart: () => void

  // Novas funções para calcular mudanças
  getNewQuantityForProduct: (productId: string) => number
  getCartChangesForSave: () => CartItem[]
  getCartChangesForTicketPrint: () => CartItem[]
  hasChanges: () => boolean
}

export const useSalesStore = create<SalesStore>((set, get) => ({
  selectedClient: null,
  setSelectedClient: (client) => set({ selectedClient: client }),

  isOverlayOpen: false,
  setIsOverlayOpen: (isOpen) => set({ isOverlayOpen: isOpen }),

  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  cartItems: [],
  initialCartItems: [],

  addToCart: (product) => {
    const { cartItems } = get()
    const existingItem = cartItems.find((item) => item.product.id === product.id)

    if (existingItem) {
      set({
        cartItems: cartItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      })
    } else {
      set({
        cartItems: [...cartItems, { product, quantity: 1 }]
      })
    }
  },

  increaseQuantity: (productId) => {
    const { cartItems } = get()
    set({
      cartItems: cartItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    })
  },

  decreaseQuantity: (productId) => {
    const { cartItems } = get()
    set({
      cartItems: cartItems.map((item) =>
        item.product.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    })
  },

  removeFromCart: (productId) => {
    const { cartItems } = get()
    set({
      cartItems: cartItems.filter((item) => item.product.id !== productId)
    })
  },

  clearCart: () => {
    set({ cartItems: [], initialCartItems: [] })
  },

  initializeCart: (items: OrderItem[]) => {
    const cartItems = items.map((item) => ({
      id: item.id,
      product: item.product,
      quantity: item.quantity,
    }))

    set({
      cartItems,
      initialCartItems: JSON.parse(JSON.stringify(cartItems))
    })
  },

  getTotalPrice: () => {
    const { cartItems } = get()
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  },

  getNewQuantityForProduct: (productId) => {
    const { cartItems, initialCartItems } = get()
    const currentItem = cartItems.find(item => item.product.id === productId)
    const initialItem = initialCartItems.find(item => item.product.id === productId)

    if (!currentItem) return 0
    if (!initialItem) return currentItem.quantity // Item completamente novo

    const diff = currentItem.quantity - initialItem.quantity
    return diff > 0 ? diff : 0 // Só mostra se aumentou
  },

  getCartChangesForSave: () => {
    const { cartItems, initialCartItems } = get()
    const itemsToSave: CartItem[] = []

    cartItems.forEach(currentItem => {
      const initialItem = initialCartItems.find(
        item => item.product.id === currentItem.product.id
      )

      if (!initialItem) {
        // Item completamente novo
        itemsToSave.push(currentItem)
      } else if (initialItem.quantity !== currentItem.quantity) {
        // Item com quantidade alterada
        itemsToSave.push({
          ...currentItem,
          quantity: currentItem.quantity
        })
      }
    })

    return itemsToSave
  },

  getCartChangesForTicketPrint: () => {
    const { getCartChangesForSave, getNewQuantityForProduct } = get()
    const itemsToPrint: CartItem[] = []

    const changes = getCartChangesForSave()

    changes.forEach(currentItem => {
      const newQuantity = getNewQuantityForProduct(currentItem.product.id)

      if (newQuantity > 0) {
        itemsToPrint.push({
          ...currentItem,
          quantity: newQuantity
        })
      }
    })

    return itemsToPrint
  },

  hasChanges: () => {
    const { getCartChangesForSave } = get()
    return getCartChangesForSave().length > 0
  }
}))
