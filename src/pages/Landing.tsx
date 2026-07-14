// MB Crunchy — Home Page
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, UtensilsCrossed, ShoppingBag, Sparkles, Leaf, Award, Truck, ShieldCheck } from "lucide-react";

const categories = [
  { label: "Frozen Foods", icon: Sparkles, href: "/kitchen", color: "bg-primary" },
  { label: "Fast Food", icon: UtensilsCrossed, href: "/kitchen", color: "bg-secondary" },
  { label: "Homemade Snacks", icon: Sparkles, href: "/kitchen", color: "bg-accent text-accent-foreground" },
  { label: "Organic Products", icon: Leaf, href: "/mart", color: "bg-primary" },
];

const features = [
  { icon: Truck, title: "Free Delivery", desc: "On orders above ₹499" },
  { icon: ShieldCheck, title: "100% Fresh", desc: "Quality guaranteed" },
  { icon: Award, title: "Premium Quality", desc: "Handpicked products" },
  { icon: Leaf, title: "Organic Choice", desc: "Natural & pure" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5 },
};

export default function Landing() {
  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="relative border-b-2 border-black bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block border-2 border-accent bg-accent px-3 py-1 text-xs font-black uppercase tracking-widest text-accent-foreground mb-6">
                Fresh • Homemade • Premium
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl leading-[1.05]">
                Taste the
                <br />
                <span className="text-primary">Crunch</span>
              </h1>
              <p className="mt-6 max-w-md text-base text-muted-foreground leading-relaxed">
                Premium frozen foods, homemade snacks, cold-pressed oils, and organic products
                — crafted with love and delivered fresh to your doorstep.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/kitchen"
                  className="inline-flex items-center gap-2 border-2 border-primary bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  Order Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/mart"
                  className="inline-flex items-center gap-2 border-2 border-white bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-all"
                >
                  Explore Mart
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="bg-primary/20 border-2 border-white/30 p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-white/30 bg-white/10 p-6 text-center">
                    <ShoppingBag className="mx-auto h-8 w-8 text-accent" />
                    <p className="mt-2 text-sm font-bold uppercase">100+</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                  <div className="border-2 border-white/30 bg-white/10 p-6 text-center">
                    <Award className="mx-auto h-8 w-8 text-accent" />
                    <p className="mt-2 text-sm font-bold uppercase">Premium</p>
                    <p className="text-xs text-muted-foreground">Quality</p>
                  </div>
                  <div className="border-2 border-white/30 bg-white/10 p-6 text-center">
                    <Truck className="mx-auto h-8 w-8 text-accent" />
                    <p className="mt-2 text-sm font-bold uppercase">Fast</p>
                    <p className="text-xs text-muted-foreground">Delivery</p>
                  </div>
                  <div className="border-2 border-white/30 bg-white/10 p-6 text-center">
                    <Leaf className="mx-auto h-8 w-8 text-accent" />
                    <p className="mt-2 text-sm font-bold uppercase">Organic</p>
                    <p className="text-xs text-muted-foreground">Choice</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Features Bar ─── */}
      <section className="border-b-2 border-black bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  {...fadeUp}
                  className="border-2 border-black bg-white p-4 text-center"
                >
                  <Icon className="mx-auto h-6 w-6 text-primary" />
                  <p className="mt-2 text-sm font-bold uppercase">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="border-b-2 border-black bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <h2 className="neo-section-title">Shop by Category</h2>
          </motion.div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={cat.href}
                    className="group block border-2 border-black bg-white transition-all hover:bg-secondary hover:text-secondary-foreground"
                  >
                    <div className={`flex items-center justify-center border-b-2 border-black p-8 ${cat.color}`}>
                      <Icon className="h-10 w-10" />
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm font-bold uppercase tracking-wide group-hover:text-white transition-colors">
                        {cat.label}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Products Preview ─── */}
      <section className="border-b-2 border-black bg-muted">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <h2 className="neo-section-title">Why MB Crunchy?</h2>
          </motion.div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Homemade Goodness", desc: "Every snack is made with traditional recipes passed down through generations, ensuring authentic taste in every bite.", accent: true },
              { title: "Cold-Pressed Purity", desc: "Our oils are extracted using traditional cold-press methods, retaining all natural nutrients and flavors without chemicals.", accent: false },
              { title: "Farm-Fresh Organic", desc: "Sourced directly from certified organic farms, our products are 100% natural and free from pesticides.", accent: true },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`border-2 border-black p-6 ${item.accent ? "bg-accent text-accent-foreground" : "bg-white"}`}
              >
                <h3 className="text-lg font-black uppercase">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-b-2 border-black bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
              Ready to Crunch?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base opacity-80">
              Browse our collection of premium homemade snacks, frozen foods, and organic products.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/kitchen"
                className="inline-flex items-center gap-2 border-2 border-black bg-secondary px-6 py-3 text-sm font-bold uppercase tracking-wider text-secondary-foreground hover:bg-secondary/90 transition-all"
              >
                Visit Kitchen
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/mart"
                className="inline-flex items-center gap-2 border-2 border-white bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-all"
              >
                Explore Mart
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Tagline Strip ─── */}
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Fresh • Homemade • Premium — MB Crunchy
          </p>
        </div>
      </section>
    </div>
  );
}
