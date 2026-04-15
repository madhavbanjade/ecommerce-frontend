"use client"

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

type TabItem = { label: string; href: string; icon?: any }
type Props = { tabs?: TabItem[]; className?: string; variant?: "sidebar" | "mobile" }

const normalizePath = (p: string) => {
  if (!p) return "/";
  const cleaned = p.replace(/\+$/, "");
  return cleaned === "" ? "/" : cleaned;
};

export default function SideTabs({ tabs = [], className = "", variant = "sidebar" }: Props) {
  const pathname = normalizePath(usePathname());
  const sp = useSearchParams();

  const isActive = (href: string) => {
    const isQueryOnly = href.startsWith("?");
    const url = new URL(href, `http://x${pathname}`);
    const linkPath = normalizePath(url.pathname);

    if (!isQueryOnly && linkPath !== pathname) return false;

    const linkParams = Object.fromEntries(url.searchParams.entries());
    const linkHasParams = Object.keys(linkParams).length > 0;
    const currentHasParams = Array.from(sp.keys()).length > 0;

    if (!linkHasParams && currentHasParams) return false;

    for (const [key, value] of Object.entries(linkParams)) {
      if (sp.get(key) !== value) return false;
    }

    return true;
  };

  if (variant === "mobile") {
    return (
      <nav className={`flex items-center min-w-max px-2 ${className}`}>
        {tabs.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-3 transition-colors shrink-0 ${
                active ? "text-green-600" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {item.icon && (
                <Image src={item.icon} alt={item.label} width={18} height={18} />
              )}
              <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className={`flex flex-col gap-1 ${className}`}>
      {tabs.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active
                ? "bg-green-50 text-green-700 font-medium border-l-4 border-green-500"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            {item.icon && (
              <Image src={item.icon} alt={item.label} width={16} height={16} />
            )}
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}