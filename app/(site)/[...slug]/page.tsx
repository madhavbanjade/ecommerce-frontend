import { fetchAPI } from "@/src/utils/apiService";
import ProductCard from "@/src/components/ui/product-card";

const pageMap: Record<
  string,
  { endpoint: string; Component: React.ComponentType<any> | null }
> = {
  products: { endpoint: "products", Component: null },
  "products/new-arrivals": { endpoint: "products?tag=new", Component: null },
  "products/on-sale": { endpoint: "products?tag=on-sale", Component: null },
};

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SlugPage({ params, searchParams }: PageProps) {
  const [resolvedParams] = await Promise.all([params, searchParams]);
  const slug = resolvedParams.slug ?? [];

  const pageKey = slug.join("/");
  const page = pageMap[pageKey];
  if (!page)
    return (
      <p className="container text-gray-500 text-center">Page not found!</p>
    );

  const res = await fetchAPI({ endPoint: page.endpoint });
  const products = res.data?.data ?? [];

  // ── shared grid ──
  const ProductGrid = (
    <div className="container py-10">
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found</p>
      )}
    </div>
  );

  return (
    <>
      {page.Component && <page.Component />}
      {ProductGrid}
    </>
  );
}
