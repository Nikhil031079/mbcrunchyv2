# MB Crunchy — Order Flow

## Order Lifecycle

```
pending → accepted → preparing → ready → out-for-delivery → completed
                                                                  
pending → cancelled (at any stage before completion)
```

## Order Statuses

| Status | Description | Customer Display |
|---|---|---|
| Pending | Order received, awaiting confirmation | "Order Placed" |
| Accepted | Restaurant confirmed the order | "Accepted" |
| Preparing | Food is being cooked | "Preparing" |
| Ready | Food is packed and ready | "Ready" |
| Out for Delivery | On the way to customer | "Out for Delivery" |
| Completed | Delivered successfully | "Delivered 🎉" |
| Cancelled | Order cancelled | "Cancelled" |

## Order Creation

- **Guest checkout**: No authentication required
- Order number format: `MB-{timestamp_base36}-{random_4_chars}`
- Orders stored in Convex `orders` table
- Items stored within the order document

## Order Tracking

- Track at `/order-tracking`
- Enter order number to look up status
- Visual timeline showing current status and all completed steps
- Demo orders available: MB-DEMO-001 through MB-DEMO-004

## WhatsApp Integration

After placing an order, customers can share via WhatsApp with:
- Order number
- Customer name and phone
- Order type (Delivery/Takeaway)
- Delivery address (if applicable)
- Itemized list with quantities and prices
- Subtotal, delivery fee, and total
- Payment method and status
- Any notes
