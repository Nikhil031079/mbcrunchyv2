// MB Crunchy — Blog Page (Convex-Powered)
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Newspaper, Calendar, User, Tag, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

export default function Blog() {
  const blogs = useQuery(api.content.listBlogs, { status: "published" });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const published = (blogs ?? []).filter(b => b.status === "published");
  const categories = [...new Set(published.flatMap(b => b.tags ?? []))];
  const filtered = filter ? published.filter(b => (b.tags ?? []).includes(filter)) : published;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
          <Newspaper className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Blog</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Stories, recipes, and tips from the MB Crunchy kitchen.
          Discover the art of homemade food and healthy living.
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button onClick={() => setFilter("")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${!filter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            All
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${filter === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Loading state */}
      {!blogs && (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      )}

      {/* No posts yet */}
      {blogs && published.length === 0 && (
        <div className="text-center py-20">
          <span className="text-5xl">📝</span>
          <p className="mt-4 text-sm text-muted-foreground">No blog posts yet. Stay tuned for recipes and stories!</p>
        </div>
      )}

      {/* Blog grid */}
      {filtered.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => (
            <motion.article key={post._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-white border border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-all group">
              {post.image && (
                <div className="h-48 bg-muted overflow-hidden">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-2">
                  {post.author && (
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>
                  )}
                  {post.createdAt && (
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.createdAt).toLocaleDateString()}</span>
                  )}
                </div>
                <h2 className="font-bold text-base leading-snug mb-2 line-clamp-2">{post.title}</h2>
                {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map(tag => (
                      <span key={tag} className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase">{tag}</span>
                    ))}
                  </div>
                )}
                {/* Expand post */}
                <button onClick={() => setExpanded(expanded === post._id ? null : post._id)}
                  className="mt-3 text-xs text-primary hover:underline inline-flex items-center gap-1">
                  {expanded === post._id ? "Show less" : "Read more"}
                  {expanded === post._id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
                {expanded === post._id && post.content && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 border-t border-border/40 pt-3">
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{post.content}</div>
                  </motion.div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {filtered.length === 0 && published.length > 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No posts found in this category.</p>
          <button onClick={() => setFilter("")} className="mt-2 text-sm text-primary hover:underline">Clear filter</button>
        </div>
      )}
    </div>
  );
}
