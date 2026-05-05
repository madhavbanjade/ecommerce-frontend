import { Skeleton } from "@/src/components/ui/skeleton"

export function CartSyncSkeleton() {
  return (
    <div className="container py-4 flex flex-col gap-6 mt-24">

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Cart items */}
        <div className="flex-1 flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-zinc-100 p-4 flex gap-4 shadow-sm opacity-0 animate-[fadeSlideUp_0.4s_ease_forwards]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Image */}
              <Skeleton className="w-32 h-32 rounded-xl" />

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between gap-4">

                {/* Top */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>

                {/* Bottom actions */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-24 rounded-lg" />
                    <Skeleton className="h-9 w-10 rounded-lg" />
                  </div>

                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}