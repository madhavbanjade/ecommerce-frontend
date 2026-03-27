"use client";

import { filter } from "@/src/assets";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { X } from "lucide-react";

const Gender = ["Male", "Female", "Unisex"];
const Categories = [
  "Hoodie & Sweet-shirts",
  "Shirts",
  "Pants",
  "Kintwear",
  "Jackets",
  "Accessories",
];
const SIZES = ["sm", "S", "M", "L", "XL", "XXL"];

interface FilterProps {
  initialGenders?: string[];
  initialCategories?: string[];
  initialSizes?: string[];
}

export default function Filter({
  initialGenders = [],
  initialCategories = [],
  initialSizes = [],
}: FilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const selectedGenders =
    searchParams.getAll("gender").length > 0
      ? searchParams.getAll("gender")
      : initialGenders;

  const selectedCategories =
    searchParams.getAll("category").length > 0
      ? searchParams.getAll("category")
      : initialCategories;

  const selectedSizes =
    searchParams.getAll("size").length > 0
      ? searchParams.getAll("size")
      : initialSizes;

  const updateParam = useCallback(
    (key: string, value: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.getAll(key);
      if (checked) {
        if (!current.includes(value)) params.append(key, value);
      } else {
        params.delete(key);
        current.filter((v) => v !== value).forEach((v) => params.append(key, v));
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["gender", "category", "size"].forEach((k) => params.delete(k));
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasFilters =
    selectedGenders.length > 0 ||
    selectedCategories.length > 0 ||
    selectedSizes.length > 0;

  const FilterContent = () => (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold uppercase text-dark">Filters</p>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="!tracking-normal hover:text-zinc-500 !text-[15px] cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-3">
        <h5 className="text-[10px] font-bold uppercase text-zinc-400">Gender</h5>
        <div className="space-y-2">
          {Gender.map((g) => (
            <label key={g} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedGenders.includes(g)}
                onChange={(e) => updateParam("gender", g, e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 accent-black cursor-pointer"
              />
              <span className="text-xs text-zinc-600 group-hover:text-black transition-colors">{g}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h5 className="text-[10px] font-bold uppercase text-zinc-400">Category</h5>
        <div className="space-y-2">
          {Categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={(e) => updateParam("category", cat, e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 accent-black cursor-pointer"
              />
              <span className="text-xs text-zinc-600 group-hover:text-black transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-zinc-400" />

      {/* Sizes */}
      <div className="space-y-3">
        <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">Size</h5>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const active = selectedSizes.includes(s);
            return (
              <button
                key={s}
                onClick={() => updateParam("size", s, !active)}
                className={`px-3 py-1.5 text-[10px] font-bold tracking-wider border rounded transition-all cursor-pointer ${
                  active
                    ? "border-black bg-black text-white"
                    : "border-zinc-200 text-zinc-500 hover:border-black hover:text-black hover:bg-zinc-100"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile burger button */}
      <button
         className="lg:hidden relative z-50 flex items-center gap-2 border border-zinc-400 rounded-lg px-3 py-2 text-xs font-semibold  tracking-wider text-zinc-600 hover:border-zinc-900 transition mb-2"
        onClick={() => setOpen(true)}
      >
        <Image src={filter} alt="filter" width={16} height={16} />
        {hasFilters && <span className="bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{selectedGenders.length + selectedCategories.length + selectedSizes.length}</span>}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-72 z-50 bg-white shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-100">
          <p className="font-bold text-sm uppercase tracking-widest">Filters</p>
          <button onClick={() => setOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 transition">
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
        <FilterContent />
      </div>
    </>
  );
}