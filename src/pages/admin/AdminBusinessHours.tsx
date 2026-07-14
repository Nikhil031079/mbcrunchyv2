// MB Crunchy — Admin Business Hours
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Save, Clock } from "lucide-react";
import { CardSkeleton } from "@/components/admin/LoadingSkeleton";
import { toast } from "sonner";

const DAYS = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
] as const;

interface HourEntry {
  day: typeof DAYS[number];
  open: string;
  close: string;
  isOpen: boolean;
}

export default function AdminBusinessHours() {
  const hours = useQuery(api.settings.listBusinessHours);
  const update = useMutation(api.settings.updateBusinessHours);
  const [form, setForm] = useState<HourEntry[] | null>(null);
  const [saving, setSaving] = useState(false);

  const data = form ?? (hours?.length ? hours.map(h => ({
    day: h.day as typeof DAYS[number],
    open: h.open ?? "09:00",
    close: h.close ?? "22:00",
    isOpen: h.isOpen,
  })) : DAYS.map(d => ({ day: d, open: "09:00", close: "22:00", isOpen: d !== "sunday" })));

  const handleSave = async () => {
    setSaving(true);
    try {
      await update({ hours: data });
      toast.success("Business hours saved");
    } catch (err) {
      toast.error("Failed to save hours");
    }
    setSaving(false);
  };

  if (!hours && form === null) return <CardSkeleton />;

  const toggleDay = (day: typeof DAYS[number]) => {
    setForm(data.map(h => h.day === day ? { ...h, isOpen: !h.isOpen } : h));
  };

  const updateTime = (day: typeof DAYS[number], field: "open" | "close", value: string) => {
    setForm(data.map(h => h.day === day ? { ...h, [field]: value } : h));
  };

  const dayLabel = (d: string) => d.charAt(0).toUpperCase() + d.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Business Hours</h1>
          <p className="text-sm text-muted-foreground">Set your store operating hours</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Weekly Hours</h2>
        <div className="space-y-2">
          {DAYS.map(day => {
            const entry = data.find(h => h.day === day)!;
            return (
              <div
                key={day}
                className={`flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl p-4 transition-colors ${
                  entry.isOpen ? "bg-white border border-border/60" : "bg-muted/30 border border-border/30"
                }`}
              >
                <div className="flex items-center gap-3 sm:w-40">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={entry.isOpen}
                      onChange={() => toggleDay(day)}
                      className="rounded border-border"
                    />
                    <span className={`text-sm font-medium ${!entry.isOpen ? "text-muted-foreground line-through" : ""}`}>
                      {dayLabel(day)}
                    </span>
                  </label>
                </div>
                {entry.isOpen ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={entry.open}
                      onChange={e => updateTime(day, "open", e.target.value)}
                      className="rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <span className="text-muted-foreground text-sm">to</span>
                    <input
                      type="time"
                      value={entry.close}
                      onChange={e => updateTime(day, "close", e.target.value)}
                      className="rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">Closed</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
