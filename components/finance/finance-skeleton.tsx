import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function FinanceSkeleton() {
  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2 w-full sm:w-auto">
          <Skeleton className="h-10 flex-1 sm:w-32" />
          <Skeleton className="h-10 flex-1 sm:w-32" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="w-full">
        <div className="grid w-full grid-cols-2 lg:w-[400px] mb-6">
          <Skeleton className="h-10 rounded-md" />
          <Skeleton className="h-10 rounded-md ml-2" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-9 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
