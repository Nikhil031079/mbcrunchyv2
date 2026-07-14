# MB Crunchy V2 — Release Notes v1.0.0

**Release Date:** July 2026  
**Version:** v1.0.0  
**Status:** Production Ready

---

## Overview

MB Crunchy V2 is a production-ready food ordering and grocery platform built with React, Vite, Convex, and Tailwind CSS. It serves as a complete business management system for a food/kitchen and mart business.

## Features

### Customer Experience
- **Homepage** with hero, categories, featured products, offers, testimonials
- **Kitchen & Mart** storefronts for browsing products
- **Product Details** with gallery, nutrition info, reviews
- **Cart** with quantity management, coupon support, savings
- **5-Step Checkout** — Customer Details → Order Type → Payment → Review → Place
- **UPI Payment** with QR code and manual verification
- **Cash on Delivery** support
- **WhatsApp Order Confirmation** with formatted message
- **Order Tracking** with visual status timeline
- **Wishlist** with move-to-cart
- **Guest Checkout** — no login required to order

### Admin Panel (24+ Pages)
- **Dashboard** with revenue, orders, products, customers stats
- **Kitchen Dashboard** with order cards, timer, accept/reject workflow
- **Products, Categories, Orders, Customers** — Full CRUD
- **Combos, Coupons, Offers** — Marketing management
- **Reviews** — Moderation workflow (approve/reject/pin/feature)
- **Inventory** — Stock levels and low stock alerts
- **Content** — Blogs, FAQs, Banners, Testimonials, Messages, Newsletter
- **Settings** — Business, Branding, Payments, Delivery, Hours, Security, System
- **Reports** — CSV export for orders, products, customers, inventory
- **Audit Logs** — Immutable event tracking

### Business Logic
- **Dynamic Settings** — All business rules configurable from Admin Panel
- **Delivery Charges** — Configurable fee and free delivery threshold
- **Business Hours** — Per-day schedule
- **GST Calculation** — Configurable percentage in checkout
- **Order Numbering** — Configurable order prefix
- **Social Media Links** — Configurable in settings

### Technical
- **PWA** — Installable, offline page, service worker caching
- **SEO** — Dynamic meta tags, Open Graph, Twitter Cards, Structured Data
- **Security** — Password management, recovery keys, session management
- **Data Backup** — JSON export of all data, CSV export of orders
- **Lazy Loading** — All routes and admin pages code-split
- **Responsive** — Mobile-first design, 320px to 4K

## Technical Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite 7 | Build Tool |
| Tailwind CSS 4 | Styling |
| Convex | Backend & Database |
| Convex Auth | Authentication |
| Framer Motion | Animations |
| React Router 7 | Routing |
| Lucide React | Icons |
| Sonner | Toast Notifications |

## Database

28+ tables covering:
- Products, Categories, Brands, Combos, Party Packs
- Orders, Order Items, Coupons, Offers
- Reviews, Inventory, Stock History
- Users, Admin Sessions, Recovery Keys
- Audit Logs, Notifications
- FAQs, Blogs, Banners, Testimonials
- Contact Messages, Newsletter Subscribers
- Business Hours, Payment Settings, Branding Settings
- System Settings, SEO Settings, Backup History

## Known Limitations

See `KNOWN_LIMITATIONS.md` for full details.

Key limitations:
- No paid payment gateway (COD + manual UPI only)
- No push notifications
- No SMS/email notifications
- Kitchen dashboard uses demo data
- Offers page uses demo data

## Previous Versions

- **v0.1** — Foundation & UI (Phases 1-2)
- **v0.2** — Admin Panel Core (Phase 3)
- **v0.3** — Backend Foundation (Phase 4)
- **v0.4** — Customer Journey & Checkout (Phase 5)
- **v0.5** — Business Operations (Phase 6)
- **v0.6** — Production Readiness (Phase 7)
- **v1.0.0** — Production Launch (Phase 8)

## Thank You

MB Crunchy V2 is built with ❤️ for fresh, homemade, premium food.
