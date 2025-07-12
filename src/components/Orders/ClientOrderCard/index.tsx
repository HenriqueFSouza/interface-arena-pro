"use client"

import type { Order } from "@/@types/order"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePrinter } from "@/hooks/usePrinter"
import { useSalesStore } from "@/stores/sales-store"
import { formatToBRL } from "@/utils/formaters"
import { Printer } from "lucide-react"
import PaymentDialog from "../PaymentDialog"

interface ClientOrderCardProps {
  order: Order
}

export default function ClientOrderCard({ order }: ClientOrderCardProps) {
  const { setSelectedClient, initializeCart, setIsOverlayOpen } = useSalesStore()
  const { printOrder, isPrinting } = usePrinter()

  const handleClick = () => {
    setSelectedClient({ ...order.clients[0], orderId: order.id })
    initializeCart(order.items)
    setIsOverlayOpen(true)
  }

  const handlePrint = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when printing
    await printOrder({ order, options: { shouldCallFallback: true } })
  }

  const totalPrice = order.items.reduce((acc, item) => acc + (item.product?.price || item?.price!) * item.quantity, 0)
  const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <Card className="relative cursor-pointer hover:border-primary transition-colors">
      {/* Print Button */}
      <Button
        type="button"
        onClick={handlePrint}
        size="sm"
        variant="ghost"
        disabled={isPrinting}
        isLoading={isPrinting}
        className="gap-2 absolute top-2 right-12 p-2 z-10"
      >
        <Printer className="h-4 w-4" />
      </Button>

      <PaymentDialog order={order} />
      <div onClick={handleClick}>
        <CardHeader className="px-4 py-2 flex flex-row flex-nowrap">
          <CardTitle className="text-lg">{order.clients[0].name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Valor total</div>
            <div className="text-lg font-bold 2xl:text-xl">{formatToBRL(totalPrice)}</div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </div>
        </CardContent></div>
    </Card>
  )
}
