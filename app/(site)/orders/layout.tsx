import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";



const navItems = [
 { label: "Active orders",  href: "/orders",     count: 2  },
  { label: "Past orders",    href: "/orders?tab=past",        count: 14 },
  { label: "Returns",        href: "/orders?tab=returns",     count: 1  },
]

export default function OrdersLayout({
 searchParams, children, 
}: {
      searchParams: { tab?: string };
  children: React.ReactNode;
}) {
      const activeTab = searchParams?.tab ?? "active";
      console.log("search", searchParams)
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
                const isActive = activeTab === item.href.split("=")[1];
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
                      {String(item.count).padStart(2, "0")}
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