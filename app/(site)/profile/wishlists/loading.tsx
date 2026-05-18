export default function WishlistLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-zinc-900 animate-spin" />
        <p className="text-sm text-zinc-400 font-medium">Loading wishlist…</p>
      </div>
    </div>
  )
}
