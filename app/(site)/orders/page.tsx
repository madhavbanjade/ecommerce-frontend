import { Order, OrderStatus } from "@/src/types";
import { fetchAPI } from "@/src/utils/apiService";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";




// ---------------- STATUS UI ----------------
const statusStyles: Record<OrderStatus, string> = {
  "Confirmed": "bg-blue-50 text-blue-700",
  Shipped: "bg-zinc-100 text-zinc-600",
  Delivered: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-600",
  Pending: "bg-yellow-50 text-yellow-700",
};

const statusDot: Record<OrderStatus, string> = {
  "Confirmed": "bg-blue-500",
  Shipped: "bg-yellow-400",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
  Pending: "bg-yellow-500",
};

// ---------------- FETCH ----------------

async function getOrders(tab: string): Promise<Order[]> {

    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join(";");
  try {
    const res = await fetchAPI({
      endPoint: `orders?tab=${tab}`,
      headers:{
        Cookie: cookieHeader,
      },
      revalidateSeconds:0,
    });

    console.log("res", res)
    const orders = res.data?.data;
    console.log("order", orders)

    if (!orders) {
      return [];
    }

    return orders;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

// ---------------- PAGE ----------------

export default async function MyOrders({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const activeTab = searchParams.tab ?? "active";
  const orders = await getOrders(activeTab);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-sm text-zinc-400">No orders found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {orders.map((order) => {
            const firstItem = order.items[0];
            const totalUnits = order.items.reduce(
              (acc, item) => acc + item.quantity,
              0
            );

            return (
              <div
                key={order.id}
                className="bg-white border border-zinc-200 rounded-xl p-3 flex gap-5"
              >
                {/* IMAGE */}
                <div className="w-28 h-32 rounded-lg overflow-hidden border bg-zinc-50 shrink-0">
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
                <div className="flex-1">
                  {/* TOP */}
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs text-zinc-400 tracking-wide">
                      Order ID: #{order.id}
                    </p>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${
                        statusStyles[order.status]
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          statusDot[order.status]
                        }`}
                      />
                      {order.status}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {firstItem?.name}
                   
                  </h3>

                  {/* DATE */}
                  <p className="text-sm text-zinc-400 mb-4">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  {/* META */}
                  <div className="flex gap-8 mb-5">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">
                        Items
                      </p>
                      <p className="text-sm font-medium text-zinc-900">
                        {totalUnits}{" "}
                        {totalUnits === 1 ? "Unit" : "Units"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">
                        Total
                      </p>
                      <p className="text-sm font-medium text-zinc-900">
                        Rs. {order.totalPrice}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">
                        Size
                      </p>
                      <p className="text-sm font-medium text-zinc-900">
                        {firstItem.size}
                      </p>
                    </div>
                   
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3">
                    <Link
                      href={`/orders/${order.id}/track`}
                      className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      Track order
                    </Link>

                    <Link
                      href={`/orders/${order.id}`}
                      className="px-5 py-2.5 border border-zinc-200 text-zinc-600 text-sm rounded-lg hover:bg-zinc-50 transition-colors"
                    >
                      View details
                    </Link>
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