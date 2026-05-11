"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Star, Heart } from "lucide-react";

const TABS = [
  { label: "My Orders", href: "/profile/orders", Icon: Package },
  { label: "My Reviews", href: "/profile/reviews", Icon: Star },
  { label: "Wishlist", href: "/profile/wishlists", Icon: Heart },
];

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col px-3 py-3 gap-0.5 border-b border-zinc-100">
      {TABS.map(({ label, href, Icon }) => {
        const slug = href.split("/").pop()!;
        const active = pathname.includes(slug);

        return (
          <Link
            key={href}
            href={href}
            className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              active
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                active ? "text-white" : "text-zinc-400"
              }`}
            />
            {label}
          </Link>
        );
      })}
    </div>
  );
}