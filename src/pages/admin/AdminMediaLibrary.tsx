// MB Crunchy — Centralized Media Library Admin Page
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Search, X, ImageIcon, Trash2, Download, Copy,
  Edit, AlertTriangle, Loader2, Check
} from "lucide-react";
import { toast } from "sonner";

export default function AdminMediaLibrary() {
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState<string>("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [previewItem, setPreviewItem] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
  const [deleteUsages, setDeleteUsages] = useState<any[]>([]);
  const [renameItem, setRenameItem] = useState<any>(null);
  const [renameValue, setRenameValue] = useState("");

  const allMedia = useQuery(api.media.listMedia, {
    folder: activeFolder || undefined,
    search: search || undefined,
  });
  const folders = useQuery(api.media.listFolders);
  const checkUsage = useMutation(api.media.checkUsage);
  const removeMedia = useMutation(api.media.removeMedia);
  const updateMedia = useMutation(api.media.updateMedia);

  const [checkingUsage, setCheckingUsage] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savingRename, setSavingRename] = useState(false);

  const items = allMedia ?? [];
  const totalSize = items.reduce((s, m) => s + (m.fileSize || 0), 0);

  const formatSize = (bytes?: number) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDeleteCheck = async (item: any) => {
    setCheckingUsage(true);
    setDeleteConfirm(item);
    try {
      const usage = await checkUsage({ url: item.url });
      setDeleteUsages(usage);
    } catch (e: any) {
      toast.error(e.message);
      setDeleteUsages([]);
    }
    setCheckingUsage(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await removeMedia({ id: deleteConfirm._id, storageId: deleteConfirm.storageId });
      toast.success("Media deleted");
      setDeleteConfirm(null);
      setDeleteUsages([]);
    } catch (e: any) {
      toast.error(e.message);
    }
    setDeleting(false);
  };

  const handleRename = async () => {
    if (!renameItem || !renameValue.trim()) return;
    setSavingRename(true);
    try {
      await updateMedia({ id: renameItem._id, name: renameValue.trim() });
      toast.success("Renamed");
      setRenameItem(null);
      setRenameValue("");
    } catch (e: any) {
      toast.error(e.message);
    }
    setSavingRename(false);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const handleBulkDelete = async () => {
    const toDelete = items.filter(i => selected.has(i._id));
    for (const item of toDelete) {
      try { await removeMedia({ id: item._id, storageId: item.storageId }); } catch { }
    }
    toast.success(`${selected.size} media deleted`);
    setSelected(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} files • {formatSize(totalSize)} total
          </p>
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{selected.size} selected</span>
            <button onClick={handleBulkDelete} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors">Delete Selected</button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search media..." className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setActiveFolder("")} className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${!activeFolder ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>All</button>
          {(folders ?? []).map(f => (
            <button key={f} onClick={() => setActiveFolder(f)} className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors ${activeFolder === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{f}</button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-border/60">
          <ImageIcon className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <p className="text-sm font-medium text-muted-foreground">No media files yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Upload images from any admin page to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map((media) => (
            <div key={media._id} className={`group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${selected.has(media._id) ? "border-primary ring-2 ring-primary/20" : "border-border/60 hover:border-primary/30"}`}
              onClick={() => toggleSelect(media._id)}>
              <div className="aspect-square bg-muted/20">
                <img src={media.url} alt={media.name} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 group-hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100">
                <button onClick={(e) => { e.stopPropagation(); setPreviewItem(media); }} className="rounded-lg bg-white/90 p-1.5 text-muted-foreground hover:text-foreground" title="Preview"><ImageIcon className="h-3.5 w-3.5" /></button>
                <button onClick={(e) => { e.stopPropagation(); setRenameItem(media); setRenameValue(media.name); }} className="rounded-lg bg-white/90 p-1.5 text-muted-foreground hover:text-foreground" title="Rename"><Edit className="h-3.5 w-3.5" /></button>
                <button onClick={(e) => { e.stopPropagation(); handleCopyUrl(media.url); }} className="rounded-lg bg-white/90 p-1.5 text-muted-foreground hover:text-foreground" title="Copy URL"><Copy className="h-3.5 w-3.5" /></button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteCheck(media); }} className="rounded-lg bg-red-500/90 p-1.5 text-white hover:bg-red-600" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="absolute top-1 left-1">
                <div className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-all ${selected.has(media._id) ? "bg-primary border-primary" : "border-white/70 bg-black/20"}`}>
                  {selected.has(media._id) && <Check className="h-3 w-3 text-white" />}
                </div>
              </div>
              <div className="px-2 py-1.5 bg-white border-t border-border/40">
                <p className="text-[10px] font-medium truncate">{media.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[8px] text-muted-foreground">{formatSize(media.fileSize)}</span>
                  {media.width && media.height && <span className="text-[8px] text-muted-foreground">• {media.width}×{media.height}</span>}
                </div>
                {media.folder && <span className="inline-block mt-0.5 rounded bg-muted/60 px-1 text-[7px] text-muted-foreground uppercase tracking-wider">{media.folder}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setPreviewItem(null)}>
          <div className="max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-border/60">
              <div className="bg-muted/30 flex items-center justify-center p-4 max-h-[60vh] overflow-hidden">
                <img src={previewItem.url} alt={previewItem.name} className="max-h-[55vh] object-contain" />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-semibold">{previewItem.name}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                  <div><span className="font-medium">File:</span> {previewItem.originalFilename || "—"}</div>
                  <div><span className="font-medium">Size:</span> {formatSize(previewItem.fileSize)}</div>
                  {previewItem.width && <div><span className="font-medium">Dimensions:</span> {previewItem.width} × {previewItem.height}</div>}
                  {previewItem.mimeType && <div><span className="font-medium">Type:</span> {previewItem.mimeType}</div>}
                  <div><span className="font-medium">Folder:</span> {previewItem.folder || "—"}</div>
                  <div><span className="font-medium">Used:</span> {previewItem.usageCount ?? 0} times</div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => handleCopyUrl(previewItem.url)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"><Copy className="h-3 w-3" /> Copy URL</button>
                  <a href={previewItem.url} download target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"><Download className="h-3 w-3" /> Download</a>
                </div>
                <button onClick={() => setPreviewItem(null)} className="mt-2 w-full rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { if (!deleting) { setDeleteConfirm(null); setDeleteUsages([]); }}}>
          <div className="bg-white rounded-2xl shadow-xl border border-border/60 w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50"><AlertTriangle className="h-5 w-5 text-red-500" /></div>
              <div><h3 className="font-semibold">Delete Media</h3><p className="text-sm text-muted-foreground">{deleteConfirm.name}</p></div>
            </div>
            {checkingUsage ? (
              <div className="flex items-center justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <>
                {deleteUsages.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-semibold text-red-600 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Used in {deleteUsages.length} place(s):</p>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {deleteUsages.map((u, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground bg-amber-50 rounded-lg px-3 py-1.5">
                          <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[9px] font-medium">{u.entityType}</span> {u.name}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Deleting may break these references.</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">Not used anywhere. Safe to delete.</p>
                )}
                <div className="flex items-center justify-end gap-3 mt-4">
                  <button onClick={() => { setDeleteConfirm(null); setDeleteUsages([]); }} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
                  <button onClick={handleDeleteConfirm} disabled={deleting}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50">
                    {deleting && <Loader2 className="h-4 w-4 animate-spin" />} Delete Permanently
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { if (!savingRename) setRenameItem(null); }}>
          <div className="bg-white rounded-2xl shadow-xl border border-border/60 w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold mb-1">Rename Media</h3>
            <p className="text-xs text-muted-foreground mb-4">Current: {renameItem.name}</p>
            <input value={renameValue} onChange={e => setRenameValue(e.target.value)} placeholder="New name" autoFocus
              onKeyDown={e => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setRenameItem(null); }}
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={() => setRenameItem(null)} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
              <button onClick={handleRename} disabled={savingRename || !renameValue.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {savingRename && <Loader2 className="h-4 w-4 animate-spin" />} Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
