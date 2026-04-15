import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { cookies } from "next/headers";
import { fetchAPI } from "@/src/utils/apiService";

const navItems = [
  { label: "Active orders", tab: "active", href: "/orders" },
  { label: "Past orders",   tab: "past",   href: "/orders?tab=past" },
  { label: "Returns",       tab: "returns", href: "/orders?tab=returns" },
];

export default async function OrdersLayout({
  searchParams,
  children,
}: {
  searchParams: { tab?: string };
  children: React.ReactNode;
}) {
  const activeTab = searchParams?.tab ?? "active";

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  const [activeRes, pastRes, returnsRes] = await Promise.all([
    fetchAPI({ endPoint: "orders?tab=active", headers: { Cookie: cookieHeader }, revalidateSeconds: 0 }),
    fetchAPI({ endPoint: "orders?tab=past",   headers: { Cookie: cookieHeader }, revalidateSeconds: 0 }),
    fetchAPI({ endPoint: "orders?tab=returns", headers: { Cookie: cookieHeader }, revalidateSeconds: 0 }),
  ]);

  const counts = {
    active:  activeRes.data?.data?.length  ?? 0,
    past:    pastRes.data?.data?.length    ?? 0,
    returns: returnsRes.data?.data?.length ?? 0,
  };

  return (
    <>
      {/* Breadcrumb — hidden on mobile */}
      <div className="hidden sm:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>My Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ── Mobile Tab Bar ── */}
      <div className="md:hidden w-full bg-white border-b border-zinc-200">
        <nav className="flex items-center">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <Link
                key={item.tab}
                href={item.href}
                className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors border-b-2 ${
                  isActive
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-400 hover:text-zinc-700"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-zinc-400">
                  {String(counts[item.tab as keyof typeof counts]).padStart(2, "0")}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Main Layout ── */}
      <div className="container flex flex-col md:flex-row gap-4 py-4">

        {/* ── Desktop Sidebar ── */}
        <div className="hidden md:block bg-white w-56 lg:w-64 shrink-0 border border-zinc-200 rounded-xl p-4 self-start sticky top-24">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest px-2 mb-3">
            My Orders
          </p>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <Link
                  key={item.tab}
                  href={item.href}
                  className={`flex justify-between items-center px-3 py-3 rounded-lg border-b border-zinc-100 text-sm transition-colors ${
                    isActive
                      ? "text-zinc-900 font-medium bg-zinc-50"
                      : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-zinc-400 text-xs">
                    {String(counts[item.tab as keyof typeof counts]).padStart(2, "0")}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </>
  );
} 