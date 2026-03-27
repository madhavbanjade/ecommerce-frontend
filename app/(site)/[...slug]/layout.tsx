import Filter from "@/src/components/layout/filters";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import FilterChips from "@/src/components/ui/filter-chips";
import { use } from "react";

function formatSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function SlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = use(params);
  const slugArray = resolvedParams.slug ?? [];
  const pageKey = slugArray.join("/");
  const initialGenders =
    pageKey === "products/men"
      ? ["Male"]
      : pageKey === "products/women"
      ? ["Female"]
      : [];

  return (
    <div className="text-dark">
      {/* Breadcrumb */}
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {slugArray.map((segment, index) => {
              const href = "/" + slugArray.slice(0, index + 1).join("/");
              const isLast = index === slugArray.length - 1;
              return (
                <div key={index} className="flex items-center">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{formatSlug(segment)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href}>
                        {formatSlug(segment)}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container">
        {/* mobile */}
    <div className="lg:hidden absolute">
  <Filter initialGenders={initialGenders} />
</div>

        {/* Desktop view */}
        <div className="flex gap-6">
          {/* Sidebar — filters only */}
          <div className="hidden lg:block w-64 shrink-0">
            <Filter initialGenders={initialGenders} />
          </div>

          {/* Main content — chips, sort, title, grid */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}