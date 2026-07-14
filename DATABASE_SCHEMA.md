# MB Crunchy — Database Schema

## Overview

25+ tables defined in `src/convex/schema.ts` using Convex's `defineSchema` and `defineTable`.

## Tables

### Users (`users`)
| Field | Type | Description |
|---|---|---|
| name | optional string | Customer/admin name |
| email | optional string | Email address |
| phone | optional string | Phone number |
| role | admin \| manager \| customer | User role |
| address, city, state, pincode | optional string | Delivery address |
| totalOrders | optional number | Lifetime order count |
| totalSpent | optional number | Lifetime spent |
| status | active \| blocked | Account status |

### Products (`products`)
| Field | Type | Description |
|---|---|---|
| businessType | kitchen \| mart | Product category type |
| categoryId | Id("categories") | Parent category |
| name | string | Product name |
| slug | string | URL slug (unique) |
| price | number | Selling price |
| mrp | optional number | Maximum retail price |
| discount | optional number | Discount percentage |
| weightValue, weightUnit | optional | Product weight |
| veg | boolean | Vegetarian indicator |
| stock, lowStockLimit | optional number | Inventory tracking |
| status | active \| inactive \| draft | Publication status |
| images, gallery | optional string[] | Image URLs |
| nutrition, ingredients, allergens | optional string | Product info |
| tags | optional string[] | Search tags |
| Indexes: slug, category, businessType, status, sku | | |

### Categories (`categories`)
| Field | Type | Description |
|---|---|---|
| name | string | Category name |
| slug | string | URL slug |
| businessType | kitchen \| mart \| both | Category scope |
| parentId | optional Id("categories") | Parent for nesting |
| sortOrder | optional number | Display order |
| status | active \| inactive | Publication status |
| Indexes: slug, parent, businessType | | |

### Orders (`orders`)
| Field | Type | Description |
|---|---|---|
| orderNumber | string | Unique order ID |
| customerId | Id("users") | Ordering customer |
| items | array | Order line items |
| subtotal, deliveryFee, discount, total | number | Pricing |
| status | pending → cancelled | Order lifecycle |
| paymentMethod | cash \| upi | Payment type |
| paymentStatus | pending \| paid \| failed \| refunded | Payment state |
| Indexes: orderNumber, customer, status, createdAt | | |

### Combos (`combos`)
| Field | Type | Description |
|---|---|---|
| productIds | Id("products")[] | Included products |
| comboPrice, mrp, savings | number | Pricing |
| status | active \| inactive | Visibility |

### Party Packs (`partyPacks`)
Same as combos + `serves` (number of people).

### Coupons (`coupons`)
| Field | Type | Description |
|---|---|---|
| code | string | Coupon code |
| type | percentage \| flat | Discount type |
| value, minOrder, maxDiscount | number | Discount rules |
| usageLimit, usedCount | optional number | Usage tracking |
| validFrom, validUntil | number | Validity window |
| Indexes: code, active | | |

### Other Tables
- **brands** — Product brands
- **orderItems** — Denormalized order line items
- **reviews** — Customer reviews with moderation workflow
- **offers** — Flash sales, festival offers (4 types)
- **inventory** — Stock tracking per product
- **stockHistory** — Audit trail for stock changes
- **deliveryCharges** — Fee rules by distance/minimum order
- **adminSessions** — Admin login sessions
- **recoveryKeys** — Password recovery keys (hashed, shown once)
- **auditLogs** — Immutable activity log
- **notifications** — Order/admin/system notifications
- **faqs** — Frequently asked questions
- **blogs** — Blog posts (draft/published)
- **banners** — Homepage banner ads
- **testimonials** — Customer testimonials
- **contactMessages** — Contact form submissions
- **newsletterSubscribers** — Email subscribers
- **businessHours** — Store operating hours (per day)
- **paymentSettings** — UPI, Cash, Razorpay config
- **brandingSettings** — Theme colors, store identity
- **businesses** — Business/store information
