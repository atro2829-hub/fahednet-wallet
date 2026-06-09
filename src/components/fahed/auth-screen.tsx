'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, ShieldCheck, Phone, Heart, CreditCard, X, KeyRound, Fingerprint, CheckCircle2, FileText, Shield } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { auth, database } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { ref, get, update } from 'firebase/database';
import { generateUserId } from '@/lib/utils';
import { LOGO_BASE64 } from '@/lib/logo';

type AuthStep = 'login' | 'register-step1' | 'register-step2' | 'register-step3' | 'password-recovery';

// Yemen flag indicator
function YemenFlagIndicator() {
  return (
    <div className="flex flex-col w-6 h-4 rounded-sm overflow-hidden shrink-0">
      <div className="flex-1 bg-red-600" />
      <div className="flex-1 bg-white" />
      <div className="flex-1 bg-black" />
    </div>
  );
}

// Step indicator component
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: 'الشخصية' },
    { num: 2, label: 'الحساب' },
    { num: 3, label: 'الهاتف' },
  ];

  return (
    <div className="flex items-center justify-center gap-0 my-4">
      {steps.map((step, index) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{
                scale: currentStep >= step.num ? 1 : 0.8,
                backgroundColor: currentStep >= step.num ? '#E60000' : 'transparent',
                borderColor: currentStep >= step.num ? '#E60000' : '#CCC',
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
              style={{ borderColor: currentStep >= step.num ? '#E60000' : '#CCC' }}
            >
              {currentStep > step.num ? (
                <CheckCircle2 size={16} color="#FFF" />
              ) : (
                <span className="text-xs font-bold" style={{ color: currentStep >= step.num ? '#FFF' : '#999' }}>
                  {step.num}
                </span>
              )}
            </motion.div>
            <span className="text-[9px] mt-1 font-medium" style={{ color: currentStep >= step.num ? '#E60000' : '#999' }}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="w-10 h-0.5 mx-1 mt-[-12px]" style={{ background: currentStep > step.num ? '#E60000' : '#DDD' }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function AuthScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { setUser } = useAppStore();

  const [step, setStep] = useState<AuthStep>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields - Step 1: Personal info
  const [regFirstName, setRegFirstName] = useState('');
  const [regSecondName, setRegSecondName] = useState('');
  const [regThirdName, setRegThirdName] = useState('');
  const [regFamilyName, setRegFamilyName] = useState('');
  const [regNationalId, setRegNationalId] = useState('');

  // Register fields - Step 2: Account info
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');

  // Register fields - Step 3: Phone
  const [regPhone, setRegPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Password recovery fields
  const [recoveryNationalId, setRecoveryNationalId] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'input' | 'reset'>('input');
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');
  const [recoveryConfirmPassword, setRecoveryConfirmPassword] = useState('');
  const [recoveryUid, setRecoveryUid] = useState('');

  const inputStyle = {
    background: isDark ? '#1A1A1A' : '#F8F8F8',
    border: isDark ? '1px solid #333' : '1px solid #EEE',
    color: isDark ? '#FFF' : '#1a1a1a',
  };

  // Compute full name from parts
  const getFullName = () => {
    return [regFirstName, regSecondName, regThirdName, regFamilyName].filter(n => n.trim()).join(' ');
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const uid = userCredential.user.uid;
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const isAdminEmail = loginEmail.toLowerCase().includes('admin');
        let effectiveRole: 'user' | 'admin' | 'owner' = userData.role || 'user';
        if (effectiveRole === 'owner') {
          // Owner role is set in Firebase, keep it
        } else if (effectiveRole === 'admin' || isAdminEmail) {
          effectiveRole = 'admin';
          if (isAdminEmail && userData.role !== 'admin') {
            await update(ref(database, `users/${uid}`), { role: 'admin' });
          }
        }
        const fullName = [userData.firstName, userData.secondName, userData.thirdName, userData.familyName].filter((n: string) => n && n.trim()).join(' ') || userData.name || '';
        setUser({
          id: uid, email: userData.email || loginEmail, phone: userData.phone || '',
          name: fullName, firstName: userData.firstName || '', secondName: userData.secondName || '',
          thirdName: userData.thirdName || '', familyName: userData.familyName || '',
          nationalId: userData.nationalId || '', avatar: userData.avatar || '', role: effectiveRole,
          userId: userData.userId || '', kycStatus: userData.kycStatus || 'pending',
          isBlocked: userData.isBlocked || false, balanceYER: userData.balanceYER || 0,
          balanceSAR: userData.balanceSAR || 0, balanceUSD: userData.balanceUSD || 0,
          cardType: userData.cardType || '', cardNumber: userData.cardNumber || '',
          cardIssuedAt: userData.cardIssuedAt || '', governorate: userData.governorate || '',
          theme: userData.theme || 'light',
        });
      } else {
        const newUserId = generateUserId();
        const isAdminEmail = loginEmail.toLowerCase().includes('admin');
        const newUserData = { email: loginEmail, phone: '', name: '', firstName: '', secondName: '', thirdName: '', familyName: '', nationalId: '', avatar: '', role: isAdminEmail ? 'admin' as const : 'user' as const, userId: newUserId, kycStatus: 'pending' as const, isBlocked: false, balanceYER: 0, balanceSAR: 0, balanceUSD: 0, cardType: '', cardNumber: '', cardIssuedAt: '', governorate: '', theme: 'light' as const };
        await update(ref(database), {
          [`users/${uid}`]: newUserData,
          [`userIds/${newUserId}`]: uid,
        });
        setUser({ id: uid, ...newUserData });
      }
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      if (firebaseError.code === 'auth/user-not-found') setError('الحساب غير موجود');
      else if (firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') setError('كلمة المرور غير صحيحة');
      else setError('حدث خطأ في تسجيل الدخول');
    } finally { setIsLoading(false); }
  };

  const handleRegisterStep1 = () => {
    if (!regFirstName.trim() || !regFamilyName.trim()) {
      setError('يرجى إدخال الاسم الأول واسم العائلة على الأقل');
      return;
    }
    if (!regNationalId.trim()) {
      setError('يرجى إدخال رقم البطاقة الشخصية');
      return;
    }
    if (regNationalId && (regNationalId.length < 6 || regNationalId.length > 20 || !/^\d+$/.test(regNationalId))) {
      setError('رقم البطاقة الشخصية يجب أن يكون أرقاماً فقط بين 6 إلى 20 رقم');
      return;
    }
    setError('');
    setStep('register-step2');
  };

  const handleRegisterStep2 = () => {
    if (!regEmail) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }
    if (!regPassword) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }
    if (regPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (regPassword !== regPasswordConfirm) {
      setError('كلمة المرور غير متطابقة');
      return;
    }
    setError('');
    setStep('register-step3');
  };

  const handleRegisterStep3 = async () => {
    if (!agreeTerms || !agreePrivacy) {
      setError('يرجى الموافقة على الشروط والأحكام وسياسة الخصوصية');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      const uid = userCredential.user.uid;
      const newUserId = generateUserId();
      const isAdminEmail = regEmail.toLowerCase().includes('admin');
      const fullName = getFullName();
      const userData = {
        email: regEmail,
        phone: regPhone ? `+967${regPhone}` : '',
        name: fullName,
        firstName: regFirstName.trim(),
        secondName: regSecondName.trim(),
        thirdName: regThirdName.trim(),
        familyName: regFamilyName.trim(),
        nationalId: regNationalId.trim(),
        avatar: '',
        role: isAdminEmail ? 'admin' as const : 'user' as const,
        userId: newUserId,
        kycStatus: 'pending' as const,
        isBlocked: false,
        balanceYER: 0,
        balanceSAR: 0,
        balanceUSD: 0,
        cardType: '',
        cardNumber: '',
        cardIssuedAt: '',
        governorate: '',
        theme: 'light' as const,
      };
      const firebaseUpdates: Record<string, unknown> = {
        [`users/${uid}`]: userData,
        [`userIds/${newUserId}`]: uid,
      };
      if (regPhone) {
        firebaseUpdates[`phones/P967${regPhone}`] = uid;
      }
      if (regNationalId.trim()) {
        firebaseUpdates[`nationalIds/${regNationalId.trim()}`] = uid;
      }
      await update(ref(database), firebaseUpdates);
      setUser({
        id: uid, email: regEmail, phone: regPhone ? `+967${regPhone}` : '',
        name: fullName, firstName: regFirstName.trim(), secondName: regSecondName.trim(),
        thirdName: regThirdName.trim(), familyName: regFamilyName.trim(),
        nationalId: regNationalId.trim(), avatar: '', role: isAdminEmail ? 'admin' : 'user',
        userId: newUserId, kycStatus: 'pending',
        isBlocked: false, balanceYER: 0, balanceSAR: 0, balanceUSD: 0,
        cardType: '', cardNumber: '',
        cardIssuedAt: '', governorate: '',
        theme: 'light',
      });
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      if (firebaseError.code === 'auth/email-already-in-use') setError('البريد الإلكتروني مسجل مسبقاً');
      else if (firebaseError.code === 'auth/weak-password') setError('كلمة المرور ضعيفة');
      else setError('حدث خطأ في التسجيل');
    } finally { setIsLoading(false); }
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 9);
    setRegPhone(cleaned);
  };

  const handleNationalIdChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 20);
    setRegNationalId(cleaned);
  };

  // Password Recovery - Step 1: Find user by nationalId and email
  const handleRecoverySearch = async () => {
    if (!recoveryNationalId.trim() || !recoveryEmail.trim()) {
      setError('يرجى إدخال رقم البطاقة الشخصية والبريد الإلكتروني');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const nationalIdRef = ref(database, `nationalIds/${recoveryNationalId.trim()}`);
      const nidSnapshot = await get(nationalIdRef);
      if (!nidSnapshot.exists()) {
        setError('لا يوجد حساب مرتبط بهذا رقم البطاقة الشخصية');
        setIsLoading(false);
        return;
      }
      const uid = nidSnapshot.val();
      const userRef = ref(database, `users/${uid}`);
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        setError('لم يتم العثور على الحساب');
        setIsLoading(false);
        return;
      }
      const userData = userSnapshot.val();
      if (userData.email?.toLowerCase() !== recoveryEmail.trim().toLowerCase()) {
        setError('البريد الإلكتروني لا يتطابق مع رقم البطاقة الشخصية');
        setIsLoading(false);
        return;
      }
      setRecoveryUid(uid);
      setRecoveryStep('reset');
      setError('');
    } catch {
      setError('حدث خطأ في البحث عن الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  // Password Recovery - Step 2: Send password reset email
  const handlePasswordReset = async () => {
    if (!recoveryNewPassword || recoveryNewPassword.length < 6) {
      setError('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (recoveryNewPassword !== recoveryConfirmPassword) {
      setError('كلمة المرور غير متطابقة');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, recoveryEmail.trim());
      setSuccess('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
      setRecoveryStep('input');
      setRecoveryNationalId('');
      setRecoveryEmail('');
      setRecoveryNewPassword('');
      setRecoveryConfirmPassword('');
      setTimeout(() => {
        setStep('login');
        setLoginMode('login');
        setSuccess('');
      }, 3000);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      if (firebaseError.code === 'auth/user-not-found') {
        setError('لم يتم العثور على حساب بهذا البريد');
      } else {
        setError('حدث خطأ في إرسال رابط إعادة التعيين');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Skeleton loading component
  const SkeletonPulse = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 rounded-2xl" style={{ background: isDark ? '#222' : '#EEE' }} />
      <div className="h-12 rounded-2xl" style={{ background: isDark ? '#222' : '#EEE' }} />
      <div className="h-12 rounded-2xl w-3/4" style={{ background: isDark ? '#222' : '#EEE' }} />
    </div>
  );

  const btnPrimary = {
    background: 'linear-gradient(135deg, #E60000 0%, #B30000 100%)',
    boxShadow: '0 4px 16px rgba(230,0,0,0.3)',
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: isDark ? '#0F0F0F' : '#F5F5F5' }}>
      {/* Logo Area */}
      <div className="flex flex-col items-center pt-10 pb-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-2xl overflow-hidden mb-4 flex items-center justify-center"
          style={{ boxShadow: '0 8px 24px rgba(230,0,0,0.3)', background: isDark ? 'rgba(230,0,0,0.1)' : 'rgba(230,0,0,0.06)' }}
        >
          <img src={LOGO_BASE64} alt="الجنوب" className="w-full h-full object-cover" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold"
          style={{ color: isDark ? '#FFF' : '#1a1a1a' }}
        >
          محفظة الجنوب
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm mt-1"
          style={{ color: isDark ? '#888' : '#AAA' }}
        >
          محفظتك الرقمية الموثوقة
        </motion.p>

        {/* Mode Toggle */}
        {step !== 'password-recovery' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mt-5"
          >
            <button
              onClick={() => { setLoginMode('register'); setStep('register-step1'); setError(''); setSuccess(''); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all"
              style={{
                background: loginMode === 'register' ? 'rgba(230,0,0,0.1)' : 'transparent',
                border: loginMode === 'register' ? '1px solid rgba(230,0,0,0.3)' : '1px solid transparent',
              }}
            >
              <Heart size={16} strokeWidth={1.5} color={loginMode === 'register' ? '#E60000' : (isDark ? '#555' : '#AAA')} fill={loginMode === 'register' ? '#E60000' : 'none'} />
              <span className="text-xs font-medium" style={{ color: loginMode === 'register' ? '#E60000' : (isDark ? '#555' : '#AAA') }}>تسجيل جديد</span>
            </button>
            <button
              onClick={() => { setLoginMode('login'); setStep('login'); setError(''); setSuccess(''); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all"
              style={{
                background: loginMode === 'login' ? 'rgba(230,0,0,0.1)' : 'transparent',
                border: loginMode === 'login' ? '1px solid rgba(230,0,0,0.3)' : '1px solid transparent',
              }}
            >
              <User size={16} strokeWidth={1.5} color={loginMode === 'login' ? '#E60000' : (isDark ? '#555' : '#AAA')} />
              <span className="text-xs font-medium" style={{ color: loginMode === 'login' ? '#E60000' : (isDark ? '#555' : '#AAA') }}>تسجيل الدخول</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Form Area */}
      <div className="flex-1 px-6">
        <AnimatePresence mode="wait">
          {/* LOGIN STEP */}
          {step === 'login' && (
            <motion.div
              key="login"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="space-y-4"
            >
              {/* Login Card */}
              <div className="rounded-2xl p-5" style={{ background: isDark ? '#1A1A1A' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}` }}>
                <h2 className="text-lg font-bold mb-4 text-center" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                  تسجيل الدخول
                </h2>

                {/* Email */}
                <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl mb-3" style={inputStyle}>
                  <Mail size={18} strokeWidth={1.5} color="#E60000" />
                  <input type="email" placeholder="البريد الإلكتروني" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" style={{ color: isDark ? '#FFF' : '#1a1a1a' }} dir="ltr" autoComplete="email" />
                </div>

                {/* Password */}
                <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl mb-3" style={inputStyle}>
                  <Lock size={18} strokeWidth={1.5} color="#E60000" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="كلمة المرور" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" style={{ color: isDark ? '#FFF' : '#1a1a1a' }} dir="ltr" autoComplete="current-password" />
                  <button onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} strokeWidth={1.5} color={isDark ? '#888' : '#AAA'} /> : <Eye size={18} strokeWidth={1.5} color="#E60000" />}
                  </button>
                </div>

                {error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-center" style={{ color: '#E60000' }}>{error}</motion.p>}
                {success && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-center" style={{ color: '#10B981' }}>{success}</motion.p>}

                <button onClick={handleLogin} disabled={isLoading} className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50 mt-2" style={btnPrimary}>
                  {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <span>تسجيل الدخول</span>}
                </button>

                {/* Biometric button (visual only) */}
                <button
                  onClick={() => {
                    const { useAppStore } = require('@/lib/store');
                    useAppStore.getState().addNotification({
                      id: `biometric-${Date.now()}`,
                      title: 'قريباً',
                      body: 'ميزة البصمة ستتوفر قريباً',
                      type: 'info',
                      isRead: false,
                      createdAt: new Date().toISOString(),
                    });
                  }}
                  className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-sm mt-3"
                  style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', color: isDark ? '#AAA' : '#888', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}` }}
                >
                  <Fingerprint size={18} strokeWidth={1.5} color={isDark ? '#AAA' : '#888'} />
                  <span>الدخول بالبصمة</span>
                </button>
              </div>

              <button
                onClick={() => { setStep('password-recovery'); setError(''); setSuccess(''); setRecoveryStep('input'); }}
                className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-sm"
                style={{ background: isDark ? '#1A1A1A' : '#F0F0F0', color: isDark ? '#AAA' : '#888', border: `1px solid ${isDark ? '#333' : '#EEE'}` }}
              >
                <KeyRound size={16} strokeWidth={1.5} />
                استعادة كلمة المرور
              </button>
            </motion.div>
          )}

          {/* PASSWORD RECOVERY */}
          {step === 'password-recovery' && (
            <motion.div
              key="password-recovery"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => { setStep('login'); setLoginMode('login'); setError(''); setSuccess(''); }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: isDark ? '#1A1A1A' : '#F0F0F0' }}>
                  <ArrowLeft size={16} strokeWidth={1.5} color={isDark ? '#FFF' : '#666'} />
                </button>
                <h2 className="text-lg font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>استعادة كلمة المرور</h2>
              </div>

              <div className="flex flex-col items-center mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: 'rgba(230,0,0,0.1)' }}>
                  <KeyRound size={28} strokeWidth={1.5} color="#E60000" />
                </div>
                <p className="text-xs text-center max-w-[250px]" style={{ color: isDark ? '#888' : '#AAA' }}>
                  أدخل رقم البطاقة الشخصية والبريد الإلكتروني المرتبط بحسابك لاستعادة كلمة المرور
                </p>
              </div>

              {recoveryStep === 'input' ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl" style={inputStyle}>
                    <CreditCard size={18} strokeWidth={1.5} color="#E60000" />
                    <input type="tel" placeholder="رقم البطاقة الشخصية" value={recoveryNationalId} onChange={(e) => setRecoveryNationalId(e.target.value.replace(/\D/g, '').slice(0, 20))} className="flex-1 bg-transparent outline-none text-sm" style={{ color: isDark ? '#FFF' : '#1a1a1a' }} dir="ltr" />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl" style={inputStyle}>
                    <Mail size={18} strokeWidth={1.5} color="#E60000" />
                    <input type="email" placeholder="البريد الإلكتروني" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" style={{ color: isDark ? '#FFF' : '#1a1a1a' }} dir="ltr" autoComplete="email" />
                  </div>

                  {error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-center" style={{ color: '#E60000' }}>{error}</motion.p>}

                  <button onClick={handleRecoverySearch} disabled={isLoading} className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50" style={btnPrimary}>
                    {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <span>بحث عن الحساب</span>}
                  </button>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-2xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <p className="text-xs text-center" style={{ color: '#10B981' }}>تم العثور على حسابك. سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.</p>
                  </div>

                  {error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-center" style={{ color: '#E60000' }}>{error}</motion.p>}

                  <button onClick={handlePasswordReset} disabled={isLoading} className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50" style={btnPrimary}>
                    {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <span>إرسال رابط إعادة التعيين</span>}
                  </button>

                  <button onClick={() => { setRecoveryStep('input'); setError(''); }} className="w-full py-3 rounded-2xl flex items-center justify-center text-sm" style={{ background: isDark ? '#1A1A1A' : '#F0F0F0', color: isDark ? '#AAA' : '#888', border: `1px solid ${isDark ? '#333' : '#EEE'}` }}>
                    رجوع
                  </button>
                </>
              )}
            </motion.div>
          )}

          {/* REGISTER STEP 1 - Personal Info */}
          {step === 'register-step1' && (
            <motion.div key="register-step1" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => { setStep('login'); setLoginMode('login'); setError(''); }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: isDark ? '#1A1A1A' : '#F0F0F0' }}>
                  <ArrowLeft size={16} strokeWidth={1.5} color={isDark ? '#FFF' : '#666'} />
                </button>
                <h2 className="text-lg font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>إنشاء حسابك الجديد</h2>
              </div>

              <StepIndicator currentStep={1} />

              {/* First Name */}
              <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl" style={inputStyle}>
                <User size={18} strokeWidth={1.5} color="#E60000" />
                <input type="text" placeholder="الاسم الأول *" value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" style={{ color: isDark ? '#FFF' : '#1a1a1a' }} />
              </div>

              {/* Second Name */}
              <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl" style={inputStyle}>
                <User size={18} strokeWidth={1.5} color={isDark ? '#444' : '#CCC'} />
                <input type="text" placeholder="الاسم الثاني" value={regSecondName} onChange={(e) => setRegSecondName(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" style={{ color: isDark ? '#FFF' : '#1a1a1a' }} />
              </div>

              {/* Third Name */}
              <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl" style={inputStyle}>
                <User size={18} strokeWidth={1.5} color={isDark ? '#444' : '#CCC'} />
                <input type="text" placeholder="الاسم الثالث" value={regThirdName} onChange={(e) => setRegThirdName(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" style={{ color: isDark ? '#FFF' : '#1a1a1a' }} />
              </div>

              {/* Family Name */}
              <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl" style={inputStyle}>
                <User size={18} strokeWidth={1.5} color="#E60000" />
                <input type="text" placeholder="اسم العائلة *" value={regFamilyName} onChange={(e) => setRegFamilyName(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" style={{ color: isDark ? '#FFF' : '#1a1a1a' }} />
              </div>

              {/* National ID */}
              <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl" style={inputStyle}>
                <CreditCard size={18} strokeWidth={1.5} color="#E60000" />
                <input type="tel" placeholder="رقم البطاقة الشخصية *" value={regNationalId} onChange={(e) => handleNationalIdChange(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" style={{ color: isDark ? '#FFF' : '#1a1a1a' }} dir="ltr" />
              </div>

              {error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-center" style={{ color: '#E60000' }}>{error}</motion.p>}

              <button onClick={handleRegisterStep1} className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white transition-all active:scale-[0.98]" style={btnPrimary}>
                <span>التالي</span>
                <ArrowLeft size={16} strokeWidth={1.5} />
              </button>
            </motion.div>
          )}

          {/* REGISTER STEP 2 - Account Info */}
          {step === 'register-step2' && (
            <motion.div key="register-step2" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => { setStep('register-step1'); setError(''); }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: isDark ? '#1A1A1A' : '#F0F0F0' }}>
                  <ArrowLeft size={16} strokeWidth={1.5} color={isDark ? '#FFF' : '#666'} />
                </button>
                <h2 className="text-lg font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>معلومات الحساب</h2>
              </div>

              <StepIndicator currentStep={2} />

              {/* Email */}
              <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl" style={inputStyle}>
                <Mail size={18} strokeWidth={1.5} color="#E60000" />
                <input type="email" placeholder="البريد الإلكتروني *" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" style={{ color: isDark ? '#FFF' : '#1a1a1a' }} dir="ltr" autoComplete="email" />
              </div>

              {/* Password */}
              <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl" style={inputStyle}>
                <Lock size={18} strokeWidth={1.5} color="#E60000" />
                <input type="password" placeholder="كلمة المرور (6 أحرف على الأقل) *" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" style={{ color: isDark ? '#FFF' : '#1a1a1a' }} dir="ltr" autoComplete="new-password" />
              </div>

              {/* Confirm Password */}
              <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl" style={inputStyle}>
                <ShieldCheck size={18} strokeWidth={1.5} color="#E60000" />
                <input type="password" placeholder="تأكيد كلمة المرور *" value={regPasswordConfirm} onChange={(e) => setRegPasswordConfirm(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" style={{ color: isDark ? '#FFF' : '#1a1a1a' }} dir="ltr" autoComplete="new-password" />
              </div>

              {error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-center" style={{ color: '#E60000' }}>{error}</motion.p>}

              <div className="flex gap-3">
                <button onClick={() => { setStep('register-step1'); setError(''); }} className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98]" style={{ background: isDark ? '#1A1A1A' : '#F0F0F0', color: isDark ? '#FFF' : '#1a1a1a', border: `1px solid ${isDark ? '#333' : '#EEE'}` }}>
                  السابق
                </button>
                <button onClick={handleRegisterStep2} className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white transition-all active:scale-[0.98]" style={btnPrimary}>
                  <span>التالي</span>
                  <ArrowLeft size={16} strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>
          )}

          {/* REGISTER STEP 3 - Phone & Terms */}
          {step === 'register-step3' && (
            <motion.div key="register-step3" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => { setStep('register-step2'); setError(''); }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: isDark ? '#1A1A1A' : '#F0F0F0' }}>
                  <ArrowLeft size={16} strokeWidth={1.5} color={isDark ? '#FFF' : '#666'} />
                </button>
                <h2 className="text-lg font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>رقم الهاتف</h2>
              </div>

              <StepIndicator currentStep={3} />

              <div className="flex flex-col items-center mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: 'rgba(230,0,0,0.1)' }}>
                  <Phone size={28} strokeWidth={1.5} color="#E60000" />
                </div>
                <p className="text-xs text-center max-w-[250px]" style={{ color: isDark ? '#888' : '#AAA' }}>
                  يمكنك إضافة رقم هاتفك لاستقبال التحويلات عبر الهاتف
                </p>
              </div>

              <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl" style={inputStyle}>
                <YemenFlagIndicator />
                <span className="text-sm font-medium shrink-0" style={{ color: isDark ? '#AAA' : '#888' }} dir="ltr">+967</span>
                <div className="w-px h-5 shrink-0" style={{ background: isDark ? '#444' : '#DDD' }} />
                <input type="tel" placeholder="7XX XXX XXX" value={regPhone} onChange={(e) => handlePhoneChange(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" style={{ color: isDark ? '#FFF' : '#1a1a1a' }} dir="ltr" />
              </div>

              {/* Terms & Conditions Checkbox */}
              <button
                onClick={() => setAgreeTerms(!agreeTerms)}
                className="w-full flex items-start gap-3 p-3 rounded-2xl text-right"
                style={{ background: agreeTerms ? 'rgba(230,0,0,0.06)' : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: agreeTerms ? '1px solid rgba(230,0,0,0.2)' : `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}
              >
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ background: agreeTerms ? '#E60000' : 'transparent', border: agreeTerms ? 'none' : `1px solid ${isDark ? '#555' : '#CCC'}` }}>
                  {agreeTerms && <CheckCircle2 size={12} color="#FFF" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <FileText size={14} color="#E60000" />
                    <span className="text-xs font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>أوافق على الشروط والأحكام</span>
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: isDark ? '#888' : '#AAA' }}>الموافقة على شروط استخدام محفظة الجنوب</p>
                </div>
              </button>

              {/* Privacy Policy Checkbox */}
              <button
                onClick={() => setAgreePrivacy(!agreePrivacy)}
                className="w-full flex items-start gap-3 p-3 rounded-2xl text-right"
                style={{ background: agreePrivacy ? 'rgba(230,0,0,0.06)' : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: agreePrivacy ? '1px solid rgba(230,0,0,0.2)' : `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}
              >
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ background: agreePrivacy ? '#E60000' : 'transparent', border: agreePrivacy ? 'none' : `1px solid ${isDark ? '#555' : '#CCC'}` }}>
                  {agreePrivacy && <CheckCircle2 size={12} color="#FFF" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <Shield size={14} color="#E60000" />
                    <span className="text-xs font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>أوافق على سياسة الخصوصية</span>
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: isDark ? '#888' : '#AAA' }}>الموافقة على سياسة حماية البيانات الشخصية</p>
                </div>
              </button>

              {error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-center" style={{ color: '#E60000' }}>{error}</motion.p>}

              <div className="flex gap-3">
                <button onClick={() => { setStep('register-step2'); setError(''); }} className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98]" style={{ background: isDark ? '#1A1A1A' : '#F0F0F0', color: isDark ? '#FFF' : '#1a1a1a', border: `1px solid ${isDark ? '#333' : '#EEE'}` }}>
                  السابق
                </button>
                <button onClick={handleRegisterStep3} disabled={isLoading} className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50" style={btnPrimary}>
                  {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <span>إنشاء الحساب</span>}
                </button>
              </div>

              <button onClick={() => { setRegPhone(''); handleRegisterStep3(); }} disabled={isLoading} className="w-full py-3 rounded-2xl flex items-center justify-center text-sm font-medium disabled:opacity-50" style={{ background: isDark ? '#1A1A1A' : '#F0F0F0', color: isDark ? '#AAA' : '#888', border: `1px solid ${isDark ? '#333' : '#EEE'}` }}>
                تخطي - بدون رقم هاتف
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
