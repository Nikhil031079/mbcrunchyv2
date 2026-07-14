# Backup & Restore Guide — MB Crunchy V2

## Overview

MB Crunchy provides a built-in data management system accessible from the admin panel at `/admin/data-backup`. This system allows you to export and import your business data.

## Exporting Data

### JSON Export (Full Backup)

From the **Admin Panel → Settings → Data Backup** page:

1. Click **"Export All (X records)"**
2. A JSON file will be downloaded containing all database tables:
   - Business Settings
   - Products & Categories
   - Orders & Order Items
   - Customers & Users
   - Coupons & Offers
   - Reviews & Inventory
   - Content (Blogs, FAQs, Banners, Testimonials)
   - Settings (Branding, Payments, Delivery, Hours, System, SEO)
   - Audit Logs

### CSV Export (Orders Only)

1. Click **"Export Orders as CSV"**
2. A CSV file will be downloaded with order data including:
   - Order Number, Customer, Phone, Items Count
   - Subtotal, Delivery Fee, Total
   - Status, Payment Method, Date

## Backup History

Every JSON export is logged in the backup history table, showing:
- File name
- Number of tables and records
- Timestamp

## Restoring Data

### JSON Import

1. Navigate to **Admin → Settings → Data Backup**
2. Click **"Click to Upload JSON File"**
3. Select a previously exported JSON file
4. The system will validate the file structure

> **Note:** Full server-side import requires admin approval. The current import mechanism validates the file structure client-side.

## Manual Backup via Convex Dashboard

For critical data, you can also export directly from the [Convex Dashboard](https://dashboard.convex.dev):

1. Navigate to your project
2. Go to the **Data** tab
3. Select each table and click **Export**

## Recovery Key Backup

Admin recovery keys are shown **only once** when generated. Store them securely:
- Password manager
- Encrypted file
- Physical printout

## Best Practices

1. **Daily backups** for active stores
2. **Before major changes** (schema updates, bulk imports)
3. **Store exports** in a secure cloud storage
4. **Test restore** periodically to verify data integrity
5. **Keep recovery keys** in a secure, offline location
