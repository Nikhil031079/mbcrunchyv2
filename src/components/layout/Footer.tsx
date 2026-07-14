// MB Crunchy — Responsive Footer
import { Link } from "react-router";
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Youtube } from "lucide-react";

const footerSections = [
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Kitchen", href: "/kitchen" },
      { label: "Mart", href: "/mart" },
      { label: "Offers", href: "/offers" },
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
      { label: "Contact Us", href: "/contact" },
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
  { icon: Mail, text: "hello@mbcrunchy.com" },
  { icon: Clock, text: "Mon-Sat: 9 AM - 10 PM" },
];

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-black bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-white bg-primary text-primary-foreground font-black text-xl">
                MC
              </div>
              <div>
                <span className="text-lg font-black uppercase tracking-tight leading-none block text-white">MB Crunchy</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent block leading-tight">Fresh • Homemade • Premium</span>
              </div>
            </Link>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Your destination for premium frozen foods, homemade snacks, cold-pressed oils,
              natural honey, and organic products. Freshness delivered to your doorstep.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-accent" />
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
                    className="flex h-9 w-9 items-center justify-center border-2 border-white/30 text-white hover:border-white hover:bg-white/10 transition-all"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-black uppercase tracking-widest text-accent mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t-2 border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} MB Crunchy. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Made with ❤️ in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
