"use client"

import PrintOptions from "@/components/Print/print-options"
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCashRegister } from "@/hooks/useCashRegister"
import { useOrders } from "@/hooks/useOrders"
import { usePrinter } from "@/hooks/usePrinter"
import { newOrderSchema, type NewOrderFormData } from "@/schemas/new-order"
import { useSalesStore } from "@/stores/sales-store"
import { formatPhoneNumber, formatToBRL } from "@/utils/formaters"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { CartItens } from "../CartSummary"
import CategoryFilter from "../CategoryFilter"
import OrderProductsList from "../OrderProductsList"

export default function NewOrderDialog() {
    const [open, setOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [printOrderTicket, setPrintOrderTicket] = useState(false)
    const [printTicket, setPrintTicket] = useState(false)
    const { cartItems, getTotalPrice, clearCart } = useSalesStore()
    const { isPending, createOrder } = useOrders()
    const { isOpen: isCashRegisterOpen } = useCashRegister()
    const { printOrder } = usePrinter()

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

        const order = await createOrder({
            clientInfo: {
                name: data.name,
                phone: data.phone
            },
            items
        })
        reset()
        clearCart()
        setOpen(false)

        const hasItems = order.items.length > 0
        if (printOrderTicket && hasItems) {
            printOrder({ order, options: { shouldCallFallback: true } })
        }
        if (printTicket && hasItems) {
            printOrder({ order, template: 'ticket' })
        }
    }

    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <Dialog open={open} onOpenChange={(newOpen) => {
                            // Clear cart when closing dialog without submitting
                            if (open && !newOpen) {
                                clearCart()
                            }
                            setOpen(newOpen)
                        }}>
                            <DialogTrigger asChild>
                                <Button disabled={!isCashRegisterOpen}>
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

                                            <CartItens />

                                            <PrintOptions
                                                className="p-0 [&>label]:text-xs [&>button]:size-4"
                                                handlePrintOrder={setPrintOrderTicket}
                                                handlePrintTicket={setPrintTicket}
                                                printOrderTicket={printOrderTicket}
                                                printTicket={printTicket}
                                            />

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
                    </div>
                </TooltipTrigger>
                {!isCashRegisterOpen && (
                    <TooltipContent>
                        <p>É necessário abrir o caixa para criar novos pedidos</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    )
} 