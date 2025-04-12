'use client'
import { useOrders } from "@/hooks/useOrders"
import ClientOrderCard from "../ClientOrderCard"
import ClientOrderSkeleton from "../ClientOrderSkeleton"

export default function ClientOrderList() {
  const { orders, isLoading } = useOrders()

  if (isLoading) return <ClientOrderSkeleton />

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {orders.map((order) => (
        <ClientOrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}
