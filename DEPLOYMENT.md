# Deployment Guide — MB Crunchy V2

## Prerequisites

- Node.js 18+ and npm
- A Convex account (free tier)
- Git (for version control)

## Environment Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a Convex project at [convex.dev](https://convex.dev)
4. Copy `.env.example` to `.env.local` and add your Convex URL:
   ```
   VITE_CONVEX_URL=https://your-project.convex.cloud
   ```

## Local Development

Start the development server:
```bash
npm run dev
```

Deploy Convex functions in development mode:
```bash
npx convex dev
```

## Production Build

1. Build the frontend:
   ```bash
   npm run build
   ```
   Output will be in the `dist/` directory.

2. Deploy Convex functions to production:
   ```bash
   npx convex deploy
   ```

## PWA Requirements

Ensure all PWA icons exist in `/public/icons/`:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

The service worker `/public/sw.js` is registered from `index.html`.

## Hosting Options

### Static Hosting (Vercel, Netlify, Cloudflare Pages)
- Build output: `dist/`
- Set `VITE_CONVEX_URL` as an environment variable
- Configure SPA fallback: redirect all routes to `/index.html`

### Convex Hosting
Convex provides hosting for your functions. The frontend can be deployed to any static host.

## Post-Deployment Checklist

1. ✅ Admin panel accessible at `/admin/dashboard`
2. ✅ Business settings configured
3. ✅ Payment methods (UPI, Cash) configured
4. ✅ Delivery charges set
5. ✅ Business hours configured
6. ✅ SEO settings added
7. ✅ Service worker registered
8. ✅ Manifest linked

## Troubleshooting

### Blank page on deploy
- Ensure `VITE_CONVEX_URL` is set correctly
- Check browser console for errors
- Verify all lazy-loaded routes resolve

### Convex errors
- Run `npx convex dev --once` to push latest functions
- Check Convex dashboard at dashboard.convex.dev

### PWA not installing
- Ensure the app is served over HTTPS
- Verify all icons exist in `/public/icons/`
- Check that `manifest.webmanifest` is valid JSON
