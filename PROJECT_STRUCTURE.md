# MB Crunchy — Project Structure

## Complete Route Map

### Customer Routes (wrapped in Layout)

| Path | Component | Description |
|---|---|---|
| `/` | Landing | Homepage with hero, categories, products, offers, testimonials |
| `/kitchen` | Kitchen | Browse kitchen products with filters, search, combos, party packs |
| `/mart` | Mart | Browse mart products with filters, search |
| `/offers` | Offers | Current promotions (placeholder) |
| `/about` | About | Business information |
| `/contact` | Contact | Contact form |
| `/blog` | Blog | Blog listing |
| `/faq` | FAQ | Frequently asked questions |
| `/wishlist` | Wishlist | Saved items |
| `/checkout` | Checkout | Order checkout (placeholder) |
| `/product/:id` | ProductDetails | Product detail view |
| `/order-tracking` | OrderTracking | Order status tracking |
| `/auth` | Auth | Login/register page |
| `*` | NotFound | 404 page |

### Admin Routes (wrapped in AdminLayout)

| Path | Component | Description |
|---|---|---|
| `/admin` | → redirects to `/admin/dashboard` | |
| `/admin/dashboard` | AdminDashboard | Stats, recent orders, quick actions |
| `/admin/products` | AdminProducts | Product CRUD with bulk actions |
| `/admin/categories` | AdminCategories | Nested category tree management |
| `/admin/orders` | AdminOrders | Order list with status workflow |
| `/admin/customers` | AdminCustomers | Customer list & management |
| `/admin/combos` | AdminCombos | Combo meal management |
| `/admin/coupons` | AdminCoupons | Coupon CRUD |
| `/admin/offers` | AdminOffers | Offer management |
| `/admin/reviews` | AdminReviews | Review moderation |
| `/admin/inventory` | AdminInventory | Stock tracking & low stock alerts |
| `/admin/blogs` | AdminBlogs | Blog post management |
| `/admin/faqs` | AdminFaqs | FAQ management |
| `/admin/banners` | AdminBanners | Homepage banner management |
| `/admin/testimonials` | AdminTestimonials | Customer testimonial management |
| `/admin/messages` | AdminMessages | Contact form inbox |
| `/admin/newsletter` | AdminNewsletter | Subscriber management |
| `/admin/settings/business` | AdminBusinessSettings | Store information |
| `/admin/settings/branding` | AdminBranding | Theme colors & store identity |
| `/admin/settings/payments` | AdminPayments | Payment method configuration |
| `/admin/settings/delivery` | AdminDelivery | Delivery charges & timing |
| `/admin/settings/hours` | AdminBusinessHours | Operating hours (per day) |
| `/admin/settings/security` | AdminSecurity | Password, recovery keys, sessions |
| `/admin/settings/system` | AdminSystemSettings | Currency, timezone, maintenance |
| `/admin/audit-logs` | AdminAuditLogs | Immutable activity log |

## Directory Structure

```
/
├── public/
│   ├── sw.js                   # Service Worker
│   ├── manifest.webmanifest    # PWA manifest
│   ├── favicon.svg             # Favicon
│   └── icons/                  # App icons
├── src/
│   ├── components/
│   │   ├── admin/              # 5 reusable admin components
│   │   ├── layout/             # 7 layout components
│   │   ├── product/            # 5 product browsing components
│   │   └── ui/                 # shadcn/ui primitives
│   ├── convex/                 # 14 backend files
│   ├── data/                   # Static product data
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities
│   ├── pages/
│   │   ├── admin/              # 22 admin pages
│   │   └── *.tsx               # 16 customer-facing pages
│   ├── store/                  # 4 state providers
│   └── types/                  # TypeScript types
└── Documentation files (root)
```

## Component Reuse

| Component | Used By |
|---|---|
| ConfirmDialog | All admin CRUD pages (delete confirmations) |
| EmptyState | Admin pages with no data |
| AdminTable | Product, order, customer tables |
| LoadingSkeleton | Admin pages during data fetch |
| AdminStatsCard | Dashboard stat cards |
| ProductCard | Kitchen, Mart browsing pages |
| ProductFilters | Kitchen, Mart search/filter |
| ComboCard | Kitchen combos section |
| FloatingCart | Kitchen, Mart mobile view |
