"use client"

import { Star, PenLine, X } from "lucide-react"
import { Button } from "./button"
import { useRef } from "react"

export interface Review {
  id: number
  name: string
  rating: number
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
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <div className="flex flex-col gap-4">

      {/* Sticky Header + Summary */}
      <div className="sticky top-16 z-10 bg-white py-2">
        <div className="flex flex-col gap-4 p-3 shadow-sm rounded-2xl border border-gray-200">

          <div className="flex items-center justify-between">
            <h3 className="font-bold text-zinc-900">
              Customer Reviews
              <span className="ml-2 text-sm font-normal text-zinc-400">({summary.total})</span>
            </h3>
            <Button
              variant="filter"
              onClick={() => dialogRef.current?.showModal()}
              className="flex items-center gap-2 text-xs"
            >
              <PenLine className="w-3.5 h-3.5" />
              Write a Review
            </Button>
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
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                  <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-[12px] text-zinc-400">{count}</span>
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
        <div className="flex flex-col gap-3 max-h-[520px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {reviews.map((r) => (
            <div key={r.id} className="flex flex-col gap-2 border border-gray-200 hover:border-zinc-300 rounded-2xl p-4 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{r.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{r.name}</p>
                    <p className="text-[11px] text-zinc-400">{r.date}</p>
                  </div>
                </div>
                <Stars value={r.rating} />
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed pl-13">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Native Dialog Modal — no useState needed */}
      <dialog
        ref={dialogRef}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        className="rounded-2xl w-full max-w-md shadow-2xl backdrop:bg-black/50 p-0 open:flex open:flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-700">Write a Review</h3>
          <button
            onClick={() => dialogRef.current?.close()}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        <form method="dialog" className="flex flex-col gap-4 p-6">
          <input
            name="name"
            placeholder="Your name"
            required
            className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-900 transition"
          />

          <div className="flex flex-col gap-2">
            <p className="text-xs text-zinc-400 font-medium">Your rating</p>
            <div className="flex gap-1 flex-row-reverse justify-end">
              {[5, 4, 3, 2, 1].map((s) => (
                <label key={s} className="cursor-pointer">
                  <input type="radio" name="rating" value={s} className="sr-only peer" required />
                  <Star className="w-7 h-7 text-zinc-200 peer-checked:fill-amber-400 peer-checked:text-amber-400 transition-all hover:scale-110" />
                </label>
              ))}
            </div>
          </div>

          <textarea
            name="comment"
            placeholder="Share your experience..."
            required
            rows={4}
            className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-900 transition resize-none"
          />

          <Button
            type="submit"
            className="w-full bg-zinc-900 text-white hover:bg-black rounded-xl py-2.5 text-xs tracking-widest uppercase"
          >
            Submit Review
          </Button>
        </form>
      </dialog>

    </div>
  )
}