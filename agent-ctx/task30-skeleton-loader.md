# Task 30 - Skeleton Loading Components

## Summary
Created skeleton loading components for all screens with pulsing animation that respects dark/light theme, plus a `useLoadingState` hook.

## File Created
- `/home/z/my-project/src/components/fahed/skeleton-loader.tsx` - All skeleton components and the useLoadingState hook

## Exported Components & Hooks

### Hook: `useLoadingState(duration = 1500)`
- Returns `boolean` indicating loading state
- Simulates loading for 1.5 seconds (configurable) on initial render
- Uses `useState(true)` + `setTimeout` in `useEffect`

### Skeleton Components

1. **`BalanceCardSkeleton`** - Mimics the balance card shape with:
   - Top row (logo + brand name + eye toggle placeholders)
   - Balance section (label + large amount)
   - Bottom row (chip + currency badge + dots + user ID)
   - Pagination dots below

2. **`ServiceGridSkeleton`** - 3x3 grid of service icon placeholders:
   - Header row (title + "more" link)
   - 9 icon cards with rounded icons + text labels
   - Matches exact grid layout and card styling

3. **`TransactionListSkeleton`** - 5 transaction rows:
   - Header row (title + "view all" link)
   - 5 rows with: icon circle, description lines, amount + currency badge
   - Includes divider lines between rows

4. **`ProviderGridSkeleton`** - Grid of provider cards:
   - Header row
   - 2-column grid with 6 provider card placeholders
   - Each card has icon + name + subtitle

5. **`BannerSkeleton`** - Banner carousel placeholder:
   - Full-width banner with tag, title, and description placeholders
   - Dot indicators at bottom

6. **`ProfileSkeleton`** - User profile card:
   - Avatar + name + subtitle placeholders
   - 3-column stats row with icon + label + value

7. **`HomeScreenSkeleton`** - Complete home screen skeleton composition:
   - Header + BalanceCard + Banner + ServiceGrid + TransactionList

8. **`WalletScreenSkeleton`** - Complete wallet screen skeleton composition:
   - Header + BalanceCard + Spending summary + Search bar + TransactionList

## Design Decisions
- Base `SkeletonBlock` component uses `motion.div` with `animate={{ opacity: [0.3, 0.7, 0.3] }}` for smooth pulsing
- Pulse duration: 1.5s with infinite repeat and easeInOut
- All components respect dark/light theme via `useTheme()`
- Skeleton colors: dark mode uses `rgba(255,255,255,0.06)`, light mode uses `rgba(0,0,0,0.06)`
- Rounded corners (8px default) match the app's design language
- Layout structure mirrors actual screen components exactly
