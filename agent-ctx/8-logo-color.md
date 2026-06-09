# Task 8: Change logo color from white to red in all positions

## Summary
Applied `RED_LOGO_FILTER` from `@/lib/logo` to all logo instances that appear outside of balance cards (where white is correct on colored backgrounds).

## Files Changed

### 1. `src/components/fahed/splash-screen.tsx`
- **Change**: Imported `RED_LOGO_FILTER` and applied it to the logo `<img>` tag (line 170)
- **Reason**: The splash screen has a white background, so the white logo needs to be converted to red

### 2. `src/components/fahed/auth-screen.tsx`
- **Change**: Imported `RED_LOGO_FILTER` and applied it to the logo `<img>` tag (line 188)
- **Reason**: The auth screen logo appears on white/dark backgrounds without a colored card container

### Verified - No Changes Needed
- **home-screen.tsx line 460**: Header logo already uses `RED_LOGO_FILTER` ✅
- **home-screen.tsx lines 548, 590**: Balance card logos - WHITE is correct (on colored card backgrounds) ✅
- **home-screen.tsx lines 698, 750**: Promo banner watermarks - WHITE is correct (on colored backgrounds at low opacity) ✅
- **pin-screen.tsx line 147**: Logo inside red gradient container - WHITE is correct (like balance card) ✅
- **recharge-screen.tsx line 928**: Already uses `RED_LOGO_FILTER` ✅
- **wallet-screen.tsx lines 374, 419**: Balance card logos - WHITE is correct ✅
- **qr-screen.tsx line 407**: Watermark at 0.03 opacity - color doesn't matter ✅
- **admin-screen.tsx**: Imports LOGO_BASE64 but doesn't render it (unused import)
- **account-screen.tsx**: Imports LOGO_BASE64 but doesn't render it (unused import)
- **edit-profile-screen.tsx**: Imports LOGO_BASE64 but doesn't render it (unused import)
