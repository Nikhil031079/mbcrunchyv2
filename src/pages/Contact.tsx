// MB Crunchy — Contact Page
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Info */}
        <div className="border-2 border-black bg-white p-8">
          <h1 className="text-3xl font-black uppercase tracking-tight">Get in Touch</h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Have a question, feedback, or want to partner with us? We'd love to hear from you.
          </p>

          <div className="mt-8 space-y-5">
            {[
              { icon: Phone, label: "Phone", value: "+91 98765 43210" },
              { icon: Mail, label: "Email", value: "hello@mbcrunchy.com" },
              { icon: MapPin, label: "Address", value: "123, Food Street, Mumbai - 400001" },
              { icon: Clock, label: "Hours", value: "Mon-Sat: 9 AM - 10 PM" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form Placeholder */}
        <div className="border-2 border-black bg-white p-8">
          <h2 className="text-xl font-black uppercase">Send a Message</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill out the form below and we'll get back to you within 24 hours.
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase">Your Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="mt-1 w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="mt-1 w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase">Message</label>
              <textarea
                rows={4}
                placeholder="Your message..."
                className="mt-1 w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 border-2 border-black bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-all"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
