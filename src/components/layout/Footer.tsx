// MB Crunchy V2 — Premium Footer
import { Link } from "react-router";
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Youtube, MessageCircle, ArrowUpRight } from "lucide-react";

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Kitchen", href: "/kitchen" },
      { label: "Mart", href: "/mart" },
      { label: "Offers", href: "/offers" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/refund" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Cancellation Policy", href: "/cancellation" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Order Tracking", href: "/order-tracking" },
      { label: "Bulk Orders", href: "/contact" },
      { label: "Partner With Us", href: "/contact" },
      { label: "Careers", href: "/about" },
    ],
  },
];

const contactInfo = [
  { icon: MapPin, text: "123, Food Street, Mumbai - 400001" },
  { icon: Phone, text: "+91 98765 43210" },
  { icon: MessageCircle, text: "+91 98765 43210", label: "WhatsApp" },
  { icon: Mail, text: "hello@mbcrunchy.com" },
  { icon: Clock, text: "Mon - Sat: 9 AM - 10 PM" },
];

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-500" },
  { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-500" },
  { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-500" },
];

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column - 4 cols */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-black text-lg shadow-md shadow-primary/30">
                MC
              </div>
              <div>
                <span className="text-base font-bold tracking-tight leading-none block text-white">MB Crunchy</span>
                <span className="text-[9px] font-medium text-accent/80 tracking-wider block leading-tight uppercase">Fresh • Homemade • Premium</span>
              </div>
            </Link>

            <p className="mt-5 text-sm text-muted-foreground/80 leading-relaxed max-w-sm">
              Your destination for premium frozen foods, homemade snacks, cold-pressed oils,
              natural honey, and organic products. Freshness delivered to your doorstep.
            </p>

            {/* Contact Details */}
            <div className="mt-6 space-y-3">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground/70">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                      <Icon className="h-3.5 w-3.5 text-accent" />
                    </span>
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/70 transition-all duration-200 hover:bg-white/10 ${social.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns - 2 cols each */}
          {footerLinks.map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-5">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground/70 transition-all duration-200 hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Payment & App Badge Placeholder */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-5">
              Download App
            </h4>
            <p className="text-sm text-muted-foreground/60 mb-4">
              Coming soon on Android & iOS
            </p>
            <div className="flex flex-col gap-2">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-xs text-muted-foreground/50">
                Android App — Comming Soon
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-xs text-muted-foreground/50">
                iOS App — Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-muted-foreground/50">
              © {new Date().getFullYear()} MB Crunchy. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/50">
              Made with ❤️ in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
