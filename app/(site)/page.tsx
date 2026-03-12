import Banner from "@/src/components/layout/banner";
import Hero from "@/src/components/layout/hero";
import ProductCard from "@/src/components/ui/product-card";
import { fetchAPI } from "@/src/utils/apiService";

export default async function Home() {
  const res = await fetchAPI({
    endPoint: "products",
  });

  const products = res.data?.data ?? null;
  const error = res.error ?? null;
  return (
    <>
      <Hero />
      {
        <div className="container grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products &&
            products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      }

      <Banner />
    </>
  );
}
