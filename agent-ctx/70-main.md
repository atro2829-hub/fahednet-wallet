# Task 70 - Retry Screen on Connection Failure

## Agent: main

## Summary
Created a connection error/retry screen with animated illustrations, cached balance display, pending actions queue, and a `useNetworkStatus` hook for network state management.

## Changes Made

### `src/lib/use-network-status.ts` (NEW)
- **useNetworkStatus hook**: Returns `{ isOnline, lastOnline, retry }`
  - Detects offline state using `navigator.onLine` and `online`/`offline` events
  - `retry()`: Tests connectivity by fetching `/manifest.json` with HEAD request, 5s timeout
  - Listens for Firebase connection changes via custom `firebase-connection-change` event
  - Automatically processes pending actions when connection is restored
- **Pending actions queue**:
  - `addPendingAction(type, data)`: Queues an action in localStorage
  - `getPendingActions()`: Returns all pending actions (auto-expires after 24h)
  - `removePendingAction(id)`: Removes a specific action
  - `clearPendingActions()`: Clears all pending actions
  - Dispatches `process-pending-actions` custom event when online
- **Cached balance helpers**:
  - `cacheBalance({ YER, SAR, USD })`: Stores balance in localStorage
  - `getCachedBalance()`: Retrieves cached balance with timestamp

### `src/components/fahed/connection-error-screen.tsx` (NEW)
- **Animated wifi-off illustration**: Pulsing circles with scale animation
- **Status text**: "لا يوجد اتصال بالإنترنت" / "تحقق من اتصالك بالشبكة وحاول مرة أخرى"
- **Retry button**: "إعادة المحاولة" with spinning RefreshCw icon during retry
- **Auto-retry on reconnection**: Automatically navigates back to home when connection is restored
- **Cached balance card**: Shows last known balance for YER, SAR, USD (with "غير محدث" label)
- **Pending actions list**: Shows queued operations with type labels and timestamps
  - Clear all button
  - Auto-expiry note
- **Back navigation**: Chevron button to return to home screen
- **Color support**: Full dark/light mode

### `src/components/fahed/admin/admin-notifications-inline.tsx` (NEW - fix for pre-existing build error)
- Created the missing admin notifications component that was imported but didn't exist
- Simple notification sending form with title/body fields
- Lists sent notifications from Firebase
