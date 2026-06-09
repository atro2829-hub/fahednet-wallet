# Task 70 - Retry Screen on Connection Failure

## Work Completed

### Summary
Created an enhanced `useNetworkStatus` hook in `src/hooks/` with offline duration tracking, retry count, and wasOffline detection. Added network status dot (green/red) indicator to the home screen header. Enhanced the existing connection-error-screen with offline duration display and retry count.

### Changes Made

1. **`src/hooks/use-network-status.ts`** (NEW):
   - `useNetworkStatus()` hook with:
     - `isOnline` - Real-time online/offline status via navigator.onLine + events
     - `lastOnline` - Last time the app was online
     - `wasOffline` - Whether the app was offline at any point during the session
     - `offlineDuration` - Duration of current offline period (computed, updated every second)
     - `retry()` - Manual retry function that fetches /manifest.json to verify connectivity
     - `retryCount` - Number of retry attempts made
   - `useIsOnline()` - Lightweight hook that just returns boolean
   - Listens to `online`/`offline` browser events + custom `firebase-connection-change` event

2. **`src/components/fahed/home-screen.tsx`**:
   - Added network status dot indicator in header:
     - Green dot (#10B981) with glow when online
     - Red dot (#E60000) with glow when offline
     - Smooth transition between states
   - Import from `@/hooks/use-network-status`

3. **`src/components/fahed/connection-error-screen.tsx`**:
   - Updated to import `useNetworkStatus` from `@/hooks/use-network-status` (the enhanced version)
   - Still imports helper functions (`getPendingActions`, `clearPendingActions`, `getCachedBalance`) from `@/lib/use-network-status`
   - Added offline duration display: "مدة الانقطاع: X دقيقة" with red styling
   - Added retry count display: "عدد المحاولات: X"
   - Enhanced status info section with stacked layout

### Already Implemented (Pre-existing)
- Connection error screen with animated wifi-off icon + pulse effects
- Arabic messages ("لا يوجد اتصال بالإنترنت", "تحقق من اتصالك بالشبكة")
- Retry button with loading spinner
- Auto-navigate back when connection restored
- Cached balance display (YER, SAR, USD)
- Pending actions list with clear all functionality
