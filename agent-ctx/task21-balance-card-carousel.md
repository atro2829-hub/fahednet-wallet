# Task 21 - Extract Shared Balance Card Carousel

## Summary
Extracted duplicate balance card carousel code from home-screen.tsx and wallet-screen.tsx into a shared component.

## Files Created
- `/home/z/my-project/src/components/fahed/balance-card-carousel.tsx` - Shared carousel component with all extracted logic

## Files Modified
- `/home/z/my-project/src/components/fahed/home-screen.tsx` - Replaced inline carousel with `<BalanceCardCarousel />`
- `/home/z/my-project/src/components/fahed/wallet-screen.tsx` - Replaced inline carousel with `<BalanceCardCarousel />`

## Extracted Shared Code
- `BalanceCard` type definition
- `balanceCards` constant array (3 cards: YER, SAR, USD)
- `hexToRgb` helper function
- `useAnimatedCounter` hook (custom hook for animating balance numbers)
- `AnimatedBalance` component (displays animated balance with eye toggle support)
- All carousel touch/drag logic (snapToCard, setTrackPosition, handleTouchStart/Move/End)
- Full card rendering with glassmorphism effects (gradient backgrounds, backdrop blur, SVG patterns, decorative circles/waves, animated glow borders)
- Pagination dots with animated transitions
- IncomeExpenseSection sub-component (for wallet screen's incoming/outgoing display)

## Component Props Interface
```typescript
export interface BalanceCardCarouselProps {
  showIncomeExpense?: boolean;     // Show income/expense (wallet only)
  income?: number;                 // Income amount
  expense?: number;                // Expense amount
  activeCardHeight?: number;       // Height of active card (home: 195, wallet: 210)
  inactiveCardHeight?: number;     // Height of inactive card
  cardPadding?: string;            // Padding class (home: 'p-6', wallet: 'p-5')
  patternIdPrefix?: string;        // SVG pattern ID prefix to avoid conflicts
  animateHeight?: boolean;         // Whether to animate height transitions
  extraContent?: (card, index) => ReactNode;  // Optional extra content slot
}
```

## Usage in Screens

### Home Screen
```tsx
<BalanceCardCarousel
  activeCardHeight={195}
  inactiveCardHeight={190}
  cardPadding="p-6"
  patternIdPrefix="home-grid"
  animateHeight={true}
/>
```

### Wallet Screen
```tsx
<BalanceCardCarousel
  showIncomeExpense={true}
  income={income}
  expense={expense}
  activeCardHeight={210}
  inactiveCardHeight={210}
  cardPadding="p-5"
  patternIdPrefix="wallet-grid"
  animateHeight={false}
/>
```

## Visual Appearance
- Kept exactly the same visual appearance as before
- All glassmorphism effects, gradients, patterns preserved
- Carousel swipe/drag behavior identical
- Pagination dots animations identical
