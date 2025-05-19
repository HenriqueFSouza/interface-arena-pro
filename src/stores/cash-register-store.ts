"use client"

import { CashRegister, CashRegisterOriginType, CashRegisterTransaction } from "@/@types/cash-register"
import { PaymentMethod } from "@/@types/payment"
import { create } from "zustand"

interface CashRegisterStore {
    isOverlayOpen: boolean
    setIsOverlayOpen: (isOpen: boolean) => void

    currentCashRegister: CashRegister | null
    setCurrentCashRegister: (cashRegister: CashRegister | null) => void

    initializeCashRegister: (cashRegister: CashRegister) => void

    expensesAndIncrements: () => CashRegisterTransaction[]

    // Computed values
    getTotalSold: () => number
    getExpectedAmount: () => number
    getCashAmount: () => number
    getCardAmount: () => number
    getPixAmount: () => number
}

export const useCashRegisterStore = create<CashRegisterStore>((set, get) => ({
    isOverlayOpen: false,
    setIsOverlayOpen: (isOpen) => set({ isOverlayOpen: isOpen }),

    currentCashRegister: null,
    setCurrentCashRegister: (cashRegister) => set({ currentCashRegister: cashRegister }),
    initializeCashRegister: (cashRegister) => set({ currentCashRegister: cashRegister }),

    // Computed values
    expensesAndIncrements: () => {
        const { currentCashRegister } = get()
        if (!currentCashRegister) return []

        return currentCashRegister.transactions
            .filter(transaction => transaction.originType === CashRegisterOriginType.INCREMENT || transaction.originType === CashRegisterOriginType.EXPENSE)
    },
    getTotalSold: () => {
        const { currentCashRegister } = get()
        if (!currentCashRegister) return 0

        return currentCashRegister.transactions
            .filter(transaction => transaction.originType === CashRegisterOriginType.PAYMENT)
            .reduce(
                (total, transaction) => total + (transaction.amount ?? 0),
                0
            )
    },

    getExpectedAmount: () => {
        const { currentCashRegister, getCashAmount } = get()
        if (!currentCashRegister) return 0

        const isExpense = (transaction: CashRegisterTransaction) => transaction.originType === CashRegisterOriginType.EXPENSE
        const isIncrement = (transaction: CashRegisterTransaction) => transaction.originType === CashRegisterOriginType.INCREMENT

        const incrementAmount = currentCashRegister.transactions
            .filter(isIncrement)
            .reduce((total, transaction) => total + (transaction.amount ?? 0), 0)

        const expenseAmount = currentCashRegister.transactions
            .filter(isExpense)
            .reduce((total, transaction) => total + (transaction.amount ?? 0), 0)

        return currentCashRegister.openedAmount + getCashAmount() + incrementAmount + expenseAmount
    },

    getCashAmount: () => {
        const { currentCashRegister } = get()
        if (!currentCashRegister) return 0

        return currentCashRegister.transactions
            .filter(transaction => transaction.paymentMethod === PaymentMethod.CASH)
            .reduce((total, transaction) => total + (transaction.amount ?? 0), 0)
    },

    getCardAmount: () => {
        const { currentCashRegister } = get()
        if (!currentCashRegister) return 0

        return currentCashRegister.transactions
            .filter(transaction => transaction.paymentMethod === PaymentMethod.CARD)
            .reduce((total, transaction) => total + (transaction.amount ?? 0), 0)
    },

    getPixAmount: () => {
        const { currentCashRegister } = get()
        if (!currentCashRegister) return 0

        return currentCashRegister.transactions
            .filter(transaction => transaction.paymentMethod === PaymentMethod.PIX)
            .reduce((total, transaction) => total + (transaction.amount ?? 0), 0)
    }
}))
