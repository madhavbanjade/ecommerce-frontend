"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/profile/orders")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-zinc-900 animate-spin" />
    </div>
  )
}
