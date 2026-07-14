// MB Crunchy — Reusable Admin Stats Card
import { motion } from "framer-motion";

interface AdminStatsCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: { value: string; positive: boolean };
  delay?: number;
}

export default function AdminStatsCard({ label, value, icon: Icon, color, trend, delay = 0 }: AdminStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm"
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} mb-3`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <div className="flex items-center gap-2 mt-0.5">
        <p className="text-xs text-muted-foreground">{label}</p>
        {trend && (
          <span className={`text-[10px] font-medium ${trend.positive ? "text-emerald-600" : "text-red-600"}`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
    </motion.div>
  );
}
