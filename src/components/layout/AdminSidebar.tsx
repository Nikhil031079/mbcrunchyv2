"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Package, Grid3X3,
  Combine, ShoppingCart, Users, Star, TicketPercent,
  Percent, Box, BookOpen, HelpCircle, MessageSquare, Mail, Image,
  Settings, Shield, CreditCard, Truck, Clock, ClipboardList,
  LogOut, ChevronLeft, Menu, UtensilsCrossed, BarChart3, FileText,
  Receipt, PartyPopper,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: number;
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Kitchen Dashboard", href: "/admin/kitchen-dashboard", icon: UtensilsCrossed },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Grid3X3 },
      { label: "Combos", href: "/admin/combos", icon: Combine },
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
      { label: "Coupons", href: "/admin/coupons", icon: TicketPercent },
      { label: "Offers", href: "/admin/offers", icon: Percent },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Inventory", href: "/admin/inventory", icon: Box },
      { label: "Blogs", href: "/admin/blogs", icon: BookOpen },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
      { label: "Banners", href: "/admin/banners", icon: Image },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
      { label: "Messages", href: "/admin/messages", icon: Mail },
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
    ],
  },
  {
    title: "Reports",
    items: [
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Business", href: "/admin/settings/business", icon: Settings },
      { label: "Branding", href: "/admin/settings/branding", icon: Image },
      { label: "Payments", href: "/admin/settings/payments", icon: CreditCard },
      { label: "Delivery", href: "/admin/settings/delivery", icon: Truck },
      { label: "Hours", href: "/admin/settings/hours", icon: Clock },
      { label: "Security", href: "/admin/settings/security", icon: Shield },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: ClipboardList },
      { label: "System", href: "/admin/settings/system", icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return location.pathname === "/admin/dashboard" || location.pathname === "/admin";
    return location.pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/60 px-4 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-sm">
          MC
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold leading-tight">MB Crunchy</p>
            <p className="text-[10px] text-muted-foreground">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {item.badge && !collapsed && (
                      <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/60 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Back to Website</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-50 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg lg:hidden"
        aria-label="Open admin menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-border/60 bg-white shadow-xl lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex h-screen flex-col border-r border-border/60 bg-white transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex flex-col h-full">
          {sidebarContent}
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white shadow-sm hover:bg-muted transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={cn("h-3 w-3 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>
      </aside>
    </>
  );
}
