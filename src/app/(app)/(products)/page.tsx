import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import NewCategoryModal from "./_components/NewCategoryModal"
import ProductList from "./_components/ProductList"

export default function ProductsPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Produtos</h1>
                <div className="flex gap-3">
                    <NewCategoryModal />
                    <Link href="/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Produto
                        </Button>
                    </Link>
                </div>
            </div>

            <ProductList />
        </div>
    )
}
