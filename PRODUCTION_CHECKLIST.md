# Production Checklist — MB Crunchy V2

## Pre-Launch Checklist

### Configuration
- [ ] **Business Settings** configured (name, address, phone, email, GST)
- [ ] **Branding** customized (colors, store name, tagline)
- [ ] **Payment** settings configured (UPI ID, payment methods)
- [ ] **Delivery** charges set (fee, free threshold, estimated time)
- [ ] **Business Hours** configured (daily schedule, closed days)
- [ ] **System Settings** configured (currency, timezone, order prefix, GST%)
- [ ] **Admin Account** created and recovery keys saved

### Content
- [ ] **Products** added with images, prices, categories
- [ ] **Categories** created and organized
- [ ] **Banners** uploaded for homepage
- [ ] **Testimonials** added for social proof
- [ ] **FAQs** populated
- [ ] **Blog posts** added (optional)
- [ ] **Offers** created for promotions

### Technical
- [ ] `VITE_CONVEX_URL` environment variable set
- [ ] Convex functions deployed: `npx convex deploy`
- [ ] Frontend built: `npm run build`
- [ ] TypeScript: zero errors (`npx tsc -b --noEmit`)
- [ ] Convex: zero errors (`npx convex dev --once`)

### PWA
- [ ] All PWA icons uploaded to `/public/icons/`
- [ ] Service worker registered in `index.html`
- [ ] Manifest validated
- [ ] Offline page tested
- [ ] Install prompt works

### SEO
- [ ] SEO settings configured (title, description, OG image)
- [ ] All pages have unique titles
- [ ] Robots.txt configured
- [ ] Sitemap generated
- [ ] Canonical URLs working

### Security
- [ ] Admin password changed from default
- [ ] Recovery keys generated and saved securely
- [ ] Audit logging enabled
- [ ] Session management active

### Testing
- [ ] Customer flow tested (Home → Browse → Cart → Checkout → Order)
- [ ] Admin flow tested (All CRUD pages)
- [ ] Mobile responsive tested (320px - 1440px)
- [ ] UPI payment flow verified
- [ ] Cash on Delivery verified
- [ ] WhatsApp order message tested
- [ ] Order tracking verified

## Post-Launch

- [ ] Monitor Convex dashboard for errors
- [ ] Check audit logs regularly
- [ ] Backup data weekly
- [ ] Update CHANGELOG.md for each release
- [ ] Review analytics monthly

## Emergency Contacts

- **Convex Dashboard**: https://dashboard.convex.dev
- **Hosting Provider**: (your hosting provider dashboard)
