'use client'
import { Button } from "@/components/ui/button"
import { useStock } from "@/hooks/useStock"
import { formatDateTime } from "@/utils/formaters"
import { RefreshCcw } from "lucide-react"

export function UpdateStockButton() {
    const { invalidateAndRefetch, lastUpdatedAt, isLoading } = useStock()

    console.log(lastUpdatedAt)
    return (
        <div className="flex items-center gap-2">
            <div className="flex-wrap max-w-[120px]">
                <p className="text-sm text-muted-foreground">Última atualização: {!isLoading && formatDateTime(lastUpdatedAt.toString())}</p>
            </div>
            <Button
                className="bg-white hover:bg-white/50"
                variant="outline"
                size="sm"
                onClick={invalidateAndRefetch}
                isLoading={isLoading}
            >
                <RefreshCcw className="w-4 h-4 mr-2" />
                <span className="text-sm">Atualizar</span>
            </Button>
        </div>
    )
}
