import { InventoryButton } from "@/components/Stock/InventoryButton"
import { NewItemDialog } from "@/components/Stock/NewItemDialog"
import { StockList } from "@/components/Stock/StockList"

export default function StockPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Controle de Estoque</h1>

                <div className="flex items-center gap-3">
                    <InventoryButton />
                    <NewItemDialog />
                </div>
            </div>

            <StockList />
        </div>
    )
}
