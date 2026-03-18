import { fetchAPI } from "@/src/utils/apiService";
import { Button } from "@/src/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import ProductImageGallery from "@/src/components/ui/image-gallary";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/src/components/ui/breadcrumb";
import Reviews from "@/src/components/ui/review-section";


export default async function ProductDetails({ params }: any) {
  const { slug } = await params;
  const res = await fetchAPI({ endPoint: `products/${slug}` });
  const product = res.data?.data ?? null;

  if (!product) {
    return (
      <div className="container py-20 text-center text-red-500">
        {res.error || "Product not found"}
      </div>
    );
  }

  

  const tagStyles: Record<string, string> = {
  New: "bg-green-400 text-black",
  Sale: "bg-red-500 text-white",
}

const tagClass = tagStyles[product.tag] ?? "bg-gray-200 text-gray-700"

  return (
    <div className="container ">
        <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/products">Products</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>{product.name}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-3">

        {/* ── Images ── */}
       {/* ── Images ── */}
<div className="relative w-full rounded-2xl">
  {product.images?.[0] && (
    <ProductImageGallery
      images={product.images}
      name={product.name}
      tag={product.tag}
      tagClass={tagClass}
    />
  )}
</div>

        {/* ── Info ── */}
        <div className="flex flex-col gap-6 py-4">

          {/* Name + Category */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
              {product.gender}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price */}
         <div className="flex items-center gap-3">
  {product.discountPercent ? (
    <>
      <span className="text-2xl font-bold text-gray-900">
        Rs. {product.dicountPrice}
      </span>
      <span className="text-lg text-gray-400 line-through">
        Rs. {product.originalPrice}
      </span>
      <span className="bg-red-100 text-red-500 text-xs font-semibold px-2 py-0.5 rounded-full">
        -{product.discountPercent}%
      </span>
    </>
  ) : (
    <span className="text-2xl font-bold text-gray-900">
      Rs. {product.originalPrice}
    </span>
  )}
</div>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                Select Size
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s: any) => (
                  <button
                    key={s.size}
                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium uppercase hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200"
                  >
                    {s.size}
                    <span className="ml-1 text-[10px] text-gray-400">
                      ({s.stockQuantity})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                product.isAvilable ? "bg-green-400" : "bg-red-400"
              }`}
            />
            <span className="text-gray-500">
              {product.isAvilable ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <Button className="flex-1 bg-gray-900 text-white hover:bg-black rounded-xl py-6 text-sm tracking-widest uppercase flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="w-12 h-12 rounded-xl p-0 flex items-center justify-center border-gray-200 hover:border-red-300 hover:text-red-500"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
          <div className="">
          <Reviews  />

          </div>

        </div>
      </div>
    </div>
  );
}