# Task 9: Add iPhone-style dividers between elements in lists

## Summary
Created a reusable `IPhoneDivider` component and applied it across all list views in the app, replacing plain `borderBottom`/`borderTop` styles with proper iOS-style inset dividers.

## New Component Created

### `src/components/fahed/iphone-divider.tsx`
- Thin (0.5px) divider line
- Inset 48px from the right side (RTL start edge)
- Color: `rgba(255,255,255,0.04)` dark / `rgba(0,0,0,0.06)` light
- Supports `position` prop: `'bottom'` (default) or `'top'`
- Supports `insetStart` prop to customize inset distance
- Uses absolute positioning within `relative` parent elements

## Files Changed

### 1. `src/components/fahed/home-screen.tsx`
- **Transaction list**: Replaced `borderBottom` style with `IPhoneDivider` (position="bottom")
- Added `relative` class to transaction item divs
- Added import for `IPhoneDivider`

### 2. `src/components/fahed/wallet-screen.tsx`
- **Transaction list**: Replaced `borderBottom` style with `IPhoneDivider` (position="bottom")
- Added `relative` class to transaction item divs
- Added import for `IPhoneDivider`

### 3. `src/components/fahed/account-screen.tsx`
- **Settings sections**: Replaced `borderTop` style with `IPhoneDivider` (position="top")
- Added `relative` class to setting item buttons
- Only shows divider when `index > 0` (not on first item after section header)
- Added imports for `IPhoneDivider` and `RED_LOGO_FILTER`

### 4. `src/components/fahed/settings-screen.tsx`
- **Settings sections**: Replaced `borderTop` style with `IPhoneDivider` (position="top")
- Added `relative` class to setting item buttons
- Only shows divider when `index > 0`
- Added import for `IPhoneDivider`

### 5. `src/components/fahed/admin-screen.tsx`
- **Product list within provider cards**: Replaced `borderBottom` style with `IPhoneDivider`
- **Provider header dividers**: Replaced `borderBottom` style with `IPhoneDivider`
- **User detail row**: Replaced `borderBottom` style with `IPhoneDivider`
- **Banner action section**: Replaced `borderTop` style with `IPhoneDivider` (position="top")
- Added imports for `IPhoneDivider` and `RED_LOGO_FILTER`

### 6. `src/components/fahed/notifications-screen.tsx`
- **Complete redesign**: Converted from individual cards (`space-y-2`) to a single grouped card with `IPhoneDivider` between items
- This matches the iOS-style grouped list approach used elsewhere
- Unread notifications still show colored right border indicator
- Added import for `IPhoneDivider`

## Design Decisions
- The divider uses 0.5px height for true iOS-style thinness
- Inset of 48px from the right side in RTL (the "start" edge) matches iOS Settings style
- The `position` prop allows both top-positioned (for settings sections) and bottom-positioned (for transaction lists) dividers
- Modal headers and non-list borders were left unchanged
