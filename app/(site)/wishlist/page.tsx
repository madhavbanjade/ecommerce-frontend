import ProductCard from "@/src/components/ui/product-card";
import { fetchAPI } from "@/src/utils/apiService";

export default async function Wishlist() {
  const res = await fetchAPI({ endPoint: "users/wishlist" });

  const products = res ?? [];

  console.log("products ->", products);

  if (!products) {
    return (
      <div className="container py-20 text-center text-red-500">
        {res.error || "Product not found"}
      </div>
    );
  }

  return (
    <div className="container space-y-4">
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found</p>
      )}
    </div>
  );
}