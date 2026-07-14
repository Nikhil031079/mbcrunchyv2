# MB Crunchy — Architecture

## Overview

MB Crunchy is a production-ready, mobile-first e-commerce application for a homemade food business. Built with React, TypeScript, Vite, TailwindCSS, and Convex.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Build | Vite |
| Styling | TailwindCSS + shadcn/ui |
| Backend | Convex (serverless database + functions) |
| Auth | Convex Auth |
| Animation | Framer Motion |
| Routing | React Router v7 |
| State | React Context (Cart, Wishlist, User, Settings) |
| PWA | Service Worker + Web Manifest |

## Project Structure

```
/
├── public/                  # Static assets, PWA manifest, icons
├── src/
│   ├── components/
│   │   ├── admin/           # Reusable admin components
│   │   │   ├── AdminStatsCard.tsx
│   │   │   ├── AdminTable.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── LoadingSkeleton.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileBottomNav.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── product/         # Product browsing components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── CategoryBanner.tsx
│   │   │   ├── ComboCard.tsx
│   │   │   └── FloatingCart.tsx
│   │   └── ui/              # shadcn/ui components
│   ├── convex/              # Convex backend
│   │   ├── schema.ts        # Database schema (25+ tables)
│   │   ├── products.ts      # Product CRUD
│   │   ├── categories.ts    # Category CRUD (nested)
│   │   ├── orders.ts        # Order management
│   │   ├── customers.ts     # Customer queries
│   │   ├── combos.ts        # Combo & party pack CRUD
│   │   ├── coupons.ts       # Coupon CRUD + validation
│   │   ├── offers.ts        # Offer management
│   │   ├── reviews.ts       # Review moderation
│   │   ├── inventory.ts     # Stock management
│   │   ├── content.ts       # Blogs, FAQs, banners, testimonials, messages, newsletter
│   │   ├── settings.ts      # Business settings, branding, delivery, payments, hours, dashboard stats
│   │   ├── security.ts      # Password, recovery keys, sessions, audit logs
│   │   └── users.ts         # User helpers
│   ├── data/                # Static product data (Phase 3 placeholder)
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Route pages
│   │   ├── admin/           # Admin panel pages (22 pages)
│   │   ├── Landing.tsx      # Homepage
│   │   ├── Kitchen.tsx      # Kitchen browsing
│   │   └── Mart.tsx         # Mart browsing
│   ├── store/               # State management (Context + Providers)
│   └── types/               # TypeScript interfaces
```

## Routing

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for the complete route map.

## Component Hierarchy

```
App
├── StoreProviders
│   ├── CartProvider
│   ├── WishlistProvider
│   ├── UserProvider
│   └── SettingsProvider
├── Routes
│   ├── Layout (customer-facing)
│   │   ├── Header (sticky, with search & nav)
│   │   ├── <Outlet /> (page content)
│   │   ├── Footer
│   │   └── MobileBottomNav
│   └── AdminLayout (admin panel)
│       ├── AdminSidebar
│       └── <Outlet /> (admin page content)
```

## Data Flow

- **Customer browsing:** React Context stores (Cart, Wishlist) hold transient state. Product data comes from Convex queries.
- **Admin panel:** Direct Convex queries/mutations for all CRUD operations with real-time reactivity.
- **Auth:** Convex Auth provides email OTP authentication. Admin uses the same system with role-based access.

## Future Extension Points

- Payment Gateway (Razorpay/Stripe)
- WhatsApp Ordering Integration
- Admin Role Management (Super Admin, Manager, Staff)
- Image Upload (local → cloud storage)
- Reviews & Ratings (verified purchase flow)
- Real-time Order Tracking
- Push Notifications
- Multi-language Support
