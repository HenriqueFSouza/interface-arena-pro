"use client"

import type { Order } from "@/@types/order"
import PrintOrder from "@/components/Print"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSalesStore } from "@/lib/sales-store"
import { formatToBRL } from "@/utils/currency-formaters"
import PaymentDialog from "../PaymentDialog"
interface ClientOrderCardProps {
  order: Order
}

export default function ClientOrderCard({ order }: ClientOrderCardProps) {
  const { setSelectedClient, initializeCart, setIsOverlayOpen } = useSalesStore()

  const handleClick = () => {
    setSelectedClient(order.clients[0])
    initializeCart(order.items)
    setIsOverlayOpen(true)
  }

  const totalPrice = order.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <Card className="relative cursor-pointer hover:border-primary transition-colors">
      <PrintOrder
        showButton
        order={order}
        size="sm"
        variant="ghost"
      />
      <PaymentDialog order={order} />
      <div onClick={handleClick}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{order.clients[0].name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Valor total</div>
            <div className="text-xl font-bold">{formatToBRL(totalPrice)}</div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </div>
        </CardContent></div>
    </Card>
  )
}
