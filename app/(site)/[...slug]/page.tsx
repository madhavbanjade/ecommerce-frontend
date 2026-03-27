import { fetchAPI } from "@/src/utils/apiService";
import ProductCard from "@/src/components/ui/product-card";
import FilterChips from "@/src/components/ui/filter-chips";
import Pagination from "@/src/components/ui/pagination";

// mapping of slug paths to their corresponding API endpoints and components
const pageMap: Record<
  string,
  {
    endpoint: string;
    Component: React.ComponentType<any> | null;
    title: string;
  }
> = {
  products: { endpoint: "products", Component: null, title: "All Products" },
  "products/new-arrivals": {
    endpoint: "products?tag=New",
    Component: null,
    title: "New Arrivals",
  },
  "products/on-sale": {
    endpoint: "products?tag=Sale",
    Component: null,
    title: "On Sale",
  },
  "products/men": {
    endpoint: "products?gender=Male",
    Component: null,
    title: "Men's Apparel",
  },
  "products/women": {
    endpoint: "products?gender=Female",
    Component: null,
    title: "Women's Apparel",
  },
};

// helper function to convert search param values to arrays1
type SearchParams = { [key: string]: string | string[] | undefined };
const toArr = (v: string | string[] | undefined) =>
  v ? (Array.isArray(v) ? v : [v]) : [];

// type definition for page props
interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

//
export default async function SlugPage({ params, searchParams }: PageProps) {
  const [resolvedParams, search] = await Promise.all([params, searchParams]);
  const slug = resolvedParams.slug ?? [];
  // construct the page key from the slug and look up the corresponding page config
  const pageKey = slug.join("/");
  const page = pageMap[pageKey];
  if (!page)
    return (
      <p className="container text-gray-500 text-center">Page not found!</p>
    );

  // extract filter values from search params and build the API endpoint
  const genders = toArr(search.gender);
  const categories = toArr(search.category);
  const sizes = toArr(search.size);
  const currentSort = (search.sort as string) ?? "featured"; 

  // safely split base endpoint into path + existing query
  const [basePath, baseQuery] = page.endpoint.split("?");
  const queryParams = new URLSearchParams(baseQuery ?? "");

  if (genders.length) queryParams.set("gender", genders.join(","));
  if (categories.length) queryParams.set("category", categories.join(","));
  if (sizes.length) queryParams.set("size", sizes.join(","));
  if (search.sort) queryParams.set("sort", search.sort as string);
  if (search.search) queryParams.set("search", search.search as string);
  const currentPage = parseInt((search.page as string) ?? "1")
  queryParams.set("limit", "6")
  queryParams.set("page", String(currentPage))

  const endpoint = queryParams.toString()
    ? `${basePath}?${queryParams.toString()}`
    : basePath;

  // construct active filters for the FilterChips component
  const activeFilters = [
    ...genders.map((v) => ({ key: "gender", value: v, label: v })),
    ...categories.map((v) => ({ key: "category", value: v, label: v })),
    ...sizes.map((v) => ({ key: "size", value: v, label: `Size: ${v}` })),
  ];

  // fetch products from the API
  const res = await fetchAPI({ endPoint: endpoint });
  const products = res.data?.data ?? [];
  const meta = res.data.meta ?? null;
  console.log("page", meta)

  return (
    <div className="space-y-4">
      {page.Component && <page.Component />}

      {/* ── Row 1: Active filter chips  +  Sort by (right-aligned) ── */}
      <div className="w-full">
        <FilterChips 
          activeFilters={activeFilters}
          currentSort={currentSort}
        />
      </div>

      {/* ── Row 2: Page title + product count ── */}
      <div className="px-1">
        <h2 className="text-5xl font-bold">{page.title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Showing {products.length > 0 ? 1 : 0}–{products.length} of{" "}
          {meta?.total ?? products.length} products
        </p>
      </div>

      {/* ── Row 3: Product grid + pagination ── */}
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
            currentPage={meta?.page ?? 1}
          />
        </>
      ) : (
        <p className="text-gray-500">No products found</p>
      )}
    </div>
  );
}
