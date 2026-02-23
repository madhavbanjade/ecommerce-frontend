import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { logo } from "@/src/assets";

const collections = ["Men's FW24", "Women's FW24", "Accessories", "Fragrance", "Sale"];
const services = ["Size Guide", "Shipping", "Returns", "Care Guide", "Contact"];
const legal = ["Privacy Policy", "Terms of Use", "Accessibility", "Cookie Policy"];

const socials = [
  { label: "Facebook", href: "/", icon: <Facebook className="w-4 h-4" /> },
  { label: "Instagram", href: "/", icon: <Instagram className="w-4 h-4" /> },
  { label: "TikTok", href: "/", icon: <SiTiktok className="w-4 h-4" /> },
  { label: "Twitter", href: "/", icon: <Twitter className="w-4 h-4" /> },
];

export default function Footer() {
  return (
    <footer className="w-screen text-dark bottom-0 border-t border-black">



      {/* ── Main Footer ── */}
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-10 py-14">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 grid gap-6">
          <Link href="/">
            <Image
              src={logo}
              alt="logo"
              width={80}
              height={80}
              className="w-14 md:w-20 h-auto object-contain"
            />
          </Link>

          <p className="text-sm text-secondary leading-relaxed">
            Elevating the everyday through curated luxury and sustainable
            practices. Designed in Paris, crafted globally.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3">
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 rounded-full border border-black/20 flex items-center justify-center text-dark hover:bg-[#4285F4] hover:text-white hover:border-[#4285F4] transition-all duration-300"
              >
                {s.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Collections */}
        <div className="grid content-start">
          <h5 className="font-bold uppercase border-b border-black/10 pb-3">
            Collections
          </h5>
          <ul className="grid gap-3">
            {collections.map((item) => (
              <li key={item} className="flex items-center gap-2 group">
                <span className="w-1 h-1 rounded-full bg-[#4285F4] opacity-0 group-hover:opacity-100 transition-opacity" />
                <Link href="/" className="text-sm text-secondary hover:text-dark transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Service */}
        <div className="grid  content-start">
          <h5 className="font-bold uppercase border-b border-black/10 pb-3">
            Service
          </h5>
          <ul className="grid gap-3">
            {services.map((item) => (
              <li key={item} className="flex items-center gap-2 group">
                <span className="w-1 h-1 rounded-full bg-[#4285F4] opacity-0 group-hover:opacity-100 transition-opacity" />
                <Link href="/" className="text-sm text-secondary hover:text-dark transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="grid  content-start">
          <h5 className="font-bold uppercase border-b border-black/10 pb-3">
            Legal
          </h5>
          <ul className="grid gap-3">
            {legal.map((item) => (
              <li key={item} className="flex items-center gap-2 group">
                <span className="w-1 h-1 rounded-full bg-[#4285F4] opacity-0 group-hover:opacity-100 transition-opacity" />
                <Link href="/" className="text-sm text-secondary hover:text-dark transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-black/10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-3 py-5">
          <p className="text-xs text-secondary tracking-widest text-center md:text-left uppercase">
            © 2026 HRN. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <p className="text-xs text-secondary tracking-widest uppercase">Developed By Madhav Banjade</p>
          </div>
        </div>
      </div>

    </footer>
  );
}