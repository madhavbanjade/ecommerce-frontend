import { fetchAPI } from "@/src/utils/apiService";
import {
  CheckCircle2,
 
  Truck,
  Home,
  Clock,
} from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

const steps = [
  { key: "Pending", label: "Order Placed", icon: Clock },
  { key: "  ", label: "Processing", icon: CheckCircle2 },
  { key: "Shipped", label: "Shipped", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: Home },
];

const statusOrder = ["Pending", "Confirmed", "Shipped", "Delivered"];

export default async function TrackOrder({
  params,
}: {
  params: Promise<{ order?: string }>;
}) {
  const { orderId }: any = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join(";");

  const res = await fetchAPI({
    endPoint: `orders/${orderId}`,
    headers: {
      Cookie: cookieHeader,
    },
    revalidateSeconds: 0,
  });
  console.log("response", res);
  const order = res.data?.data;
  console.log("order", order);

  if (!order) {
    return (
      <div className="container py-20 text-center text-zinc-400 text-sm">
        Order not found
      </div>
    );
  }

  const currentStep = statusOrder.indexOf(order.status);
  const firstItem = order.items?.[0];

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container py-8 flex flex-col gap-8">
        {/* Header */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
            Order Tracking
          </p>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT — timeline + history */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Progress Steps */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
              <div className="relative flex justify-between">
                {/* connecting line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-zinc-100 z-0" />
                <div
                  className="absolute top-5 left-0 h-0.5 bg-zinc-900 z-0 transition-all duration-700"
                  style={{
                    width: `${(currentStep / (steps.length - 1)) * 100}%`,
                  }}
                />

                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const done = index <= currentStep;
                  const active = index === currentStep;
                  return (
                    <div
                      key={step.key}
                      className="relative z-10 flex flex-col items-center gap-2 flex-1"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          done
                            ? "bg-zinc-900 border-zinc-900 text-white"
                            : "bg-white border-zinc-200 text-zinc-300"
                        } ${active ? "ring-4 ring-zinc-200" : ""}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <p
                        className={`text-[10px] font-semibold uppercase tracking-wider text-center ${
                          done ? "text-zinc-900" : "text-zinc-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      {active && (
                        <span className="text-[9px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipment History */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
                Shipment History
              </p>
              <div className="flex flex-col gap-4">
                {statusOrder
                  .slice(0, currentStep + 1)
                  .reverse()
                  .map((status, index) => (
                    <div key={status} className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          index === 0 ? "bg-zinc-900" : "bg-zinc-300"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            index === 0 ? "text-zinc-900" : "text-zinc-400"
                          }`}
                        >
                          {status === "Pending" && "Order Placed"}
                          {status === "Confirmed" &&
                            "Order Confirmed & Processing"}
                          {status === "Shipped" && "Package Shipped"}
                          {status === "Delivered" && "Package Delivered"}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {new Date(order.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
                Shipping Address
              </p>
              <p className="text-sm font-medium text-zinc-900">
                {order.address || "—"}
              </p>
              <p className="text-sm text-zinc-500 mt-1">{order.phone || "—"}</p>
              {order.note && (
                <p className="text-xs text-zinc-400 mt-2 italic">
                  Note: "{order.note}"
                </p>
              )}
            </div>
          </div>

          {/* RIGHT — order summary + items */}
          <div className="flex flex-col gap-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
                Order Summary
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="text-zinc-900">Rs. {order.totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Delivery</span>
                  <span className="text-emerald-600">Free</span>
                </div>
                <div className="h-px bg-zinc-100 my-1" />
                <div className="flex justify-between font-bold">
                  <span className="text-zinc-900">Total</span>
                  <span className="text-zinc-900">Rs. {order.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Package Contents */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
                Package Contents
              </p>
              <div className="flex flex-col gap-3">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.image && (
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-zinc-100 shrink-0">
                        <img
                          src={`http://localhost:3333${firstItem.image}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-zinc-400">
                        Size: {item.size} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-zinc-900 shrink-0">
                      Rs. {item.totalPrice}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Back button */}
            <Link
              href="/orders"
              className="w-full text-center py-3 border border-zinc-200 text-zinc-600 text-sm rounded-xl hover:bg-zinc-50 transition-colors"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
