# MB Crunchy — Checkout Flow

## User Flow

1. **Cart** → Click "Proceed to Checkout"
2. **Step 1: Customer Details** → Name (required), Phone (required, 10 digits), Email (optional)
3. **Step 2: Order Type** → Choose Takeaway (free) or Delivery (₹29 or free if subtotal ≥ ₹199)
   - If Delivery: Show address fields (House No, Street, Landmark, Area, City, State, Pincode)
   - If Takeaway: Hide address fields
4. **Step 3: Payment** → Choose Cash on Delivery or UPI
   - If UPI: Show QR code placeholder, UPI ID (mbcrunchy@upi), copy button, "I have completed payment" toggle
5. **Step 4: Review** → Full order review (customer info, order type, items, payment, totals)
6. **Step 5: Place Order** → Animation, order number generated, cart cleared, redirect to success view

## Key Components

- Checkout page at `/checkout` in `src/pages/Checkout.tsx`
- 5-step progress indicator at top
- Order summary sidebar (sticky on desktop)
- Back/Next navigation between steps
- Form validation at each step

## Delivery Charges

| Order Type | Subtotal | Delivery Fee |
|---|---|---|
| Takeaway | Any | ₹0 |
| Delivery | < ₹199 | ₹29 |
| Delivery | ≥ ₹199 | ₹0 (Free) |

## Payment Methods

- **Cash on Delivery**: No extra steps, pay at delivery/pickup
- **UPI**: QR code display, UPI ID copy, payment confirmation toggle, optional transaction reference
