// MB Crunchy — Admin Reviews Management
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Star, CheckCircle, XCircle, EyeOff, Pin } from "lucide-react";

export default function AdminReviews() {
  const [filter, setFilter] = useState<string>("");
  const reviews = useQuery(api.reviews.list, {});
  const moderate = useMutation(api.reviews.moderate);
  const remove = useMutation(api.reviews.remove);

  const filtered = (reviews ?? []).filter(r => !filter || r.status === filter);
  const stats = {
    total: reviews?.length ?? 0,
    pending: reviews?.filter(r => r.status === "pending").length ?? 0,
    approved: reviews?.filter(r => r.status === "approved").length ?? 0,
    rejected: reviews?.filter(r => r.status === "rejected").length ?? 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
          <p className="text-sm text-muted-foreground">{stats.total} total reviews</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Pending", value: stats.pending, color: "bg-amber-50 text-amber-600" },
          { label: "Approved", value: stats.approved, color: "bg-emerald-50 text-emerald-600" },
          { label: "Rejected", value: stats.rejected, color: "bg-red-50 text-red-600" },
          { label: "Total", value: stats.total, color: "bg-blue-50 text-blue-600" },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-white border border-border/60 p-3 text-center shadow-sm">
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {["", "pending", "approved", "rejected", "hidden"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {s || "All"}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {filtered.map(review => (
          <div key={review._id} className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                  {review.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm">{review.customerName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-accent text-accent" : "text-muted-foreground/20"}`} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold capitalize ${
                review.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                review.status === "rejected" ? "bg-red-50 text-red-700" :
                review.status === "hidden" ? "bg-gray-50 text-gray-700" : "bg-amber-50 text-amber-700"
              }`}>{review.status}</span>
            </div>
            <p className="mt-3 text-sm text-muted-

[FILE_TOO_LARGE]: The combined read_files output exceeded the 100,000 character hard limit. This file was truncated after 3,966 characters. Read it separately or use code_search for the relevant section.