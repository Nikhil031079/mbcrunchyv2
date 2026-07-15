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
        <td className="px-4 py-3 font-semibold">₹{order.total}

[FILE_TOO_LARGE]: The combined read_files output exceeded the 100,000 character hard limit. This file was truncated after 1,745 characters. Read it separately or use code_search for the relevant section.