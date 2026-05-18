import { fetchAPI } from "@/src/utils/apiService";
import ProductCard from "@/src/components/ui/product-card";
import FilterChips from "@/src/components/ui/filter-chips";
import Pagination from "@/src/components/ui/pagination";

const pageMap: Record<string, { endpoint: string; title: string; Component: React.ComponentType<any> | null }> = {
  products:                { endpoint: "products",              title: "All Products", Component: null },
  "products/new-arrivals": { endpoint: "products?tag=New",      title: "New Arrivals", Component: null },
  "products/on-sale":      { endpoint: "products?tag=Sale",     title: "On Sale",      Component: null },
  "products/men":          { endpoint: "products?gender=Male",   title: "Men",          Component: null },
  "products/women":        { endpoint: "products?gender=Female", title: "Women",        Component: null },
};

const toArr = (v: string | string[] | undefined) =>
  v ? (Array.isArray(v) ? v : [v]) : [];

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SlugPage({ params, searchParams }: PageProps) {
  const [resolvedParams, search] = await Promise.all([params, searchParams]);
  const slug = resolvedParams.slug ?? [];
  const pageKey = slug.join("/");
  const page = pageMap[pageKey];

  if (!page)
    return <p className="container text-gray-500 text-center">Page not found!</p>;

  const genders    = toArr(search.gender);
  const categories = toArr(search.category);
  const sizes      = toArr(search.size);
  const currentPage = parseInt((search.page as string) ?? "1");

  const [basePath, baseQuery] = page.endpoint.split("?");
  const queryParams = new URLSearchParams(baseQuery ?? "");

  if (genders.length)    queryParams.set("gender",   genders.join(","));
  if (categories.length) queryParams.set("category", categories.join(","));
  if (sizes.length)      queryParams.set("size",      sizes.join(","));
  if (search.sort)       queryParams.set("sort",      search.sort as string);
  if (search.search)     queryParams.set("search",    search.search as string);
  queryParams.set("limit", "6");
  queryParams.set("page", String(currentPage));

  const endpoint = queryParams.toString()
    ? `${basePath}?${queryParams.toString()}`
    : basePath;

  const activeFilters = [
    ...genders.map((v)    => ({ key: "gender",   value: v, label: v })),
    ...categories.map((v) => ({ key: "category", value: v, label: v })),
    ...sizes.map((v)      => ({ key: "size",      value: v, label: `Size: ${v}` })),
  ];

  const res = await fetchAPI({ endPoint: endpoint });
  const products = res.data?.data ?? [];
  const meta     = res.data?.meta ?? null;

  const from = products.length > 0 ? (currentPage - 1) * 6 + 1 : 0;
  const to   = (currentPage - 1) * 6 + products.length;

  return (
    <div className="space-y-4" id="products">
      {page.Component && <page.Component />}

      {/* Header (title + search + sort) + active filter chips */}
      <FilterChips title={page.title} activeFilters={activeFilters} />

      {/* Product count */}
      <p className="text-sm text-gray-500">
        Showing {from}–{to} of {meta?.total ?? products.length} products
      </p>

      {/* Product grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            total={meta?.total ?? 0}
            limit={6}
            currentPage={currentPage}
            scrollToId="products"
          />
        </>
      ) : (
        <p className="text-center text-gray-500">No products found</p>
      )}
    </div>
  );
}
