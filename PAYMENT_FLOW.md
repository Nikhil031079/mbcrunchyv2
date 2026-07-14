# MB Crunchy — Payment Flow

## Current Implementation

### Cash on Delivery
- No payment gateway integration
- Customer pays in cash at delivery or pickup
- Payment status: `pending` until manually marked `paid`
- Simple, no additional setup required

### UPI Payments
- No payment gateway (no Razorpay/Stripe)
- Business UPI ID: `mbcrunchy@upi` (configurable in admin)
- QR code displayed on checkout page (placeholder)
- Customer scans, pays via any UPI app (Google Pay, PhonePe, Paytm)
- Customer clicks "I have completed payment" to confirm
- Optional transaction reference number for manual verification
- Payment screenshot upload (placeholder, future)

## Manual Verification Flow

1. Customer places order → Payment status = `pending`
2. If UPI: Customer completes payment externally, clicks confirmation
3. Admin sees payment status in orders panel
4. Admin can manually verify UPI transaction reference
5. Admin marks payment as `paid` in order management

## Future Integration (Phase 7+)

When ready to integrate Razorpay:
1. Enable Razorpay toggle in Admin > Payment Settings
3. Customer redirected to Razorpay checkout
4. Webhook updates order payment status automatically
5. Fallback to manual verification remains available

## Configuration

Admin panel at `/admin/settings/payments`:
- Enable/disable Cash on Delivery
- Enable/disable UPI payments
- Set UPI ID
- Toggle WhatsApp payment confirmation

## Free Architecture

- No paid payment gateway APIs
- No monthly subscription fees
- UPI: Free via any UPI app
- Cash: No transaction fees
- Manual verification: Zero cost
