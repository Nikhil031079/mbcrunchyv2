// MB Crunchy — Reusable Loading Skeleton
interface LoadingSkeletonProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, cols = 5 }: LoadingSkeletonProps) {
  return (
    <div className="rounded-2xl bg-white border border-border/60 overflow-hidden shadow-sm">
      <div className="border-b border-border/60 bg-muted/20 px-4 py-3">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded animate-pulse flex-1" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="border-b border-border/40 px-4 py-4">
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="h-4 bg-muted/50 rounded animate-pulse flex-1" style={{ animationDelay: `${r * 0.1}s` }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
          <div className="h-10 w-10 bg-muted rounded-xl animate-pulse mb-3" />
          <div className="h-6 w-20 bg-muted rounded animate-pulse mb-2" />
          <div className="h-3 w-16 bg-muted/50 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
