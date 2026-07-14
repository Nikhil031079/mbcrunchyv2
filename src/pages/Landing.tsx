// MB Crunchy V2 — Premium Home Page
import { useState } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Star,
  Heart,
  Eye,
  Truck,
  ShieldCheck,
  Leaf,
  Award,
  Sparkles,
  UtensilsCrossed,
  Pizza,
  Beef,
  Soup,
  Cookie,
  Apple,
  Droplets,
  Wheat,
  ShoppingBag,
  ChevronLeft,
  Percent,
  Gift,
  Zap,
  PartyPopper,
  Users,
  CheckCircle,
  Smartphone,
  Send,
  Mail,
} from "lucide-react";

// ─── Static Data ───
const kitchenCategories = [
  { name: "Pizza", icon: Pizza, color: "bg-orange-50 text-orange-600" },
  { name: "Burger", icon: Beef, color: "bg-amber-50 text-amber-600" },
  { name: "Fries", icon: Soup, color: "bg-yellow-50 text-yellow-600" },
  { name: "Pasta", icon: UtensilsCrossed, color: "bg-red-50 text-red-600" },
  { name: "Noodles", icon: Soup, color: "bg-emerald-50 text-emerald-600" },
  { name: "Momos", icon: Cookie, color: "bg-cyan-50 text-cyan-600" },
  { name: "Sandwiches", icon: UtensilsCrossed, color: "bg-amber-50 text-amber-600" },
  { name: "Sweet Corn", icon: Apple, color: "bg-yellow-50 text-yellow-600" },
  { name: "Frozen Foods", icon: Sparkles, color: "bg-blue-50 text-blue-600" },
];

const martCategories = [
  { name: "Pickles", icon: Cookie, color: "bg-orange-50 text-orange-600" },
  { name: "Cold Pressed Oils", icon: Droplets, color: "bg-amber-50 text-amber-600" },
  { name: "Honey", icon: Sparkles, color: "bg-yellow-50 text-yellow-600" },
  { name: "Organic Products", icon: Leaf, color: "bg-emerald-50 text-emerald-600" },
  { name: "Homemade Snacks", icon: Cookie, color: "bg-red-50 text-red-600" },
  { name: "Spices", icon: Wheat, color: "bg-rose-50 text-rose-600" },
];

const featuredProducts = [
  { name: "Classic Margherita Pizza", category: "Pizza", price: 249, rating: 4.8, reviews: 128, veg: true, discount: 20, image: "🍕" },
  { name: "Crispy French Fries", category: "Fries", price: 149, rating: 4.6, reviews: 96, veg: true, discount: 0, image: "🍟" },
  { name: "Chicken Momos (12 pcs)", category: "Momos", price: 199, rating: 4.7, reviews: 84, veg: false, discount: 15, image: "🥟" },
  { name: "Mango Pickle (500g)", category: "Pickles", price: 179, rating: 4.5, reviews: 62, veg: true, discount: 0, image: "🥭" },
  { name: "Cold Pressed Coconut Oil", category: "Oils", price: 399, rating: 4.9, reviews: 45, veg: true, discount: 10, image: "🥥" },
  { name: "Natural Honey (250g)", category: "Honey", price: 299, rating: 4.8, reviews: 73, veg: true, discount: 0, image: "🍯" },
  { name: "Peri Peri Fries", category: "Fries", price: 179, rating: 4.4, reviews: 51, veg: true, discount: 25, image: "🌶️" },
  { name: "Veggie Burger", category: "Burger", price: 129, rating: 4.3, reviews: 38, veg: true, discount: 0, image: "🍔" },
];

const offers = [
  { title: "20% OFF", subtitle: "on first order", code: "FIRST20", icon: Percent, color: "from-red-500 to-red-600" },
  { title: "Buy 1 Get 1", subtitle: "on all pizzas", code: "BOGO", icon: Gift, color: "from-amber-500 to-orange-600" },
  { title: "Weekend Special", subtitle: "extra 10% off", code: "WEEKEND", icon: Zap, color: "from-purple-500 to-purple-600" },
  { title: "Party Deals", subtitle: "min 30% off", code: "PARTY", icon: PartyPopper, color: "from-emerald-500 to-teal-600" },
];

const whyUs = [
  { icon: Leaf, title: "Fresh Ingredients", desc: "We source directly from farms and local markets to ensure every ingredient is at its peak freshness." },
  { icon: Sparkles, title: "Homemade Taste", desc: "Traditional recipes passed down through generations, made fresh daily in our kitchen." },
  { icon: Truck, title: "Fast Delivery", desc: "Hot meals delivered in under 30 minutes. Groceries delivered within 2 hours." },
  { icon: ShieldCheck, title: "Secure Payments", desc: "100% secure checkout with multiple payment options including UPI, cards, and COD." },
  { icon: Award, title: "Quality Assured", desc: "Every product undergoes strict quality checks. Not satisfied? We'll replace or refund." },
  { icon: Users, title: "Made with Love", desc: "Every dish is prepared with care by our expert chefs who put love into every bite." },
];

const testimonials = [
  { name: "Priya Sharma", city: "Mumbai", comment: "The homemade snacks taste just like my grandmother used to make! Absolutely love the quality and freshness.", rating: 5, avatar: "PS" },
  { name: "Rahul Verma", city: "Thane", comment: "Ordered party pack for my son's birthday. Everyone loved the food! Fast delivery and great packaging.", rating: 5, avatar: "RV" },
  { name: "Ananya Patel", city: "Navi Mumbai", comment: "Cold pressed oils are amazing. I can taste the difference in my cooking. Regular customer now!", rating: 5, avatar: "AP" },
  { name: "Vikram Singh", city: "Mumbai", comment: "Best quick food delivery in town. The pizzas are restaurant quality at home. Highly recommended!", rating: 4, avatar: "VS" },
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
          <motion.span
            key={i}
            className="absolute text-3xl sm:text-4xl opacity-20"
            style={{ left: `${10 + i * 11}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm mb-6">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  Fresh • Homemade • Premium
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
                  Fresh Homemade<br />
                  <span className="text-gradient">Foods Delivered</span><br />
                  Fast
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
                  <Link to="/kitchen" className="btn-primary text-base px-8 py-3.5">
                    Order Kitchen <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link to="/mart" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white">Shop Mart</Link>
                </div>
                <div className="mt-10 flex items-center gap-8">
                  {[
                    { value: "100+", label: "Products" },
                    { value: "5k+", label: "Happy Customers" },
                    { value: "30 min", label: "Avg. Delivery" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-lg font-bold">{stat.value}</p>
                      <p className="text-xs text-white/50">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative hidden lg:block">
              <div className="relative">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { emoji: "🍕", label: "Pizzas", sub: "Starting ₹129" },
                      { emoji: "🍔", label: "Burgers", sub: "Starting ₹99" },
                      { emoji: "🥟", label: "Momos", sub: "12 pcs ₹199" },
                      { emoji: "🍯", label: "Honey", sub: "Pure & Natural" },
                    ].map((item, i) => (
                      <motion.div key={item.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.1 }} className="rounded-xl bg-white/10 p-4 text-center hover:bg-white/20 transition-colors">
                        <span className="text-3xl">{item.emoji}</span>
                        <p className="mt-1.5 text-sm font-semibold">{item.label}</p>
                        <p className="text-xs text-white/60">{item.sub}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                <motion.div animate={{ y: [0, -12, 0], rotate: [0, -3, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 0.5 }} className="absolute -top-4 -right-4 rounded-xl bg-accent text-accent-foreground px-4 py-2 shadow-lg">
                  <p className="text-xs font-bold">20% OFF</p>
                  <p className="text-[10px] opacity-80">First Order</p>
                </motion.div>
                <motion.div animate={{ y: [0, 8, 0], rotate: [0, 2, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 1 }} className="absolute -bottom-4 -left-4 rounded-xl bg-white/95 text-foreground px-4 py-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-primary" />
                    <p className="text-xs font-semibold">Free Delivery</p>
                  </div>
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

// ─── Category Section ───
function CategorySection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle mt-1 text-sm">Explore our wide range of products</p>
          </div>
          <Link to="/kitchen" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><UtensilsCrossed className="h-4 w-4 text-primary" /></div>
            <h3 className="font-semibold text-sm">Kitchen</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {kitchenCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.name} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link to="/kitchen" className="group flex flex-col items-center gap-2 min-w-[90px] rounded-xl border border-border bg-white p-4 transition-all duration-200 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.color} transition-transform group-hover:scale-110 duration-200`}><Icon className="h-6 w-6" /></div>
                    <span className="text-xs font-medium text-center leading-tight">{cat.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50"><ShoppingBag className="h-4 w-4 text-emerald-600" /></div>
            <h3 className="font-semibold text-sm">Mart</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {martCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.name} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link to="/mart" className="group flex flex-col items-center gap-2 min-w-[90px] rounded-xl border border-border bg-white p-4 transition-all duration-200 hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.color} transition-transform group-hover:scale-110 duration-200`}><Icon className="h-6 w-6" /></div>
                    <span className="text-xs font-medium text-center leading-tight">{cat.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link to="/kitchen" className="inline-flex items-center gap-1 text-sm font-medium text-primary">View All Categories <ChevronRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}

// ─── Featured Products Section ───
function FeaturedProductsSection() {
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());
  const toggleWishlist = (i: number) => {
    const next = new Set(wishlisted);
    if (next.has(i)) next.delete(i); else next.add(i);
    setWishlisted(next);
  };

  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle mt-1 text-sm">Most loved items this week</p>
          </div>
        </div>

        <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }}
          variants={{ initial: {}, whileInView: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product.name}
              variants={{ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 } }}
              className="group relative rounded-2xl bg-white border border-border/60 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative aspect-square rounded-t-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
                <motion.span className="text-6xl" whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}>
                  {product.image}
                </motion.span>
                {product.discount > 0 && (
                  <span className="absolute top-2 left-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 text-[10px] font-bold shadow-md">-{product.discount}%</span>
                )}
                <span className={`absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 ${product.veg ? "border-emerald-500 bg-emerald-50" : "border-red-500 bg-red-50"}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${product.veg ? "bg-emerald-500" : "bg-red-500"}`} />
                </span>
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-t-2xl">
                  <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-foreground shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-90" aria-label="Quick view">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button onClick={(e) => { e.preventDefault(); toggleWishlist(i); }}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-lg transition-all duration-200 active:scale-90 ${wishlisted.has(i) ? "text-red-500" : "text-foreground hover:text-red-500"}`}
                    aria-label={wishlisted.has(i) ? "Remove from wishlist" : "Add to wishlist"}>
                    <Heart className={`h-4 w-4 ${wishlisted.has(i) ? "fill-current" : ""}`} />
                  </button>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5">
                    <Star className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                    <span className="text-[11px] font-semibold text-emerald-700">{product.rating}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">({product.reviews})</span>
                </div>
                <h3 className="text-sm font-semibold leading-tight line-clamp-2">{product.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                <div className="mt-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold">₹{product.price}</span>
                    {product.discount > 0 && <span className="ml-1.5 text-xs text-muted-foreground line-through">₹{Math.round(product.price * (1 + product.discount / 100))}</span>}
                  </div>
                  <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 transition-all duration-200 hover:bg-primary/90 active:scale-90" aria-label="Add to cart">
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <Link to="/kitchen" className="btn-outline">View All Products <ChevronRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}

// ─── Offers Section ───
function OffersSection() {
  const [activeOffer, setActiveOffer] = useState(0);
  const nextOffer = () => setActiveOffer((prev) => (prev + 1) % offers.length);
  const prevOffer = () => setActiveOffer((prev) => (prev - 1 + offers.length) % offers.length);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="section-title">Special Offers</h2>
          <p className="section-subtitle mt-1 text-sm">Don't miss out on these deals</p>
        </div>

        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {offers.map((offer, i) => {
            const Icon = offer.icon;
            const parts = offer.color.split(" ");
            const fromColor = parts[0].replace("from-", "");
            const toColor = parts[1].replace("to-", "");
            return (
              <motion.div key={offer.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-lg cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${fromColor}, ${toColor})` }}>
                <div className="relative z-10">
                  <Icon className="h-8 w-8 text-white/80 mb-3" />
                  <h3 className="text-xl font-bold">{offer.title}</h3>
                  <p className="text-sm text-white/80 mt-1">{offer.subtitle}</p>
                  <div className="mt-4 inline-block rounded-lg bg-white/20 px-3 py-1 text-xs font-mono backdrop-blur-sm">{offer.code}</div>
                </div>
                <div className="absolute -bottom-6 -right-6 text-6xl opacity-10"><Icon className="h-24 w-24" /></div>
              </motion.div>
            );
          })}
        </div>

        <div className="relative sm:hidden">
          <AnimatePresence mode="wait">
            <motion.div key={activeOffer} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}
              className="rounded-2xl p-6 text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${offers[activeOffer].color.split(" ")[0].replace("from-", "")}, ${offers[activeOffer].color.split(" ")[1].replace("to-", "")})` }}>
              {(() => {
                const offer = offers[activeOffer];
                const Icon = offer.icon;
                return (<><Icon className="h-8 w-8 text-white/80 mb-3" /><h3 className="text-xl font-bold">{offer.title}</h3><p className="text-sm text-white/80 mt-1">{offer.subtitle}</p><div className="mt-4 inline-block rounded-lg bg-white/20 px-3 py-1 text-xs font-mono backdrop-blur-sm">{offer.code}</div></>);
              })()}
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-center gap-4 mt-4">
            <button onClick={prevOffer} className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white shadow-sm hover:bg-muted transition-colors" aria-label="Previous offer"><ChevronLeft className="h-4 w-4" /></button>
            <div className="flex gap-1.5">
              {offers.map((_, i) => (
                <button key={i} onClick={() => setActiveOffer(i)} className={`h-2 rounded-full transition-all duration-300 ${i === activeOffer ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"}`} aria-label={`Go to offer ${i + 1}`} />
              ))}
            </div>
            <button onClick={nextOffer} className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white shadow-sm hover:bg-muted transition-colors" aria-label="Next offer"><ChevronRight className="h-4 w-4" /></button>
          </div>
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

// ─── Testimonials Section ───
function TestimonialsSection() {
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
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={{ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 } }}
              className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-accent text-accent" : "text-muted-foreground/20"}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{t.comment}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{t.avatar}</div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.city}</p>
                </div>
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
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Download the<br /><span className="text-gradient">MB Crunchy</span> App
            </h2>
            <p className="mt-4 max-w-md text-sm text-white/70 leading-relaxed">
              Order your favorites on the go. Track deliveries in real-time, get exclusive app-only offers, and enjoy a seamless food ordering experience.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm px-5 py-3.5 flex items-center gap-3 hover:bg-white/20 transition-colors cursor-pointer">
                <Smartphone className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-[10px] text-white/60">Download on</p>
                  <p className="text-sm font-semibold">Google Play</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm px-5 py-3.5 flex items-center gap-3 hover:bg-white/20 transition-colors cursor-pointer">
                <Smartphone className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-[10px] text-white/60">Download on</p>
                  <p className="text-sm font-semibold">App Store</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative hidden lg:flex items-center justify-center">
            <div className="relative">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="rounded-3xl border-2 border-white/20 bg-white/5 backdrop-blur-sm p-8 w-64 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-black text-xl shadow-lg">MC</div>
                </div>
                <p className="text-lg font-bold">MB Crunchy</p>
                <p className="text-xs text-white/60 mt-1">Fresh • Homemade • Premium</p>
                <div className="mt-6 space-y-2">
                  {["🍕", "🍔", "🥟"].map((emoji) => (
                    <div key={emoji} className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2">
                      <span className="text-lg">{emoji}</span>
                      <div className="flex-1 h-2 rounded-full bg-white/10" />
                    </div>
                  ))}
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
                className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                aria-label="Email for newsletter" />
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
