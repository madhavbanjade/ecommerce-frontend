"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Filter { key: string; value: string; label: string; }

interface Props {
  activeFilters: Filter[];
  currentSort: string;
}

export default function FilterChips({ activeFilters, currentSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


  //update the url with search-params
  const push = (params: URLSearchParams) =>
    router.push(`${pathname}?${params.toString()}`);


  // remove a specific filter and update the url
  const removeFilter = (filter: Filter) => {
    const params = new URLSearchParams(searchParams.toString());
    const remaining = params.getAll(filter.key).filter((v) => v !== filter.value);
    params.delete(filter.key);
    remaining.forEach((v) => params.append(filter.key, v));
    params.set("page", "1");
    push(params);
  };


  // reset all filters and update the url
  const resetAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["gender", "category", "size"].forEach((k) => params.delete(k));
    params.set("page", "1");
    push(params);
  };


  // handle sort change and update the url
  const setSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.set("page", "1");
    push(params);
  };

  return (
    <div className="flex flex-col items-end gap-2">

    
      {/* sort */}
      <div className="relative">
        <label htmlFor="">Sort By:{" "}</label>
        <select
          defaultValue={currentSort}
          onChange={setSort}
          className="appearance-none border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm bg-white cursor-pointer focus:outline-none"
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="discount">Discount</option>
            
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
      </div>

             {/* chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <span
              key={`${f.key}-${f.value}`}
              className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700"
            >
              {f.label}
              <button onClick={() => removeFilter(f)} className="text-gray-400 hover:text-black">✕</button>
            </span>
          ))}
          <button onClick={resetAll} className="text-xs text-gray-500 underline underline-offset-2 hover:text-black">
            Reset all
          </button>
        </div>
      )}

   
    </div>
  );
}