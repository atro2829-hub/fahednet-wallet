# Task 64 - Manifest.json and Service Worker for Offline PWA

## Agent: main

## Summary
Updated the PWA manifest and created a full service worker with caching strategies, background sync, and push notification support.

## Changes Made

### `public/manifest.json`
- **Updated app name**: "محفظة الجنوب"
- **Updated short name**: "الجنوب"
- **Added Arabic description**: comprehensive description of the wallet's features
- **Set theme_color**: #E60000
- **Set background_color**: #0A0A0A (dark mode)
- **Added shortcuts**: شحن رصيد, تحويل أموال, سداد الفواتير
- **Kept all icon sizes**: 72, 96, 128, 144, 152, 192, 384, 512
- **Set display**: standalone, orientation: portrait, lang: ar, dir: rtl

### `public/sw.js` (NEW)
- **Cache names**: Separate caches for static assets, images, API, and general
- **Install event**: Pre-caches static assets (/, /manifest.json, /logo.svg)
- **Activate event**: Cleans up old caches
- **Fetch routing**:
  - API requests → Network-first strategy (try network, fallback to cache)
  - Images → Cache-first strategy (CDN images from codashop, seagm, payermax, eneba)
  - Static assets (CSS, JS, fonts) → Cache-first
  - HTML pages → Stale-while-revalidate
- **Offline fallback**: Returns SVG placeholder for images, JSON error for APIs
- **Background sync**: Listens for `sync-pending-transactions` tag, notifies clients
- **Push notifications**: Shows notifications with RTL support, handles click-to-open
- **Message handling**: Supports SKIP_WAITING and CACHE_URLS commands

### `src/app/layout.tsx`
- **Added service worker registration** via inline script in `<head>`:
  - Registers `/sw.js` on window load
  - Checks for updates on load
  - Listens for `updatefound` events and notifies via BroadcastChannel
  - Handles `controllerchange` events
  - Forwards `BACKGROUND_SYNC` messages as custom DOM events
- **Updated theme colors**: Dark mode viewport color changed to #0A0A0A
