import { fetchAPI } from "@/src/utils/apiService";
import ProductCard from "@/src/components/ui/product-card";
import NewArrivals from "@/src/components/layout/new-arrivals";
import OnSale from "@/src/components/layout/on-sale";
import Banner from "@/src/components/layout/banner";
import SliderSection from "@/src/components/layout/slider-section";

const pageMap: Record<
  string,
  { endpoint: string; Component: React.ComponentType<any> | null }
> = {
  products: { endpoint: "products", Component: null },
  "products/new-arrivals": {
    endpoint: "products?tag=new",
    Component: NewArrivals,
  },
  "products/on-sale": { endpoint: "products?tag=on-sale", Component: OnSale },
  "products/category": { endpoint: "products?category=Men", Component: SliderSection},
};

interface PageProps {
  params: Promise<{ slug: string[] }>;
  //products?tag=new
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SlugPage({ params, searchParams }: PageProps) {
  const [resolvedParams] = await Promise.all([params, searchParams]);
  const slug = resolvedParams.slug ?? [];

  //url derived fromm segment
  const pageKey = slug.join("/");
  const page = pageMap[pageKey];

  if (!page) {
    return <p className="container text-gray-500">Page not found!</p>;
  }

  //fetch products
  const res = await fetchAPI({ endPoint: page.endpoint });
  const products = res.data?.data ?? [];

  // Has a layout component → render it
  if (page.Component) {
    return (
      <>
        <page.Component />
        <div className="container">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-start text-gray-500">No products found</p>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="container">
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-start text-gray-500">No products found</p>
      )}
    </div>
  );
}
