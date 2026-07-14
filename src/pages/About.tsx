// MB Crunchy — About Page (Placeholder)
import { Info, Heart, Leaf, Award } from "lucide-react";

export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-2 border-black bg-white p-8 sm:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center border-2 border-black bg-primary text-primary-foreground">
            <Info className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-black uppercase tracking-tight sm:text-4xl">
            About MB Crunchy
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground leading-relaxed">
            MB Crunchy is your premium destination for fresh, homemade, and organic food products.
            We believe in bringing the taste of traditional Indian kitchens to your doorstep with
            uncompromising quality and freshness.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3 w-full max-w-2xl">
            {[
              { icon: Heart, title: "Made with Love", desc: "Every product is crafted with care using traditional recipes and the finest ingredients." },
              { icon: Leaf, title: "100% Natural", desc: "No preservatives, no artificial flavors — just pure, natural goodness." },
              { icon: Award, title: "Premium Quality", desc: "We handpick every product to ensure you get nothing but the best." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="border-2 border-black bg-muted p-5 text-center">
                  <Icon className="mx-auto h-8 w-8 text-primary" />
                  <h3 className="mt-3 text-sm font-black uppercase">{item.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
