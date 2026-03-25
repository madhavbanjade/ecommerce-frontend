// app/wishlist/page.tsx
import ProductCard from "@/src/components/ui/product-card"
import { cookies } from "next/headers"

export default async function Wishlist() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("access_token")?.value
  const refreshToken = cookieStore.get("refresh_token")?.value

  const res = await fetch("http://localhost:3333/api/v1/users/wishlist", {
    headers: {
      Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
    },
    cache: "no-store",
  })

  const data = await res.json()
  const products = data?.data ?? []

  return (
      <div className="container space-y-4">
        <h2 className="text-3xl font-bold text-zinc-900">My Wishlist</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-20">No products in wishlist</p>
        )}
      </div>
  )
}