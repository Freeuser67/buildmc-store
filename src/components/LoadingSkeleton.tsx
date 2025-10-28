import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const ProductCardSkeleton = () => (
  <Card className="overflow-hidden border-2 border-border/50">
    <Skeleton className="h-56 w-full" />
    <CardHeader className="space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-28" />
      </div>
    </CardContent>
  </Card>
);

export const OrderCardSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
);
