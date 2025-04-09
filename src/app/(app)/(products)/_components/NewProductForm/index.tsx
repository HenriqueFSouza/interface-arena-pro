"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import UploadInput from "@/components/UploadInput"
import { useCategories } from "@/hooks/useCategories"
import { newProductSchema } from "@/schemas/new-product"
import { productService } from "@/services/product"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { z } from "zod"

type NewProductFormData = z.infer<typeof newProductSchema>
export default function NewProductForm() {
  const router = useRouter()
  const { categories, isLoading: isCategoriesLoading, invalidateCategories } = useCategories()

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<NewProductFormData>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      name: "",
      price: undefined,
      categoryId: "",
      image: "",
    },
  })

  const imageValue = watch("image") || ""

  async function onSubmit(values: NewProductFormData) {
    try {
      await productService.createProduct(values)

      router.push("/")
      invalidateCategories()
    } catch (error) {
      toast.error("Erro ao criar produto")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Nome do Produto"
        placeholder="Digite o nome do produto"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        label="Preço"
        placeholder="0.00"
        type="number"
        step="0.01"
        min="0"
        error={errors.price?.message}
        {...register("price", {
          setValueAs: (value) => Number(value)
        })}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-neutral-700 font-medium leading-none">
          Categoria
        </label>
        {isCategoriesLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            onValueChange={(value) => setValue("categoryId", value)}
            defaultValue={watch("categoryId")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.categoryId?.message && (
          <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-neutral-700 font-medium leading-none">
          Imagem do Produto
        </label>
        <UploadInput
          value={imageValue}
          onChange={(value) => setValue("image", value)}
          onRemove={() => setValue("image", "")}
        />
        {errors.image?.message && (
          <p className="text-red-500 text-sm">{errors.image.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting} isLoading={isSubmitting}>
        Criar Produto
      </Button>
    </form>
  )
}
