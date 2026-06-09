# Task 57 - Improved KYC Screen with Auto-Verification

## Summary
Enhanced the KYC screen at `/home/z/my-project/src/components/fahed/kyc-screen.tsx` with auto-verification features, improved multi-step flow, and verification status tracking.

## Changes Made

### Auto-Verification Features
1. **OCR simulation**: When user uploads ID photo, "extracts" name and ID number automatically
2. **Face matching**: When user uploads selfie, compares with ID photo (85% match rate simulation)
3. **Liveness detection instructions**: "أدر رأسك يميناً ثم يساراً" with step-by-step guide
4. **Image quality check (blur detection)**: Simulated quality check with good/blurry status

### Improved Multi-Step Flow (5 steps)
1. **Step 1 - Personal Info**: Name, ID number, date of birth with auto-fill from OCR
2. **Step 2 - ID Card Photo**: Guide overlay with rectangle for card placement, corner markers, camera toggle
3. **Step 3 - Selfie**: Face guide circle overlay, liveness instructions, face match verification
4. **Step 4 - Address**: Governorate, city, street inputs
5. **Step 5 - Review & Submit**: All data summary with photo previews and face match status

### Verification Status Tracking
- Real-time status updates from Firebase (`kycStatus` field listener)
- Progress bar showing verification progress percentage
- Timeline steps: إرسال الطلب → مراجعة البيانات → التحقق من الهوية → اعتماد الحساب
- "قيد المراجعة" status with estimated time (24 hours)
- Approved (green checkmark) / Rejected (red X) status display
- Simulated approval after 30 seconds for demo

### Improved Camera UI
- Front/back camera toggle (SwitchCamera icon)
- Photo retake option (RefreshCw icon)
- Image quality check (blur detection simulation)
- Guide overlays:
  - ID card: Rectangle with corner markers and dashed border
  - Selfie: Circle outline for face positioning
- Quality badges on photos: "واضحة" (good) or "غير واضحة" (blurry)
- Face match badge: "مطابقة" (matching) or "غير مطابقة" (not matching)

### Technical Details
- `simulateOCR()` generates random Arabic name and ID number
- Quality check simulates 80% good / 20% blurry results
- Face match simulates 85% match / 15% not matching
- `onValue` Firebase listener for real-time KYC status
- Simulated auto-approval after 30 seconds (for demo)
- Can proceed only if photo quality is "good"
- Error toasts for blurry photos and face mismatch
