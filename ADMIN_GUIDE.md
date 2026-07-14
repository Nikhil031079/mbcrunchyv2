# MB Crunchy — Admin Guide

## Accessing the Admin Panel

Navigate to `/admin` on your MB Crunchy website. The admin panel requires authentication (coming in Phase 5).

## Layout

- **Desktop:** Left sidebar with collapsible navigation + content area
- **Mobile:** Hamburger menu with slide-out sidebar + sticky top bar
- Breadcrumb navigation is available on all pages

## Dashboard

The dashboard provides:
- **8 stat cards:** Orders, Revenue, Products, Customers, Pending Orders, Pending Reviews, Active Coupons, Low Stock Items
- **Recent Orders:** Last 5 orders with status indicators
- **Quick Actions:** Add Product, View Orders, Manage Categories, Create Coupon

## Product Management

1. Navigate to **Products** in the sidebar
2. Use the search bar to find products by name or SKU
3. Filter by status (all/active/inactive)
4. **Bulk actions:** Select products via checkboxes, then Activate/Deactivate
5. **Individual actions:** Edit, Duplicate, Delete via action icons
6. Sort by clicking column headers

## Order Management

1. Navigate to **Orders** in the sidebar
2. Filter by status using the pill buttons (All, Pending, Accepted, etc.)
3. Search by order number or customer name
4. Click **Next Status** button to progress orders through the workflow:
   - Pending → Accepted → Preparing → Ready → Out for Delivery → Completed
5. Click **Cancel** to cancel an order at any stage

## Category Management

1. Navigate to **Categories**
2. View categories as a nested tree
3. Create new categories with business type (Kitchen/Mart/Both)
4. Set parent category for nesting
5. Toggle active/inactive status

## Settings

### Business Settings
- Store name, tagline, address, contact information, GST number

### Branding
- Primary, secondary, and accent colors (color picker + hex input)
- Store name, tagline, about text
- Live color preview

### Payments
- Enable/disable Cash on Delivery and UPI
- Set UPI ID for digital payments
- Toggle WhatsApp payment confirmation

### Delivery
- Set delivery charge amount
- Free delivery threshold
- Estimated delivery time

### Business Hours
- Per-day toggle for open/closed
- Opening and closing time picker
- Sunday defaults to closed

### Account Security
- **Change Password:** Current password + new password (min 8 chars)
- **Recovery Keys:** Generate new key (shown only once — save immediately!)
- **Active Sessions:** View and revoke sessions

### Audit Logs
- Immutable record of all admin actions
- Search by action or entity type
- Tracked events: Create, Update, Delete, Login, Logout, Password changes, Recovery key operations

### System Settings
- Currency (INR/USD/EUR/GBP)
- Timezone
- Maintenance mode toggle
- Version info and data management options

## Content Management

- **Banners:** Create homepage banners with drag-to-reorder, preview, and status toggle
- **Testimonials:** Customer reviews with star ratings, responsive card grid
- **Blogs:** Blog post draft/publish workflow
- **FAQs:** Question/answer pairs with ordering
- **Contact Messages:** Inbox for form submissions with read/unread tracking
- **Newsletter:** Subscriber list with export capability

## Security Best Practices

1. Keep recovery keys in a safe place (password manager)
2. Revoke unused sessions regularly
3. Use strong passwords (min 8 characters, mixed case)
4. Monitor audit logs for suspicious activity
5. Generate new recovery keys before old ones expire
