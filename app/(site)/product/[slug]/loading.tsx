import { Skeleton } from "@/src/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container flex flex-col space-y-6 mt-24 ">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-20" />
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT: Image Gallery */}
        <div className="space-y-4">

          {/* Main Image */}
          <Skeleton className="h-[420px] w-full rounded-2xl" />

          {/* Thumbnail */}
          <Skeleton className="h-[100px] w-[140px] rounded-xl" />
        </div>

        {/* RIGHT: Product Info */}
        <div className="flex flex-col gap-6">

          {/* Gender */}
          <Skeleton className="h-3 w-16" />

          {/* Title */}
          <Skeleton className="h-10 w-[300px]" />

          {/* Price Box */}
          <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>

          {/* Description */}
          <div className="space-y-2 border-l-2 pl-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[90%]" />
            <Skeleton className="h-3 w-[80%]" />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-12 rounded-full" />
              <Skeleton className="h-8 w-12 rounded-full" />
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>

          {/* Add to Cart */}
          <div className="flex gap-3">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  )
}