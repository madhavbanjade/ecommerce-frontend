import { Skeleton } from "@/src/components/ui/skeleton";

function OrderCardSkeleton() {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 flex gap-3 sm:gap-5">
      {/* Image */}
      <Skeleton className="w-24 h-28 sm:w-28 sm:h-32 rounded-lg shrink-0" />

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        {/* ID + status */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-24 rounded-lg" />
        </div>

        {/* Name */}
        <Skeleton className="h-4 w-3/4" />

        {/* Date */}
        <Skeleton className="h-3 w-24" />

        {/* Stats row */}
        <div className="flex gap-6">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>

        {/* Action button */}
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function OrdersListSkeleton() {
  return (
    <>
      {/* Cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-9 rounded-lg" />
        ))}
      </div>
    </>
  );
}

export default function OrdersLoading() {
  return <OrdersListSkeleton />;
}
