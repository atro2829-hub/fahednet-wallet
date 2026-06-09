# Task: Create Owner Panel (لوحة مالك المشروع)

## Summary

Created a comprehensive Owner Panel for the "محفظة الجنوب" digital wallet app. The owner panel provides complete control over the app's branding, icons, colors, sections, banners, and general settings.

## Files Created/Modified

### New Files
1. **`src/components/fahed/owner-screen.tsx`** - Main owner panel component with 7 tabs
2. **`src/lib/use-owner-settings.ts`** - Hook for reading owner settings from Firebase in real-time + utility functions

### Modified Files
1. **`src/lib/store.ts`** - Added OwnerSettings types, defaultOwnerSettings, and store state/actions
2. **`src/components/fahed/account-screen.tsx`** - Added owner panel entry point (visible button + hidden long-press)
3. **`src/app/page.tsx`** - Added lazy import and routing for 'owner' screen

## Detailed Changes

### Store Updates (`src/lib/store.ts`)
- Added interfaces: `OwnerCardColors`, `OwnerSection`, `OwnerBanner`, `OwnerTheme`, `OwnerGeneral`, `OwnerSettings`
- Added `defaultOwnerSettings` export with all default values matching current app behavior
- Added `ownerSettings` state and `setOwnerSettings` action to AppState interface
- Added store implementation with merge logic

### Owner Screen (`src/components/fahed/owner-screen.tsx`)
7 fully functional tabs:
1. **اسم المحفظة** - Change Arabic and English app name with live preview
2. **الأيقونات** - Change service icons, upload custom base64 icons, reset to defaults
3. **ألوان البطاقات** - Customize YER/SAR/USD card colors with live preview
4. **الأقسام** - Enable/disable/reorder/add custom sections
5. **البانرات** - Add/edit/delete banners with image upload
6. **الألوان** - Change primary/secondary/accent theme colors with preview
7. **إعدادات عامة** - Maintenance mode, force update, support contacts, social links, about text

All settings save to Firebase `ownerSettings/` and listen to real-time updates.

### Hook (`src/lib/use-owner-settings.ts`)
- `useOwnerSettings()` - React hook for real-time Firebase listening
- `isOwnerUser()` - Check if user is owner (super_admin or m775371829@gmail.com)
- `getAppName()` - Get app name with owner override
- `getOwnerIcon()` - Get icon with owner override
- `getCardColors()` - Get card colors with owner override
- `getVisibleSections()` - Get visible sections sorted by order
- `getActiveBanners()` - Get active banners for a screen
- `getThemeColors()` - Get theme colors with owner override

### Account Screen Updates
- Added Crown icon import
- Added `isOwnerUser` import from use-owner-settings
- Added `isOwner` state + Firebase check for owner role
- Added visible purple "لوحة مالك المشروع" button for owner users
- Added hidden entry point: tap version text 5 times quickly to open owner panel

### Page.tsx Updates
- Added lazy import for OwnerScreen
- Added 'owner' to overlayScreens map
