'use client'

import { OpenCashRegisterDialog } from "@/components/CashRegister/OpenCashRegisterDialog"
import { Input } from "@/components/ui/input"
import { useCashRegister } from "@/hooks/useCashRegister"
import { useOrders } from "@/hooks/useOrders"
import { formatToBRL } from "@/utils/formaters"
import { Search } from "lucide-react"
import ClientOrderCard from "../ClientOrderCard"

export default function ClientOrderList() {
  const { orders, isLoading, search, openOrdersSubTotal, setSearch } = useOrders()
  const { isOpen: isCashRegisterOpen } = useCashRegister()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  if (!isCashRegisterOpen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold 2xl:text-2xl">Caixa Fechado</h2>
          <p className="text-muted-foreground text-sm 2xl:text-base">Abra o caixa para começar a registrar pedidos</p>
        </div>
        <OpenCashRegisterDialog />
      </div>
    )
  }

  const noOrdersFound = orders.length === 0 && !isLoading

  return (
    <>
      <div className="mb-4 relative bg-card rounded-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          autoFocus
          placeholder="Pesquisar cliente..."
          className="pl-10 "
          value={search}
          onChange={handleSearch}
        />
      </div>

      {!noOrdersFound && <p className="text-sm text-muted-foreground mb-2">Subtotal: <strong className="text-neutral-900 font-bold text-base">{formatToBRL(openOrdersSubTotal)}</strong></p>}

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
