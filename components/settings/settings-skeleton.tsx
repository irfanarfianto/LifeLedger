import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-4 pb-20">
      <Skeleton className="h-8 w-48 mb-4" />
      
      {/* Tabs List Skeleton */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-md" />
          ))}
        </div>
      </div>

      {/* Settings Content Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-64" />
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <Skeleton className="h-10 w-40" />
        </CardContent>
      </Card>
    </div>
  );
}
