"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useOrders } from "@/hooks/useOrders"
import { useSalesStore } from "@/lib/sales-store"
import { newOrderSchema, type NewOrderFormData } from "@/schemas/new-order"
import { formatToBRL } from "@/utils/currency-formaters"
import { formatPhoneNumber } from "@/utils/format-phone"
import { zodResolver } from "@hookform/resolvers/zod"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import CategoryFilter from "../CategoryFilter"
import OrderProductsList from "../OrderProductsList"
export default function NewOrderDialog() {
    const [open, setOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice, clearCart } = useSalesStore()
    const { isPending, createOrder } = useOrders()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<NewOrderFormData>({
        resolver: zodResolver(newOrderSchema),
        defaultValues: {
            name: "",
            phone: ""
        }
    })

    const phoneValue = watch("phone")

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value)
        setValue("phone", formatted)
    }

    const onSubmit = async (data: NewOrderFormData) => {
        const items = cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity
        }))

        createOrder({
            clientInfo: {
                name: data.name,
                phone: data.phone
            },
            items
        })
        reset()
        clearCart()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            // Clear cart when closing dialog without submitting
            if (open && !newOpen) {
                clearCart()
            }
            setOpen(newOpen)
        }}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova comanda
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Nova comanda</DialogTitle>
                    <DialogDescription>
                        Preencha as informações do cliente e adicione produtos à comanda.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-1 overflow-hidden custom-scrollbar">
                    {/* Left side: Products */}
                    <div className="w-2/3 overflow-auto">
                        <div className="mb-4">
                            <CategoryFilter
                                selectedCategory={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                            />
                        </div>
                        <OrderProductsList categoryOverride={selectedCategory} />
                    </div>

                    {/* Right side: Client info and cart items */}
                    <div className="w-1/3 border-l pl-4 flex flex-col">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Nome do cliente
                                    </label>
                                    <Input
                                        id="name"
                                        placeholder="Digite o nome do cliente"
                                        {...register("name")}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">
                                        Telefone
                                    </label>
                                    <Input
                                        id="phone"
                                        placeholder="(00) 00000-0000"
                                        value={phoneValue}
                                        onChange={handlePhoneChange}
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                                    )}
                                </div>
                            </div>
                        </form>

                        {/* Cart items section */}
                        <div className="flex-1 flex flex-col mt-4 overflow-hidden">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium">Itens adicionados</h3>
                                {cartItems.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive h-8"
                                        onClick={clearCart}
                                    >
                                        Limpar
                                    </Button>
                                )}
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center p-4 text-center text-muted-foreground text-sm">
                                    Nenhum item adicionado. Selecione produtos do painel esquerdo.
                                </div>
                            ) : (
                                <ScrollArea className="flex-1 rounded-md p-2 bg-neutral-100">
                                    <div className="space-y-3">
                                        {cartItems.map((item) => (
                                            <div key={item.product.id} className="space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-medium text-sm">{item.product.name}</h3>
                                                        <p className="text-xs text-muted-foreground">{formatToBRL(item.product.price)} cada</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-sm">{formatToBRL(item.product.price * item.quantity)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="p-1 h-6 w-6"
                                                            onClick={() => decreaseQuantity(item.product.id)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="p-1 h-6 w-6"
                                                            onClick={() => increaseQuantity(item.product.id)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="p-1 h-6 w-6 text-destructive"
                                                        onClick={() => removeFromCart(item.product.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <Separator />
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}

                            <div className="pt-3 mt-2">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-medium">Total</span>
                                    <span className="text-lg font-bold">{formatToBRL(getTotalPrice())}</span>
                                </div>
                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    className="w-full"
                                    disabled={isPending}
                                >
                                    {isPending ? "Criando..." : "Criar comanda"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 