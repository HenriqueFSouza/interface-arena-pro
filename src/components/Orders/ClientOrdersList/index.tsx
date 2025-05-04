'use client'

import { Input } from "@/components/ui/input"
import { useOrders } from "@/hooks/useOrders"
import { Search } from "lucide-react"
import ClientOrderCard from "../ClientOrderCard"
import ClientOrderSkeleton from "../ClientOrderSkeleton"

export default function ClientOrderList() {
  const { orders, isLoading, search, setSearch } = useOrders()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

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
