# Task 55 - Terms and Conditions + Privacy Policy Legal Screen

## Summary
Created a comprehensive legal pages screen at `/home/z/my-project/src/components/fahed/legal-screen.tsx`.

## Changes Made
1. **Two tabs**: "الشروط والأحكام" and "سياسة الخصوصية" with tab toggle
2. **Terms and Conditions content in Arabic** covering:
   - مقدمة (Introduction) - About محفظة الجنوب
   - تعريف المصطلحات (Definitions) - User, Wallet, Account, Balance, Transfer, etc.
   - شروط التسجيل (Registration terms) - Age, KYC, single account rules
   - استخدام المحفظة (Wallet usage) - Prohibited activities, account security
   - الرسوم والعمولات (Fees and commissions) - Fee transparency, modification rights
   - الحدود والقيود (Limits and restrictions) - Balance/transfer limits by verification level
   - المسؤولية (Liability) - Service reliability, third-party delays
   - إنهاء الحساب (Account termination) - User and platform rights
   - التعديلات (Amendments) - 15-day notice, user acceptance
   - القانون المعمول به (Governing law) - Republic of Yemen jurisdiction
3. **Privacy Policy content in Arabic** covering:
   - جمع البيانات (Data collection) - Personal, identity, device, usage data
   - استخدام البيانات (Data usage) - Service delivery, KYC, fraud protection
   - مشاركة البيانات (Data sharing) - No selling, service providers, government
   - تخزين البيانات (Data storage) - Encrypted storage, 5-year retention
   - حقوق المستخدم (User rights) - Access, correction, deletion, portability
   - ملفات تعريف الارتباط (Cookies) - Essential, analytical cookies
   - الأمان (Security) - AES-256, TLS 1.3, multi-factor auth
4. **"قبول الشروط" checkbox** at the bottom with green checkmark animation
5. **Scrollable card layout** with expandable sections
6. **Last updated date** at top of content
7. **Registered in page.tsx** as 'legal' overlay screen
8. **Account screen updated** to navigate to legal screen for terms and privacy

## Technical Details
- Expandable sections with chevron animation
- Each section has its own icon (Lucide icons)
- AnimatePresence for tab switching animations
- Motion animations for section expansion
- Consistent dark/light theme support
