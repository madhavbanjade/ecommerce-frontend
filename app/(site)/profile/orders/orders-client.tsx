"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { OrdersListSkeleton } from "./loading"

// ── Context ──────────────────────────────────────────────────────────────────
const LoadingCtx = createContext({ startLoading: () => {} })
const useLoadingCtx = () => useContext(LoadingCtx)

// ── OrdersArea ────────────────────────────────────────────────────────────────
// Client shell: shows skeleton immediately on click, reveals children once the
// new searchParams land (= server has responded with new content).
export function OrdersArea({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const prev = useRef(searchParams.toString())

  useEffect(() => {
    const curr = searchParams.toString()
    if (curr !== prev.current) {
      prev.current = curr
      setLoading(false)
    }
  }, [searchParams])

  return (
    <LoadingCtx.Provider value={{ startLoading: () => setLoading(true) }}>
      {loading ? <OrdersListSkeleton /> : children}
    </LoadingCtx.Provider>
  )
}

// ── OrdersPagination ──────────────────────────────────────────────────────────
interface PaginationProps {
  total: number
  limit: number
  currentPage: number
  activeTab: string
}

export function OrdersPagination({ total, limit, currentPage, activeTab }: PaginationProps) {
  const router = useRouter()
  const { startLoading } = useLoadingCtx()
  const totalPages = Math.ceil(total / limit)

  const goTo = (page: number) => {
    startLoading()
    router.push(`/profile/orders?tab=${activeTab}&page=${page}`, { scroll: false })
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 hover:border-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={`w-8 h-8 text-xs font-semibold rounded-lg border transition-all ${
            p === currentPage
              ? "bg-black text-white border-black"
              : "border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 hover:border-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
