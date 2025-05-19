import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

type SpinnerProps = {
    className?: string
    size?: number
}

export function Spinner({ className, size = 16 }: SpinnerProps) {
    return (
        <Loader2
            className={cn("animate-spin text-muted-foreground", className)}
            size={size}
        />
    )
} 