import { Skeleton } from "@/components/ui/skeleton"

export default function ClientOrderSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-[120px] w-full rounded-lg bg-gray-200" />
      ))}
    </div>
  )
}
