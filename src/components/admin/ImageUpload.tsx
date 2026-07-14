// MB Crunchy — Reusable Image Upload Component
// Supports: single image, gallery (multiple images), drag & drop, preview, remove, reorder
import { useState, useRef, useCallback } from "react";
import { Upload, X, GripVertical, ImageIcon, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  maxSizeMB = 5,
  accept = "image/jpeg,image/png,image/webp",
  label = "Upload Images",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const images = multiple
    ? (Array.isArray(value) ? value : [])
    : (typeof value === "string" && value ? [value] : []);

  const handleFiles = useCallback((files: FileList | File[]) => {
    setError(null);
    const fileArray = Array.from(files);
    const maxSize = maxSizeMB * 1024 * 1024;

    for (const file of fileArray) {
      if (!accept.split(",").some(t => file.type.match(t.replace("*", "").replace("/", "\\/")))) {
        setError(`Invalid file type: ${file.type}. Accepted: ${accept}`);
        return;
      }
      if (file.size > maxSize) {
        setError(`File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max ${maxSizeMB}MB)`);
        return;
      }
    }

    const remaining = maxFiles - images.length;
    if (fileArray.length > remaining) {
      setError(`Maximum ${maxFiles} files allowed (${remaining} remaining)`);
      return;
    }

    const readers = fileArray.map(file => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    }));

    Promise.all(readers).then((results) => {
      if (multiple) {
        onChange([...images, ...results]);
      } else {
        onChange(results[0]);
      }
    });
  }, [images, multiple, maxFiles, maxSizeMB, accept, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleRemove = (index: number) => {
    if (multiple) {
      const next = images.filter((_, i) => i !== index);
      onChange(next);
    } else {
      onChange("");
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (!multiple) return;
    const next = [...images];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
  };

  const handleClickUpload = () => inputRef.current?.click();

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase text-muted-foreground">{label}</label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={handleClickUpload}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/20"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm font-medium text-muted-foreground">
          {dragOver ? "Drop files here" : `Drag & drop or click to upload`}
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">
          {accept.replace(/image\//g, "").toUpperCase()} • Max {maxSizeMB}MB each
          {multiple && ` • Up to ${maxFiles} files`}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          <AlertCircle className="h-3 w-3 shrink-0" /> {error}
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {images.map((src, index) => (
            <div key={index} className="group relative aspect-square rounded-xl border border-border/60 bg-muted/20 overflow-hidden">
              {src.startsWith("data:") || src.startsWith("http") ? (
                <img src={src} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                </div>
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 group-hover:bg-black/40 transition-all">
                {multiple && images.length > 1 && (
                  <>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleReorder(index, index - 1); }}
                        className="rounded-lg bg-white/90 p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <GripVertical className="h-3 w-3 rotate-90" />
                      </button>
                    )}
                  </>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                  className="rounded-lg bg-red-500/90 p-1 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              {/* Index badge */}
              {multiple && (
                <span className="absolute top-1 left-1 rounded-md bg-black/50 px-1.5 py-0.5 text-[9px] font-medium text-white">
                  {index + 1}
                </span>
              )}
            </div>
          ))}
          {/* Add more button */}
          {multiple && images.length < maxFiles && (
            <button
              type="button"
              onClick={handleClickUpload}
              className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 hover:bg-muted/20 transition-all"
            >
              <Upload className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
        </div>
      )}

      {/* Count */}
      {multiple && images.length > 0 && (
        <p className="text-[10px] text-muted-foreground">{images.length} / {maxFiles} files</p>
      )}
    </div>
  );
}
