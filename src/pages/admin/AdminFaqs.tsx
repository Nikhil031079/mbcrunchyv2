// MB Crunchy — Admin FAQs Management
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function AdminFaqs() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const faqs = useQuery(api.content.listFaqs, {});
  const remove = useMutation(api.content.removeFaq);

  const toggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpanded(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">FAQs</h1>
          <p className="text-sm text-muted-foreground">{faqs?.length ?? 0} questions</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm">
          <Plus className="h-4 w-4" /> Add FAQ
        </button>
      </div>

      <div className="space-y-2">
        {(faqs ?? []).map(faq => (
          <div key={faq._id} className="rounded-2xl bg-white border border-border/60 shadow-sm overflow-hidden">
            <button onClick={() => toggle(faq._id)} className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">❓</span>
                <span className="font-medium text-sm">{faq.question}</span>
              </div>
              <div className="flex items-center gap-2">
                {faq.category && <span className="rounded-lg bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{faq.category}</span>}
                <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${faq.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {faq.status}
                </span>
                <button className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
                <button onClick={() => remove({ id: faq._id })} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                {expanded.has(faq._id) ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </button>
            {expanded.has(faq._id) && (
              <div className="border-t border-border/40 px-4 py-3 bg-muted/10">
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
        {(faqs ?? []).length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">No FAQs yet.</div>
        )}
      </div>
    </div>
  );
}
