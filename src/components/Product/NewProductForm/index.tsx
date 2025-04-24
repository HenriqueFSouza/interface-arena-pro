"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import UploadInput from "@/components/UploadInput"
import { useCategories } from "@/hooks/useCategories"
import { newProductSchema } from "@/schemas/new-product"
import { productService } from "@/services/product"
import { uploadService } from "@/services/upload"
import { parseFileName } from "@/utils/formaters"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { z } from "zod"

type NewProductFormData = z.infer<typeof newProductSchema>

interface NewProductFormProps {
  id?: string
  defaultValues?: NewProductFormData
}

export default function NewProductForm({ id, defaultValues }: NewProductFormProps) {
  const router = useRouter()
  const { categories, isLoading: isCategoriesLoading, invalidateCategories } = useCategories()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<NewProductFormData>({
    resolver: zodResolver(newProductSchema),
    defaultValues: defaultValues || {
      name: "",
      price: undefined,
      categoryId: "",
      imageUrl: "",
    },
  })

  const isEditing = !!defaultValues

  // Function to handle file upload
  const handleFileUpload = async (values: NewProductFormData): Promise<NewProductFormData> => {
    if (!selectedFile) return values;

    setIsUploading(true);
    try {
      // Generate safe filename
      const filename = parseFileName(selectedFile.name)

      // Get presigned URL
      const { url, publicUrl } = await uploadService.getPresignedUrl(filename);

      // Upload file to S3
      await uploadService.uploadToS3(url, selectedFile);

      // Return updated product data with public URL
      return {
        ...values,
        imageUrl: publicUrl
      };
    } catch (error) {
      console.error('File upload error:', error);
      toast.error("Erro ao fazer upload da imagem");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const { mutate: createProduct, isPending: isCreating } = useMutation({
    mutationFn: async (values: NewProductFormData) => {
      // Handle file upload if needed
      const updatedValues = await handleFileUpload(values);
      return productService.createProduct(updatedValues);
    },
    onSuccess: () => {
      toast.success("Produto criado com sucesso")
      router.push("/products")
      invalidateCategories()
    },
    onError: () => {
      toast.error("Erro ao criar produto")
    }
  })

  const { mutate: updateProduct, isPending: isUpdating } = useMutation({
    mutationFn: async (values: NewProductFormData) => {
      // Handle file upload if needed
      const updatedValues = await handleFileUpload(values);
      return productService.updateProduct(id!, updatedValues);
    },
    onSuccess: () => {
      toast.success("Produto atualizado com sucesso")
      router.push("/products")
      invalidateCategories()
    },
    onError: () => {
      toast.error("Erro ao atualizar produto")
    }
  })

  async function onSubmit(values: NewProductFormData) {
    if (isEditing && id) {
      updateProduct(values)
    } else {
      createProduct(values)
    }
  }

  const imageValue = watch("imageUrl") || ""
  const isLoading = isSubmitting || isCreating || isUpdating || isUploading

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
          onChange={(value) => setValue("imageUrl", value)}
          onRemove={() => setValue("imageUrl", "")}
          onFileSelect={setSelectedFile}
          disabled={isLoading}
          loading={isUploading}
        />
        {errors.imageUrl?.message && (
          <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading} isLoading={isLoading}>
        {isEditing ? "Editar Produto" : "Criar Produto"}
      </Button>
    </form>
  )
}
