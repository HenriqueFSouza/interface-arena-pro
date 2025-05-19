"use client"

import { PaymentMethod } from "@/@types/payment"
import { PaymentIcon } from "@/components/PaymentIcon"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCashRegister } from "@/hooks/useCashRegister"
import { useCashRegisterStore } from "@/stores/cash-register-store"
import { formatToBRL, parseCurrencyString } from "@/utils/formaters"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calculator } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { CloseCashRegisterReport } from "./report"

const closeCashRegisterSchema = z.object({
    registeredPayments: z.object({
        cash: z.string().min(1, "Informe o valor em dinheiro"),
        card: z.string().min(1, "Informe o valor em cartão"),
        pix: z.string().min(1, "Informe o valor em PIX"),
    }),
})

type CloseCashRegisterForm = z.infer<typeof closeCashRegisterSchema>
type PaymentField = keyof CloseCashRegisterForm["registeredPayments"]

interface PaymentRowProps {
    method: PaymentMethod
    systemValue: number
    fieldName: PaymentField
    register: any
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string
    currentValue: string
}

function PaymentRow({ method, systemValue, fieldName, register, onChange, error, currentValue }: PaymentRowProps) {
    const difference = useMemo(() => {
        const inputValue = parseCurrencyString(currentValue || "0")
        return inputValue - systemValue
    }, [currentValue, systemValue])

    return (
        <div className="grid grid-cols-[1fr,repeat(3,100px)] gap-4 items-center">
            <div className="flex items-center gap-2">
                <PaymentIcon method={method} />
                <Label>{method === PaymentMethod.CASH ? "Dinheiro" : method === PaymentMethod.CARD ? "Cartão" : "PIX"}</Label>
            </div>
            <div className="text-right flex flex-col items-start gap-2 -mt-2">
                <p className="text-sm text-muted-foreground">Sistema</p>
                <p className="font-medium">{formatToBRL(systemValue)}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <Input
                    className="w-32"
                    {...register(`registeredPayments.${fieldName}`)}
                    onChange={onChange}
                    error={error}
                />
            </div>
            <div className="text-right flex flex-col gap-2 -mt-2">
                <p className="text-sm text-muted-foreground">Diferença</p>
                <p className={`font-medium ${difference === 0 ? 'text-gray-600' : difference > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {formatToBRL(difference)}
                </p>
            </div>
        </div>
    )
}

export function CloseCashRegisterDialog() {
    const [step, setStep] = useState(0)
    const { currentCashRegister, getExpectedAmount, getCashAmount, getCardAmount, getPixAmount } = useCashRegisterStore()
    const { closeCashRegister, registerPayments } = useCashRegister()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        control,
        reset,
    } = useForm<CloseCashRegisterForm>({
        resolver: zodResolver(closeCashRegisterSchema),
    })

    const values = useWatch({
        control,
        name: "registeredPayments",
        defaultValue: {
            cash: formatToBRL(getExpectedAmount()),
            card: formatToBRL(getCardAmount()),
            pix: formatToBRL(getPixAmount()),
        }
    })

    const handleCurrencyInput = (field: PaymentField) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "")
        const formattedValue = formatToBRL(Number(value) / 100)
        setValue(`registeredPayments.${field}`, formattedValue)
    }

    const onSubmit = async (data: CloseCashRegisterForm) => {
        const parsedData = {
            currentCashRegisterId: currentCashRegister?.id!,
            registeredPayments: [
                {
                    paymentMethod: PaymentMethod.CASH,
                    amount: getCashAmount(),
                },
                {
                    paymentMethod: PaymentMethod.CARD,
                    amount: parseCurrencyString(data.registeredPayments.card),
                },
                {
                    paymentMethod: PaymentMethod.PIX,
                    amount: parseCurrencyString(data.registeredPayments.pix),
                },
            ],
        }

        registerPayments(parsedData, {
            onSuccess: () => {
                toast.success("Caixa fechado com sucesso")
                setStep(1)
            },
            onError: () => {
                toast.error("Erro ao fechar caixa")
            },
        })
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            reset()
            if (step === 1) {
                setStep(0)
                closeCashRegister(currentCashRegister?.id!)
            }
        }
    }

    const isReportStep = step === 1

    return (
        <Dialog onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Fechar Caixa
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    {!isReportStep && (
                        <>
                            <DialogTitle>Fechar Caixa</DialogTitle>
                            <DialogDescription>
                                Informe os valores contabilizados em cada método de pagamento
                            </DialogDescription>
                        </>
                    )}
                    {isReportStep && (
                        <DialogTitle>Relatório de Caixa</DialogTitle>
                    )}
                </DialogHeader>

                {!isReportStep && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <PaymentRow
                                method={PaymentMethod.CASH}
                                systemValue={getExpectedAmount()}
                                fieldName="cash"
                                register={register}
                                onChange={handleCurrencyInput("cash")}
                                error={errors.registeredPayments?.cash?.message}
                                currentValue={values.cash || formatToBRL(getExpectedAmount())}
                            />
                            <PaymentRow
                                method={PaymentMethod.CARD}
                                systemValue={getCardAmount()}
                                fieldName="card"
                                register={register}
                                onChange={handleCurrencyInput("card")}
                                error={errors.registeredPayments?.card?.message}
                                currentValue={values.card || formatToBRL(getCardAmount())}
                            />
                            <PaymentRow
                                method={PaymentMethod.PIX}
                                systemValue={getPixAmount()}
                                fieldName="pix"
                                register={register}
                                onChange={handleCurrencyInput("pix")}
                                error={errors.registeredPayments?.pix?.message}
                                currentValue={values.pix || formatToBRL(getPixAmount())}
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Fechando..." : "Fechar Caixa"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}

                {isReportStep && (
                    <CloseCashRegisterReport />
                )}
            </DialogContent>
        </Dialog>
    )
} 