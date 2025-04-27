"use client"

import { usePrintItem } from "@/components/Print"
import Receipt from "@/components/Print/receipt"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useOrders } from "@/hooks/useOrders"
import { useSalesStore } from "@/lib/sales-store"
import { formatToBRL } from "@/utils/formaters"
import { Minus, Plus, Trash2, X } from "lucide-react"
import DeleteOrderDialog from "../DeleteOrderDialog"

export default function CartSummary() {
  const {
    selectedClient,
    cartItems,
    newCartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    setIsOverlayOpen,
    setSelectedClient,
  } = useSalesStore()

  const { orders, addOrderItem, isPending, removeOrderItem } = useOrders()
  const { printItem, printItemRef } = usePrintItem()

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false)
    setSelectedClient(null)
    clearCart()
  }

  if (!selectedClient) return null

  const order = orders.find((order) => order.id === selectedClient.orderId)

  const handleMakeOrder = async () => {
    try {
      addOrderItem({
        orderId: selectedClient.orderId,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          orderClientId: selectedClient.id,
        }))
      })

      handleCloseOverlay()

      // Print after closing
      // if (order) {
      //   printItem()
      // }
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

      {cartItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4 text-center text-muted-foreground">
          Nenhum item adicionado ainda. Selecione produtos do painel esquerdo.
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-4">
            {cartItems.map((item) => (
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

                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 h-8 w-8 text-destructive"
                    onClick={() => handleDeleteItem(item.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="p-4 border-t bg-muted">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Valor total</span>
          <span className="text-xl font-bold">{formatToBRL(getTotalPrice())}</span>
        </div>
        <Button className="w-full" size="lg" disabled={cartItems.length === 0} onClick={handleMakeOrder} isLoading={isPending}>
          Fazer pedido
        </Button>
        <DeleteOrderDialog
          orderId={selectedClient.orderId}
          clientName={selectedClient.name}
          onSuccess={handleCloseOverlay}
        />
      </div>

      <div className="hidden">
        <Receipt ref={printItemRef} order={order!} newItems={newCartItems} />
      </div>
    </div>
  )
}
