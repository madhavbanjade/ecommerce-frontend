import { fetchAPI } from "@/src/utils/apiService";
import ProductCard from "@/src/components/ui/product-card";
import FilterChips from "@/src/components/ui/filter-chips";


// mapping of slug paths to their corresponding API endpoints and components
const pageMap: Record<
  string,
  { endpoint: string; Component: React.ComponentType<any> | null; title:string }
> = {
  products: { endpoint: "products", Component: null, title:"All Products"},
  "products/new-arrivals": { endpoint: "products?tag=new", Component: null, title:"New Arrivals"},
  "products/on-sale": { endpoint: "products?tag=on-sale", Component: null, title:"On Sale" },
  "products/men": { endpoint: "products?category=Men", Component: null, title:"Men's Apparel" },
  "products/women": { endpoint: "products?category=Women", Component: null, title:"Women's Apparel" },
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
      const genders    = toArr(search.gender);
  const categories = toArr(search.category);
  const sizes      = toArr(search.size);


  // build the API endpoint with filters and sorting
  let endpoint = page.endpoint;
  if (genders.length)    endpoint += `&gender=${genders.join(",")}`;
  if (categories.length) endpoint += `&category=${categories.join(",")}`;
  if (sizes.length)      endpoint += `&size=${sizes.join(",")}`;
  if (search.sort)       endpoint += `&sort=${search.sort}`;


  // construct active filters for the FilterChips component
  const activeFilters = [
    ...genders.map((v)    => ({ key: "gender",   value: v, label: v })),
    ...categories.map((v) => ({ key: "category", value: v, label: v })),
    ...sizes.map((v)      => ({ key: "size",      value: v, label: `Size: ${v}` })),
  ];


// fetch products from the API
  const res = await fetchAPI({ endPoint: endpoint });
  const products = res.data?.data ?? [];

 

  return (
      <div className="container space-y-4">
      {page.Component && <page.Component />}

      {/* header row */}
      <div className="flex items-start justify-between p-3">
        <div>
          <h2 className="text-5xl font-bold">{page.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing 1–{products.length} of {products.length} products
          </p>
        </div>

        <FilterChips activeFilters={activeFilters} currentSort={search.sort as string ?? "featured"} />
      </div>

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
}
