// MB Crunchy — Responsive Header
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { ShoppingCart, Heart, Menu, X, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Kitchen", href: "/kitchen" },
  { label: "Mart", href: "/mart" },
  { label: "Offers", href: "/offers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center border-2 border-black bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-primary text-primary-foreground font-black text-lg">
              MC
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-black uppercase tracking-tight leading-none block">MB Crunchy</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary block leading-tight">Fresh • Homemade • Premium</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-bold uppercase tracking-wide border-2 border-transparent hover:border-black hover:bg-muted transition-all",
                  isActive(link.href) && "border-black bg-muted text-primary",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Desktop Search */}
            <div className="hidden md:block w-48 lg:w-64">
              <SearchBar />
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="flex h-10 w-10 items-center justify-center border-2 border-black hover:bg-muted transition-colors md:hidden"
              aria-label="Toggle search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* User / Auth */}
            <Link
              to="/auth"
              className="flex h-10 w-10 items-center justify-center border-2 border-black hover:bg-muted transition-colors"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center border-2 border-black hover:bg-muted transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center border border-black bg-accent text-[10px] font-bold text-accent-foreground">
                0
              </span>
            </Link>

            {/* Cart */}
            <Link
              to="/checkout"
              className="relative flex h-10 w-10 items-center justify-center border-2 border-black bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center border border-black bg-accent text-[10px] font-bold text-accent-foreground">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="border-t-2 border-black bg-background px-4 py-3 md:hidden">
          <SearchBar mobile onClose={() => setMobileSearchOpen(false)} />
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t-2 border-black bg-background lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-bold uppercase tracking-wide border-2 border-transparent hover:border-black hover:bg-muted transition-all",
                    isActive(link.href) && "border-black bg-muted text-primary",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
