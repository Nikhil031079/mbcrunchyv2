// MB Crunchy — Mobile Bottom Navigation Bar
import { Link, useLocation } from "react-router";
import { Home, UtensilsCrossed, ShoppingBag, Tags, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BOTTOM_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Kitchen", href: "/kitchen", icon: UtensilsCrossed },
  { label: "Mart", href: "/mart", icon: ShoppingBag },
  { label: "Offers", href: "/offers", icon: Tags },
  { label: "Account", href: "/auth", icon: User },
];

export default function MobileBottomNav() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-black bg-background lg:hidden">
      <div className="flex items-center justify-around">
        {BOTTOM_LINKS.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-3 min-w-[64px] border-t-2 border-transparent transition-all",
                active
                  ? "border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "fill-primary/10")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
