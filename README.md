# 🍽️ MB Crunchy

**Fresh • Homemade • Premium**

A production-ready, mobile-first e-commerce application for a homemade food business. Built with React, TypeScript, Convex, and modern web technologies.

## Features

### Customer Experience
- **Premium Homepage** — Hero section, categories, featured products, offers, testimonials, newsletter
- **Kitchen Browsing** — Frozen foods, pizza, burgers, momos, pasta, combos, party packs with live search and filters
- **Mart Browsing** — Pickles, cold-pressed oils, honey, organic products, spices with advanced filtering
- **Responsive Design** — Perfect on 320px to 1440px screens
- **PWA Ready** — Service worker, web manifest, offline structure

### Admin Panel (22 pages)
- **Dashboard** — Stats, recent orders, quick actions
- **Product Management** — CRUD with bulk actions, duplicate, search, filter
- **Order Management** — 7-status workflow (Pending → Accepted → Preparing → Ready → Out for Delivery → Completed)
- **Category Management** — Nested tree with business type scoping
- **Content Management** — Banners, testimonials, blogs, FAQs, messages, newsletter
- **Settings** — Business info, branding/theming, payments, delivery, hours, security, audit logs, system

### Backend (Convex)
- 25+ database tables with proper indexes
- Full CRUD for all entities
- Security system (password, recovery keys, sessions, audit logging)
- Dashboard stats aggregation

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | TailwindCSS, shadcn/ui |
| Backend | Convex (serverless) |
| Animation | Framer Motion |
| Routing | React Router v7 |
| State | React Context |
| PWA | Service Worker, Web Manifest |

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd mb-crunchy

# Install dependencies
npm install

# Set up Convex
npx convex dev --once

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_CONVEX_URL` | Convex deployment URL (auto-configured) |
| `CONVEX_DEPLOY_KEY` | Convex deploy key (production only) |

## Project Structure

```
/
├── public/              # Static assets, PWA manifest, service worker
├── src/
│   ├── components/      # Reusable components (admin, layout, product, ui)
│   ├── convex/          # Backend functions (14 modules)
│   ├── data/            # Static product data
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities
│   ├── pages/           # Routes (38 pages total)
│   │   ├── admin/       # 22 admin pages
│   │   └── *.tsx        # 16 customer-facing pages
│   ├── store/           # State management (4 stores)
│   └── types/           # TypeScript types
├── ARCHITECTURE.md      # System architecture
├── DATABASE_SCHEMA.md   # Database schema reference
├── PROJECT_STRUCTURE.md # Route map & file structure
├── ADMIN_GUIDE.md       # Admin user guide
├── API_REFERENCE.md     # Convex API reference
├── CHANGELOG.md         # Version history
└── ROADMAP.md           # Future development plan
```

## Build Verification

```bash
npm run build            # Production build
npx convex dev --once    # Deploy backend
npx tsc -b --noEmit      # TypeScript check
```

## License

MIT

---

Built with ❤️ for small businesses
