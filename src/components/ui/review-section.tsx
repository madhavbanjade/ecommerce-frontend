"use client"

import { useState } from "react"
import { fetchAPI } from "@/src/utils/apiService"
import { Star, PenLine, X, Check, Loader2 } from "lucide-react"
import { Button } from "./button"

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
  productId: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildSummary(reviews: Review[]): ReviewSummary {
  const total = reviews.length
  const avg = total ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0
  const counts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length
    return { star, count, percentage: total ? Math.round((count / total) * 100) : 0 }
  })
  return { avg, total, counts }
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor", 2: "Fair", 3: "Good", 4: "Great", 5: "Excellent",
}

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-4 h-4 ${s <= value ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  )
}

function InteractiveStars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform duration-100 hover:scale-110 active:scale-95"
        >
          <Star className={`w-7 h-7 transition-colors duration-100 ${s <= active ? "fill-amber-400 text-amber-400" : "text-zinc-200"}`} />
        </button>
      ))}
    </div>
  )
}

// ─── Popup Form ───────────────────────────────────────────────────────────────

interface WriteReviewModalProps {
  productId: string
  onClose: () => void
  onSuccess: (review: Review) => void
}

function WriteReviewModal({ productId, onClose, onSuccess }: WriteReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!rating) e.rating = "Please select a rating"
    if (!title.trim()) e.title = "Title is required"
    if (!comment.trim()) e.comment = "Review is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    setServerError("")

    try {
      const res = await fetchAPI({
        endPoint: "reviews",
        method: "POST",
        data: {
          productId,
          title: title.trim(),
          comment: comment.trim(),
          rating,
        },
      })

      const raw = res?.data?.data ?? {}
      console.log("res", res)
      const newReview: Review = {
        id: raw.id ?? Date.now().toString(),
        name: raw.user?.username ?? "You",
        rating: raw.rating ?? rating,
        title: raw.title ?? title.trim(),
        comment: raw.comment ?? comment.trim(),
        date: raw.createdAt
          ? new Date(raw.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      }

      setSubmitted(true)
      onSuccess(newReview)
      setTimeout(onClose, 1800)
    } catch (err: any) {
      setServerError(err?.message ?? "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 px-6">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <Check className="w-7 h-7 text-emerald-500" strokeWidth={2.5} />
            </div>
            <p className="text-base font-bold text-zinc-900">Review submitted!</p>
            <p className="text-sm text-zinc-400">Thank you for your feedback.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <p className="text-md font-bold text-zinc-900">Write a Review</p>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-5 p-5">

              {/* Rating */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Your Rating</label>
                <div className="flex items-center gap-3">
                  <InteractiveStars value={rating} onChange={setRating} />
                  {rating > 0 && (
                    <span className="text-sm font-semibold text-amber-500">{RATING_LABELS[rating]}</span>
                  )}
                </div>
                {errors.rating && <p className="text-[11px] text-red-500">{errors.rating}</p>}
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  className={`w-full text-sm p-2 rounded border bg-white text-zinc-900 placeholder:text-zinc-300 outline-none transition-colors ${
                    errors.title ? "border-red-300 focus:border-red-400" : "border-zinc-200 focus:border-zinc-400"
                  }`}
                />
                {errors.title && <p className="text-[11px] text-red-500">{errors.title}</p>}
              </div>

              {/* Comment */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or dislike?"
                  rows={4}
                  className={`w-full text-sm p-2 rounded border bg-white text-zinc-900 placeholder:text-zinc-300 outline-none resize-none transition-colors ${
                    errors.comment ? "border-red-300 focus:border-red-400" : "border-zinc-200 focus:border-zinc-400"
                  }`}
                />
                {errors.comment && <p className="text-[11px] text-red-500">{errors.comment}</p>}
              </div>

              {serverError && (
                <p className="text-[11px] text-red-500 bg-red-50 px-3 py-2 rounded-lg">{serverError}</p>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 pb-5">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                ) : "Submit Review"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Reviews({ reviews: initialReviews, summary: initialSummary, productId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [summary, setSummary] = useState<ReviewSummary>(initialSummary)
  const [showModal, setShowModal] = useState(false)

  const handleNewReview = (review: Review) => {
    const updated = [review, ...reviews]
    setReviews(updated)
    setSummary(buildSummary(updated))
  }

  return (
    <>
      {showModal && (
        <WriteReviewModal
          productId={productId}
          onClose={() => setShowModal(false)}
          onSuccess={handleNewReview}
        />
      )}

      <div className="flex flex-col gap-4">

        {/* Sticky Header + Summary */}
        <div className="sticky top-16 z-10 bg-white py-2">
          <div className="flex flex-col gap-4 p-4 shadow-sm rounded-2xl border border-gray-200">

            <div className="flex items-center justify-between">
              <h3 className="font-bold text-zinc-900">
                Customer Reviews
                <span className="ml-2 text-sm font-normal text-zinc-400">({summary.total})</span>
              </h3>
              <Button 
                onClick={() => setShowModal(true)}
                variant={"filter"}
               
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
                    <span className="text-[10px] text-zinc-400 w-2">{star}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
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
    </>
  )
}