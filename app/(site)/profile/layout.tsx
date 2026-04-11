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
    cookieStore.delete("refresh_token");
    redirect("/auth");
  }

  return (
    <>
      {/* Breadcrumb — hidden on mobile to save space */}
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
              <BreadcrumbPage>Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ── Mobile Tab Bar (visible only on mobile) ── */}
      <div className="lg:hidden w-full bg-white border-b border-zinc-200 overflow-x-auto">
        <nav className="flex items-center min-w-max px-2">
          {navaitems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-3 text-zinc-500 hover:text-zinc-900 transition-colors shrink-0"
            >
              <Image src={item.icon} alt={item.label} width={18} height={18} />
              <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
            </Link>
          ))}

          {/* Logout in tab bar */}
          <form action={logoutAction} className="shrink-0">
            <button className="flex flex-col items-center gap-1 px-3 py-3 text-zinc-500 hover:text-red-500 transition-colors">
              <Image src={logout} alt="sign out" width={18} height={18} />
              <span className="text-[10px] font-medium">Sign out</span>
            </button>
          </form>
        </nav>
      </div>

      {/* ── Main Layout ── */}
      <div className="container flex flex-col md:flex-row gap-4 py-4">

        {/* ── Desktop Sidebar (hidden on mobile) ── */}
        <div className="hidden md:block bg-white w-56 lg:w-64 shrink-0 border border-zinc-200 rounded-xl p-4 self-start sticky top-24">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest px-2 mb-3">
            Account Dashboard
          </p>

          <nav className="flex flex-col gap-1">
            {navaitems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
              >
                <Image src={item.icon} alt={item.label} width={16} height={16} />
                {item.label}
              </Link>
            ))}
          </nav>

          <hr className="my-4 border-zinc-200" />

          <form action={logoutAction}>
            <button className="flex items-center gap-3 px-3 py-2.5 w-full text-sm text-black hover:bg-red-50 rounded-lg transition-colors hover:text-red-500 cursor-pointer">
              <Image src={logout} alt="sign out" width={16} height={16} />
              Sign out
            </button>
          </form>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </>
  );
}