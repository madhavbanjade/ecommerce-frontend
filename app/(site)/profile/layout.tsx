import Link from "next/link";
import { cookies, headers } from "next/headers";
import { fetchAPI } from "@/src/utils/apiService";
import Image from "next/image";
import { logout, order, payment, saved, security, user } from "@/src/assets";
import { redirect } from "next/navigation";
import { Package, Star, Heart, LogOut } from "lucide-react";
import ProfileSidebar from "@/src/components/ui/profileSidebar";

const TABS = [
  { label: "My Orders",  href: "/profile/orders",   Icon: Package },
  { label: "My Reviews", href: "/profile/reviews",  Icon: Star    },
  { label: "Wishlist",   href: "/profile/wishlists", Icon: Heart   },
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

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  const displayName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile?.username || "User";

  const avatarSeed = profile?.username || profile?.email || "user";

  return (
    <div className="mt-24  min-h-screen bg-[#F7F6F3]">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 pt-28 pb-16 items-start">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:flex w-72 shrink-0 flex-col gap-0 bg-white border border-zinc-200/80 rounded-2xl overflow-hidden sticky top-24 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">

            {/* Header strip */}
            <div className="relative px-5 pt-5 pb-4 border-b border-zinc-100 overflow-hidden">
              {/* Subtle decorative dot grid */}
              <div
                className="absolute inset-0 opacity-[0.035] pointer-events-none"
               
              />
              <div className="relative flex items-center justify-between">
                <h4 className="text-base font-bold text-zinc-900 tracking-tight">Dashboard</h4>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md">
                  {profile?.role || "Customer"}
                </span>
              </div>
            </div>

            {/* ── Profile Info ── */}
            <div className="flex items-center gap-4 px-5 py-5 border-b border-zinc-100">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-zinc-900 truncate leading-snug">{displayName}</p>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{profile?.email}</p>
              </div>
            </div>

            {/* ── Stats ── */}
            <div className="flex flex-col divide-y divide-zinc-50 px-5 py-1 border-b border-zinc-100 bg-zinc-50/50">
              {[
                { label: "Total Orders", value: profile?.totalOrders ?? 0, mono: true },
                { label: "Total Spent",  value: `₹ ${profile?.totalSpent?.toFixed(2) ?? "0.00"}`, mono: true },
                {
                  label: "Last Order",
                  value: profile?.lastOrder
                    ? new Date(profile.lastOrder).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : "N/A",
                  mono: false,
                },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex items-center justify-between py-3">
                  <span className="text-xs text-zinc-400 font-medium">{label}</span>
                  <span className={`text-xs font-bold text-zinc-800 ${mono ? "tabular-nums" : ""}`}>
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Nav Links ── */}
         <ProfileSidebar />

            {/* ── Sign out ── */}
            <div className="px-3 py-3">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="group flex items-center gap-3 px-3.5 py-2.5 w-full text-sm font-medium text-zinc-400 hover:bg-red-50 rounded-xl transition-all duration-150 hover:text-red-500 cursor-pointer"
                >
                  <LogOut
                    className="w-4 h-4 shrink-0 transition-colors group-hover:text-red-400"
                    strokeWidth={2}
                  />
                  Sign out
                </button>
              </form>
            </div>
          </aside>

          {/* ── Mobile Header + Tabs ── */}
          <div className="lg:hidden w-full space-y-3 mb-4">
            <div className="bg-white border border-zinc-200/80 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 leading-tight">{displayName}</p>
                  <p className="text-xs text-zinc-400 leading-tight">{profile?.email}</p>
                </div>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-500 transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
                  Sign out
                </button>
              </form>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
              {TABS.map(({ label, href, Icon }) => {
                const slug = href.split("/").pop()!;
                const active = pathname.includes(slug);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border shadow-sm ${
                      active
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Content ── */}
          <main className="flex-1 min-w-0 w-full">{children}</main>

        </div>
      </div>
    </div>
  );
}