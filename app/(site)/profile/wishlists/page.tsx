
import ProductCard from "@/src/components/ui/product-card";
import { fetchAPI } from "@/src/utils/apiService";
import { cookies } from "next/headers";

export default async function Wishlist() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join(";");

  const res = await fetchAPI({
    endPoint: "users/wishlist",
    headers: {
      Cookie: cookieHeader,
    },
    revalidateSeconds: 0,
  });

  const wishlist = res?.data?.data ?? [];
console.log("wishlist", wishlist)
  return (
    <>
    
      <div className="container space-y-4">
        <h2 className="text-3xl font-bold text-zinc-900">My Wishlist</h2>
     {wishlist.length > 0 ? (
  <>
    <p className="text-sm text-gray-400">Found {wishlist.length} items</p>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
      {wishlist.map((item: any) => (
        <ProductCard key={item.id} product={item.product ?? item} />
      ))}
    </div>
  </>
) : (
  <p>No products in wishlist</p>
)}
      </div>
    </>
  );
}
