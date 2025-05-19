"use client"

import { Button } from "@/components/ui/button"
import { useCashRegister } from "@/hooks/useCashRegister"
import { useCashRegisterStore } from "@/stores/cash-register-store"
import { DollarSign } from "lucide-react"


export default function CashRegisterOpenButton() {
    const { initializeCashRegister, setIsOverlayOpen } = useCashRegisterStore()
    const { cashRegister, isLoading } = useCashRegister()

    const handleOpenCashRegister = () => {
        if (!cashRegister) return

        initializeCashRegister(cashRegister)
        setIsOverlayOpen(true)
    }

    return (
        <Button
            className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            variant="outline"
            disabled={!cashRegister}
            isLoading={isLoading}
            onClick={handleOpenCashRegister}
        >
            <DollarSign className="mr-2 h-4 w-4" />
            Ver Caixa
        </Button>
    )
}
