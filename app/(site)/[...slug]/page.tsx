import NewArrivals from "@/src/components/layout/new-arrivals";
import OnSale from "@/src/components/layout/on-sale";
import SliderSection from "@/src/components/layout/slider-section";

const pageMap: Record<
  string,
  { component: React.ComponentType<any>; maxDepth: number }
> = {
  brands: { component: SliderSection, maxDepth: 1 },
  "new-arrivals": { component: NewArrivals, maxDepth: 1 },
  "on-sale": { component: OnSale, maxDepth: 1 },
};
interface PageProps {
  params: Promise<{ slug: string[] }>;
}
export default async function Slug({ params }: PageProps) {
  const { slug } = await params;
  const firstSlug = slug[0];
  const route = pageMap[firstSlug];

  if (!route) return "Not-Found";

  if (slug.length > route.maxDepth) return "Not-Found";

  const PageComponent = route.component;

  return (
    <div className="text-dark">
      <PageComponent slug={slug} />
    </div>
  );
}
