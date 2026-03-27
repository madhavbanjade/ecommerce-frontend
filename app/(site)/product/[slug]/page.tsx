import { fetchAPI } from "@/src/utils/apiService";
import { Button } from "@/src/components/ui/button";
import { ShoppingCart, Heart, Package, Tag } from "lucide-react";
import ProductImageGallery from "@/src/components/ui/image-gallary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
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
  };
  const tagClass = tagStyles[product.tag] ?? "bg-gray-200 text-gray-700";
  const hasDiscount = !!product.discountPercent;

  //reviews
  const reviews =
    product.reviews?.map((r: any) => ({
      id: r.id,
      name: r.user?.username ?? "Anonymous",
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      date: new Date(r.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    })) ?? [];

  //reviews summary
  const total = reviews.length;
  const avg = total
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / total
    : 0;
  const summary = {
    avg,
    total,
    counts: [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((r: any) => r.rating == star).length;
      return {
        star,
        count,
        percentage: total ? Math.round((count / total) * 100) : 0,
      };
    }),
  };


  return (
    <>

       {/* Breadcrumb */}
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
    <div className="container flex flex-col space-y-4">
   

      {/* Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="w-full rounded-2xl">
          {product.images?.[0] && (
            <ProductImageGallery
              images={product.images}
              name={product.name}
              tag={product.tag}
              tagClass={tagClass}
            />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6 py-2">
          {/* Gender + Name */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">
                {product.gender}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold text-gray-900">
                  Rs. {product.dicountPrice}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  Rs. {product.originalPrice}
                </span>
                <span className="bg-red-100 text-red-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                  -{product.discountPercent}% OFF
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                Rs. {product.originalPrice}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed border-l-2 border-gray-200 pl-3">
            {product.description}
          </p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Select Size
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s: any) => (
                  <button
                    key={s.size}
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium uppercase hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200"
                  >
                    {s.size}
                    <span className="ml-1 text-[10px] text-gray-400 group-hover:text-gray-300">
                      ({s.stockQuantity})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${product.isAvilable ? "bg-green-400" : "bg-red-400"}`}
              />
              <span className="text-gray-500">
                {product.isAvilable ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Package className="w-3.5 h-3.5" />
              <span className="text-xs">Free delivery</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Tag className="w-3.5 h-3.5" />
              <span className="text-xs">Easy returns</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-gray-900 text-white hover:bg-black rounded-xl py-6 text-sm tracking-widest uppercase flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="w-12 h-12 rounded-xl p-0 flex items-center justify-center border-gray-200 hover:border-red-300 hover:text-red-500 transition-colors"
              
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <Reviews reviews={reviews} summary={summary} />
    </div>
    </>

  );
}
