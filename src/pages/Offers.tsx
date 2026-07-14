// MB Crunchy — Offers Page (Convex-Powered)
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Tags, Percent, Gift, Zap, Calendar, Clock, Loader2 } from "lucide-react";
import { Link } from "react-router";

export default function Offers() {
  const offers = useQuery(api.offers.list, {});

  const activeOffers = (offers ?? []).filter(o => o.isActive && o.validUntil > Date.now()).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent mx-auto mb-4">
          <Tags className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Offers & Deals</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Exciting discounts and combo offers on your favorite products.
          Save more with MB Crunchy deals.
        </p>
      </div>

      {!offers && (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      )}

      {offers && activeOffers.length === 0 && (
        <div className="text-center py-20">
          <span className="text-5xl">🏷️</span>
          <p className="mt-4 text-sm text-muted-foreground">No active offers right now. Check back soon!</p>
          <Link to="/kitchen" className="mt-4 inline-block rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
            Browse Products
          </Link>
        </div>
      )}

      {activeOffers.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activeOffers.map((offer, i) => {
            const colorPairs = [
              ["from-red-500 to-red-600", "bg-red-50 text-red-700"],
              ["from-amber-500 to-orange-600", "bg-amber-50 text-amber-700"],
              ["from-purple-500 to-purple-600", "bg-purple-50 text-purple-700"],
              ["from-emerald-500 to-teal-600", "bg-emerald-50 text-emerald-700"],
              ["from-blue-500 to-blue-600", "bg-blue-50 text-blue-700"],
              ["from-rose-500 to-rose-600", "bg-rose-50 text-rose-700"],
            ];
            const colors = colorPairs[i % colorPairs.length];

            return (
              <motion.div key={offer._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${colors[0].split(" ")[0].replace("from-", "")}, ${colors[0].split(" ")[1].replace("to-", "")})` }}>
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {offer.type === "flash-sale" && <Zap className="h-5 w-5 text-yellow-300" />}
                      {offer.type === "festival" && <Gift className="h-5 w-5" />}
                      {offer.type === "category" && <Tags className="h-5 w-5" />}
                      <span className="text-xs font-medium uppercase tracking-wider opacity-80">{offer.type?.replace("-", " ")}</span>
                    </div>
                    {offer.image && <img src={offer.image} alt="" className="h-12 w-12 rounded-xl object-cover" />}
                  </div>

                  <h3 className="text-xl font-bold">{offer.title}</h3>
                  {offer.description && <p className="text-sm text-white/80 mt-1">{offer.description}</p>}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {offer.discountPercent && (
                      <span className="rounded-lg bg-white/20 px-3 py-1 text-sm font-bold backdrop-blur-sm">{offer.discountPercent}% OFF</span>
                    )}
                    {offer.discountFlat && (
                      <span className="rounded-lg bg-white/20 px-3 py-1 text-sm font-bold backdrop-blur-sm">₹{offer.discountFlat} OFF</span>
                    )}
                    {offer.code && (
                      <span className="rounded-lg bg-white/20 px-3 py-1 text-xs font-mono backdrop-blur-sm">Code: {offer.code}</span>
                    )}
                  </div>

                  {offer.minOrder && <p className="text-xs text-white/60 mt-2">Min. order: ₹{offer.minOrder}</p>}

                  <div className="flex items-center gap-1.5 text-[10px] text-white/50 mt-3">
                    <Calendar className="h-3 w-3" />
                    <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                  </div>
                </div>
                {/* Background decoration */}
                <div className="absolute -bottom-8 -right-8 text-8xl opacity-10"><Percent className="h-32 w-32" /></div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Expired offers */}
      {offers && offers.filter(o => !o.isActive || o.validUntil <= Date.now()).length > 0 && (
        <div className="mt-16">
          <h2 className="text-lg font-bold mb-4">Past Offers</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {offers.filter(o => !o.isActive || o.validUntil <= Date.now()).slice(0, 3).map(offer => (
              <div key={offer._id} className="rounded-2xl bg-muted/30 border border-border/60 p-4 opacity-50">
                <p className="font-semibold text-sm">{offer.title}</p>
                <p className="text-xs text-muted-foreground mt-1">Expired</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
