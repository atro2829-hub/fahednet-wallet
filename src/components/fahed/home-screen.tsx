'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Headphones,
  Eye,
  EyeOff,
  Send,
  Download,
  QrCode,
  HandCoins,
  ArrowUpRight,
  ArrowDownLeft,
  Wifi,
  Heart,
  Target,
  Plus,
  ChevronLeft,
  RefreshCw,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatBalance, formatNumber, currencySymbols, currencyNames, currencyBadgeColors, timeAgo, transactionTypeLabels, transactionTypeColors } from '@/lib/utils';
import { LOGO_BASE64 } from '@/lib/logo';

interface BalanceCard {
  currency: 'YER' | 'SAR' | 'USD';
  gradient: string;
  gradientEnd: string;
  accentColor: string;
  patternColor: string;
}

const balanceCards: BalanceCard[] = [
  { currency: 'YER', gradient: '#E60000', gradientEnd: '#8B0000', accentColor: '#E60000', patternColor: 'rgba(255,255,255,0.08)' },
  { currency: 'SAR', gradient: '#059669', gradientEnd: '#064E3B', accentColor: '#10B981', patternColor: 'rgba(255,255,255,0.08)' },
  { currency: 'USD', gradient: '#2563EB', gradientEnd: '#1E3A8A', accentColor: '#3B82F6', patternColor: 'rgba(255,255,255,0.08)' },
];

const quickActions = [
  { id: 'send', label: 'تحويل', icon: Send, color: '#E60000', bgColor: 'rgba(230,0,0,0.08)' },
  { id: 'receive', label: 'استقبال', icon: Download, color: '#10B981', bgColor: 'rgba(16,185,129,0.08)' },
  { id: 'qr', label: 'مسح QR', icon: QrCode, color: '#3B82F6', bgColor: 'rgba(37,99,235,0.08)' },
  { id: 'request', label: 'طلب أموال', icon: HandCoins, color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.08)' },
];

const promoItems = [
  { title: 'شحن رصيدك الآن واحصل على مكافأة!', desc: 'مكافأة تصل إلى 500 ر.ي عند كل شحن' },
  { title: 'عرض حصري على بطاقات ببجي', desc: 'خصم 15% على جميع شدات ببجي' },
  { title: 'أول تحويل مجاني', desc: 'استمتع بتحويل مجاني عند التسجيل' },
];

// Animated counter hook
function useAnimatedCounter(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    if (prevTarget.current === target) return;
    const start = prevTarget.current;
    const diff = target - start;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + diff * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevTarget.current = target;
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return value;
}

function AnimatedBalance({ amount, currency, visible }: { amount: number; currency: string; visible: boolean }) {
  const animatedValue = useAnimatedCounter(amount);
  if (!visible) return <span className="text-white text-2xl font-bold tracking-wide">****</span>;
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-white text-2xl font-bold tracking-wide">{formatBalance(animatedValue, currency)}</span>
      <span className="text-white/40 text-xs">{currencySymbols[currency]}</span>
    </div>
  );
}

// Countdown timer component
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      if (distance < 0) { clearInterval(timer); return; }
      setTimeLeft({
        hours: Math.floor(distance / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-1.5 mt-2" dir="ltr">
      {[
        { val: timeLeft.hours, label: 'س' },
        { val: timeLeft.minutes, label: 'د' },
        { val: timeLeft.seconds, label: 'ث' },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <span className="text-white text-xs font-bold">{String(item.val).padStart(2, '0')}</span>
          </div>
          <span className="text-white/30 text-[9px]">{item.label}</span>
          {i < 2 && <span className="text-white/20 mx-0.5">:</span>}
        </div>
      ))}
    </div>
  );
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const {
    user,
    balanceVisible,
    toggleBalance,
    setActiveScreen,
    notifications,
    setTransferOpen,
    setRequestMoneyOpen,
    setDrawerOpen,
    transactions,
    providers,
    categories,
    favorites,
    toggleFavorite,
    recentServices,
    setSelectedProvider,
    setOrderOpen,
    savingsGoals,
  } = useAppStore();

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(375);
  const [promoIndex, setPromoIndex] = useState(0);

  // Touch/drag tracking
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);

  // Hidden admin access - tap greeting 5 times within 3 seconds
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleGreetingTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      setActiveScreen('admin');
      return;
    }
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 3000);
  };

  // Pull to refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  // Promo rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex(prev => (prev + 1) % promoItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Card dimensions per Jaib spec
  const CARD_GAP = 12;
  const CARD_SIDE_PADDING = 32; // paddingHorizontal to show side cards

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const getCardWidth = useCallback(() => {
    // 78% of container width (75-80% per spec)
    return containerWidth * 0.78;
  }, [containerWidth]);

  const getStepWidth = useCallback(() => {
    return getCardWidth() + CARD_GAP;
  }, [getCardWidth]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    return 'مساء الخير';
  };

  const getBalance = (currency: string): number => {
    if (!user) return 0;
    const field = `balance${currency}` as keyof typeof user;
    return (user[field] as number) || 0;
  };

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;
  const recentTx = transactions.slice(0, 5);

  // Flash deal countdown
  const flashDealEnd = useRef(new Date(Date.now() + 6 * 60 * 60 * 1000));

  // Filtered providers for services grid - show all active, no category filter
  const allProviders = providers.filter(p => p.isActive);

  // Snap to a specific card index
  const snapToCard = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, balanceCards.length - 1));
    setActiveCardIndex(clamped);
    const targetTranslate = -clamped * getStepWidth();
    currentTranslate.current = targetTranslate;
    prevTranslate.current = targetTranslate;

    if (containerRef.current) {
      const track = containerRef.current.querySelector('[data-carousel-track]') as HTMLElement;
      if (track) {
        track.style.transform = `translateX(${targetTranslate}px)`;
        track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
      }
    }
  }, [getStepWidth]);

  const setTrackPosition = useCallback((translateX: number) => {
    if (containerRef.current) {
      const track = containerRef.current.querySelector('[data-carousel-track]') as HTMLElement;
      if (track) {
        track.style.transform = `translateX(${translateX}px)`;
      }
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    prevTranslate.current = currentTranslate.current;

    if (containerRef.current) {
      const track = containerRef.current.querySelector('[data-carousel-track]') as HTMLElement;
      if (track) {
        track.style.transition = 'none';
      }
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX.current;
    const newTranslate = prevTranslate.current + diff;

    const minTranslate = -(balanceCards.length - 1) * getStepWidth();
    const maxTranslate = 0;

    let clampedTranslate = newTranslate;
    if (newTranslate > maxTranslate) {
      clampedTranslate = maxTranslate + (newTranslate - maxTranslate) * 0.3;
    } else if (newTranslate < minTranslate) {
      clampedTranslate = minTranslate + (newTranslate - minTranslate) * 0.3;
    }

    currentTranslate.current = clampedTranslate;
    setTrackPosition(clampedTranslate);
  }, [getStepWidth, setTrackPosition]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const movedBy = currentTranslate.current - prevTranslate.current;
    const stepWidth = getStepWidth();
    const threshold = stepWidth * 0.2;

    let newIndex = activeCardIndex;

    if (movedBy < -threshold) {
      newIndex = Math.min(activeCardIndex + 1, balanceCards.length - 1);
    } else if (movedBy > threshold) {
      newIndex = Math.max(activeCardIndex - 1, 0);
    }

    const targetTranslate = -newIndex * stepWidth;
    currentTranslate.current = targetTranslate;
    prevTranslate.current = targetTranslate;

    if (containerRef.current) {
      const track = containerRef.current.querySelector('[data-carousel-track]') as HTMLElement;
      if (track) {
        track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        track.style.transform = `translateX(${targetTranslate}px)`;
      }
    }

    setActiveCardIndex(newIndex);
  }, [activeCardIndex, getStepWidth]);

  useEffect(() => {
    currentTranslate.current = 0;
    prevTranslate.current = 0;
  }, []);

  const handleQuickAction = (id: string) => {
    switch (id) {
      case 'send': setTransferOpen(true); break;
      case 'receive': setDrawerOpen(true); break;
      case 'qr': setDrawerOpen(true); break;
      case 'request': setRequestMoneyOpen(true); break;
    }
  };

  const handleProviderClick = (provider: { id: string; name: string; color: string; icon: string; categoryId: string; isActive: boolean; inputLabel: string; inputType: 'phone' | 'text'; inputPrefix?: string }) => {
    setSelectedProvider(provider);
    setOrderOpen(true);
    useAppStore.getState().addRecentService(provider.id);
  };

  return (
    <div className="pb-4">
      {/* ========================================
          HEADER - Clean Jaib Style (60-70px)
          ======================================== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-4 pt-4 pb-2"
      >
        <div className="flex items-center justify-between" style={{ height: 60 }}>
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div
              className="w-10 h-10 rounded-xl overflow-hidden"
              style={{
                boxShadow: '0 2px 8px rgba(230,0,0,0.15)',
              }}
            >
              <img src={LOGO_BASE64} alt="الجنوب" className="w-full h-full object-cover" />
            </div>
            <button onClick={handleGreetingTap} className="active:scale-95 transition-transform">
              <h1 className="text-base font-bold" style={{ color: isDark ? '#FFFFFF' : '#1a1a1a' }}>
                {getGreeting()}، {user?.name || 'مستخدم'}
              </h1>
              <p className="text-[11px]" style={{ color: isDark ? '#666' : '#999' }}>محفظة الجنوب</p>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveScreen('notifications')}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}
            >
              <Bell size={20} strokeWidth={1.5} color={isDark ? '#CCC' : '#666'} />
              {unreadNotifCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full flex items-center justify-center text-[9px] font-bold text-white px-1"
                  style={{ background: '#E60000' }}
                >
                  {unreadNotifCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveScreen('support')}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}
            >
              <Headphones size={20} strokeWidth={1.5} color={isDark ? '#CCC' : '#666'} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ========================================
          BALANCE CARD CAROUSEL - Jaib Style
          Card: 78% width, 12px gap, 20px radius
          Container: 32px side padding to show edges
          ======================================== */}
      <div className="relative z-20">
        <div
          ref={containerRef}
          className="relative overflow-hidden"
          style={{ touchAction: 'pan-y', paddingLeft: CARD_SIDE_PADDING, paddingRight: CARD_SIDE_PADDING }}
          dir="ltr"
        >
          <div
            data-carousel-track=""
            className="flex cursor-grab active:cursor-grabbing select-none"
            style={{ gap: CARD_GAP }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={() => {
              if (isDragging.current) handleTouchEnd();
            }}
          >
            {balanceCards.map((card, index) => (
              <div
                key={card.currency}
                className="shrink-0 relative overflow-hidden select-none"
                style={{
                  width: getCardWidth(),
                  height: 200,
                  borderRadius: 20,
                  background: `linear-gradient(145deg, ${card.gradient} 0%, ${card.gradientEnd} 100%)`,
                  boxShadow: index === activeCardIndex
                    ? `0 4px 12px rgba(0,0,0,0.1), 0 12px 32px ${card.accentColor}30`
                    : '0 2px 8px rgba(0,0,0,0.08)',
                  transform: index === activeCardIndex ? 'scale(1)' : 'scale(0.93)',
                  opacity: index === activeCardIndex ? 1 : 0.5,
                  transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease, box-shadow 0.4s ease',
                }}
                onClick={() => snapToCard(index)}
                dir="rtl"
              >
                {/* Logo Watermark - transparent icon */}
                <img
                  src={LOGO_BASE64}
                  alt=""
                  className="absolute bottom-1 left-1 w-24 h-24 object-contain opacity-[0.04] pointer-events-none select-none"
                  aria-hidden="true"
                />

                {/* Shimmer effect */}
                <div className="absolute inset-0 shimmer pointer-events-none" />

                {/* Card SVG Dot Pattern */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id={`grid-${card.currency}`} width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="1" fill={card.patternColor} />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#grid-${card.currency})`} />
                </svg>

                {/* Decorative circles */}
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />

                {/* Decorative wave line */}
                <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 300 40" preserveAspectRatio="none" style={{ height: '35px' }}>
                  <path d="M0,30 C50,10 100,40 150,25 C200,10 250,35 300,20 L300,40 L0,40 Z" fill="rgba(255,255,255,0.03)" />
                </svg>

                {/* Card Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-5">
                  {/* Top Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                        <span className="text-white text-[8px] font-bold">الجنوب</span>
                      </div>
                      <span className="text-white/60 text-[11px] font-medium">محفظة الجنوب</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wifi size={14} strokeWidth={1.5} color="rgba(255,255,255,0.35)" />
                      <button onClick={(e) => { e.stopPropagation(); toggleBalance(); }}>
                        {balanceVisible ? (
                          <Eye size={14} strokeWidth={1.5} color="rgba(255,255,255,0.35)" />
                        ) : (
                          <EyeOff size={14} strokeWidth={1.5} color="rgba(255,255,255,0.35)" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Chip + Currency */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 rounded-md" style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.4) 0%, rgba(255,215,0,0.2) 100%)', border: '1px solid rgba(255,215,0,0.2)' }} />
                    <span
                      className="text-[10px] px-2 py-0.5 rounded font-bold text-white"
                      style={{ background: currencyBadgeColors[card.currency] }}
                    >
                      {card.currency}
                    </span>
                    <span className="text-white/40 text-[10px]">{currencyNames[card.currency]}</span>
                  </div>

                  {/* Bottom Row - Account + Balance */}
                  <div>
                    <p className="text-white/30 text-[10px] mb-0.5">رقم الحساب</p>
                    <p className="text-white text-xs font-bold tracking-[0.15em]" dir="ltr">
                      {user?.userId || '------'}
                    </p>
                    <div className="mt-1.5">
                      <AnimatedBalance amount={getBalance(card.currency)} currency={card.currency} visible={balanceVisible} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots - Jaib Style
              Inactive: 6px circle gray
              Active: 14px x 6px rounded rect, red */}
          <div className="flex items-center justify-center gap-2 mt-4" dir="rtl">
            {balanceCards.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => snapToCard(index)}
                className="rounded-full"
                animate={{
                  width: activeCardIndex === index ? 14 : 6,
                  backgroundColor: activeCardIndex === index ? balanceCards[index].accentColor : (isDark ? '#333' : '#D4D4D4'),
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ height: 6 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ========================================
          QUICK ACTIONS ROW - Clean pill buttons
          ======================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="px-4 mt-5"
      >
        <div className="flex justify-between gap-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                onClick={() => handleQuickAction(action.id)}
                className="flex-1 flex flex-col items-center gap-2 py-3 card-press"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: action.bgColor }}
                >
                  <Icon size={22} strokeWidth={1.5} color={action.color} />
                </div>
                <span className="text-[11px] font-medium" style={{ color: isDark ? '#AAA' : '#666' }}>
                  {action.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ========================================
          PROMO BANNER - Jaib Style
          Height: 80-100px, borderRadius: 16px
          ======================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="px-4 mt-5"
      >
        <div
          className="rounded-2xl relative overflow-hidden"
          style={{
            height: 96,
            background: 'linear-gradient(145deg, #E60000 0%, #8B0000 60%, #5C0000 100%)',
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(230,0,0,0.2)',
          }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="absolute top-4 left-16 w-12 h-12 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />

          {/* Logo watermark on banner */}
          <img
            src={LOGO_BASE64}
            alt=""
            className="absolute left-2 bottom-1 w-20 h-20 object-contain opacity-[0.06] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 h-full flex items-center px-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{ background: 'rgba(255,255,255,0.2)', color: '#FFF' }}
                >
                  <Sparkles size={8} />
                  عرض خاص
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                  <Clock size={8} className="inline ml-0.5" />
                  محدود
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={promoIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-bold text-[13px] text-white leading-tight">
                    {promoItems[promoIndex].title}
                  </h3>
                  <p className="text-[11px] mt-0.5 text-white/50">
                    {promoItems[promoIndex].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Countdown */}
            <div className="shrink-0 mr-2">
              <CountdownTimer targetDate={flashDealEnd.current} />
            </div>
          </div>

          {/* Promo indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
            {promoItems.map((_, i) => (
              <div
                key={i}
                className="h-[3px] rounded-full transition-all duration-300"
                style={{
                  width: i === promoIndex ? 12 : 4,
                  background: i === promoIndex ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)',
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* ========================================
          SERVICES GRID - Jaib Style
          3 columns, square items, white bg
          borderRadius: 16px, icon: 28px, text: 12px
          ======================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="px-4 mt-5"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold" style={{ color: isDark ? '#FFFFFF' : '#1a1a1a' }}>الخدمات</h3>
          <button
            onClick={() => useAppStore.getState().setActiveTab('services')}
            className="text-xs font-medium flex items-center gap-0.5"
            style={{ color: '#E60000' }}
          >
            عرض الكل
            <ChevronLeft size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* 3-column Grid - Jaib spec */}
        <div className="grid grid-cols-3 gap-3">
          {allProviders.slice(0, 9).map((provider, index) => {
            const isFav = favorites.includes(provider.id);
            return (
              <motion.button
                key={provider.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * index }}
                onClick={() => handleProviderClick(provider)}
                className="flex flex-col items-center justify-center gap-2 py-4 px-2 card-press relative"
                style={{
                  background: isDark ? '#1A1A1A' : '#FFFFFF',
                  borderRadius: 16,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                  boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                  aspectRatio: '1 / 0.95',
                }}
              >
                {/* Favorite heart */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(provider.id); }}
                  className="absolute top-1.5 left-1.5 z-10"
                >
                  <Heart
                    size={10}
                    fill={isFav ? '#E60000' : 'none'}
                    color={isFav ? '#E60000' : (isDark ? '#333' : '#DDD')}
                    strokeWidth={2}
                  />
                </button>

                {/* Provider Icon - 28-32px per spec */}
                {provider.icon && provider.icon.startsWith('data:') ? (
                  <img src={provider.icon} alt={provider.name} className="w-7 h-7 rounded-lg object-cover" />
                ) : (
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${provider.color}12` }}
                  >
                    <span className="font-bold text-sm" style={{ color: provider.color }}>
                      {provider.name.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Text: 12px, max 2 lines */}
                <span
                  className="text-[12px] font-medium text-center leading-tight max-w-[90px]"
                  style={{
                    color: isDark ? '#CCC' : '#444',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {provider.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ========================================
          RECENT TRANSACTIONS
          ======================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="px-4 mt-5"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold" style={{ color: isDark ? '#FFFFFF' : '#1a1a1a' }}>آخر المعاملات</h3>
          <button
            onClick={() => useAppStore.getState().setActiveTab('wallet')}
            className="text-xs font-medium flex items-center gap-0.5"
            style={{ color: '#E60000' }}
          >
            عرض الكل
            <ChevronLeft size={14} strokeWidth={1.5} />
          </button>
        </div>

        {recentTx.length === 0 ? (
          <div
            className="rounded-2xl p-8 flex flex-col items-center"
            style={{
              background: isDark ? '#1A1A1A' : '#FFFFFF',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: isDark ? '#222' : '#F5F5F5' }}>
              <Send size={24} strokeWidth={1.5} color={isDark ? '#333' : '#DDD'} />
            </div>
            <p className="text-sm mt-3 font-medium" style={{ color: isDark ? '#555' : '#AAA' }}>لا توجد معاملات بعد</p>
            <p className="text-[11px] mt-1" style={{ color: isDark ? '#444' : '#CCC' }}>أول تحويل سيظهر هنا</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTx.map((tx, index) => {
              const isIncoming = tx.toUserId === user?.id;
              const txColor = transactionTypeColors[tx.type] || '#E60000';
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * index }}
                  className="flex items-center gap-3 p-3 rounded-2xl card-press"
                  style={{
                    background: isDark ? '#1A1A1A' : '#FFFFFF',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${txColor}10` }}
                  >
                    {isIncoming ? (
                      <ArrowDownLeft size={18} strokeWidth={1.5} color={txColor} />
                    ) : (
                      <ArrowUpRight size={18} strokeWidth={1.5} color={txColor} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                      {tx.description || transactionTypeLabels[tx.type] || 'معاملة'}
                    </p>
                    <p className="text-[11px]" style={{ color: isDark ? '#555' : '#AAA' }}>
                      {timeAgo(tx.createdAt)}
                    </p>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-sm font-bold" style={{ color: isIncoming ? '#10B981' : '#E60000' }}>
                      {isIncoming ? '+' : '-'}{tx.amount.toLocaleString()}
                    </p>
                    <div className="flex justify-end mt-0.5">
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded font-bold text-white"
                        style={{ background: currencyBadgeColors[tx.currency] || '#666' }}
                      >
                        {tx.currency}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
