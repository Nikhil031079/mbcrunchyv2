import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Eye, ChevronDown, ChevronUp, MessageSquare, Settings2, MapPin, Phone, User } from "lucide-react";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700", accepted: "bg-blue-50 text-blue-700",
  preparing: "bg-purple-50 text-purple-700", ready: "bg-cyan-50 text-cyan-700",
  "out-for-delivery": "bg-indigo-50 text-indigo-700", completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

const statuses = ["pending", "accepted", "preparing", "ready", "out-for-delivery", "completed", "cancelled"];

function OrderRow({ order }: { order: any }) {
  const [expanded, setExpanded] = useState(false);
  const updateStatus = useMutation(api.orders.updateStatus);

  return (
    <>
      <tr className="border-b border-border/40 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <td className="px-4 py-3">
          <p className="font-medium text-xs">{order.orderNumber}</p>
          <p className="text-[10px] text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
        </td>
        <td className="px-4 py-3">
          <p className="font-medium text-xs">{order.customerName ?? "Guest"}</p>
          <p className="text-[10px] text-muted-foreground">{order.customerPhone ?? ""}</p>
        </td>
        <td className="px-4 py-3">
          <p className="text-xs">{order.items.length} items</p>
          <p className="text-[10px] text-muted-foreground capitalize">{order.orderType}</p>
        </td>
        <td className="px-4 py-3 font-semibold">₹{order.total}</td>
        <td className="px-4 py-3">
          <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase ${statusStyles[order.status] ?? ""}`}>{order.status}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-[10px] text-muted-foreground capitalize">{order.paymentMethod}</span>
          {order.paymentStatus && <span className="text-[9px] ml-1 text-muted-foreground">({order.paymentStatus})</span>}
        </td>
        <td className="px-4 py-3 text-right">
          {expanded ? <ChevronUp className="h-4 w-4 inline" /> : <ChevronDown className="h-4 w-4 inline" />}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-muted/10">
          <td colSpan={7} className="px-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Customer Info */}
              <div className="rounded-xl bg-white border border-border/60 p-3">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-2">Customer</p>
                <div className="space-y-1 text-xs">
                  <p className="flex items-center gap-1.5"><User className="h-3 w-3 text-muted-foreground" /> {order.customerName || "Guest"}</p>
                  {order.customerPhone && <p className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-muted-foreground" /> {order.customerPhone}</p>}
                  {order.customerEmail && <p>{order.customerEmail}</p>}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="rounded-xl bg-white border border-border/60 p-3">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-2">Delivery</p>
                <div className="space-y-1 text-xs">
                  <p className="capitalize">{order.orderType}</p>
                  {order.deliveryAddress && <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-muted-foreground" /> {order.deliveryAddress}</p>}
                  {order.deliveryCity && <p className="text-muted-foreground">{order.deliveryCity} - {order.deliveryPincode}</p>}
                </div>
              </div>

              {/* Items */}
              <div className="md:col-span-2 rounded-xl bg-white border border-border/60 p-3">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-2">Items</p>
                <div className="space-y-2">
                  {(order.items || []).map((item: any, idx: number) => {
                    const hasMods = item.name?.includes("(");
                    const baseName = hasMods ? item.name.split(" (")[0] : item.name;
                    const modPart = hasMods ? item.name.match(/\(([^)]+)\)/)?.[1] || "" : "";

                    return (
                      <div key={idx} className="flex items-start justify-between text-xs border-b border-border/30 pb-2 last:border-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{baseName}</span>
                            <span className="text-muted-foreground">x{item.quantity}</span>
                          </div>
                          {modPart && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Settings2 className="h-2.5 w-2.5 text-primary" />
                              <span className="text-[10px] text-primary">{modPart}</span>
                            </div>
                          )}
                        </div>
                        <span className="font-medium shrink-0">₹{item.price * item.quantity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Note */}
              {order.note && (
                <div className="md:col-span-2 rounded-xl bg-white border border-border/60 p-3">
                  <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Order Notes</p>
                  <p className="text-xs italic flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {order.note}</p>
                </div>
              )}

              {/* Status Actions */}
              <div className="md:col-span-2 flex gap-2">
                {statuses.slice(0, -1).map((s, i) => (
                  order.status === s && (
                    <button key={s} onClick={() => updateStatus({ id: order._id, status: statuses[i + 1] as any })}
                      className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary/90 transition-colors">
                      Move to {statuses[i + 1]}
                    </button>
                  )
                ))}
                {order.status !== "cancelled" && order.status !== "completed" && (
                  <button onClick={() => updateStatus({ id: order._id, status: "cancelled" })}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-[10px] font-semibold text-red-600 hover:bg-red-100 transition-colors">
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminOrders() {
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const orders = useQuery(api.orders.list

[FILE_TOO_LARGE]: The combined read_files output exceeded the 100,000 character hard limit. This file was truncated after 7,304 characters. Read it separately or use code_search for the relevant section.