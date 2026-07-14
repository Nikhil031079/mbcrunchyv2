// MB Crunchy — FAQ Page (Placeholder)
import { HelpCircle } from "lucide-react";

export default function FAQ() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-2 border-black bg-white p-8 sm:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center border-2 border-black bg-accent text-accent-foreground">
            <HelpCircle className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 max-w-lg text-sm text-muted-foreground leading-relaxed">
            Got questions? We've got answers. Find everything you need to know about ordering,
            delivery, payments, and more.
          </p>
          <div className="mt-8 w-full max-w-2xl space-y-4 text-left">
            {[
              { q: "What areas do you deliver to?", a: "We currently deliver across Mumbai, Thane, and Navi Mumbai. We're expanding to more cities soon." },
              { q: "What is the minimum order amount?", a: "The minimum order amount is ₹199 for free delivery. Orders below ₹199 have a flat delivery fee of ₹40." },
              { q: "How are your products packaged?", a: "All products are packed in food-grade, eco-friendly packaging to ensure freshness and safety." },
              { q: "Do you accept bulk orders?", a: "Yes! We offer special pricing for bulk and party orders. Contact us for custom quotes." },
              { q: "What is your refund policy?", a: "If you're not satisfied with your order, we offer full refund or replacement within 24 hours of delivery." },
            ].map((faq, i) => (
              <details key={i} className="group border-2 border-black">
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-bold uppercase hover:bg-muted transition-colors">
                  {faq.q}
                  <span className="text-lg leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="border-t-2 border-black px-4 py-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
