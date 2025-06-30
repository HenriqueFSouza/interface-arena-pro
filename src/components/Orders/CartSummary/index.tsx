"use client"

import PrintOptions from "@/components/Print/print-options"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useOrders } from "@/hooks/useOrders"
import { usePrinter } from "@/hooks/usePrinter"
import { CartItem, useSalesStore } from "@/stores/sales-store"
import { formatToBRL } from "@/utils/formaters"
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react"
import { useState } from "react"
import DeleteOrderDialog from "../DeleteOrderDialog"

export default function CartSummary() {
  const {
    selectedClient,
    cartItems,
    clearCart,
    getTotalPrice,
    setIsOverlayOpen,
    setSelectedClient,
    getCartChangesForSave,
    getCartChangesForTicketPrint,
    hasChanges,
  } = useSalesStore()

  const { orders, saveOrderItems, isPending, removeOrderItem } = useOrders()
  const [printOrderTicket, setPrintOrderTicket] = useState(false)
  const [printTicket, setPrintTicket] = useState(false)
  const { printOrder } = usePrinter()

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false)
    setSelectedClient(null)
    clearCart()
  }

  if (!selectedClient) return null

  const order = orders.find((order) => order.id === selectedClient.orderId)

  const handleMakeOrder = async () => {
    try {
      const changedItems = getCartChangesForSave()
      const changedItemsForTicketPrint = getCartChangesForTicketPrint()


      if (changedItems.length > 0) {
        saveOrderItems({
          orderId: selectedClient.orderId,
          items: changedItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            orderClientId: selectedClient.id,
          }))
        })
      }

      handleCloseOverlay()

      // Print after closing
      if (order) {
        if (printOrderTicket) {
          printOrder({ order, newItems: changedItemsForTicketPrint, options: { shouldCallFallback: true } })
        }
        if (printTicket) {
          printOrder({ order, template: 'ticket', newItems: changedItemsForTicketPrint })
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteItem = (id: string) => {
    removeOrderItem({ orderId: selectedClient.orderId, itemId: id })
    handleCloseOverlay()
  }

  return (
    <div className="pt-4 relative h-full flex flex-col">
      <Button className="absolute top-0 right-0 mt-2 mr-2 border border-gray-500" variant="ghost" size="sm" onClick={handleCloseOverlay}>
        <X className="h-5 w-5" />
      </Button>
      <div className="p-4 pt-0 border-b bg-muted">
        <h2 className="text-xl font-bold">{selectedClient.name}</h2>
        <p className="text-sm text-muted-foreground">
          {selectedClient.phone}
        </p>
        <p className="text-sm text-muted-foreground">
          Itens no carrinho: {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        </p>
      </div>

      <CartItens onDeleteItem={handleDeleteItem} />

      <PrintOptions
        handlePrintOrder={setPrintOrderTicket}
        handlePrintTicket={setPrintTicket}
        printOrderTicket={printOrderTicket}
        printTicket={printTicket}
      />

      <div className="p-4 py-2">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Valor total</span>
          <span className="text-xl font-bold">{formatToBRL(getTotalPrice())}</span>
        </div>
        <Button
          className="w-full"
          size="lg"
          disabled={cartItems.length === 0 || !hasChanges()}
          onClick={handleMakeOrder}
          isLoading={isPending}
        >
          Salvar alterações
        </Button>
        <DeleteOrderDialog
          orderId={selectedClient.orderId}
          clientName={selectedClient.name}
          onSuccess={handleCloseOverlay}
        />
      </div>
    </div>
  )
}

export const CartItens = ({ onDeleteItem }: { onDeleteItem?: (id: string) => void }) => {
  const { cartItems, getNewQuantityForProduct, decreaseQuantity, increaseQuantity, removeFromCart } = useSalesStore()

  const handleDeleteItem = (item: CartItem) => {
    if (onDeleteItem) {
      onDeleteItem(item.id!)
    } else {
      removeFromCart(item.product.id)
    }
  }


  return (
    <>
      {cartItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
          <ShoppingCart className="h-12 w-12 mb-2 opacity-50" />
          <p>Carrinho vazio</p>
          <p className="text-xs">Selecione produtos do painel esquerdo.</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-4">
            {cartItems.map((item) => {
              const newQuantity = getNewQuantityForProduct(item.product.id)
              const hasNewQuantity = newQuantity > 0

              const shouldShowDeleteButton = onDeleteItem ? !hasNewQuantity : true

              return (
                <div key={item.product.id} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium max-w-[170px] truncate">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">{formatToBRL(item.product.price)} cada</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatToBRL(item.product.price * item.quantity)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 border-none"
                        onClick={() => decreaseQuantity(item.product.id)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 border-none"
                        onClick={() => increaseQuantity(item.product.id)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>

                    {/* Só mostra o botão de deletar para itens que não são novos */}
                    {shouldShowDeleteButton && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-8 w-8 text-destructive"
                        onClick={() => handleDeleteItem(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Separator />
                </div>
              )
            })}
          </div>
        </ScrollArea>
      )}
    </>
  )
}
