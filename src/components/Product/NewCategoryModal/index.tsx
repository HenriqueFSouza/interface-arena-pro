"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useCategories } from "@/hooks/useCategories"
import { newCategorySchema } from "@/schemas/new-category"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { FolderPlus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { z } from "zod"

export default function CategoryModal() {
    const [open, setOpen] = useState(false)
    const { createCategory } = useCategories()

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<z.infer<typeof newCategorySchema>>({
        resolver: zodResolver(newCategorySchema),
        defaultValues: {
            name: "",
            image: "",
        },
    })

    const imageValue = watch("image") || ""

    function onSubmit(values: z.infer<typeof newCategorySchema>) {
        createCategory(
            {
                name: values.name,
                imageUrl: values.image
            },
            {
                onSuccess: () => {
                    toast.success('Categoria criada com sucesso')
                    reset()
                    setOpen(false)
                },
                onError: () => {
                    toast.error('Erro ao criar categoria')
                }
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Nova Categoria
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Criar Nova Categoria</DialogTitle>
                    <DialogDescription>Adicione uma nova categoria de produto para organizar seu estoque.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Nome da Categoria"
                        placeholder="Digite o nome da categoria"
                        error={errors.name?.message}
                        {...register("name")}
                    />

                    {/* <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-700 font-medium leading-none">
                            Imagem da Categoria
                        </label>
                        <UploadInput
                            value={imageValue}
                            onChange={(value) => setValue("image", value)}
                            onRemove={() => setValue("image", "")}
                        />
                        {errors.image?.message && (
                            <p className="text-red-500 text-sm">{errors.image.message}</p>
                        )}
                    </div> */}

                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                            Criar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
