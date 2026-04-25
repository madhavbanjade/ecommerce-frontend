import OrderDetailModal from "@/src/components/ui/order-detail";
import { Order, OrderStatus } from "@/src/types";
import { fetchAPI } from "@/src/utils/apiService";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

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
};

const statusDot: Record<OrderStatus, string> = {
  Pending: "bg-yellow-500",
  Confirmed: "bg-blue-500",
  Shipped: "bg-purple-500",
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

  const res = await fetchAPI({
    endPoint: `orders?tab=${tab}`,
    headers: { Cookie: cookieHeader },
    revalidateSeconds: 0,
  });

  return res.data?.data ?? [];
}

// ---------------- PAGE ----------------
export default async function MyOrders({
  searchParams,
}: {
  searchParams: {
    tab?: string;
    search?: string;
    sort?: string;
  };
}) {
  const activeTab = searchParams?.tab ?? "active";
  const search = searchParams?.search ?? "";
  const sort = searchParams?.sort ?? "newest";

  let orders = await getOrders(activeTab);

  // ---------------- SEARCH FILTER ----------------
  if (search) {
    orders = orders.filter((order) =>
      order.items.some((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      ) || order.id.toString().includes(search)
    );
  }

  // ---------------- SORT ----------------
  if (sort === "newest") {
    orders = orders.sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  }

  if (sort === "oldest") {
    orders = orders.sort(
      (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)
    );
  }

  if (sort === "price_high") {
    orders = orders.sort((a, b) => b.totalPrice - a.totalPrice);
  }

  if (sort === "price_low") {
    orders = orders.sort((a, b) => a.totalPrice - b.totalPrice);
  }

  return (
    <>
      {/* TITLE */}
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">My Orders</h2>
        <p className="text-sm mt-1 text-gray-400">
          Track and Manage Your Orders
        </p>
      </div>

      {/* TOP BAR (Tabs + Search + Sort) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 border-b border-zinc-200 pb-3">

        {/* TABS */}
        <div className="flex gap-3 flex-wrap">
          {tabs.map((t) => {
            const isActive = activeTab === t.tab;

            return (
              <Link
                key={t.tab}
                href={`/orders?tab=${t.tab}&search=${search}&sort=${sort}`}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>

        {/* SEARCH + SORT */}
        <div className="flex gap-2 items-center">

          {/* SEARCH */}
          <form>
            <input
              name="search"
              defaultValue={search}
              placeholder="Search orders..."
              className="px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </form>

          {/* SORT */}
          <form>
            <select
              name="sort"
              defaultValue={sort}
              className="px-3 py-2 text-sm border border-zinc-300 rounded-lg"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_high">Price High</option>
              <option value="price_low">Price Low</option>
            </select>
          </form>

        </div>
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <div className="py-16 text-center text-sm text-zinc-400">
          No orders found.
        </div>
      ) : (
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
                      <p className="text-sm font-medium">
                        Rs. {order.totalPrice}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-400">Size</p>
                      <p className="text-sm font-medium">
                        {firstItem.size}
                      </p>
                    </div>
                  </div>

                  <OrderDetailModal order={order} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}