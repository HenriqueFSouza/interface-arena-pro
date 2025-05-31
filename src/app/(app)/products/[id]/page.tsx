"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetProductById } from "@/hooks/useGetProductById"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import NewProductForm from "../../../../components/Product/NewProductForm"

export default function EditProductPage() {
    const { id } = useParams<{ id: string }>()

    const { data: product, isLoading, error } = useGetProductById(id)

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
                <h1 className="text-3xl font-bold">Editar Produto</h1>
            </div>

            <div className="max-w-2xl mx-auto">
                {isLoading ? (
                    <div className="space-y-7">
                        <Skeleton className="h-10 w-full bg-gray-300" />
                        <Skeleton className="h-10 w-full bg-gray-300" />
                        <Skeleton className="h-10 w-full bg-gray-300" />
                        <Skeleton className="h-20 w-full bg-gray-300" />
                        <Skeleton className="h-10 w-full bg-gray-300" />
                    </div>
                ) : error ? (
                    <div className="p-8 text-center">
                        <p className="text-red-500">Erro ao carregar o produto</p>
                        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                            Tentar novamente
                        </Button>
                    </div>
                ) : product ? (
                    <NewProductForm id={id} defaultValues={product} />
                ) : null}
            </div>
        </div>
    )
} 