"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const Gender = ["Man", "Women", "Unisex"]
const Categories = ["Shirts", "Pants", "Kintwear", "Jackets", "Accessories"]
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];




export default function Filter() {
  const router = useRouter();
  const pathname  = usePathname();
  const searchParams = useSearchParams();


  //read current values from url
  const selectedGenders  = searchParams.getAll("gender");
  const selectedCategories = searchParams.getAll("category");
  const selectedSizes = searchParams.getAll("size");


  const updateParam = useCallback((key:string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);
    if(checked){
      if(!current.includes(value)) params.append(key,value);
    }else{
      //remove
      params.delete(key);
      current.filter((v) => v !== value).forEach((v) => params.append(key,v))
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`)
  }, [searchParams, pathname, router])


  const clearAll = () => {
    const parmas = new URLSearchParams(searchParams.toString());
    ["gender","category", "size" ].forEach((k) => parmas.delete(k));
    parmas.set("page", "1");
    router.push(`${pathname}?${parmas.toString()}`)
  }
  
  const  hasFilters = selectedGenders.length > 0 || selectedCategories.length > 0 || selectedSizes.length > 0;
    return(
        <>
        <div className="space-y-4 p-2">
            <div className="flex items-center justify-between">
                <p className="text-lg font-bold  uppercase text-dark">Filters</p>
                {hasFilters && (
        <button
        onClick={clearAll}
        className="!tracking-normal hover:text-zinc-500  !text-[15px] cursor-pointer">Clear All</button>

                )}
            </div>

                {/* gender */}
            <div className="space-y-3">
                <h5 className="text-[10px] font-bold  uppercase text-zinc-400">Gender</h5>
              <div className="space-y-2">
                {Gender.map((g) => (
                <label key={g} htmlFor="" className="flex items-center gap-3 cursor-pointer group">
                     <input
                      type="checkbox"
                      checked={selectedGenders.includes(g)}
                      onChange={(e) => updateParam("gender", g, e.target.checked)}
                     className="w-4 h-4 rounded border-zinc-300 accent-black cursor-pointer" />
                      <span className="text-xs text-zinc-600 group-hover:text-black  transition-colors">{g}</span>
                </label>

                      
                ))}

              </div>
            </div>
       

{/* categories */}
            <div className="space-y-3">
                <h5 className="text-[10px] font-bold  uppercase text-zinc-400">Category</h5>
              <div className="space-y-2">
                {Categories.map((cat) => (
                <label key={cat} htmlFor="" className="flex items-center gap-3 cursor-pointer group">
                     <input
                      type="checkbox"
                       checked={selectedCategories.includes(cat)}
                onChange={(e) => updateParam("category", cat, e.target.checked)}
                       className="w-4 h-4 rounded border-zinc-300 accent-black cursor-pointer" />
                      <span className="text-xs text-zinc-600 group-hover:text-black  transition-colors">{cat}</span>
                </label>

                    
                ))}

              </div>
            </div>
        
              <div className="h-px bg-zinc-400" />
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
        </>
    )
}