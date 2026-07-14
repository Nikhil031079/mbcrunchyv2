// MB Crunchy — Admin Blog Management
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";

export default function AdminBlogs() {
  const [filter, setFilter] = useState<string>("");
  const blogs = useQuery(api.content.listBlogs, {});
  const remove = useMutation(api.content.removeBlog);

  const filtered = (blogs ?? []).filter(b => !filter || b.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blogs</h1>
          <p className="text-sm text-muted-foreground">{blogs?.length ?? 0} articles</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm">
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      <div className="flex gap-2">
        {["", "draft", "published"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {s || "All"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(blog => (
          <div key={blog._id} className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted text-2xl">📝</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{blog.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {blog.slug} • {blog.author ?? "Unknown"} • {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "—"}
              </p>
              {blog.excerpt && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{blog.excerpt}</p>}
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${blog.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {blog.status}
              </span>
              <button className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Eye className="h-4 w-4" /></button>
              <button className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
              <button onClick={() => remove({ id: blog._id })} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">No blog posts found.</div>
        )}
      </div>
    </div>
  );
}
