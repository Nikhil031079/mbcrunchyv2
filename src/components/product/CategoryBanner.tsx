// MB Crunchy — Category Banner (Convex-Ready)
import { motion } from "framer-motion";

interface CategoryBannerProps {
  name: string;
  description: string;
  emoji: string;
  image?: string | null;
  banner?: string | null;
}

export default function CategoryBanner({ name, description, emoji, image, banner }: CategoryBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-muted to-muted/30 border border-border/60 p-4 sm:p-5 overflow-hidden relative"
    >
      {(banner || image) && (
        <div className="absolute inset-0 opacity-10">
          <img src={banner || image!} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-border/40 text-3xl relative">
        {image ? <img src={image} alt={name} className="h-full w-full rounded-xl object-cover" /> : emoji}
      </div>
      <div className="relative">
        <h3 className="text-lg font-bold tracking-tight">{name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
