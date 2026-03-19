import Banner from "@/src/components/layout/banner";
import Hero from "@/src/components/layout/hero";
import Pagination from "@/src/components/ui/pagination";
import ProductCard from "@/src/components/ui/product-card";
import { fetchAPI } from "@/src/utils/apiService";

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  const search = await searchParams
  const currentPage = parseInt(search.page ?? "1")

  const res = await fetchAPI({
    endPoint: `products?page=${currentPage}&limit=6`,
  });

    const products = res.data.data ?? [];
   const meta = res.data.meta ?? null;

  return (
    <>
      <Hero />

      <div className="container space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3  gap-4">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Pagination
          total={meta?.total ?? 0}
          limit={6}
          currentPage={meta?.page ?? 1}
        />
      </div>

      <Banner />
    </>
  );
}