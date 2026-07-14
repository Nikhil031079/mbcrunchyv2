# MB Crunchy — API Reference

All backend functions are defined as Convex queries/mutations in `src/convex/`. They are auto-imported through `convex/_generated/api`.

## Products (`convex/products.ts`)

### Queries
- `list({ businessType?, categoryId?, status?, search?, veg?, limit? })` — Filtered product list
- `getById({ id })` — Single product by ID
- `getBySlug({ slug })` — Single product by slug

### Mutations
- `create({ businessType, categoryId, name, slug, price, veg, status, ... })` — Create product
- `update({ id, ...fields })` — Update product fields
- `remove({ id })` — Delete product
- `updateStatus({ ids: Id[], status })` — Bulk status update
- `duplicate({ id })` — Clone product with "(Copy)" suffix

## Categories (`convex/categories.ts`)

### Queries
- `list({ businessType?, status? })` — Filtered category tree
- `getById({ id })` — Single category

### Mutations
- `create({ name, slug, businessType, status, parentId?, ... })` — Create category
- `update({ id, ... })` — Update category
- `remove({ id })` — Delete category

## Orders (`convex/orders.ts`)

### Queries
- `list({ status?, customerId?, limit? })` — Order list with filters
- `getById({ id })` — Single order
- `getByOrderNumber({ orderNumber })` — Lookup by order number
- `getRecentOrders({ limit? })` — Latest orders
- `getStats({})` — Order statistics

### Mutations
- `create({ customerId, items, subtotal, total, paymentMethod, ... })` — Place order
- `updateStatus({ id, status, cancellationReason? })` — Advance order status

## Coupons (`convex/coupons.ts`)

### Queries
- `list({ isActive? })` — Coupon list
- `getById({ id })` — Single coupon
- `validate({ code, orderTotal })` — Validate coupon for use

### Mutations
- `create({ code, type, value, validFrom, validUntil, ... })` — Create coupon
- `update({ id, ... })` — Update coupon
- `remove({ id })` — Delete coupon

## Customers (`convex/customers.ts`)

### Queries
- `list({ search?, limit? })` — Customer list

## Inventory (`convex/inventory.ts`)

### Queries
- `getByProduct({ productId })` — Stock for product
- `listAlerts({})` — Low stock alerts

### Mutations
- `update({ productId, quantity })` — Set stock level

## Reviews (`convex/reviews.ts`)

### Queries
- `list({ productId?, status? })` — Review list with moderation filters

### Mutations
- `updateStatus({ id, status })` — Approve/reject/pin/hide review

## Content (`convex/content.ts`)

### Queries
- `listBanners({})` / `listTestimonials({})` / `listBlogs({})` / `listFaqs({})`
- `listContactMessages({})` / `listSubscribers({})`

### Mutations
- CRUD for banners, testimonials, blogs, FAQs
- `markAsRead({ id })` — Mark contact message as read
- `removeContactMessage({ id })`
- `removeSubscriber({ id })`

## Settings (`convex/settings.ts`)

### Queries
- `getBusiness({})`, `getBranding({})`, `getPaymentSettings({})`
- `listDeliveryCharges({})`, `listBusinessHours({})`
- `getDashboardStats({})` — Aggregated stats for admin dashboard

### Mutations
- `updateBusiness({...})`, `updateBranding({...})`, `updatePaymentSettings({...})`
- `updateDeliveryCharges({...})`, `updateBusinessHours({ hours })`

## Security (`convex/security.ts`)

### Queries
- `listAuditLogs({ limit?, userId? })`
- `listRecoveryKeys({})`
- `listSessions({})`
- `getSecurityInfo({})`
- `validateRecoveryKey({ key })`

### Mutations
- `logAudit({ action, entityType, entityId?, details? })`
- `generateRecoveryKey({})`
- `useRecoveryKey({ key })`
- `revokeRecoveryKey({ keyId })`
- `revokeSession({ sessionId })`
- `changePassword({ currentPassword, newPassword })`
- `resetPassword({ recoveryKey, newPassword })`
