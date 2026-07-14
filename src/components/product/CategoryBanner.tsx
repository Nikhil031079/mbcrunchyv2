// MB Crunchy — Category Banner
import { motion } from "framer-motion";

interface CategoryBannerProps {
  name: string;
  description: string;
  emoji: string;
}

export default function CategoryBanner({ name, description, emoji }: CategoryBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-muted to-muted/30 border border-border/60 p-4 sm:p-5"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-border/40 text-3xl">
        {emoji}
      </div>
      <div>
        <h3 className="text-lg font-bold tracking-tight">{name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
