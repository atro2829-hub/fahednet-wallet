---
Task ID: 1
Agent: Main Agent
Task: Create separate admin app (com.qtbm.south.admin) and modify user app

Work Log:
- Created /home/z/my-project/south-admin/ as a complete Next.js + Capacitor admin management app
- Package name: com.qtbm.south.admin, App name: محفظة الجنوب - الإدارة
- Firebase project: southern-portfolio (same as user app)
- Login-only auth with role check (admin/owner only from Firebase)
- 22 admin panel components created (dashboard, users, orders, deposits, withdrawals, KYC, providers, exchange rates, gift codes, promo codes, banners, banks, support chat, social links, legal content, sections, visibility, API settings, notifications, settings, activity log, backup)
- Removed admin/owner screens from user app (page.tsx)
- Removed admin/owner panel buttons from account-screen.tsx and settings-screen.tsx
- Updated user app package name from com.fahd.net to com.qtbm.south
- Updated Firebase config from fahed-net to southern-portfolio project
- Updated google-services.json with both com.qtbm.south and com.qtbm.south.admin clients
- Fixed dark theme toggle - proper sync between next-themes and Zustand store
- Updated theme storage key from fahed-theme to south-wallet-theme
- Rebranded all references from الحبيلين اونلاين to محفظة الجنوب
- Updated Android build.gradle namespace and applicationId
- Created new MainActivity.java under com.qtbm.south package
- Updated Android strings.xml with new app name and package
- Both apps build successfully with npm run build
- Pushed to GitHub and triggered build (Run ID: 27208463109)

Stage Summary:
- User app: com.qtbm.south (محفظة الجنوب) - cleaned, no admin/owner panels
- Admin app: com.qtbm.south.admin (محفظة الجنوب - الإدارة) - full management
- Both apps share Firebase project: southern-portfolio
- Dark theme fix: proper next-themes + Zustand sync, updated storage key
- Build triggered on GitHub Actions
