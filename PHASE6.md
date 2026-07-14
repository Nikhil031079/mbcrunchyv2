# MB Crunchy — Phase 6: Business Operations & Customer Experience

## Overview

Phase 6 transforms MB Crunchy into a production-ready business application with a Kitchen Dashboard, full Offers Engine, Reports & CSV Export, Order Receipt, and enhanced operational tools.

## New Pages

### Kitchen Dashboard (`/admin/kitchen-dashboard`)
- Large order cards with timer, priority indicators, and status badges
- Accept/Reject workflow with "Start Prep" and "Mark Ready" buttons
- Urgent/overdue alerts (15min/25min thresholds)
- Search, filter by status, stats counters
- Customer notes display

### Order Receipt (`/receipt/:orderNum`)
- Professional printable receipt with MB Crunchy branding
- Customer details, itemized table with quantities and prices
- Delivery/takeaway info, totals breakdown
- QR code placeholder, print button, PDF download stub
- Hidden when printing (`no-print` class)

### Offers Engine (`/admin/offers`) — Fully Enhanced
- 4 offer types: Flash Sales, Festival Offers, Category Offers, Product Offers
- Create form with title, discount (percent + flat), min order, coupon code
- Visual type cards with gradient backgrounds and counts
- Search, filter, CRUD operations
- Active/inactive status toggle

### Reports (`/admin/reports`)
- CSV export for 4 report types: Orders, Products, Customers, Inventory
- Business summary with revenue, order count, product count, active coupons
- One-click download with progress indicator
- Real-time data from Convex

## Enhanced Features

### Order Management
- Color-coded status workflow (pending → accepted → preparing → ready → completed)
- Timestamps at each status transition
- Cancellation with reason
- Search and filter

### Settings
- Business hours (per-day with time picker)
- Delivery charges configuration
- Payment methods (Cash + UPI)
- Account security with password, recovery keys, sessions
- Audit log with search

## Build Status
- `npx tsc -b --noEmit` — ✅ Zero TypeScript errors
- `npx convex dev --once` — ✅ Deployed successfully
