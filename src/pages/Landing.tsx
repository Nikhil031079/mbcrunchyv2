// MB Crunchy V2 — Premium Home Page (Convex-Powered)
import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ChevronRight, Star, Heart, Eye, Truck, ShieldCheck,
  Leaf, Award, Sparkles, UtensilsCrossed, Pizza, Beef, Soup, Cookie,
  Apple, Droplets, Wheat, ShoppingBag, ChevronLeft, Percent, Gift, Zap,
  PartyPopper, Users, CheckCircle, Smartphone, Send, Mail, Loader2,
} from "lucide-react";
import { mapConvexProduct, mapConvexCombo } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

// ─── Why Us Data (brand value props — stays static) ───
const whyUs = [
  { icon: Leaf, title: "Fresh Ingredients", desc: "We source directly from farms and local markets to ensure every ingredient is at its peak freshness." },
  { icon: Sparkles, title: "Homemade Taste", desc: "Traditional recipes passed down through generations, made fresh daily in our kitchen." },
  { icon: Truck, title: "Fast Delivery", desc: "Hot meals delivered in under 30 minutes. Groceries delivered within 2 hours." },
  { icon: ShieldCheck, title: "Secure Payments", desc: "100% secure checkout with multiple payment options including UPI, cards, and COD." },
  { icon: Award, title: "Quality Assured", desc: "Every product undergoes strict quality checks. Not satisfied? We'll replace or refund." },
  { icon: Users, title: "Made with Love", desc: "Every dish is prepared with care by our expert chefs who put love into every bite." },
];

// ─── Hero Section ───
function HeroSection() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.6]);
  const foodEmojis = ["🍕", "🍔", "🍟", "🥟", "🥭", "🍯", "🥥", "🌮"];

  return (
    <section className="relative overflow-hidden gradient-hero text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {foodEmojis.map((emoji, i) => (
          <motion.span key={i} className="absolute text-3xl sm:text-4xl opacity-20"
            style={{ left: `${10 + i * 11}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}>{emoji}</motion.span>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm mb-6">
                  <Sparkles className="h-3.5 w-3.5 text-accent" /> Fresh • Homemade • Premium
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
                  Fresh Homemade<br /><span className="text-gradient">Foods Delivered</span><br />Fast
                </h1>
                <p className="mt-6 max-w-lg text-base text-white/70 leading-relaxed">
                  From frozen foods to homemade snacks, cold-pressed oils to natural honey — premium quality, crafted with love, delivered to your doorstep.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Frozen Foods", "Snacks", "Pickles", "Cold Pressed Oils", "Natural Honey"].map((tag) => (
                    <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-sm">{tag}</span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/kitchen" className="btn-primary text-base px-8 py-3.5">Order Kitchen <ArrowRight className="h-5 w-5" /></Link>
                  <Link to="/mart" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white">Shop Mart</Link>
                </div>
                <div className="mt-10 flex items-center gap-8">
                  {[{ value: "100+", label: "Products" }, { value: "5k+", label: "Happy Customers" }, { value: "30 min", label: "Avg. Delivery" }].map((stat) => (
                    <div key={stat.label}><p className="text-lg font-bold">{stat.value}</p><p className="text-xs text-white/50">{stat.label}</p></div>
                  ))}
                </div>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative hidden lg:block">
              <div className="relative">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8">
                  <div className="grid grid-cols-2 gap-4">
                    {[{ emoji: "🍕", label: "Pizzas", sub: "Starting ₹129" }, { emoji: "🍔", label: "Burgers", sub: "Starting ₹99" }, { emoji: "🥟", label: "Momos", sub: "12 pcs ₹199" }, { emoji: "🍯", label: "Honey", sub: "Pure & Natural" }].map((item, i) => (
                      <motion.div key={item.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.1 }}
                        className="rounded-xl bg-white/10 p-4 text-center hover:bg-white/20 transition-colors">
                        <span className="text-3xl">{item.emoji}</span>
                        <p className="mt-1.5 text-sm font-semibold">{item.label}</p>
                        <p className="text-xs text-white/60">{item.sub}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                <motion.div animate={{ y: [0, -12, 0], rotate: [0, -3, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-4 -right-4 rounded-xl bg-accent text-accent-foreground px-4 py-2 shadow-lg">
                  <p className="text-xs font-bold">20% OFF</p><p className="text-[10px] opacity-80">First Order</p>
                </motion.div>
                <motion.div animate={{ y: [0, 8, 0], rotate: [0, 2, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -left-4 rounded-xl bg-white/95 text-foreground px-4 py-2 shadow-lg">
                  <div className="flex items-center gap-2"><Truck className="h-3.5 w-3.5 text-primary" /><p className="text-xs font-semibold">Free Delivery</p></div>
                  <p className="text-[10px] text-muted-foreground">On orders ₹499+</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Category Section (Convex-Powered) ───
function CategorySection() {
  const categories = useQuery(api.categories.list, {});
  const kitchenCats = (categories ?? []).filter(c => c.businessType === "kitchen" || c.businessType === "both").slice(0, 8);
  const martCats = (categories ?? []).filter(c => c.businessType === "mart" || c.businessType === "both").slice(0, 6);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div><h2 className="section-title">Shop by Category</h2><p className="section-subtitle mt-1 text-sm">Explore our wide range of products</p></div>
          <Link to="/kitchen" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            View All <ChevronRight className="h-4 w-4" /></Link>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><UtensilsCrossed className="h-4 w-4 text-primary" /></div>
            <h3 className="font-semibold text-sm">Kitchen</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {kitchenCats.length > 0 ? kitchenCats.map((cat, i) => (
              <motion.div key={cat._id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link to="/kitchen" className="group flex flex-col items-center gap-2 min-w-[90px] rounded-xl border border-border bg-white p-4 transition-all duration-200 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 text-xl transition-transform group-hover:scale-110 duration-200">
                    {cat.icon ?? "📁"}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">{cat.name}</span>
                </Link>
              </motion.div>
            )) : (
              <p className="text-xs text-muted-foreground py-4">Add categories in Admin to see them here</p>
            )}
          </div>
        </div>
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50"><ShoppingBag className="h-4 w-4 text-emerald-600" /></div>
            <h3 className="font-semibold text-sm">Mart</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {martCats.length > 0 ? martCats.map((cat, i) => (
              <motion.div key={cat._id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link to="/mart" className="group flex flex-col items-center gap-2 min-w-[90px] rounded-xl border border-border bg-white p-4 transition-all duration-200 hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 text-xl transition-transform group-hover:scale-110 duration-200">
                    {cat.icon ?? "📦"}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">{cat.name}</span>
                </Link>
              </motion.div>
            )) : (
              <p className="text-xs text-muted-foreground py-4">Add categories in Admin to see them here</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Featured Products (Convex-Powered) ───
function FeaturedProductsSection() {
  const products = useQuery(api.products.list, { status: "active" });
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());
  const toggleWishlist = (i: number) => {
    const next = new Set(wishlisted);
    if (next.has(i)) next.delete(i); else next.add(i);
    setWishlisted(next);
  };

  const featured = (products ?? [])
    .filter(p => p.isFeatured || p.isBestSeller || p.isTrending)
    .slice(0, 8)
    .map(p => mapConvexProduct(p));

  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div><h2 className="section-title">Featured Products</h2><p className="section-subtitle mt-1 text-sm">Most loved items this week</p></div>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12"><p className="text-sm text-muted-foreground">Add featured products in Admin to see them here</p></div>
        )}
        <div className="mt-10 text-center">
          <Link to="/kitchen" className="btn-outline">View All Products <ChevronRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}

// ─── Offers Section (Convex-Powered) ───
function OffersSection() {
  const offers = useQuery(api.offers.list, { isActive: true });
  const [activeOffer, setActiveOffer] = useState(0);
  const activeOffers = (offers ?? []).slice(0, 4);

  if (activeOffers.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8"><h2 className="section-title">Special Offers</h2><p className="section-subtitle mt-1 text-sm">Don't miss out on these deals</p></div>
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeOffers.map((offer, i) => (
            <motion.div key={offer._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-lg cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${["#DC2626","#D97706","#7C3AED","#059669"][i % 4]}, ${["#991B1B","#EA580C","#6D28D9","#047857"][i % 4]})` }}>
              <div className="relative z-10">
                {offer.image && <img src={offer.image} alt="" className="h-8 w-8 object-contain mb-3 rounded" />}
                <h3 className="text-xl font-bold">{offer.title}</h3>
                <p className="text-sm text-white/80 mt-1">{offer.description}</p>
                {offer.code && <div className="mt-4 inline-block rounded-lg bg-white/20 px-3 py-1 text-xs font-mono backdrop-blur-sm">{offer.code}</div>}
                {offer.discountPercent && <div className="mt-2 inline-block rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold">{offer.discountPercent}% OFF</div>}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="relative sm:hidden">
          <AnimatePresence mode="wait">
            <motion.div key={activeOffer} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}
              className="rounded-2xl p-6 text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${["#DC2626","#D97706","#7C3AED","#059669"][activeOffer % 4]}, ${["#991B1B","#EA580C","#6D28D9","#047857"][activeOffer % 4]})` }}>
              <div className="flex items-center gap-4">
                {activeOffers[activeOffer].image && <img src={activeOffers[activeOffer].image} alt="" className="h-16 w-16 rounded-xl object-cover" />}
                <div>
                  <h3 className="text-xl font-bold">{activeOffers[activeOffer].title}</h3>
                  <p className="text-sm text-white/80 mt-1">{activeOffers[activeOffer].description}</p>
                  {activeOffers[activeOffer].code && <div className="mt-2 rounded-lg bg-white/20 px-2 py-0.5 text-xs font-mono inline-block">{activeOffers[activeOffer].code}</div>}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          {activeOffers.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <button onClick={() => setActiveOffer(p => (p - 1 + activeOffers.length) % activeOffers.length)} className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white shadow-sm hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
              <div className="flex gap-1.5">{activeOffers.map((_, i) => (<button key={i} onClick={() => setActiveOffer(i)} className={`h-2 rounded-full transition-all ${i === activeOffer ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"}`} />))}</div>
              <button onClick={() => setActiveOffer(p => (p + 1) % activeOffers.length)} className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white shadow-sm hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Why MB Crunchy Section ───
function WhyUsSection() {
  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Why MB Crunchy?</h2>
          <p className="section-subtitle mt-2 text-sm max-w-lg mx-auto">We're committed to bringing you the freshest, most delicious food with unmatched quality and service.</p>
        </div>
        <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }}
          variants={{ initial: {}, whileInView: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} variants={{ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 } }}
                className="group rounded-2xl bg-white border border-border/60 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Testimonials Section (Convex-Powered) ───
function TestimonialsSection() {
  const testimonials = useQuery(api.content.listTestimonials, { status: "active" });
  const list = (testimonials ?? []).slice(0, 4);

  if (list.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle mt-2 text-sm max-w-lg mx-auto">Real reviews from real customers who love MB Crunchy</p>
        </div>
        <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }}
          variants={{ initial: {}, whileInView: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((t) => (
            <motion.div key={t._id} variants={{ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 } }}
              className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-accent text-accent" : "text-muted-foreground/20"}`} />))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{t.comment}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full overflow-hidden">
                  {t.avatar ? <img src={t.avatar} alt="" className="h-full w-full object-cover" /> : <span className="bg-primary/10 text-primary text-xs font-bold">{t.name.charAt(0)}</span>}
                </div>
                <div><p className="text-sm font-semibold">{t.name}</p>{t.city && <p className="text-xs text-muted-foreground">{t.city}</p>}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Download App Section ───
function DownloadAppSection() {
  return (
    <section className="gradient-hero text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm mb-4">
              <Smartphone className="h-3.5 w-3.5 text-accent" /> Coming Soon
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Download the<br /><span className="text-gradient">MB Crunchy</span> App</h2>
            <p className="mt-4 max-w-md text-sm text-white/70 leading-relaxed">Order your favorites on the go. Track deliveries in real-time, get exclusive app-only offers, and enjoy a seamless food ordering experience.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm px-5 py-3.5 flex items-center gap-3 hover:bg-white/20 transition-colors cursor-pointer">
                <Smartphone className="h-5 w-5 text-accent" /><div><p className="text-[10px] text-white/60">Download on</p><p className="text-sm font-semibold">Google Play</p></div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm px-5 py-3.5 flex items-center gap-3 hover:bg-white/20 transition-colors cursor-pointer">
                <Smartphone className="h-5 w-5 text-accent" /><div><p className="text-[10px] text-white/60">Download on</p><p className="text-sm font-semibold">App Store</p></div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative hidden lg:flex items-center justify-center">
            <div className="relative">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="rounded-3xl border-2 border-white/20 bg-white/5 backdrop-blur-sm p-8 w-64 text-center">
                <div className="flex justify-center mb-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-black text-xl shadow-lg">MC</div></div>
                <p className="text-lg font-bold">MB Crunchy</p>
                <p className="text-xs text-white/60 mt-1">Fresh • Homemade • Premium</p>
                <div className="mt-6 space-y-2">
                  {["🍕", "🍔", "🥟"].map((emoji) => (<div key={emoji} className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2"><span className="text-lg">{emoji}</span><div className="flex-1 h-2 rounded-full bg-white/10" /></div>))}
                </div>
              </motion.div>
              <motion.div animate={{ rotate: [0, 3, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -right-8 -bottom-4 rounded-2xl bg-white p-4 shadow-xl">
                <div className="h-20 w-20 bg-muted rounded-lg flex items-center justify-center"><span className="text-3xl">📱</span></div>
                <p className="text-[8px] text-muted-foreground text-center mt-1">Scan to download</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter Section ───
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); setTimeout(() => setSubscribed(false), 3000); }
  };
  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary mx-auto mb-4"><Mail className="h-6 w-6" /></div>
          <h2 className="section-title">Stay in the Loop</h2>
          <p className="section-subtitle mt-2 text-sm">Subscribe to our newsletter for exclusive offers, new product launches, and food stories.</p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required
                className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <button type="submit" className="btn-primary whitespace-nowrap">
              {subscribed ? <><CheckCircle className="h-4 w-4" /> Subscribed!</> : <><Send className="h-4 w-4" /> Subscribe</>}
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page Component ───
export default function Landing() {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <FeaturedProductsSection />
      <OffersSection />
      <WhyUsSection />
      <TestimonialsSection />
      <DownloadAppSection />
      <NewsletterSection />
    </div>
  );
}
