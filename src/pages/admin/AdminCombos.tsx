import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminCombos() {
  const combos = useQuery(api.combos.listCombos, {});
  const remove = useMutation(api.combos.removeCombo);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Combos</h1>
          <p className="text-sm text-muted-foreground">{combos?.length ?? 0} combos</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
          <Plus className="h-4 w-4" /> Create Combo
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(combos ?? []).map(combo => (
          <div key={combo._id} className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🎁</span>
              <div className="flex gap-1">
                <button className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
                <button onClick={() => remove({ id: combo._id })} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <h3 className="font-semibold">{combo.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{combo.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="font-bold">₹{combo.comboPrice}</span>
                <span className="ml-2 text-xs text-muted-foreground line-through">₹{combo.mrp}</span>
                <span className="ml-2 text-xs text-emerald-600 font-medium">Save ₹{combo.savings}</span>
              </div>
              <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${combo.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                {combo.status}
              </span>
            </div>
          </div>
        ))}
        {(combos ?? []).length === 0 && (
          <div className="col-span-full text-center py-12 text-sm text-muted-foreground">No combos created yet.</div>
        )}
      </div>
    </div>
  );
}
