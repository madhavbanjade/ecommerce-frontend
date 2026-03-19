import Filter from "@/src/components/layout/filters";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { use } from "react";

function formatSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function SlugLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{slug?: string[] }>;
}) {
    const resolvedParams =  use(params)
  const slugArray = resolvedParams.slug ?? [];
    const pageKey = slugArray.join("/")

  const initialGenders =
    pageKey === "products/men" ? ["Male"] :
    pageKey === "products/women" ? ["Female"] : []

  return (
    <div className="text-dark ">
      <div className="px-8 py-4">
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
      <div className="flex container gap-4">
        <Filter initialGenders={initialGenders}  />
      {children}

      </div>
    </div>
  );
}
