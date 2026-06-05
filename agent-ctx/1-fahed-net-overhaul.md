# Task: Fahed Net Digital Wallet - Complete Overhaul

## Summary
Completed all 14 tasks for the Fahed Net digital wallet project overhaul. The app is now a Yemeni-only digital wallet with RTL Arabic layout, email+password authentication via Firebase, userId-based transactions, and no emojis.

## Changes Made

### 1. Prisma Schema (`prisma/schema.prisma`)
- Added `email String @unique`, `password String @default("")`, `userId String @unique`
- Made `phone` optional (not unique, can be empty)
- Added `cardType`, `cardNumber`, `cardIssuedAt`, `governorate` fields
- Removed `pin`, `accountNo1`, `accountNo2` fields
- Ran `prisma db push --force-reset` successfully

### 2. Store (`src/lib/store.ts`)
- Updated User interface: added `email`, `userId`, `cardType`, `cardNumber`, `cardIssuedAt`, `governorate`
- Removed `accountNo1`, `accountNo2`

### 3. Utils (`src/lib/utils.ts`)
- Replaced `generateAccountNo()` with `generateUserId()` (6-digit ID starting with "10")
- Replaced all flag emojis in `currencyFlags` with text indicators (YER, SAR, USD)
- Added `currencyBadgeColors` for badge styling
- Added `governorates` list (8 Southern Yemen governorates)
- Added `cardTypes` list (3 card types)

### 4. Auth Screen (`src/components/fahed/auth-screen.tsx`)
- Complete rewrite with email+password authentication
- Uses Firebase Auth (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`)
- Stores user data in Firebase RTDB
- Registration flow: Step 1 (name, email, password) -> Step 2 (optional phone with +967 prefix) -> Step 3 (OTP verification)
- Phone input has Yemen flag indicator and fixed +967 prefix
- No emojis

### 5. Home Screen (`src/components/fahed/home-screen.tsx`)
- Fixed carousel with animated x position based on activeCardIndex
- Uses state-based carouselWidth instead of ref during render
- Replaced emoji currency flags with CurrencyBadge component
- No emojis

### 6. Wallet Screen (`src/components/fahed/wallet-screen.tsx`)
- Same carousel fix as home screen
- Replaced emoji currency flags with CurrencyBadge component
- No emojis

### 7. KYC Screen (`src/components/fahed/kyc-screen.tsx`)
- Expanded from 4 to 6 steps:
  - Step 1: Card type selection (بطاقة شخصية, جواز سفر, رخصة قيادة)
  - Step 2: Card number + issued at
  - Step 3: Governorate selection (Southern Yemen)
  - Step 4: ID photo upload
  - Step 5: Selfie upload
  - Step 6: Confirmation
- No emojis

### 8. Transfer Modal (`src/components/fahed/transfer-modal.tsx`)
- Added toggle: "تحويل بالرقم" (by userId) / "تحويل بالهاتف" (by phone)
- userId input with "10" prefix indicator
- Phone input with Yemen flag indicator and +967 prefix
- API calls support both `toUserId` and `toPhone` parameters
- No emojis

### 9. Account Screen (`src/components/fahed/account-screen.tsx`)
- Shows userId prominently with copy button
- Shows email, phone, governorate
- Shows KYC status badge
- Admin-only items filtered (adminOnly flag on menu items)
- No emojis

### 10. Admin Screen (`src/components/fahed/admin-screen.tsx`)
- Shows userId, email, governorate for each user
- Search by userId, email, or name
- "Send Notification" action for individual users
- Replaced flag emojis with CurrencyBadge components
- No emojis

### 11. All Components - Emoji Removal
- Searched all fahed component files
- No emojis remaining in any component

### 12. API Routes
- Register: Accepts email, password, name, phone; generates userId
- Login: Accepts email, password; returns full user data including userId
- Transfer: Supports both `toUserId` and `toPhone` parameters
- Admin: Includes userId and email in user listings
- Notifications: Added `createOnly` support for admin notification sending
- Seed: Updated for new schema

### 13. Page.tsx
- Admin screen only shows for `user.role === 'admin'`
- Non-admin users are redirected away from admin screen

### 14. Build Verification
- `bun run lint` passes with no errors
- Dev server compiles successfully
