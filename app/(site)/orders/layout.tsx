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
 { label: "Active orders", tab: "active",  href: "/orders" },
  { label: "Past orders", tab: "past",    href: "/orders?tab=past" },
  { label: "Returns",      tab: "returns",   href: "/orders?tab=returns" },
]

export default async function OrdersLayout({
 searchParams, children, 
}: {
      searchParams: { tab?: string };
  children: React.ReactNode;
}) {
      const activeTab = searchParams?.tab ?? "active";
      console.log("search", searchParams)

        const cookieStore = await cookies()
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join(";")

  const [activeRes, pastRes, returnsRes] = await Promise.all([
    fetchAPI({ endPoint: "orders?tab=active", headers: { Cookie: cookieHeader }, revalidateSeconds: 0 }),
    fetchAPI({ endPoint: "orders?tab=past", headers: { Cookie: cookieHeader }, revalidateSeconds: 0 }),
    fetchAPI({ endPoint: "orders?tab=returns", headers: { Cookie: cookieHeader }, revalidateSeconds: 0 }),
  ])

   const counts = {
    active: activeRes.data?.data?.length ?? 0,
    past: pastRes.data?.data?.length ?? 0,
    returns: returnsRes.data?.data?.length ?? 0,
  }
  return (

    <>
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
    
    <div className="container flex gap-4">
      {/* Sidebar */}
       
          <div className="bg-white w-64 shrink-0 border-zinc-200 rounded-xl p-4 border ">
             
    
              <nav className="flex flex-col gap-1">
               {navItems.map((item) => {
               const isActive = activeTab === item.tab;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex justify-between items-center py-3 border-b border-zinc-100 text-sm transition-colors ${
                      isActive
                        ? "text-zinc-900 font-medium"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-zinc-400 text-xs">
                         {String(counts[item.tab as keyof typeof counts] ?? 0).padStart(2, "0")}
                    </span>
                  </Link>
                );
              })}
              </nav>
    
           
            </div>

      {/* Content */}
      <div className="flex-1">{children}</div>
    </div>
    </>

  );
}