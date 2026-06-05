---
Task ID: 4
Agent: full-stack-developer
Task: Build Jaib wallet web application

Work Log:
- Initialized fullstack development environment
- Updated src/app/layout.tsx: Set lang="ar", dir="rtl", Arabic font stack, updated metadata to Arabic
- Created src/components/jaib/home-screen.tsx: Full home screen with header greeting, balance card with carousel dots and visibility toggle, 3x3 service grid, promotional banner, transactions list with Arabic data
- Created src/components/jaib/services-screen.tsx: Services screen with red gradient header, 6 main service cards with icons and descriptions, 4 quick action cards in 2x2 grid
- Created src/components/jaib/wallet-screen.tsx: Wallet screen with balance card (income/expense breakdown), search bar, filter tabs (الكل/وارد/صادر), scrollable transaction list
- Created src/components/jaib/account-screen.tsx: Account screen with avatar illustration, welcome text, account numbers card with copy functionality, 9 settings menu items
- Created src/components/jaib/bottom-nav.tsx: Bottom navigation with 4 tabs (الرئيسية, المحفظة, القائمة, الحساب), center FAB button, RTL-aware layout
- Created src/app/page.tsx: Main page with tab state management using useState, AnimatePresence for smooth transitions between screens
- Updated src/app/globals.css: Added custom scrollbar styling, overscroll behavior, safe area support
- Verified compilation successful, no lint errors

Stage Summary:
- Built complete Arabic RTL mobile wallet app "جيب" (Jaib) with 4 screens
- All text is in Arabic with proper RTL direction
- Red color scheme (#E63946) with gradient cards and white service buttons
- Mobile-first responsive design with max-w-md container
- Framer Motion animations for tab transitions, list items, and cards
- Balance visibility toggle, copy-to-clipboard, filter tabs all functional
- Bottom navigation is fixed with prominent FAB button
- App compiles and renders correctly on port 3000
