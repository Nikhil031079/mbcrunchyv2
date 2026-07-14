# Deployment Checklist — MB Crunchy V2

## Pre-Deployment

### Code Review
- [ ] Latest code pulled from repository
- [ ] All changes committed
- [ ] No uncommitted changes
- [ ] Branch is `main` or release branch

### Build Verification
- [ ] `npm run build` — production build succeeds
- [ ] `npx convex dev --once` — Convex functions deploy
- [ ] `npx tsc -b --noEmit` — zero TypeScript errors
- [ ] No `console.log` statements in production code
- [ ] No `TODO`/`FIXME`/`HACK` comments in production code

### Environment
- [ ] `VITE_CONVEX_URL` set in production environment
- [ ] Convex deployment target is production
- [ ] No development API keys in production

## Deployment Steps

### 1. Deploy Convex Backend
```bash
npx convex deploy
```

### 2. Build Frontend
```bash
npm run build
```

### 3. Deploy Frontend
- Upload `dist/` directory to static host
- Configure SPA fallback (redirect all routes to `index.html`)
- Set `VITE_CONVEX_URL` as environment variable on host

### 4. Verify Deployment
- [ ] Homepage loads correctly
- [ ] Admin panel accessible at `/admin/dashboard`
- [ ] All pages navigate correctly
- [ ] PWA install prompt shows
- [ ] Offline page works

### 5. DNS & SSL
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (HTTPS)
- [ ] WWW redirect configured

## Post-Deployment

- [ ] Run full customer flow test on production URL
- [ ] Test UPI payment flow
- [ ] Test WhatsApp order message
- [ ] Verify admin can log in
- [ ] Check Convex dashboard for errors
- [ ] Check browser console for errors

## Rollback Plan

If deployment has issues:

1. **Frontend:** Redeploy previous build
2. **Convex:** Use Convex dashboard to revert to previous deployment
3. **DNS:** Point back to previous host

## Release Sign-off

| Role | Sign-off |
|------|----------|
| Developer | ☐ |
| QA | ☐ |
| Product Owner | ☐ |
