"use client"

import { Category } from "@/@types/category"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCategoryProducts } from "@/hooks/useCategories"
import { Edit, Trash2 } from "lucide-react"
import { useCallback, useState } from "react"
import { toast } from "react-hot-toast"
import CategoryDeleteModal from "../CategoryDeleteModal"
import CategoryEditModal from "../CategoryEditModal"
import ProductCard from "../ProductCard"
import ProductListSkeleton from "../ProductListSkeleton"

export default function ProductList() {
    const { categories, isLoading, error, invalidateCategories, updateCategory, deleteCategory } = useCategoryProducts()
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

    const handleProductDelete = useCallback(() => {
        invalidateCategories()
    }, [invalidateCategories])

    const handleEditCategory = useCallback((id: string, name: string) => {
        updateCategory({ id, name }, {
            onSuccess: () => {
                toast.success('Categoria atualizada com sucesso')
                invalidateCategories()
            },
            onError: () => {
                toast.error('Erro ao atualizar categoria')
            }
        })
    }, [updateCategory, invalidateCategories])

    const handleDeleteCategory = useCallback((id: string) => {
        deleteCategory(id, {
            onSuccess: () => {
                toast.success('Categoria excluída com sucesso')
                invalidateCategories()
            },
            onError: () => {
                toast.error('Erro ao excluir categoria')
            }
        })
    }, [deleteCategory, invalidateCategories])

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
                    <CardHeader className="bg-muted/50 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CardTitle>{category.name}</CardTitle>
                            <Badge variant="outline">{category.products?.length || 0}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setEditingCategory(category)}
                                title="Editar categoria"
                            >
                                <Edit className="size-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setDeletingCategory(category)}
                                title="Excluir categoria"
                            >
                                <Trash2 className="size-5 text-destructive" />
                            </Button>
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

            {editingCategory && (
                <CategoryEditModal
                    categoryId={editingCategory.id}
                    categoryName={editingCategory.name}
                    isOpen={!!editingCategory}
                    onClose={() => setEditingCategory(null)}
                    onEdit={handleEditCategory}
                />
            )}

            {deletingCategory && (
                <CategoryDeleteModal
                    categoryId={deletingCategory.id}
                    categoryName={deletingCategory.name}
                    hasProducts={!!deletingCategory.products && deletingCategory.products.length > 0}
                    isOpen={!!deletingCategory}
                    onClose={() => setDeletingCategory(null)}
                    onDelete={handleDeleteCategory}
                />
            )}
        </div>
    )
}
