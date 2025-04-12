import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductListSkeleton() {
    return (
        <div className="space-y-8">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                        <Skeleton className="h-8 w-40" />
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((j) => (
                                <Skeleton key={j} className="h-[200px] w-full rounded-md" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
