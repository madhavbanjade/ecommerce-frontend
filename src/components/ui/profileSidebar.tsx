  "use client";

  import Link from "next/link";
  import { usePathname, useRouter } from "next/navigation";
  import { Package, Star, Heart, LogOut } from "lucide-react";
  import Image from "next/image";
  import { naya } from "@/src/assets";
  import { fetchAPI } from "@/src/utils/apiService";
  import { toast } from "react-toastify";

 

  export default function ProfileSidebar({ user }: { user: any }) {
    const pathname = usePathname();
    const router = useRouter();
     const TABS = [
    { label: "My orders", href: "/profile/orders", Icon: Package, count: user?.ordersCount ??  0},
    { label: "My reviews", href: "/profile/reviews", Icon: Star, count: 6 },
    { label: "Wishlist", href: "/profile/wishlists", Icon: Heart, count: user?.wishlistCount ?? 0 },
  ];
    const handleLogout = async () => {
      const res = await fetchAPI({
        endPoint: "users/logout",
        method: "POST",
      });
      toast.success("Logout Successful!");
    setTimeout(() => {
      router.push("/auth");
    }, 1000); 
    };

    return (
      <nav className="w-80  h-fit flex flex-col gap-5 rounded-xl ">
        {/* ── Hero ── */}
        <div className="rounded-lg bg-white p-4 shadow-sm border border-zinc-200">
          <h4 className="text-xl font-semibold text-zinc-900 mb-3">Dashboard</h4>

          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <Image
                src={naya}
                alt="user"
                className="w-16 h-16 rounded-full object-cover border-2 border-zinc-200"
              />
            </div>

            <div className="">
              <p className="font-bold text-xl">{user.username}</p>

              <p className="text-sm text-zinc-500 truncate mt-1">{user.email}</p>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="rounded-lg border border-zinc-200 overflow-hidden bg-white shadow-sm">
          {[
            { label: "Total orders", value: user?.ordersCount ?? 0 },
            { label: "Total spent", value: user?.totalSpent ?? 0 },
            { label: "Last order", value: user?.lastOrder ?? "-" },
          ].map(({ label, value }, i) => (
            <div
              key={label}
              className={`flex items-center justify-between px-5 py-4 ${
                i !== 2 ? "border-b border-zinc-100" : ""
              }`}
            >
              <span className="text-md font-medium text-zinc-500">{label}</span>

              <span className="text-md font-semibold text-zinc-900 tabular-nums">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* ── Nav ── */}
        <div className="rounded-lg border border-zinc-200 bg-white p-2 shadow-sm">
          {TABS.map(({ label, href, Icon, count }) => {
            const active = pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200 ${
                  active
                    ? "bg-black text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                <div
                  className={`flex items-center justify-center rounded-xl p-2 ${
                    active ? "bg-white/10" : "bg-zinc-100 group-hover:bg-white"
                  }`}
                >
                  <Icon
                    className="w-5 h-5 shrink-0"
                    strokeWidth={active ? 2.4 : 2}
                  />
                </div>

                <span className="flex-1 text-base font-medium">{label}</span>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    active ? "bg-white text-black" : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* ── Footer button ── */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-1 rounded-2xl bg-red-500 p-4 text-base font-semibold text-white transition-all duration-200 hover:bg-red-600"
        >
          <LogOut className="w-5 h-5" strokeWidth={2.2} />
          <p>Logout</p>
        </button>
      </nav>
    );
  }
