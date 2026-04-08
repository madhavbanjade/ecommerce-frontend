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
import Image from "next/image";
import { logout, order, payment, saved, security, user } from "@/src/assets";
import { redirect } from "next/navigation";

const navaitems = [
  { label: "Profile Details", href: "/profile", icon: user },
  { label: "Order History", href: "/orders", icon: order },
  { label: "Saved Address", href: "/address", icon: saved },
  { label: "Payment Method", href: "/payment", icon: payment },
  { label: "Security & Privacy", href: "/security", icon: security },
];

export default async function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  async function logoutAction() {
    "use server";
    const res = await fetchAPI({
      endPoint: "users/logout",
      method: "POST",
    });

    const cookieStore = await cookies();
    cookieStore.delete("refresh_token")
    console.log("res  logout", res);

    redirect("/auth")
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
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="container flex gap-1">
        {/* Sidebar */}

        <div className="bg-white w-64 shrink-0 border-zinc-200 rounded-xl p-4 border ">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest px-2 mb-3">
            Account Dashboard
          </p>

          <nav className="flex flex-col gap-1">
            {navaitems.map((item) => {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm 
                  "
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={16}
                    height={16}
                    className="
                       opacity-100
                        
                    "
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <hr className="my-4 border-zinc-200" />

          <form action={logoutAction}>
            <button className="flex items-center gap-3 px-3 py-2.5 w-full text-sm text-black hover:bg-red-50 rounded-lg transition-colors hover:text-red-500 cursor-pointer">
              <Image src={logout} alt="sign out" width={16} height={16} /> Sign
              out
            </button>
          </form>
        </div>

        {/* Content */}
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
