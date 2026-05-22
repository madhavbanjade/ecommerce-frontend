"use client"

import { Star } from "lucide-react"

export interface Review {
  id: string
  name: string
  rating: number
  title: string
  comment: string
  date: string
}

export interface ReviewSummary {
  avg: number
  total: number
  counts: { star: number; count: number; percentage: number }[]
}

interface ReviewsProps {
  reviews: Review[]
  summary: ReviewSummary
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-4 h-4 ${s <= value ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  )
}

export default function Reviews({ reviews, summary }: ReviewsProps) {
  return (
    <div className="flex flex-col gap-4">

      {/* Sticky Header + Summary */}
      <div className="sticky top-16 z-10 bg-white py-2">
        <div className="flex flex-col gap-4 p-4 shadow-sm rounded-2xl border border-gray-200">

          <div className="flex items-center justify-between">
            <h3 className="font-bold text-zinc-900">
              Customer Reviews
              <span className="ml-2 text-sm font-normal text-zinc-400">({summary.total})</span>
            </h3>
          </div>

          <div className="flex gap-6 items-center">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <span className="text-5xl font-bold text-zinc-900">{summary.avg.toFixed(1)}</span>
              <Stars value={Math.round(summary.avg)} />
              <span className="text-xs text-zinc-400">{summary.total} reviews</span>
            </div>

            <div className="w-px h-16 bg-zinc-200 shrink-0" />

            <div className="flex flex-col gap-1.5 flex-1">
              {summary.counts.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-400 w-2">{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                  <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-[10px] text-zinc-400 w-3">{count}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-sm text-zinc-400 text-center py-6">No reviews yet. Be the first!</p>
      ) : (
        <div className="flex flex-col gap-3 max-h-130 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {reviews.map((r) => (
            <div key={r.id} className="flex flex-col gap-3 border border-gray-200 hover:border-zinc-300 rounded-2xl p-4 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{r.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{r.name}</p>
                    <p className="text-[11px] text-zinc-400">{r.date}</p>
                  </div>
                </div>
                <Stars value={r.rating} />
              </div>
              {r.title && <p className="text-sm font-semibold text-zinc-800 pl-13">{r.title}</p>}
              <p className="text-sm text-zinc-500 leading-relaxed pl-13">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
