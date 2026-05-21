"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

interface Filter {
  key: string;
  value: string;
  label: string;
}

interface Props {
  title: string;
  activeFilters: Filter[];
}

const SORT_OPTIONS = [
  { value: "",           label: "Sort by" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "discount",     label: "Discount" },
];

export default function   FilterChips({ title, activeFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");
  const currentSort = searchParams.get("sort") ?? "";

  useEffect(() => {
    setSearchValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentSearch = searchParams.get("search") ?? "";
      if (searchValue === currentSearch) return;
      const params = new URLSearchParams(searchParams.toString());
      if (searchValue) {
        params.set("search", searchValue);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const removeFilter = (filter: Filter) => {
    const params = new URLSearchParams(searchParams.toString());
    const remaining = params.getAll(filter.key).filter((v) => v !== filter.value);
    params.delete(filter.key);
    remaining.forEach((v) => params.append(filter.key, v));
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["gender", "category", "size"].forEach((k) => params.delete(k));
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-3">
      {/* Header row: title on left | search + sort grouped on right */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-zinc-900 shrink-0">{title}</h2>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center w-48 border border-zinc-200 rounded-lg bg-white focus-within:border-zinc-900 px-3 gap-2">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="flex-1 py-2 text-sm focus:outline-none bg-transparent min-w-0 w-80"
            />
            {searchValue && (
              <button onClick={() => setSearchValue("")} className="text-zinc-400 hover:text-zinc-900 shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={currentSort}
            onChange={(e) => handleSort(e.target.value)}
            className="text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-900 bg-white shrink-0 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <span
              key={`${f.key}-${f.value}`}
              className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1 text-sm text-red-700"
            >
              {f.label}
              <button
                onClick={() => removeFilter(f)}
                className="text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </span>
          ))}
          <button
            onClick={resetAll}
            className="text-xs text-gray-500 underline underline-offset-2 hover:text-black"
          >
            Reset all
          </button>
        </div>
      )}
    </div>
  );
}
