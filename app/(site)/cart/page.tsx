import SliderSection from "@/src/components/layout/slider-section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import CartItemActions from "@/src/components/ui/cart-items-action";
import ProductCard from "@/src/components/ui/product-card";
import { CartItem } from "@/src/types";
import { fetchAPI } from "@/src/utils/apiService";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function Cart() {
  // ✅ Cookies
  const cookieStore = await cookies();
  const cookiesHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join(";");

  // ✅ Fetch cart + products in parallel
  const [res, productsRes] = await Promise.all([
    fetchAPI({
      endPoint: "cart",
      headers: { Cookie: cookiesHeader },
      revalidateSeconds: 0,
    }),
    fetchAPI({
      endPoint: "products",
      revalidateSeconds: 60,
    }),
  ]);

  // ✅ Data
  const cartData = res?.data?.data ?? {};
  const items: CartItem[] = cartData.items ?? [];
  const totalItems: number = cartData.totalItems ?? 0;
  console.log("totalItems", totalItems)
  const totalPrice: number = cartData.totalPrice ?? 0;
  console.log("totalPrice", totalPrice)


  // try common response shapes
  const products = productsRes?.data?.data ?? [];
  return (
    <>
      {/* ───── Breadcrumb ───── */}
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
              <BreadcrumbPage>Cart</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

      <div className="container py-4 flex flex-col gap-6">
        {/* ───── Heading ───── */}
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-zinc-800" />
          <h3 className="text-4xl font-semibold">
            Tapai Ko DoKo
            <span className="ml-2 text-base font-normal text-zinc-400">
              ({totalItems} items)
            </span>
          </h3>
        </div>

        {/* ───── Empty State ───── */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <ShoppingBag className="w-16 h-16 text-zinc-200" />
            <p className="text-zinc-400 text-sm">
              Your bag is empty — start shopping 🛒
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* ───── Cart Items ───── */}
            <div className="flex-1 flex flex-col gap-4">
              {items.map((item: CartItem) => {
                const itemTotal = item.totalPrice ?? 0;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-zinc-100 p-4 flex gap-4 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {/* Image */}
                    <div className="relative w-28 h-32 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 shrink-0">
                      <Image
                        src={item.image || "/fallback.png"}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover p-2 sm:p-4"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between gap-4">
                      {/* Top */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
                            | {item.slug}
                          </p>
                          <h3 className="text-base font-semibold text-zinc-900">
                            {item.name}
                          </h3>
                        </div>

                        {/* Price */}
                        <p className="text-base font-bold text-zinc-900">
                          Rs. {itemTotal.toLocaleString()}
                        </p>
                      </div>

                      {/* Bottom */}
                      <CartItemActions
                        itemId={item.id}
                        initialQuantity={item.quantity}
                        size={item.size}
                        maxQuantity={item.stockQuantity}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ───── Order Summary ───── */}
            <div className="w-full lg:w-80">
              <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm flex flex-col gap-5 sticky top-6">
                <h3 className="">
                  Order Summary
                </h3>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">
                      Subtotal ({totalItems} items)
                    </span>
                    <span className="font-medium text-zinc-800">
                      Rs. {totalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Delivery</span>
                    <span className="text-emerald-600 font-semibold">Free</span>
                  </div>

                  <div className="h-px bg-zinc-100" />

                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-lg">
                      Rs. {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Promo */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 border px-4 py-2.5 rounded-xl text-sm outline-none"
                  />
                  <button className="bg-zinc-900 text-white px-4 rounded-xl text-xs font-bold">
                    Apply
                  </button>
                </div>

                {/* Checkout */}
                <button className="w-full bg-zinc-900 text-white rounded-xl py-3.5 text-xs font-bold flex items-center justify-center gap-2">
                  Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Continue */}
                <Link href="/products">
                    <button className="w-full border text-zinc-500 rounded-xl py-3 text-xs font-semibold hover:border-zinc-900 hover:text-zinc-900 transition">
                  Continue Shopping
                </button>
                </Link>
            
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-zinc-900">
            You Might Also Like
          </h3>
          <div className="relative w-screen left-1/2 -translate-x-1/2 px-4 sm:px-8">
            <SliderSection
              slideSizes={{
                base: "calc(75% - 6px)",
                sm: "calc(50% - 6px)",
                md: "calc(33.333% - 8px)",
                lg: "calc(25% - 9px)",
                xl: "calc(20% - 11px)",
              }}
              autoplay={false}
              showDots={false}
            >
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </SliderSection>
          </div>
        </div>
      </div>
    </>
  );
}
