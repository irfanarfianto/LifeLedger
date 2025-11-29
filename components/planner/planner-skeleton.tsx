import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PlannerSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        {/* Tabs Skeleton */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
        
        {/* Calendar/Matrix Content Skeleton */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Skeleton className="h-[350px] w-full rounded-md" />
          </div>
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-48 mb-4" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Brain Dump Skeleton */}
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>

        {/* Habit Tracker Skeleton */}
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
