import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";

import CartSync from "@/src/features/cart/cartSync";
import { CartItem } from "@/src/types";
import { fetchAPI } from "@/src/utils/apiService";

import { cookies } from "next/headers";

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
  console.log("totalItems", totalItems);
  const totalPrice: number = cartData.totalPrice ?? 0;
  console.log("totalPrice", totalPrice);

  // try common response shapes
  const products = productsRes?.data?.data ?? [];
  return (
    <div className="mt-24">
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

      <CartSync
        items={items}
        totalItems={totalItems}
        totalPrice={totalPrice}
        products={products}
        isLoggedIn={false}
      />
    </div>
  );
}
