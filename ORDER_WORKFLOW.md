# MB Crunchy — Order Workflow

## Order Lifecycle

```
Pending → Accepted → Preparing → Ready → Out for Delivery → Completed
                                                                        
Pending → Cancelled (at any stage before Completion)
```

## Status Details

| Status | Admin Action | Kitchen Dashboard | Customer View |
|---|---|---|---|
| Pending | Accept or Reject | Timer starts, priority check | "Order Placed" |
| Accepted | Start Preparation | "Start Prep" button, timer running | "Order Accepted" |
| Preparing | Mark Ready | Timer running, urgent at 15min | "Being Prepared" |
| Ready | Out for Delivery / Complete | Green ring, timer stops | "Ready" |
| Out for Delivery | Mark Completed | — | "On the Way" |
| Completed | — | Archival | "Delivered 🎉" |
| Cancelled | Provide reason | Removed from active view | "Cancelled" |

## Kitchen Dashboard

### Features
- **Order Cards**: Large, color-coded cards with order details
- **Timer**: Elapsed time since order placement
- **Priority Alerts**: 
  - ⚠️ Urgent (15+ minutes)
  - 🔴 Overdue (25+ minutes)
- **Status Workflow**: One-click Accept → Start Prep → Mark Ready
- **Search & Filter**: By order number/customer name, status filter tabs
- **Stats**: Count of orders in each status

### Timer Display
- Under 15 min: Normal (muted foreground)
- 15-25 min: Urgent (amber, with "Urgent" label)
- Over 25 min: Overdue (red, with "Overdue!" label + pulse animation)

## Order Receipt

### Printable Layout
- MB Crunchy branding header
- Order number, date, status, payment method
- Customer details (name, phone, email, address if delivery)
- Itemized table with quantities and unit prices
- Subtotal, delivery fee, discount, total
- QR code placeholder for order tracking
- Thank you message

### Actions
- 🖨️ Print: Opens browser print dialog
- 📥 Download PDF: Future enhancement

## Admin Order Management

### Status Workflow Buttons
- Next status progression button for each stage
- Click advances to the next appropriate status
- Cancel button available at any stage (with reason)

### Filtering
- Status filter pills (All, Pending, Accepted, etc.)
- Text search by order number or customer name
