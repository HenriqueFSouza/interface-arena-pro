import CashRegisterOverlay from "@/components/CashRegister/CashRegisterOverlay"
import CashRegisterOpenButton from "@/components/CashRegister/OpenButton"
import ClientOrderList from "@/components/Orders/ClientOrdersList"
import NewOrderDialog from "@/components/Orders/NewOrderDialog"
import ProductsOverlay from "@/components/Orders/ProductsOverlay"
import QuickSaleDialog from "@/components/Orders/QuickSaleDialog"

export default function OrdersPage() {
  return (
    <div className="container mx-auto p-2 2xl:p-4">
      <div className="flex justify-between items-center pb-4">
        <div>
          <h1 className="text-2xl font-bold 2xl:text-3xl">Comandas abertas</h1>
          <p className="text-muted-foreground text-sm 2xl:text-base">Gerencie suas comandas abertas em tempo real</p>
        </div>
        <div className="flex gap-4">
          <CashRegisterOpenButton />
          <QuickSaleDialog />
          <NewOrderDialog />
        </div>
      </div>

      <ClientOrderList />
      <ProductsOverlay />
      <CashRegisterOverlay />
    </div>
  )
}
