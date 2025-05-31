import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import NewProductForm from "../../../../components/Product/NewProductForm"

export default function NewProductPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <Link href="/products">
                    <Button variant="ghost" className="p-0 h-auto text-lg hover:scale-105 transition-all">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                    </Button>
                </Link>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Novo Produto</h1>
            </div>

            <div className="max-w-2xl mx-auto">
                <NewProductForm />
            </div>
        </div>
    )
}
