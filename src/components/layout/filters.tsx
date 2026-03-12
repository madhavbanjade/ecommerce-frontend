import { Button } from "../ui/button";

const Categories = ["Shirts", "Pants", "Kintwear", "Jackets", "Accessories"]
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function Filter() {
    return(
        <>
        <div className="space-y-4">
            <div className="flex justify-between item-center">
                <p className="text-lg font-bold  uppercase text-dark">Filters</p>
        <button className="!tracking-normal hover:text-zinc-500  !text-[15px] cursor-pointer">Clear All</button>
            </div>
       

            <div className="space-y-3">
                <h5 className="text-[10px] font-bold  uppercase text-zinc-400">Category</h5>
              <div className="space-y-2">
                {Categories.map((cat) => (
                <label key={cat} htmlFor="" className="flex items-center gap-3 cursor-pointer group">
                     <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 accent-black cursor-pointer" />
                      <span className="text-xs text-zinc-600 group-hover:text-black  transition-colors">{cat}</span>
                </label>

                    
                ))}

              </div>
            </div>
              <div className="h-px bg-zinc-400" />
         <div className="space-y-3">
        <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">Size</h5>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              className="px-3 py-1.5 text-[10px] font-bold tracking-wider border border-zinc-200 rounded hover:border-black hover:text-black hover:bg-zinc-300 text-zinc-500 transition-all cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
        </div>
        </>
    )
}