"use client";

import { useState, useRef, useEffect } from "react";
import { arrow, cart, login, logo, logout, signup, user } from "../../assets";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { userCartStore } from "@/src/features/cart/cartStore";

const navItems = [
  { label: "Products", href: "/products" },
  { label: "Men", href: "/products/men" },
  { label: "Women", href: "/products/women" },
  { label: "Sale", href: "/products/on-sale" },
  { label: "New Arrivals", href: "/products/new-arrivals" },
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
      className={`flex items-center gap-3 border border-zinc-300 rounded-xl px-4 py-2
      focus-within:border-black focus-within:shadow-sm
      transition-all duration-300 ${className}`}
    >
      <Search className="w-4 h-4 opacity-50" />
      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        placeholder="Search products..."
        className="bg-transparent outline-none text-sm w-full placeholder:text-zinc-400"
      />
    </div>
  );
}

export function NavPage({ profile }: { profile: any }) {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const isLoggedIn = !!profile;
  const cartItems  = userCartStore((s) => s.items);
  const totalCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      
      {/* NAVBAR */}
      <nav
        className={`transition-all duration-300 
        ${
          scrolled
            ? "bg-blue/90 backdrop-blur-md shadow-lg border-b border-zinc-200"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center h-16 px-4">

          {/* LEFT */}
     
        
            <Link href="/">
              <Image src={logo} alt="logo" width={70} height={70} />
            </Link>

          {/* CENTER */}
          <ul className="hidden xl:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className={`text-xs font-semibold tracking-wider uppercase px-1
                    ${
                      isActive
                        ? "text-black"
                        : "text-zinc-500 hover:text-black"
                    }`}
                  >
                    {item.label}
                  </Link>

                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300
                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                  />
                </li>
              );
            })}
          </ul>

          {/* RIGHT */}
          <div className="flex items-center gap-6">

            <SearchBox className="hidden xl:flex w-64" />

            {/* CART */}
            <Link href="/cart" className="flex items-center gap-2 group">
              <div className="relative">
                <Image src={cart} alt="cart" width={22} height={22} />

                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold rounded-full px-1.5">
                    {totalCount > 99 ? "99+" : totalCount}
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold group-hover:translate-x-0.5 transition">
                Cart
              </p>
            </Link>

            {/* AUTH */}
            {isLoggedIn ? (
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer">

<Link href="/profile" className="flex items-center gap-2">

                  <Image src={user} alt="user" width={22} height={22} />
                  <p className="font-medium">Dashboard</p>
</Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth" className="text-sm font-medium">
                  Login
                </Link>
                <Link
                  href="/auth"
                  className="text-sm font-semibold bg-black text-white px-3 py-1.5 rounded-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

    
    </div>
  );
}