"use client"

import { Input } from "@/components/ui/input"
import { useStockInventory } from "@/hooks/useStockInventory"
import { cn } from "@/lib/utils"
import React, { useState } from "react"

interface QuantityInputProps {
    itemId: string
    initialQuantity: number
    disabled?: boolean
}

export function QuantityInput({ itemId, initialQuantity, disabled }: QuantityInputProps) {
    const { getItemQuantity, setItemQuantity, removeItemChange } = useStockInventory()

    const [value, setValue] = useState(() => {
        const storedQuantity = getItemQuantity(itemId)
        return storedQuantity !== undefined ? storedQuantity.toString() : initialQuantity.toString()
    })

    const currentQuantity = getItemQuantity(itemId)
    const hasChanged = currentQuantity !== undefined && currentQuantity !== initialQuantity

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setValue(newValue)

        const numericValue = parseFloat(newValue)

        if (isNaN(numericValue) || newValue === '') {
            removeItemChange(itemId)
            return
        }

        if (numericValue === initialQuantity) {
            removeItemChange(itemId)
        } else {
            setItemQuantity(itemId, numericValue)
        }
    }

    const handleBlur = () => {
        const numericValue = parseFloat(value)
        if (isNaN(numericValue) || value === '') {
            setValue(initialQuantity.toString())
            removeItemChange(itemId)
        }
    }

    return (
        <Input
            type="number"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            min="0"
            step="0.1"
            className={cn(
                "w-20 text-center",
                hasChanged && "border-orange-500 bg-orange-50"
            )}
        />
    )
} 