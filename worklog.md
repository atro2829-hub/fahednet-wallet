---
Task ID: 1
Agent: main
Task: Complete all remaining pages, admin dashboard, card carousel redesign, and polish UI

Work Log:
- Examined entire project structure and all existing components
- Redesigned home-screen.tsx with realistic credit card design (SVG dot patterns, chip, FH logo, contactless icon, user ID display, card gradient with depth)
- Fixed card carousel swipe using useMotionValue + animate() from framer-motion for smooth spring-based snapping
- Added scale/opacity/y animations for inactive cards to create depth effect
- Redesigned wallet-screen.tsx with same realistic card design + income/expense stats
- Completely rebuilt admin-screen.tsx with 5 tabs, weekly activity chart, balance summary, expandable user management, admin settings
- Polished services-screen.tsx with quick access grid, main services with descriptions, products grid
- Polished account-screen.tsx with card-style profile card, menu items with descriptions
- Updated bottom-nav.tsx with red FAB button, backdrop blur, subtle active indicators
- Updated quick-action-drawer.tsx with larger action buttons
- Updated page.tsx with branded loading screen
- All builds pass successfully

Stage Summary:
- Complete digital wallet with professional UI
- Cards look like real credit/debit cards with chip, patterns, and depth
- Smooth carousel with spring-based snapping
- Comprehensive admin dashboard with charts
- All screens polished with consistent design language
- No emojis anywhere in the app
