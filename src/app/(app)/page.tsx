import ClientOrderList from "@/components/Orders/ClientOrdersList"
import NewOrderDialog from "@/components/Orders/NewOrderDialog"
import ProductsOverlay from "@/components/Orders/ProductsOverlay"

export default function OrdersPage() {
  return (
    <div className="container mx-auto p-4">

      <div className="flex justify-between items-center pb-4">
        <div>
          <h1 className="text-3xl font-bold">Comandas abertas</h1>
          <p className="text-muted-foreground">Gerencie suas comandas abertas em tempo real</p>
        </div>
        <NewOrderDialog />
      </div>


      <ClientOrderList />

      <ProductsOverlay />

    </div>
  )
}
