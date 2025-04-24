import ClientOrderList from "@/components/Orders/ClientOrdersList"
import NewOrderDialog from "@/components/Orders/NewOrderDialog"
import ProductsOverlay from "@/components/Orders/ProductsOverlay"

export default function OrdersPage() {
  return (
    <div className="container mx-auto p-2 2xl:p-4">

      <div className="flex justify-between items-center pb-4">
        <div>
          <h1 className="text-2xl font-bold 2xl:text-3xl">Comandas abertas</h1>
          <p className="text-muted-foreground text-sm 2xl:text-base">Gerencie suas comandas abertas em tempo real</p>
        </div>
        <NewOrderDialog />
      </div>


      <ClientOrderList />

      <ProductsOverlay />

    </div>
  )
}
