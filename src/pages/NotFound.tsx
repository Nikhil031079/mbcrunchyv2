// MB Crunchy — 404 Page
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex items-center justify-center"
    >
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="inline-block border-2 border-black bg-primary px-6 py-3">
          <span className="text-6xl font-black text-primary-foreground">404</span>
        </div>
        <h1 className="mt-6 text-2xl font-black uppercase tracking-tight">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Oops! This page seems to have wandered off. Let's get you back to something delicious.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 border-2 border-black bg-secondary px-6 py-3 text-sm font-bold uppercase tracking-wider text-secondary-foreground hover:bg-secondary/90 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}
