"use client"

import { PaymentMethod } from "@/@types/payment"
import { PaymentIcon } from "@/components/PaymentIcon"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useOrders } from "@/hooks/orders/useOrders"
import { useCashRegisterStore } from "@/stores/cash-register-store"
import { formatDateTime, formatToBRL } from "@/utils/formaters"
import { Info, X } from "lucide-react"
import { useEffect } from "react"
import { AddMoneyDialog } from "../AddMoneyDialog"
import { CloseCashRegisterDialog } from "../CloseCashRegisterDialog"
import { WithdrawMoneyDialog } from "../WithdrawMoneyDialog.tsx"
import { SalesCard } from "./SalesCard"

export default function CashRegisterOverlay() {
    const {
        isOverlayOpen,
        setIsOverlayOpen,
        currentCashRegister,
        expensesAndIncrements,
        getTotalSold,
        getExpectedAmount,
        getCashAmount,
        getCardAmount,
        getPixAmount,
    } = useCashRegisterStore()

    const { openOrdersSubTotal } = useOrders()

    // Close overlay with escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOverlayOpen(false)
            }
        }
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [setIsOverlayOpen])

    if (!isOverlayOpen || !currentCashRegister) return null

    const expensesAndIncrementsSummary = expensesAndIncrements();

    return (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex rounded-lg">
            <div className="w-full h-full bg-background overflow-auto p-6">
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* Close Button */}
                    <div className="flex justify-end items-center gap-2">
                        <p className="text-sm text-muted-foreground">Pressione Esc para fechar</p>
                        <Button className="border border-gray-500" variant="ghost" size="sm" onClick={() => setIsOverlayOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Financial Overview Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Visão Geral</CardTitle>
                                <CardDescription>Status atual do caixa</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Valor Inicial</p>
                                        <p className="text-2xl font-bold">{formatToBRL(currentCashRegister.openedAmount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Total Vendido</p>
                                        <p className="text-2xl font-bold">{formatToBRL(getTotalSold())}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">

                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Valor Esperado em Caixa</p>
                                        <p className="text-3xl font-bold text-green-600">{formatToBRL(getExpectedAmount())}</p>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total à Receber</p>
                                            <p className="text-2xl font-bold">{formatToBRL(openOrdersSubTotal)}</p>
                                        </div>
                                        <TooltipProvider delayDuration={100}>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info className="h-4 w-4" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Valor total de pedidos abertos</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <AddMoneyDialog />
                                    <WithdrawMoneyDialog />
                                </div>

                                <CloseCashRegisterDialog />

                            </CardContent>
                        </Card>

                        {/* Payment Methods Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Métodos de Pagamento</CardTitle>
                                <CardDescription>Vendas por método de pagamento</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <PaymentIcon method={PaymentMethod.CASH} withLabel />
                                        </div>
                                        <span className="font-bold">{formatToBRL(getCashAmount())}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <PaymentIcon method={PaymentMethod.CARD} withLabel />
                                        </div>
                                        <span className="font-bold">{formatToBRL(getCardAmount())}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <PaymentIcon method={PaymentMethod.PIX} withLabel />
                                        </div>
                                        <span className="font-bold">{formatToBRL(getPixAmount())}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Increments and Expenses */}
                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle>Reforços e Despesas</CardTitle>
                                <CardDescription>Movimentações administrativas do caixa</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {expensesAndIncrementsSummary.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {transaction.reason ? `${transaction.reason}` : "Despesa"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDateTime(transaction.createdAt)}
                                                </p>
                                            </div>
                                            <span
                                                className={`font-bold ${transaction.amount && transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                                            >
                                                {transaction.amount && transaction.amount > 0 && "+ "}
                                                {formatToBRL(transaction.amount || 0)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sales/Payments */}
                        <SalesCard cashRegisterId={currentCashRegister.id} />
                    </div>
                </div>
            </div>
        </div>
    )
}
