# MB Crunchy — Reports & Exports

## Available Reports

### Orders Report
| Column | Description |
|---|---|
| Order # | Unique order identifier |
| Customer | Customer name or "Guest" |
| Items | Count of items in order |
| Total | Order total (₹) |
| Status | Current order status |
| Payment | Payment method |
| Type | Delivery or Takeaway |
| Date | Order date |

### Products Report
| Column | Description |
|---|---|
| Name | Product name |
| SKU | Stock keeping unit |
| Category | Category ID |
| Price | Selling price |
| MRP | Maximum retail price |
| Stock | Current stock level |
| Status | Active/Inactive/Draft |
| Veg | Veg or Non-Veg |
| Business Type | Kitchen or Mart |

### Customers Report
Structure ready for when customer data is populated.

### Inventory Report
| Column | Description |
|---|---|
| Product | Product name |
| SKU | Stock keeping unit |
| Stock | Current stock quantity |
| Low Stock Limit | Alert threshold |
| Status | Product status |

## Export Formats
- **CSV**: Comma-separated values, opens in Excel/Google Sheets
- Future: PDF, Excel (XLSX)

## How to Export
1. Navigate to Admin → Reports
2. Click "Export CSV" on the desired report card
3. File downloads automatically

## Business Summary
The Reports page also shows a quick summary:
- Total Revenue
- Total Orders
- Total Products
- Active Coupons
