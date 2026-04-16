import Link from "next/link";
import { cookies } from "next/headers";
import { fetchAPI } from "@/src/utils/apiService";
import Image from "next/image";
import { logout, order, payment, saved, security, user } from "@/src/assets";
import { redirect } from "next/navigation";
import SideTabs from "@/src/components/ui/tab";
import { User, Package, Star, Heart } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";

const tabs = [
  { label: "Order History", href: "/orders", icon: order },
];

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  const res = await fetchAPI({
    endPoint: "users/me",
    headers: { Cookie: cookieHeader },
    revalidateSeconds: 0,
  });

  const profile = res.data?.data;

  async function logoutAction() {
    "use server";
    await fetchAPI({ endPoint: "users/logout", method: "POST" });
    const cookieStore = cookies();
    (await cookieStore).delete("refresh_token");
    redirect("/auth");
  }

  return (
    <>

      {/* <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Account</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}
      {/* ── Main Layout ── */}
      <div className="container flex gap-2 mt-4">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:flex w-72 shrink-0 flex-col gap-0 bg-white border border-zinc-200 rounded-lg overflow-hidden sticky  h-fit">

          <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100">
            <h4 className="text-lg font-bold text-zinc-900">Dashboard</h4>
          </div>

          {/* ── Profile Info ── */}
          <div className="flex items-center gap-4 px-5 py-5 border-b border-zinc-100">
            {/* Avatar */}
          <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
  <img
    src={
     
         `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || profile?.email || "user"}`
    }
    alt={profile?.username || "User"}
    className="w-full h-full object-cover"
  />
</div>

            {/* Name + email + role */}
            <div className="min-w-0">
              <p className="text-lg font-bold text-zinc-900 truncate">
                {profile?.firstName && profile?.lastName
                  ? `${profile.firstName} ${profile.lastName}`
                  : profile?.username || "User"}
              </p>
              <p className="text-sm text-zinc-500 truncate mt-0.5">
                {profile?.email}
              </p>
              <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-widest border border-zinc-300 text-zinc-500 rounded-md px-2 py-0.5">
                {profile?.role || "Customer"}
              </span>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="flex flex-col divide-y divide-zinc-100 px-5 py-2 border-b border-zinc-100">
            <div className="flex items-center justify-between py-3">
              <span className="text-md text-zinc-500">Total Orders</span>
              <span className="text-md font-bold text-zinc-900">
                {profile?.totalOrders ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-md text-zinc-500">Total Spent</span>
              <span className="text-md font-bold text-zinc-900">
                ₹ {profile?.totalSpent?.toFixed(2) ?? "0.00"}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-md text-zinc-500">Last Order</span>
              <span className="text-md font-medium text-zinc-500">
                {profile?.lastOrder
                  ? new Date(profile.lastOrder).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* ── Nav Links ── */}
          <div className="flex flex-col px-3 py-3 border-b border-zinc-100">
            <Link
              href="/orders"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-lg font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <Package className="w-4 h-4" strokeWidth={2} />
              My Orders
            </Link>
            <Link
              href="/reviews"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-lg font-medium text-zinc-700 hover:bg-zinc-50 transition-colors mt-1"
            >
              <Star className="w-4 h-4" strokeWidth={2} />
              My Reviews
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-lg font-medium text-zinc-700 hover:bg-zinc-50 transition-colors mt-1"
            >
              <Image src={user} alt="wishlist" width={16} height={16}></Image>
            Wishlist
            </Link>
        
          </div>

          {/* ── Sign Out ──
          <div className="px-3 py-3">
            <form action={logoutAction}>
              <button className="flex items-center gap-3 px-3 py-2.5 w-full text-lg text-zinc-500 hover:bg-red-50 rounded-xl transition-colors hover:text-red-500 cursor-pointer">
                <Image src={logout} alt="sign out" width={16} height={16} />
                Sign out
              </button>
            </form>
          </div> */}
        </aside>

        {/* ── Content ── */}
        <main className="flex-1 min-w-0 w-full">{children}</main>
      </div>

   
    </>
  );
}