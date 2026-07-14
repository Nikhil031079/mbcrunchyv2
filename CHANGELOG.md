# MB Crunchy — Changelog

## Phase 4 — Backend Foundation Complete
**Focus:** Convex database, admin panel, security, settings

### Database (25+ tables)
- Complete Convex schema with products, categories, orders, combos, party packs, coupons, offers, reviews, inventory, stock history, delivery charges, notifications, FAQs, blogs, banners, testimonials, contact messages, newsletter subscribers, business hours, payment settings, branding settings, admin sessions, recovery keys, audit logs

### Admin Panel (22 pages)
- Dashboard with 8 stat cards, recent orders, quick actions
- Products CRUD with search, bulk actions, duplicate
- Orders with status workflow (7 statuses)
- Categories with nested tree view
- Combos, Coupons, Offers, Reviews, Inventory
- Content management (Banners, Testimonials, Blogs, FAQs, Messages, Newsletter)
- Settings (Business, Branding, Payments, Delivery, Hours, Security, Audit Logs, System)

### Security
- Password change with validation
- Recovery key generation (shown once, stored hashed)
- Session management with revoke
- Immutable audit logging
- Forgot password flow via recovery keys

### Build Verification
- `npm run build` — Passes
- `npx convex dev --once` — Deployed successfully
- `npx tsc -b --noEmit` — Zero TypeScript errors

---

## Phase 3 — Kitchen & Mart Browsing
**Focus:** Product browsing experience with static data

- 180+ static products across 18 categories + combos + party packs
- Reusable ProductCard, CategoryBanner, ProductFilters, ComboCard
- FloatingCart component for mobile
- Live search, veg/non-veg filters, sort by price/rating/discount/name
- Sticky horizontal category navigation with scroll tracking
- 4 value combos + 3 party packs

---

## Phase 2 — Premium Homepage
**Focus:** Visual design, brand identity, customer trust

- Premium theme (rounded corners, subtle shadows, elegant gradients)
- Sticky header with frame-motion animated mobile menu
- 8-section landing page (Hero, Categories, Featured Products, Offers, Why Us, Testimonials, Download App, Newsletter)
- Animated food cards, floating emoji elements
- Professional footer with social links, contact info

---

## Phase 1 — Project Foundation
**Focus:** Architecture, routing, layout components

- React + Vite + TypeScript project setup
- React Router with 15 routes + lazy loading
- Layout components (Header, Footer, MobileBottomNav, SearchBar)
- State management stores (Cart, Wishlist, User, Settings)
- PWA setup (manifest, service worker)
- Neobrutalism theme (square corners, 2px borders, flat color blocking)
