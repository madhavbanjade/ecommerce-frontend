import Banner from "@/src/components/layout/banner";
import Hero from "@/src/components/layout/hero";
import ProductCard from "@/src/components/ui/product-card";
import SliderSection from "@/src/components/layout/slider-section";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { fetchAPI } from "@/src/utils/apiService";
import Pagination from "@/src/components/ui/pagination";

// Now returns BOTH products and meta
async function fetchProducts(page:number =1) {
  const res = await fetchAPI({ endPoint: `products?limit=6&page=${page}` });
  const data = res?.data?.data ?? [];
  const meta = res?.data?.meta ?? null;
  return { data, meta };
}

async function fetchOnSaleProducts() {
  try {
    const res = await fetchAPI({ endPoint: "products?tag=Sale&limit=8" });
    return res?.data?.data ?? [];
  } catch {
    return [];
  }
}

async function fetchNewProducts() {
  try {
    const res = await fetchAPI({ endPoint: "products?tag=New&limit=8" });
    return res?.data?.data ?? [];
  } catch {
    return [];
  }
}

function ProductSection({
  title,
  products,
  href,
}: {
  title: string;
  products: any[];
  href: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="">
      <div className="flex items-center justify-between mb-6">
        <div className="relative text-center">
          <h4 className="text-xl font-bold tracking-tight text-zinc-900">
            {title}
          </h4>
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-[2px] rounded-sm bg-gradient-to-r from-transparent via-[#000000] to-transparent" />
        </div>

        <Link
          href={href}
          className="group inline-flex flex-col items-start text-sm font-medium"
        >
          <div className="flex items-center gap-1">
            <span>See More</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <span className="mt-1 h-[2px] w-1/2 bg-div transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>

      <div className="relative w-screen left-1/2 -translate-x-1/2 px-4 sm:px-8">
        <SliderSection
          slideSizes={{
            base: "calc(75% - 6px)",
            sm: "calc(50% - 6px)",
            md: "calc(33.333% - 8px)",
            lg: "calc(25% - 9px)",
            xl: "calc(20% - 11px)",
          }}
          autoplay={false}
          showDots={false}
        >
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SliderSection>
      </div>
    </section>
  );
}

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams?.page ?? 1) ;
  // Destructure { data, meta } from fetchProducts
  const [{ data: products, meta }, onSaleProducts, newProducts] =
    await Promise.all([
      fetchProducts(currentPage),
      fetchOnSaleProducts(),
      fetchNewProducts(),
    ]);

  return (
    <>
      <Hero />

      <div className="container py-6 sm:py-10 space-y-10 sm:space-y-14">

      {products.length > 0 ? (
  <section>
    {/* Header — matches ProductSection style */}
    <div className="flex items-center justify-between mb-6">
      <div className="relative">
        <h4 className="text-xl font-bold tracking-tight text-zinc-900">
          All Products
        </h4>
             <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-[2px] rounded-sm bg-gradient-to-r from-transparent via-[#000000] to-transparent" />
       
      </div>

      {/* Page indicator */}
      <span className="text-xs text-zinc-400 font-medium">
        Page {currentPage} of {Math.ceil((meta?.total ?? 0) / 6)}
      </span>
    </div>

    {/* Product Grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>

    {/* Pagination */}
    <Pagination
      total={meta?.total ?? 0}
      limit={6}
      currentPage={currentPage}
      basePath="/"
    />
  </section>
) : (
  <p className="text-zinc-400 text-sm text-center py-12">No products found</p>
)}

        <ProductSection
          title="Stay On Your Budget"
          products={onSaleProducts}
          href="/products/on-sale"
        />
        <ProductSection
          title="Latest Products On Store"
          products={newProducts}
          href="/products/new-arrivals"
        />
      </div>

      <Banner />
    </>
  );
}