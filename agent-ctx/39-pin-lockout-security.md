# Task 39: Improve PIN screen with failed attempt detection and temporary lockout

## Summary
Enhanced the PIN lock screen with comprehensive security features including failed attempt tracking, temporary lockout with countdown, haptic feedback, and a forgot PIN recovery flow.

## Changes Made

### `/home/z/my-project/src/components/fahed/pin-screen.tsx`

#### Failed Attempt Tracking
- Tracks failed PIN attempts in state (`failedAttempts`)
- Persists count to `localStorage` under key `pin_failed_attempts`
- On mount, restores failed attempt count and lockout state from localStorage using lazy state initialization
- Clears failed count on successful PIN or biometric auth

#### Warning at 3 Failed Attempts
- After 3 failed attempts, shows warning message: "تحذير: محاولة واحدة متبقية قبل القفل"
- Warning displayed in orange color (`#FF8800`) to distinguish from regular errors

#### Temporary Lockout at 5 Failed Attempts
- After 5 failed attempts, locks the screen for 30 seconds
- Lockout end timestamp stored in `localStorage` under key `pin_lockout_until`
- Shows "تم قفل التطبيق مؤقتاً" title with countdown timer
- Lock icon replaces the app logo during lockout
- Large countdown number (seconds remaining) displayed in red
- Background gradient shifts to red during lockout
- Number pad hidden during lockout
- After lockout expires, failed attempts reset and PIN entry allowed again
- Countdown timer uses `setInterval` with cleanup on unmount

#### Haptic Feedback
- On wrong PIN entry, calls `navigator.vibrate(200)` for haptic feedback
- Also vibrates on PIN mismatch during setting/confirming new PIN

#### Forgot PIN Recovery Flow
- "نسيت الرمز" (Forgot PIN) button shown below the number pad when not setting a new PIN
- Multi-step recovery flow:
  1. **Verify Email**: User enters their email address, validated against stored user email (also accepts any valid email format for demo purposes)
  2. **Reset PIN**: Enter new 4-digit PIN
  3. **Confirm PIN**: Re-enter new PIN to confirm
  4. **Success**: Shows success screen with checkmark icon, "تم تغيير رمز PIN بنجاح" message, and button to enter wallet
- Each step has proper back navigation
- Failed attempts are cleared after successful PIN reset
- Lock icon changes to key icon during recovery flow

#### State Persistence
- All lockout/failed attempt state persists across app restarts via localStorage
- Lazy state initialization reads from localStorage on first render (no useEffect setState issues)
- Lockout timer continues counting down even after page refresh
