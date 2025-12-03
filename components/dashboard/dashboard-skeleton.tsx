import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header & Stats Skeleton */}
      <div className="space-y-6">
        {/* Greeting Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none">
          <CardHeader>
            <Skeleton className="h-8 w-64 bg-white/20" />
            <Skeleton className="h-4 w-48 bg-white/20 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-32 bg-white/20" />
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 space-y-0">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Skeleton className="h-7 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Unified Dashboard Grid */}
      <div className="grid gap-6 md:grid-cols-6">
        {/* Cash Flow Chart Skeleton (Top Left - 66%) */}
        <div className="md:col-span-4 min-w-0">
          <Card className="h-[350px] shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Expense Chart Skeleton (Top Right - 33%) */}
        <div className="md:col-span-2 min-w-0">
          <Card className="h-[350px] shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-40 w-40 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Skeleton (Bottom Left - 66%) */}
        <div className="md:col-span-4 min-w-0">
          <Card className="h-full shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 px-2">
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Side Content Skeleton (Bottom Right - 33%) */}
        <div className="md:col-span-2 space-y-6 min-w-0">
          {/* Wishlist Progress Skeleton */}
          <Card className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </CardContent>
          </Card>

          {/* Bocor Halus Skeleton */}
          <Card className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-3 w-48" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                <Skeleton className="h-4 w-40" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
