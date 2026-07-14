# Changelog — MB Crunchy V2

## Phase 7 — Production Ready & Dynamic Business Rules (Current)

### Added
- 🏪 **Dynamic Business Settings** — All business rules now configurable through Admin Panel
  - No hardcoded business values anywhere in the application
  - Settings are stored in Convex and queried via `useAppSettings()` hook
- 📦 **System Settings** — Currency, timezone, order prefix, GST, packaging charge, delivery threshold, prep/delivery time, social media links
- 🎨 **SEO Component** — Dynamic meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- 📤 **Data Backup & Export** — Export all data as JSON, orders as CSV, backup history tracking
- 📱 **Enhanced PWA** — Improved service worker with better caching, offline page, updated manifest
- 🔒 **Account Security** — Password change, recovery key generation (shown once), session management
- 📊 **Enhanced Dashboard Stats** — Today's orders/revenue, weekly stats, preparing orders count
- 🚧 **Offline Page** — Professional offline fallback page
- 📑 **Documentation** — DEPLOYMENT.md, BACKUP.md, SETTINGS_GUIDE.md, SEO_GUIDE.md, PWA_GUIDE.md

### Changed
- **Footer** — Now reads address, phone, hours, social links from dynamic settings
- **Cart** — Free delivery threshold, currency symbol from settings
- **Checkout** — UPI ID, store name, order prefix, estimated time, GST from settings
- **Admin Sidebar** — Added Data Backup link
- **Admin Settings** — Enhanced system settings with comprehensive business rules
- **Admin Routes** — Added offline page, data backup page

### Technical
- Zero hardcoded business rules
- Dynamic settings flow: Convex → hooks → UI
- Lazy-loaded admin pages
- Schema validation enabled

## Phase 6 — Business Operations & Customer Experience
### Added
- Kitchen Dashboard with large order cards, timer, accept/reject/ready workflow
- Order Receipt page with printable layout, QR placeholder
- Offers Engine (Flash Sales, Festival, Category, Product offers)
- Combo Builder with auto price calculation
- Reports page with CSV export
- Enhanced order status workflow with timestamps and history
- Internal analytics dashboard

## Phase 5 — Customer Journey & Checkout
### Added
- Product Details page with gallery, zoom, veg badge, tabs
- Professional Cart with quantity management, coupons, savings
- 5-step Checkout flow (Customer → Order Type → Payment → Review → Place)
- Order Success with WhatsApp confirmation
- Order Tracking with status timeline
- Complete Wishlist with move-to-cart
- Guest checkout support

## Phase 4 — Backend Foundation
### Added
- Complete Convex database schema (25+ tables)
- Admin panel with 22+ CRUD pages
- Reusable admin components (Table, StatsCard, ConfirmDialog, EmptyState, LoadingSkeleton)
- Content management (Blogs, FAQs, Banners, Testimonials, Messages, Newsletter)
- Settings management (Business, Branding, Payments, Delivery, Hours, Security)
- Audit logging system with immutable trail

## Phase 3 — Admin Panel Core
### Added
- Admin layout with sidebar navigation
- Products, Categories, Orders, Customers CRUD
- Combos, Coupons, Offers management
- Reviews moderation workflow
- Inventory management

## Phase 1–2 — Foundation & UI
### Added
- React + Vite + Tailwind project setup
- Premium landing page with hero, categories, products, offers sections
- Reusable component library (ProductCard, Layout, Header, Footer)
- Kitchen and Mart storefront pages
- Authentication with Convex Auth
- Cart and Wishlist stores with localStorage
