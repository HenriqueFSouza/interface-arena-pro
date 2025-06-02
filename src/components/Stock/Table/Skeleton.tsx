import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
    return (
        <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-full bg-gray-200" />

            <Skeleton className="h-40 w-full bg-gray-200" />
        </div>
    )
}
