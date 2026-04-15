import OrderDetailModal from "@/src/components/ui/order-detail";
import { Order, OrderStatus } from "@/src/types";
import { fetchAPI } from "@/src/utils/apiService";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

// ---------------- STATUS UI ----------------
const statusStyles: Record<OrderStatus, string> = {
  Pending:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped:   "bg-purple-50 text-purple-700 border-purple-200",
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const statusDot: Record<OrderStatus, string> = {
  Pending:   "bg-yellow-500",
  Confirmed: "bg-blue-500",
  Shipped:   "bg-purple-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
};

// ---------------- FETCH ----------------
async function getOrders(tab: string): Promise<Order[]> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");
  try {
    const res = await fetchAPI({
      endPoint: `orders?tab=${tab}`,
      headers: { Cookie: cookieHeader },
      revalidateSeconds: 0,
    });
    return res.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

// ---------------- PAGE ----------------
export default async function MyOrders({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab ?? "active";
  const orders = await getOrders(activeTab);

  return (
    <>
      <h2 className="text-lg sm:text-xl font-semibold mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-zinc-400">No orders found.</p>
        </div>
      ) : (
        // ── grid: 1 col mobile, 2 col lg+ ──
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {orders.map((order) => {
            const firstItem = order.items[0];
            const totalUnits = order.items.reduce(
              (acc, item) => acc + item.quantity,
              0
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

                  {/* TOP — order id + status badge */}
                  <div className="flex flex-wrap justify-between items-start gap-1 mb-1">
                    <p className="text-xs text-zinc-400 tracking-wide truncate">
                      #{order.id}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0 ${
                        statusStyles[order.status]
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[order.status]}`} />
                      {order.status}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="text-sm sm:text-base font-semibold text-zinc-900 truncate">
                    {firstItem?.name}
                  </h3>

                  {/* DATE */}
                  <p className="text-xs sm:text-sm text-zinc-400 mb-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  {/* META */}
                  <div className="flex gap-4 sm:gap-8 mb-3 sm:mb-5">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest mb-0.5">
                        Items
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-zinc-900">
                        {totalUnits} {totalUnits === 1 ? "Unit" : "Units"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest mb-0.5">
                        Total
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-zinc-900">
                        Rs. {order.totalPrice}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest mb-0.5">
                        Size
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-zinc-900">
                        {firstItem.size}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex-1 sm:flex-none text-center px-3 sm:px-5 py-2 bg-zinc-900 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      Track order
                    </Link>
                   <OrderDetailModal order={order} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}