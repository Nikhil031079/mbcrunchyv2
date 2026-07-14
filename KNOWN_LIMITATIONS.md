# Known Limitations — MB Crunchy V2 v1.0.0

## Current Limitations

### Payment
- **No Online Payment Gateway**: Payments are currently limited to Cash on Delivery and UPI (manual verification). Razorpay/Stripe integration ready in schema but not wired.
- **UPI Payment**: Payment confirmation is manual (customer marks as paid). No automatic UPI verification.
- **No Payment Webhook**: No webhook endpoint for payment gateway callbacks.

### Authentication
- **Email/Password Only**: Currently configured for email/password auth. Social login (Google, GitHub) can be added via Convex Auth config.
- **No Phone OTP**: Phone verification not implemented. Phone input is used but not verified.

### Notifications
- **No Push Notifications**: Browser push notifications not implemented. Architecture is ready but requires integration.
- **No SMS**: SMS notifications not implemented (would require paid SMS API).
- **No Email**: Email notifications not implemented. Architecture prepared for future integration.

### Delivery
- **No Real-Time Tracking**: No GPS/live tracking for delivery orders.
- **No Zone-Based Delivery**: Delivery radius is a single value. Multi-zone delivery not implemented.
- **No Auto-Assignment**: Orders are manually accepted in Kitchen Dashboard.

### Inventory
- **No Auto-Restock Alerts**: Low stock alerts shown in dashboard but no automated notifications.

### Mobile App
- **No Native App**: PWA serves as mobile app. Android/iOS native apps planned.

### SEO
- **No Dynamic Sitemap**: Sitemap generation is prepared but not fully wired to route system.

### Performance
- **No CDN**: Static assets served from app host. CDN recommended for production.

### Kitchen Dashboard
- **Uses Demo Data**: Kitchen dashboard shows demo orders. Real-time Convex integration for live orders is pending.

### Offers Engine
- **Demo Offers**: Offers page shows demo offers. Convex integration for full CRUD is pending.

## Architecture Decisions

- **No Paid APIs**: The application intentionally avoids paid services to keep it free to operate
- **Manual UPI Verification**: Admin manually verifies UPI payments from dashboard
- **Client-Side Cart**: Cart is stored in localStorage, not synced across devices
- **Guest Checkout**: Orders can be placed without login using device ID
