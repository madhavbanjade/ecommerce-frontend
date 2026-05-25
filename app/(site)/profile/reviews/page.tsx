import { fetchAPI } from "@/src/utils/apiService"
import { cookies } from "next/headers"
import { Star, MessageSquare } from "lucide-react"

interface Review {
  id: string
  rating: number
  title: string
  comment: string
  createdAt: string
  product?: {
    name: string
    images?: string[]
  }
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= value ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  )
}

export default async function Reviews() {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ")

  const res = await fetchAPI({
    endPoint: "reviews",
    headers: { Cookie: cookieHeader },
    revalidateSeconds: 0,
  })

  const reviews: Review[] = res?.data?.data ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">
          My Reviews
          <span className="ml-2 text-sm font-normal text-zinc-400">({reviews.length})</span>
        </h2>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-500">No reviews yet</p>
          <p className="text-xs text-zinc-400">Your product reviews will appear here</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="flex gap-4 p-4 rounded-2xl border border-gray-200 hover:border-zinc-300 transition-colors duration-200 bg-white"
            >
              {/* Product thumbnail */}
              {r.product?.images?.[0] ? (
                <img
                  src={r.product.images[0]}
                  alt={r.product?.name ?? "Product"}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-zinc-100"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-zinc-100 shrink-0 flex items-center justify-center">
                  <Star className="w-5 h-5 text-zinc-300" />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    {r.product?.name && (
                      <p className="text-xs font-semibold text-zinc-400 truncate">
                        {r.product.name}
                      </p>
                    )}
                    {r.title && (
                      <p className="text-sm font-semibold text-zinc-900 truncate">{r.title}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Stars value={r.rating} />
                    <span className="text-[10px] text-zinc-400">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">{r.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}