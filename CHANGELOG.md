# Changelog — MB Crunchy V2

## v1.0.0 — Production Ready Release (Current)

### Added
- 🏪 **Dynamic Business Settings** — All business rules now configurable through Admin Panel
  - No hardcoded business values anywhere in the application
  - Settings stored in Convex, queried via `useAppSettings()` hook
- 📦 **System Settings** — Currency, timezone, order prefix, GST, packaging charge, delivery threshold, prep/delivery time, social media links
- 🎨 **SEO Component** — Dynamic meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- 📤 **Data Backup & Export** — Export all data as JSON, orders as CSV, backup history tracking
- 📱 **PWA** — Service worker with network-first caching, offline page, updated manifest with maskable icons
- 🔒 **Account Security** — Password change, recovery key generation (shown once), session management
- 🧹 **Application Audit** — All pages reviewed, dead imports removed, mock data cleaned, UX polished
- 📑 **Release Documentation** — TEST_REPORT.md, KNOWN_LIMITATIONS.md, PRODUCTION_CHECKLIST.md, DEPLOYMENT_CHECKLIST.md, FINAL_RELEASE_NOTES.md

### Changed
- **Admin System Settings** — Now connected to Convex (was using local state)
- **Admin Business Settings** — Added proper toast feedback with error handling
- **Admin Security** — Removed unused imports
- **Footer** — Now reads address, phone, hours, social links from dynamic settings
- **Cart** — Free delivery threshold, currency symbol from settings
- **Checkout** — UPI ID, store name, order prefix, estimated time, GST from settings
- **Admin Routes** — Added offline page, data backup page

### Fixed
- Zero TypeScript errors across entire codebase
- Zero Convex deployment errors
- All schema-generated types properly resolved
- Admin pages all connected to Convex backend

## v0.6 — Production Readiness (Phase 7)
- Dynamic business settings infrastructure
- SEO component with structured data
- useAppSettings hook for frontend
- Data backup and export system
- PWA enhancements

## v0.5 — Business Operations (Phase 6)
- Kitchen Dashboard with order fulfillment workflow
- Order Receipt with printable layout
- Offers Engine (Flash Sales, Festival, Category, Product)
- Combo Builder with auto price calculation
- Reports page with CSV export
- Enhanced order status workflow

## v0.4 — Customer Journey & Checkout (Phase 5)
- Product Details page with gallery and tabs
- Professional Cart with quantity management
- 5-step Checkout flow
- Order Success with WhatsApp confirmation
- Order Tracking with status timeline
- Complete Wishlist

## v0.3 — Backend Foundation (Phase 4)
- Complete Convex database schema (25+ tables)
- Admin panel with 22+ CRUD pages
- Reusable admin components
- Content management system
- Settings management
- Audit logging

## v0.2 — Admin Panel Core (Phase 3)
- Admin layout with sidebar navigation
- Products, Categories, Orders, Customers CRUD
- Combos, Coupons, Offers management
- Reviews moderation workflow

## v0.1 — Foundation & UI (Phases 1-2)
- React + Vite + Tailwind project setup
- Premium landing page with all sections
- Reusable component library
- Kitchen and Mart storefronts
- Authentication with Convex Auth
- Cart and Wishlist stores
