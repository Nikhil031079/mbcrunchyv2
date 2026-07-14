# PWA Guide — MB Crunchy V2

## Overview

MB Crunchy is a full Progressive Web Application (PWA) that can be installed on mobile and desktop devices, providing a native-app-like experience.

## Features

- **Installable** — Add to home screen on Android, iOS, and desktop
- **Offline Support** — Basic offline page and cached assets
- **Fast Loading** — Service worker caches static assets
- **App-like UI** — Standalone display mode, no browser chrome
- **Theme Color** — Brand-consistent status bar color

## Technical Implementation

### Service Worker
**File:** `/public/sw.js`

The service worker uses a **network-first, cache-fallback** strategy:

1. **Static Assets** (CSS, JS, images): Cache-first with background network update
2. **HTML Navigation**: Network-first, falls back to cache, then offline page
3. **API Requests**: Network-only (no caching)
4. **Convex Connections**: Bypassed entirely

### Web App Manifest
**File:** `/public/manifest.webmanifest`

Includes:
- App name and description
- Icon set (72px to 512px, including maskable)
- Display mode: `standalone`
- Orientation: `portrait-primary`
- Theme color: `#C62828`

### Registration
Service worker is registered from `/index.html`:
```html
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
</script>
```

## Icon Requirements

Place these icons in `/public/icons/`:

| Size | Purpose |
|------|---------|
| 72x72 | Old Android |
| 96x96 | Chrome |
| 128x128 | Chrome |
| 144x144 | IE/Edge |
| 152x152 | iOS Safari |
| 192x192 | Standard (maskable) |
| 384x384 | Chrome |
| 512x512 | App Icon (maskable) |

## Offline Page

**File:** `/src/pages/Offline.tsx`  
**Route:** `/offline`

Shown when the user is offline and the requested page isn't cached. Features:
- Friendly offline message
- Retry button
- Link to home page

## Testing PWA

### Chrome DevTools
1. Open Chrome DevTools → **Application** tab
2. Check **Manifest** section for proper PWA setup
3. Check **Service Workers** section for registration status
4. Use **Lighthouse** → PWA audit

### Manual Testing
1. Build the app: `npm run build`
2. Serve with: `npm run preview`
3. Open in Chrome
4. Check for install prompt (address bar icon)
5. Test offline mode (DevTools → Network → Offline)

## Best Practices

1. **Update cache version** in `sw.js` when deploying new assets
2. **Test offline** before every production deployment
3. **Pre-cache critical pages** (home, products, cart)
4. **Handle cache cleanup** in the `activate` event
5. **Use HTTPS** — required for service workers in production

## Troubleshooting

### PWA not installing
- Ensure HTTPS
- Check manifest is valid JSON
- Verify all icons exist
- Check service worker registration in DevTools

### Service worker not updating
- Clear site data in browser settings
- Update `CACHE_NAME` version in `sw.js`
- Use `Skip waiting` in DevTools → Application → Service Workers

### Offline page not showing
- Ensure the service worker is activated
- Check that `/offline` route exists
- Verify the SW fetch event handles navigation requests
