"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCategoryProducts } from "@/hooks/useCategories"
import { useCallback } from "react"
import { toast } from "react-hot-toast"
import ProductCard from "../ProductCard"
import ProductListSkeleton from "../ProductListSkeleton"

export default function ProductList() {
    const { categories, isLoading, error, invalidateCategories } = useCategoryProducts()

    const handleProductDelete = useCallback(() => {
        invalidateCategories()
    }, [invalidateCategories])

    if (error) {
        toast.error('Erro ao carregar os produtos')
    }

    if (isLoading) {
        return (
            <ProductListSkeleton />
        )
    }

    if (categories.length === 0) {
        return (
            <div className="text-neutral-500 text-center py-8">Nenhum produto cadastrado</div>
        )
    }

    return (
        <div className="space-y-8">
            {categories.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 flex flex-row items-center gap-2">
                        <div className="flex items-center gap-2">
                            <CardTitle>{category.name}</CardTitle>
                            <Badge variant="outline">{category.products?.length || 0}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {!category.products || category.products.length === 0 ? (
                            <p className="text-neutral-500 text-center py-8">Nenhum produto nesta categoria</p>
                        ) : (
                            <div className="flex flex-wrap gap-6">
                                {category.products.map((product) => (
                                    <ProductCard
                                        className="w-24"
                                        key={product.id}
                                        product={product}
                                        onDelete={handleProductDelete}
                                        isEditable={true}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
