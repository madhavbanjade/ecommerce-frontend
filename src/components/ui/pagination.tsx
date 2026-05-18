"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  total: number
  limit: number
  currentPage: number
  basePath?: string
  scrollToId?: string
}

export default function Pagination({ total, limit, currentPage, basePath, scrollToId }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isFirstRender = useRef(true)

  const base = basePath ?? pathname

  const getHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    return `${base}?${params.toString()}`
  }

  const totalPages = Math.ceil(total / limit)

  const goTo = (page: number) => {
    router.push(getHref(page), { scroll: false })
  }

  useEffect(() => {
    // skip scroll on initial mount — only scroll when page actually changes
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!scrollToId) return
    const el = document.getElementById(scrollToId)
    if (!el) return
    const NAV_HEIGHT = 64 // fixed nav h-16 = 64px
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 16
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" })
  }, [currentPage, scrollToId])

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
