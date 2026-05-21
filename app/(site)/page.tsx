import Banner from "@/src/components/layout/banner";
import Hero from "@/src/components/layout/hero";
import SliderSection from "@/src/components/layout/slider-section";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { fetchAPI } from "@/src/utils/apiService";
import ProductsInfiniteScroll from "@/src/components/ui/products-infinite-scroll";
import ProductCard from "@/src/components/ui/product-card";

async function fetchProducts() {
  const res = await fetchAPI({ endPoint: "products?page=1&limit=12" })
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

export default async function Home() {
  const [{ data: products, meta }, onSaleProducts, newProducts] = await Promise.all([
    fetchProducts(),
    fetchOnSaleProducts(),
    fetchNewProducts(),
  ]);

  return (
    <>
      <Hero  />

      <div className="container py-6 sm:py-10 space-y-10 sm:space-y-14"  >

        {products.length > 0 ? (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <h4 className="text-xl font-bold tracking-tight text-zinc-900">
                  All Products
                </h4>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-[2px] rounded-sm bg-gradient-to-r from-transparent via-[#000000] to-transparent" />
              </div>
            </div>

            <ProductsInfiniteScroll initialProducts={products} initialMeta={meta} />
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
