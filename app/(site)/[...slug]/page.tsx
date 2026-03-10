import NewArrivals from "@/src/components/layout/new-arrivals";
import OnSale from "@/src/components/layout/on-sale";
import SliderSection from "@/src/components/layout/slider-section";
import ProductListing from "@/src/components/server/productListing";
import { notFound } from "next/navigation";


//map any page in the slug in key value pair -> key/pageMap(brands)-> component, value-> maxDepth
const pageMap: Record<
  string,
  { component: React.ComponentType<any>; maxDepth: number }
> = {
  "products": {component: ProductListing, maxDepth: 1},
  "category": { component: SliderSection, maxDepth: 1 },
  "new-arrivals": { component: NewArrivals, maxDepth: 1 },
  "on-sale": { component: OnSale, maxDepth: 1 },
};

//this takes the props from the url in array ["brands", "on-sale"]
interface PageProps {
  params: Promise<{ slug: string[] }>;
}


export default async function Slug({ params }: PageProps) {
  //wait for a slug /new-arrivals
  const { slug } = await params;
  //You only care about the first part of the URL /brands firstSlug = "brands"
  const firstSlug = slug[0];
  //Does the first part of URL exist inside pageMap?
  const route = pageMap[firstSlug];

  if (!route) return notFound();

  if (slug.length > route.maxDepth) return notFound();

  //Now you store the selected component inside a variable.
  const PageComponent = route.component;

  return (
    <div className="text-dark">
      {/*  //You render the component dynamically.<NewArrivals slug={["new-arrivals"]} /> */}
      <PageComponent slug={slug} />
    </div>
  );
}


