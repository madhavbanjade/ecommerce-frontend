import { NavPage } from "@/src/components/layout/nav";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

function formatSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function Slug({ params }: PageProps) {
  const resolvedParams = await params;

  // safety fallback
  const slugArray = resolvedParams.slug ?? [];

  return (
    <div className="text-dark">

      <div className="px-8 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>

            {slugArray.map((slug, index) => {
              const href =
                "/" + slugArray.slice(0, index + 1).join("/");

              return (
                <div key={index} className="flex items-center">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {index === slugArray.length - 1 ? (
                      <BreadcrumbPage>
                        {formatSlug(slug)}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href}>
                        {formatSlug(slug)}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}