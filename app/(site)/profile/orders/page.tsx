import { Suspense } from "react";
import OrderDetailModal from "@/src/components/ui/order-detail";
import { Order, OrderStatus } from "@/src/types";
import { fetchAPI } from "@/src/utils/apiService";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { OrdersListSkeleton } from "./loading";
import { OrdersArea, OrdersPagination } from "./orders-client";

// ---------------- TABS ----------------
const tabs = [
  { label: "Active orders", tab: "active" },
  { label: "Past orders", tab: "past" },
  { label: "Returns", tab: "returns" },
];

// ---------------- STATUS UI ----------------
const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped: "bg-purple-50 text-purple-700 border-purple-200",
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
  Returned: "bg-red-100 text-red-600 border-red-300",
};

const statusDot: Record<OrderStatus, string> = {
  Pending: "bg-yellow-500",
  Confirmed: "bg-blue-500",
  Shipped: "bg-purple-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
  Returned: "bg-red-600",
};

// ---------------- FETCH ----------------
async function getOrders(
  tab: string,
  page: string = "1",
  limit: string = "6",
): Promise<{ orders: Order[]; meta: any }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  const res = await fetchAPI({
    endPoint: `orders?tab=${tab}&page=${page}&limit=${limit}`,
    headers: { Cookie: cookieHeader },
    revalidateSeconds: 0,
  });

  return {
    orders: res.data?.data ?? [],
    meta: res.data?.meta ?? null,
  };
}

// ---------------- ORDER CARDS (no pagination) ----------------
async function OrdersListContent({ tab, page }: { tab: string; page: string }) {
  const { orders } = await getOrders(tab, page, "6");

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-zinc-400">
        No orders found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {orders.map((order) => {
        const firstItem = order.items[0];
        const totalUnits = order.items.reduce(
          (acc, item) => acc + item.quantity,
          0,
        );

        return (
          <div
            key={order.id}
            className="bg-white border border-zinc-200 rounded-xl p-3 sm:p-4 flex gap-3 sm:gap-5"
          >
            {/* IMAGE */}
            <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-lg overflow-hidden border bg-zinc-50 shrink-0">
              <Image
                src={`http://localhost:3333${firstItem.image}`}
                alt={firstItem.name}
                width={0}
                height={0}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between mb-1">
                <p className="text-xs text-zinc-400">#{order.id}</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs border ${
                    statusStyles[order.status]
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${statusDot[order.status]}`}
                  />
                  {order.status}
                </span>
              </div>

              <h3 className="font-semibold text-sm truncate">
                {firstItem?.name}
              </h3>

              <p className="text-xs text-zinc-400 mb-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <div className="flex gap-6 mb-4">
                <div>
                  <p className="text-xs text-zinc-400">Items</p>
                  <p className="text-sm font-medium">{totalUnits}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Total</p>
                  <p className="text-sm font-medium">Rs. {order.totalPrice}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Size</p>
                  <p className="text-sm font-medium">{firstItem.size}</p>
                </div>
              </div>

              <OrderDetailModal order={order} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------- PAGE ----------------
export default async function MyOrders({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>;
}) {
  noStore();

  const params = await searchParams;
  const activeTab = params.tab ?? "active";
  const currentPage = params.page ?? "1";

  // fetch counts for all tabs (meta.total is tab-wide, independent of page)
  const [activeResult, pastResult, returnResult] = await Promise.all([
    getOrders("active", "1", "1"),
    getOrders("past", "1", "1"),
    getOrders("returns", "1", "1"),
  ]);

  const counts: Record<string, number> = {
    active: activeResult.meta?.total ?? 0,
    past: pastResult.meta?.total ?? 0,
    returns: returnResult.meta?.total ?? 0,
  };

  return (
    <>
      {/* TITLE */}
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">My Orders</h2>
        <p className="text-sm mt-1 text-gray-400">
          Track and Manage Your Orders
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-3 flex-wrap mb-5 border-b border-zinc-200 pb-3">
        {tabs.map((t) => {
          const isActive = activeTab === t.tab;
          const count = counts[t.tab];

          return (
            <Link
              key={t.tab}
              href={`/profile/orders?tab=${t.tab}`}
              scroll={false}
              className={`px-4 py-2 text-lg font-bold border-b-2 transition-colors flex items-center gap-2 ${
                isActive
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {t.label}
              {count > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    isActive
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* OrdersArea: shows skeleton on click, reveals content once nav completes */}
      <OrdersArea>
        <Suspense key={`${activeTab}-${currentPage}`} fallback={<OrdersListSkeleton />}>
          <OrdersListContent tab={activeTab} page={currentPage} />
        </Suspense>
        <OrdersPagination
          total={counts[activeTab]}
          limit={6}
          currentPage={Number(currentPage)}
          activeTab={activeTab}
        />
      </OrdersArea>
    </>
  );
}
