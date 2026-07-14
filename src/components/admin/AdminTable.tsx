// MB Crunchy — Reusable Admin Data Table
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  searchPlaceholder?: string;
  onSearch?: (q: string) => void;
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
}

export default function AdminTable<T extends Record<string, any>>({
  columns, data, keyField, searchPlaceholder = "Search...",
  onSearch, onRowClick, loading, emptyMessage = "No data found.",
  pageSize = 15,
}: AdminTableProps<T>) {
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [localSearch, setLocalSearch] = useState("");

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey], bVal = b[sortKey];
    if (typeof aVal === "string") return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    return sortDir === "asc" ? (aVal - bVal) : (bVal - aVal);
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSearch = (q: string) => {
    setLocalSearch(q);
    setPage(0);
    onSearch?.(q);
  };

  return (
    <div className="space-y-4">
      {onSearch && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={localSearch} onChange={e => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
      )}

      <div className="rounded-2xl bg-white border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20">
                {columns.map(col => (
                  <th key={col.key} className={`px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase ${col.sortable ? "cursor-pointer select-none hover:text-foreground" : ""} ${col.className ?? ""}`}
                    onClick={() => col.sortable && handleSort(col.key)}>
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && sortKey === col.key && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDir === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">Loading...</td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground">{emptyMessage}</td></tr>
              ) : (
                paged.map((item) => (
                  <tr key={item[keyField]} onClick={() => onRowClick?.(item)}
                    className={`border-b border-border/40 hover:bg-muted/20 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}>
                    {columns.map(col => (
                      <td key={col.key} className={`px-4 py-3 ${col.className ?? ""}`}>
                        {col.render ? col.render(item) : item[col.key] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">Page {page + 1} of {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors disabled:opacity-40">
              <ChevronLeft className="h-3 w-3" /> Prev
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors disabled:opacity-40">
              Next <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
