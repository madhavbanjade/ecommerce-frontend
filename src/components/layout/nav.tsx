"use client";
import { useState, useRef, useEffect } from "react";
import { cart, logo, user } from "../../assets";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { userCartStore } from "@/src/features/cart/cartStore";

const navItems = [
  { label: "Products", href: "/products" },
  { label: "Men", href: "/products/men" },
  { label: "Women", href: "/products/women" },
  { label: "Sale", href: "/products/on-sale" },
  { label: "New-Arrivals", href: "/products/new-arrivals" },
];

function SearchBox({ className }: { className?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = inputRef.current?.value.trim();
      if (value) router.push(`/products?search=${value}`);
    }
  };


  return (
    <div
      className={`flex items-center gap-3  border border-black rounded-lg px-4 py-2
      focus-within:border-zinc-800 focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]
      transition-all duration-300 group ${className}`}
    >
      <Search className="w-3.5 h-3.5 opacity-40 group-focus-within:opacity-70 transition-opacity shrink-0" />
      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        placeholder="Search products..."
        className="bg-transparent outline-none text-xs tracking-wide text-zinc-800 placeholder:text-zinc-400 w-full"
      />
    </div>
  );
}

export function NavPage({ profile }: { profile: any }) {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isLoggedIn = !!profile;
  const totalCount = userCartStore((s) => s.totalCount())


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* ── Announcement Bar — slides up and fades out on scroll ── */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ height: "auto", opacity: 1 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-div text-white tracking-wide uppercase text-xs overflow-hidden"
          >
            <div className="container flex justify-between py-2">
              <div className="lg:block hidden">+977-9749344926</div>
              <div className="flex gap-2 mx-auto lg:mx-0">
                Get up to 20% off |{" "}
                <Link
                  href="/auth"
                  className="underline hover:text-sale transition-colors duration-200"
                >
                  Sign up
                </Link>
              </div>
              <div className="lg:block hidden">Koteshwor, Kathmandu</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nav ── */}
      <nav className="shadow-md bg-white">
        <div className="container flex justify-between items-center">
          {/* LEFT — Logo + Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              className="flex flex-col gap-[5px] cursor-pointer xl:hidden"
              onClick={() => setToggleMenu(!toggleMenu)}
              aria-label="Toggle menu"
            >
              <span
                className={`w-6 h-[3px] bg-dark rounded transition-all duration-300 ${toggleMenu ? "rotate-45 translate-y-[8px]" : ""}`}
              />
              <span
                className={`w-6 h-[3px] bg-dark rounded transition-all duration-300 ${toggleMenu ? "opacity-0 scale-x-0" : ""}`}
              />
              <span
                className={`w-6 h-[3px] bg-dark rounded transition-all duration-300 ${toggleMenu ? "-rotate-45 -translate-y-[8px]" : ""}`}
              />
            </button>

            <Link href="/" className="shrink-0 hidden md:block ">
              <Image
                src={logo}
                alt="logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </Link>
          </div>

          {/* CENTER — Desktop Nav Links */}
          <ul className="hidden xl:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li
                  key={item.label}
                  className="group relative flex flex-col items-center gap-1 whitespace-nowrap"
                >
                  <Link
                    href={item.href}
                    className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 flex flex-col items-center gap-1
                      ${isActive ? "text-dark" : "text-secondary hover:text-dark"}`}
                  >
                    <span
                      className={`transition-transform duration-200 ${isActive ? "-translate-y-0.5" : "group-hover:-translate-y-0.5"}`}
                    >
                      {item.label}
                    </span>

                    {/* Active — shared layoutId slides the underline between nav items */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="block h-0.5 w-full bg-sale rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 900,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Inactive — expands on hover */}
                    {!isActive && (
                      <span className="block h-0.5 w-0 bg-sale rounded-full transition-all duration-300 group-hover:w-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* RIGHT — Search + Icons */}
          <div className="flex gap-4 xl:gap-6 items-center shrink-0">
            <SearchBox className="hidden xl:flex w-56 2xl:w-72" />
            <Link href="/products">
              <Button variant={"outline"}>Shop now</Button>
            </Link>
            {/* cart */}
             <Link href="/cart" className="relative inline-flex items-center">
      <Image src={cart} alt="cart" width={22} height={22} />
 
      {/* Badge — only shown when cart has items */}
      {totalCount > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
          {totalCount > 99 ? "99+" : totalCount}
        </span>
      )}
    </Link>
    {/* user */}
           <Link href={isLoggedIn ? "/profile" : "/auth"}>
  {isLoggedIn ? (
    <div className="w-8   h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold">
      {profile?.name?.charAt(0)?.toUpperCase() || "U"}
    </div>
  ) : (
    <Image src={user} alt="user" width={22} height={22} />
  )}
</Link>
          </div>
        </div>
      </nav>

      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {toggleMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setToggleMenu(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer — springs in from left ── */}
      <motion.ul
        initial={false}
        animate={{ x: toggleMenu ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="xl:hidden fixed top-0 left-0 h-full w-72 z-50 bg-white shadow-2xl flex flex-col"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <Link href="/" onClick={() => setToggleMenu(false)}>
            <Image src={logo} alt="logo" width={50} height={50} />
          </Link>
          <button
            onClick={() => setToggleMenu(false)}
            className="text-secondary hover:text-dark transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Search */}
        <div className="px-6 py-4">
          <SearchBox className="w-full" />
        </div>

        {/* Nav Links — staggered fade in */}
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: toggleMenu ? 1 : 0, x: toggleMenu ? 0 : -16 }}
              transition={{
                delay: toggleMenu ? index * 0.06 : 0,
                duration: 0.2,
              }}
              className="list-none"
            >
              <Link
                href={item.href}
                onClick={() => setToggleMenu(false)}
                className={`flex items-center px-6 py-4 border-b border-zinc-100
                  text-xs font-semibold tracking-widest uppercase transition-all duration-200
                  ${
                    isActive
                      ? "text-dark bg-zinc-50 border-l-2 border-l-dark"
                      : "text-secondary hover:bg-zinc-900 hover:text-white"
                  }`}
              >
                {item.label}
              </Link>
            </motion.li>
          );
        })}

        {/* Drawer Footer */}
        <div className="mt-auto px-6 py-6 border-t border-zinc-200 flex gap-5">
         <Link href="/cart" className="relative inline-flex items-center">
      <Image src={cart} alt="cart" width={22} height={22} />
 
      {/* Badge — only shown when cart has items */}
      {totalCount > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
          {totalCount > 99 ? "99+" : totalCount}
        </span>
      )}
    </Link>
          <Link href="/account" onClick={() => setToggleMenu(false)}>
            <Image src={user} alt="user" width={22} height={22} />
          </Link>
        </div>
      </motion.ul>
    </div>
  );
}
