import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Store Providers — explicit .tsx imports to avoid .ts barrel file ambiguity
import { CartProvider } from "@/store/cart.tsx";
import { WishlistProvider } from "@/store/wishlist.tsx";
import { UserProvider } from "@/store/user.tsx";
import { SettingsProvider } from "@/store/settings.tsx";

// Layout
import Layout from "@/components/layout/Layout";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const Kitchen = lazy(() => import("./pages/Kitchen.tsx"));
const Mart = lazy(() => import("./pages/Mart.tsx"));
const Offers = lazy(() => import("./pages/Offers.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.tsx"));
const Cart = lazy(() => import("./pages/Cart.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.tsx"));
const OrderTracking = lazy(() => import("./pages/OrderTracking.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Admin pages
const AdminLayout = lazy(() => import("./components/layout/AdminLayout.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard.tsx"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts.tsx"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories.tsx"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders.tsx"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers.tsx"));
const AdminCombos = lazy(() => import("./pages/admin/AdminCombos.tsx"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons.tsx"));
const AdminOffers = lazy(() => import("./pages/admin/AdminOffers.tsx"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews.tsx"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory.tsx"));
const AdminBlogs = lazy(() => import("./pages/admin/AdminBlogs.tsx"));
const AdminFaqs = lazy(() => import("./pages/admin/AdminFaqs.tsx"));
const AdminBanners = lazy(() => import("./pages/admin/AdminBanners.tsx"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials.tsx"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages.tsx"));
const AdminNewsletter = lazy(() => import("./pages/admin/AdminNewsletter.tsx"));
const AdminBusinessSettings = lazy(() => import("./pages/admin/AdminBusinessSettings.tsx"));
const AdminBranding = lazy(() => import("./pages/admin/AdminBranding.tsx"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments.tsx"));
const AdminDelivery = lazy(() => import("./pages/admin/AdminDelivery.tsx"));
const AdminBusinessHours = lazy(() => import("./pages/admin/AdminBusinessHours.tsx"));
const AdminSecurity = lazy(() => import("./pages/admin/AdminSecurity.tsx"));
const AdminAuditLogs = lazy(() => import("./pages/admin/AdminAuditLogs.tsx"));
const AdminSystemSettings = lazy(() => import("./pages/admin/AdminSystemSettings.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in WebContainer environment). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

function StoreProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <UserProvider>
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </UserProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <StoreProviders>
            <Suspense fallback={<RouteLoading />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/kitchen" element={<Kitchen />} />
                  <Route path="/mart" element={<Mart />} />
                  <Route path="/offers" element={<Offers />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/order-tracking" element={<OrderTracking />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="combos" element={<AdminCombos />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="offers" element={<AdminOffers />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="blogs" element={<AdminBlogs />} />
                  <Route path="faqs" element={<AdminFaqs />} />
                  <Route path="banners" element={<AdminBanners />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="newsletter" element={<AdminNewsletter />} />
                  <Route path="settings/business" element={<AdminBusinessSettings />} />
                  <Route path="settings/branding" element={<AdminBranding />} />
                  <Route path="settings/payments" element={<AdminPayments />} />
                  <Route path="settings/delivery" element={<AdminDelivery />} />
                  <Route path="settings/hours" element={<AdminBusinessHours />} />
                  <Route path="settings/security" element={<AdminSecurity />} />
                  <Route path="settings/system" element={<AdminSystemSettings />} />
                  <Route path="audit-logs" element={<AdminAuditLogs />} />
                </Route>

                <Route path="/auth" element={<AuthPage redirectAfterAuth="/" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </StoreProviders>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
