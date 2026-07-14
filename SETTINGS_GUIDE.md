# Settings Guide — MB Crunchy V2

## Overview

All business rules are now **dynamic** and configurable through the Admin Panel. No hardcoded business values remain in the application.

## Settings Sections

### 1. Business Settings
**Route:** `/admin/settings/business`

| Field | Description | Used In |
|-------|-------------|---------|
| Business Name | Store name | Header, Footer, Checkout, Invoices |
| Tagline | Short brand description | Header, Footer |
| Email | Contact email | Footer, Contact page |
| Phone | Contact number | Footer, WhatsApp |
| WhatsApp | Business WhatsApp number | Order confirmations |
| Address | Physical address | Footer, Delivery |
| GST Number | Tax registration | Invoices, Orders |

### 2. Branding Settings
**Route:** `/admin/settings/branding`

| Field | Description | Used In |
|-------|-------------|---------|
| Primary Color | Main brand color (#C62828) | Theme, Buttons, Header |
| Secondary Color | Secondary brand color | Theme |
| Accent Color | Highlight color (#F9A825) | Promotions, Badges |
| Store Name | Override display name | Header, Footer |
| Tagline | Brand tagline | Header |
| About Text | About section | About page |

### 3. Payment Settings
**Route:** `/admin/settings/payments`

| Field | Description | Used In |
|-------|-------------|---------|
| UPI ID | UPI payment ID | Checkout |
| Cash on Delivery | Enable/disable COD | Checkout |
| UPI Payments | Enable/disable UPI | Checkout |
| WhatsApp Confirmation | Toggle WhatsApp confirmations | Order flow |

### 4. Delivery Settings
**Route:** `/admin/settings/delivery`

| Field | Description | Used In |
|-------|-------------|---------|
| Delivery Charge (₹) | Fixed delivery fee | Cart, Checkout |
| Free Delivery Above | Threshold for free delivery | Cart, Checkout |
| Estimated Time (min) | Average delivery time | Checkout |

### 5. Business Hours
**Route:** `/admin/settings/hours`

Per-day configuration:
- Open/Close toggle
- Opening time
- Closing time
- Closed day marking

**Used In:** Footer display

### 6. Security Settings
**Route:** `/admin/settings/security`

Features:
- Change Password
- Recovery Key Generation (shown once)
- Active Session Management
- Password Validation (min 8 chars)

### 7. System Settings
**Route:** `/admin/settings/system`

| Field | Description | Default |
|-------|-------------|---------|
| Currency | Currency code | INR |
| Currency Symbol | Display symbol | ₹ |
| Timezone | Store timezone | Asia/Kolkata |
| Order Prefix | Order number prefix | MB |
| GST Percent | Tax percentage | 5% |
| Packaging Charge | Per-order packaging fee | ₹10 |
| Free Delivery Threshold | Min for free delivery | ₹199 |
| Estimated Prep Time | Kitchen prep in minutes | 20 min |
| Estimated Delivery Time | Delivery in minutes | 30 min |

### 8. SEO Settings
Configured via Convex database. Contact admin to update.

| Field | Description |
|-------|-------------|
| Default Title | Page title template |
| Default Description | Meta description |
| OG Image | Open Graph share image |
| Twitter Handle | Twitter card handle |

### 9. Data Backup
**Route:** `/admin/data-backup`

- Export all data as JSON
- Export orders as CSV
- View backup history

## How Dynamic Settings Work

1. Admin updates settings in the Admin Panel
2. Settings are stored in Convex database tables
3. Frontend components use `useAppSettings()` hook to read settings
4. All business rules flow from Convex → hook → UI

This means:
- No code changes needed to update business rules
- Changes take effect immediately
- Consistent values across all pages
- Easy to export and backup
