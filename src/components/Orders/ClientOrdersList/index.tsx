'use client'

import { Input } from "@/components/ui/input"
import { useOrders } from "@/hooks/useOrders"
import { formatToBRL } from "@/utils/formaters"
import { Search } from "lucide-react"
import { useMemo } from "react"
import ClientOrderCard from "../ClientOrderCard"
import ClientOrderSkeleton from "../ClientOrderSkeleton"

export default function ClientOrderList() {
  const { orders, isLoading, search, setSearch } = useOrders()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const subTotal = useMemo(() => orders.reduce((acc, order) => acc + order.items.reduce((acc, item) => acc + item.price! * item.quantity, 0), 0), [orders])

  if (isLoading) {
    return (
      <ClientOrderSkeleton />
    )
  }

  const noOrdersFound = orders.length === 0 && !isLoading


  return (
    <>
      <div className="mb-4 relative bg-card rounded-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          autoFocus
          placeholder="Pesquisar produtos..."
          className="pl-10 "
          value={search}
          onChange={handleSearch}
        />
      </div>

      {!noOrdersFound && <p className="text-sm text-muted-foreground mb-2">Subtotal: <strong className="text-neutral-900 font-bold text-base">{formatToBRL(subTotal)}</strong></p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {noOrdersFound ? (
          <div className="text-center py-8">
            {search
              ? `Nenhum resultado encontrado para "${search}"`
              : "Nenhuma comanda aberta no momento"
            }
          </div>
        ) : (
          orders.map((order) => (
            <ClientOrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </>
  )
}
