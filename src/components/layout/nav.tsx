"use client";
import { useState } from "react";
import { arrow, cart, logo, search, user } from "../../assets";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Category", href: "/products/category" },
  { label: "On-sale", href: "/products/on-sale" },
  { label: "New-Arrivals", href: "/products/new-arrivals" },
];
 
export function NavPage() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div className="bg-div text-white tracking-wide uppercase text-xs py-2">
       <div className="container   flex justify-between">
          <div className="lg:block hidden">+977-9749344926</div>
          <div className="flex gap-2 mx-auto lg:mx-0">
            Get up to 20% off{" "}|{" "}
            <Link href="/auth" className="underline hover:text-sale transition-colors duration-200">
              Sign up
            </Link>
          </div>
          <div className="lg:block hidden">Koteshwor, Kathmandu</div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="shadow-md">
        <div className="container flex justify-between items-center py-3">

          {/* LEFT — Logo + Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Hamburger - hidden on xl+ */}
            <button
              className="flex flex-col gap-[5px] cursor-pointer xl:hidden"
              onClick={() => setToggleMenu(!toggleMenu)}
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-[3px] bg-dark rounded transition-all duration-300 ${toggleMenu ? "rotate-45 translate-y-[8px]" : ""}`} />
              <span className={`w-6 h-[3px] bg-dark rounded transition-all duration-300 ${toggleMenu ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`w-6 h-[3px] bg-dark rounded transition-all duration-300 ${toggleMenu ? "-rotate-45 -translate-y-[8px]" : ""}`} />
            </button>

            <Link href="/" className="shrink-0">
              <Image
                src={logo}
                alt="logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </Link>
          </div>

          {/* CENTER — Desktop Nav Links (xl+) */}
          <ul className="hidden xl:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.label} className="group relative flex flex-col items-center gap-1 whitespace-nowrap">
                  <Link
                    href={item.href}
                    className={`text-xs font-semibold tracking-wider uppercase
                      transition-colors duration-200 flex flex-col items-center gap-1
                      ${isActive ? "text-dark" : "text-secondary hover:text-dark"}`}
                  >
                    <span className={`transition-transform duration-200 ${isActive ? "-translate-y-0.5" : "group-hover:-translate-y-0.5"}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="block h-0.5 w-full bg-sale rounded-full"
                        transition={{ type: "spring", stiffness: 900, damping: 30 }}
                      />
                    )}
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

            {/* Search — xl+ only */}
            <div className="hidden xl:flex items-center gap-3 border border-black rounded-lg px-4 py-2 w-56 2xl:w-72
              focus-within:border-zinc-800 focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]
              transition-all duration-300 group">
              <Image src={search} width={14} height={14} alt="" className="opacity-40 group-focus-within:opacity-70 transition-opacity duration-300 shrink-0" />
              <input
                placeholder="Search products..."
                className="bg-transparent outline-none text-xs tracking-wide text-zinc-800 placeholder:text-zinc-400 w-full"
              />
            </div>

            <Button variant={"outline"} className="">Shop now</Button>

            <Link href="/cart">
              <Image src={cart} alt="cart" width={22} height={22} />
            </Link>
            <Link href="/account">
              <Image src={user} alt="user" width={22} height={22} />
            </Link>
          </div>

        </div>
      </nav>

      {/* ── Mobile Drawer (hidden on xl+) ── */}
      <div
        className={`xl:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
          ${toggleMenu ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setToggleMenu(false)}
      />

      <ul
        className={`xl:hidden fixed top-0 left-0 h-full w-72 z-50 bg-white shadow-2xl
          flex flex-col transition-transform duration-300 ease-in-out
          ${toggleMenu ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <Link href="/" onClick={() => setToggleMenu(false)}>
            <Image src={logo} alt="logo" width={50} height={50} />
          </Link>
          <button onClick={() => setToggleMenu(false)} className="text-secondary hover:text-dark transition-colors" aria-label="Close menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Search */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 border border-black rounded-lg px-4 py-2.5 w-full
            focus-within:border-zinc-800 focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]
            transition-all duration-300 group">
            <Image src={search} width={14} height={14} alt="" className="opacity-40 group-focus-within:opacity-70 transition-opacity duration-300 shrink-0" />
            <input
              placeholder="Search products..."
              className="bg-transparent outline-none text-xs tracking-widest text-zinc-800 placeholder:text-zinc-400 w-full"
            />
          </div>
        </div>

        {/* Nav Links */}
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="list-none">
              <Link
                href={item.href}
                onClick={() => setToggleMenu(false)}
                style={{ transitionDelay: toggleMenu ? `${index * 60}ms` : "0ms" }}
                className={`flex items-center px-6 py-4 border-b border-zinc-100
                  text-xs font-semibold tracking-widest uppercase transition-all duration-200
                  ${isActive
                    ? "text-dark bg-zinc-50 border-l-2 border-l-dark"
                    : "text-secondary hover:bg-zinc-900 hover:text-white"
                  }
                  ${toggleMenu ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
              >
                {item.label} 
              </Link>
            </li>
          );
        })}

        {/* Drawer Footer */}
        <div className="mt-auto px-6 py-6 border-t border-zinc-200 flex gap-5">
          <Link href="/cart" onClick={() => setToggleMenu(false)}>
            <Image src={cart} alt="cart" width={22} height={22} />
          </Link>
          <Link href="/account" onClick={() => setToggleMenu(false)}>
            <Image src={user} alt="user" width={22} height={22} />
          </Link>
        </div>
      </ul>

    </>
  );
}