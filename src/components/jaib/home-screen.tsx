'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Bell,
  Headphones,
  Eye,
  EyeOff,
  FileText,
  ArrowLeftRight,
  RotateCcw,
  Smartphone,
  ShoppingBag,
  Wifi,
  FileSpreadsheet,
  Gamepad2,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  Trophy,
  Sparkles,
} from 'lucide-react';

const services = [
  { icon: FileText, label: 'المدفوعات الفورية', color: 'bg-[#E63946]' },
  { icon: ArrowLeftRight, label: 'تحويل الأموال', color: 'bg-[#2EC4B6]' },
  { icon: RotateCcw, label: 'طلب الأموال', color: 'bg-[#FF9F1C]' },
  { icon: Smartphone, label: 'شحن رصيد', color: 'bg-[#6C63FF]' },
  { icon: ShoppingBag, label: 'متجر الجيب', color: 'bg-[#E63946]' },
  { icon: Wifi, label: 'دفع الفواتير', color: 'bg-[#2EC4B6]' },
  { icon: FileSpreadsheet, label: 'كشف', color: 'bg-[#FF9F1C]' },
  { icon: Gamepad2, label: 'بطاقات الألعاب', color: 'bg-[#6C63FF]' },
  { icon: Wallet, label: 'المحفظة', color: 'bg-[#E63946]' },
];

const transactions = [
  { id: 1, title: 'شراء', subtitle: 'متجر إلكتروني', amount: -150, currency: 'YER', date: 'اليوم ١٠:٣٠', type: 'purchase' },
  { id: 2, title: 'تحويل وارد', subtitle: 'من أحمد', amount: 500, currency: 'SAR', date: 'أمس ٠٢:١٥', type: 'incoming' },
  { id: 3, title: 'دفع فاتورة', subtitle: 'فاتورة كهرباء', amount: -200, currency: 'YER', date: '٠٣/٠٦', type: 'bill' },
  { id: 4, title: 'شحن رصيد', subtitle: 'خط 773649653', amount: -50, currency: 'YER', date: '٠٢/٠٦', type: 'recharge' },
  { id: 5, title: 'تحويل وارد', subtitle: 'من سارة', amount: 1000, currency: 'USD', date: '٠١/٠٦', type: 'incoming' },
];

const balanceCards = [
  {
    id: 0,
    currency: 'YER',
    currencyAr: 'ر.ي',
    currencyName: 'الريال اليمني',
    balance: 0,
    gradientFrom: '#E63946',
    gradientVia: '#D62839',
    gradientTo: '#B91C2B',
    flagEmoji: '🇾🇪',
    glowColor: 'rgba(230, 57, 70, 0.4)',
    sparkleColor: 'rgba(255, 200, 200, 0.8)',
  },
  {
    id: 1,
    currency: 'SAR',
    currencyAr: 'ر.س',
    currencyName: 'الريال السعودي',
    balance: 0,
    gradientFrom: '#1B5E20',
    gradientVia: '#2E7D32',
    gradientTo: '#388E3C',
    flagEmoji: '🇸🇦',
    glowColor: 'rgba(46, 125, 50, 0.4)',
    sparkleColor: 'rgba(200, 255, 200, 0.8)',
  },
  {
    id: 2,
    currency: 'USD',
    currencyAr: '$',
    currencyName: 'الدولار الأمريكي',
    balance: 0,
    gradientFrom: '#1565C0',
    gradientVia: '#1976D2',
    gradientTo: '#1E88E5',
    flagEmoji: '🇺🇸',
    glowColor: 'rgba(21, 101, 192, 0.4)',
    sparkleColor: 'rgba(200, 220, 255, 0.8)',
  },
];

// Floating sparkle component
function FloatingSparkle({ delay, x, y, color }: { delay: number; x: string; y: string; color: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0],
        rotate: [0, 90, 180, 270],
        y: [0, -15, -30],
      }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3 + 1,
        ease: 'easeInOut',
      }}
    >
      <Sparkles className="w-3 h-3" style={{ color }} />
    </motion.div>
  );
}

// Individual Balance Card Component
function BalanceCard({
  card,
  balanceVisible,
  onToggleBalance,
  isActive,
}: {
  card: typeof balanceCards[0];
  balanceVisible: boolean;
  onToggleBalance: () => void;
  isActive: boolean;
}) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {/* Main gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${card.gradientFrom}, ${card.gradientVia}, ${card.gradientTo})`,
        }}
      />

      {/* Animated mesh pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
            radial-gradient(circle at 80% 20%, white 1px, transparent 1px),
            radial-gradient(circle at 50% 80%, white 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 80px 80px, 70px 70px',
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Decorative floating circles */}
      <motion.div
        className="absolute -top-10 -left-10 w-48 h-48 rounded-full"
        style={{ background: 'rgba(255,255,255,0.06)' }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full"
        style={{ background: 'rgba(255,255,255,0.05)' }}
        animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full"
        style={{ background: 'rgba(255,255,255,0.03)' }}
        animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Animated diagonal lines */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, white 8px, white 9px)',
      }} />

      {/* Glowing border effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          boxShadow: `inset 0 0 30px ${card.glowColor}, 0 0 40px ${card.glowColor}`,
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Sparkles */}
      <FloatingSparkle delay={0} x="15%" y="20%" color={card.sparkleColor} />
      <FloatingSparkle delay={1.5} x="75%" y="15%" color={card.sparkleColor} />
      <FloatingSparkle delay={3} x="85%" y="65%" color={card.sparkleColor} />
      <FloatingSparkle delay={0.8} x="25%" y="75%" color={card.sparkleColor} />
      <FloatingSparkle delay={2.2} x="55%" y="40%" color={card.sparkleColor} />

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Top row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Wallet className="w-5 h-5 text-white" />
            </motion.div>
            <motion.span
              className="text-white/90 font-bold text-lg"
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              جيب
            </motion.span>
          </div>
          <motion.div
            className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">{card.flagEmoji}</span>
            <span className="text-white/80 text-xs font-semibold">{card.currency}</span>
          </motion.div>
        </div>

        {/* Balance label */}
        <p className="text-white/60 text-sm mb-1">رصيدك الحالي</p>

        {/* Balance amount */}
        <motion.div
          className="flex items-center gap-3 mb-auto"
          key={`bal-${balanceVisible}-${card.currency}`}
          initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="text-white text-5xl font-bold tracking-tight">
            {balanceVisible ? card.balance.toLocaleString('ar-SA') : '••••'}
          </span>
          <span className="text-white/40 text-lg font-semibold mt-auto mb-2">{card.currencyAr}</span>
        </motion.div>

        {/* Currency name & toggle */}
        <div className="flex items-center justify-between mt-4">
          <motion.span
            className="text-white/50 text-xs"
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {card.currencyName}
          </motion.span>
          <motion.button
            onClick={onToggleBalance}
            className="p-2 rounded-full bg-white/15 backdrop-blur-sm"
            whileTap={{ scale: 0.85, rotate: 15 }}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.25)' }}
          >
            {balanceVisible ? (
              <Eye className="w-4 h-4 text-white/80" />
            ) : (
              <EyeOff className="w-4 h-4 text-white/80" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function HomeScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeCard, setActiveCard] = useState(0);
  const dragX = useMotionValue(0);

  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 40;
    // RTL: swiping left (negative x) means going to next card
    if (info.offset.x < -threshold) {
      setActiveCard((prev) => Math.min(balanceCards.length - 1, prev + 1));
    } else if (info.offset.x > threshold) {
      // RTL: swiping right (positive x) means going to previous card
      setActiveCard((prev) => Math.max(0, prev - 1));
    }
  }, []);

  const goToCard = useCallback((index: number) => {
    setActiveCard(index);
  }, []);

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <p className="text-sm text-gray-500">مساء الخير،</p>
          <h1 className="text-lg font-bold text-gray-900">محمود</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 rounded-full bg-white shadow-sm active:scale-95 transition-transform">
            <Bell className="w-5 h-5 text-[#E63946]" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#E63946] rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2.5 rounded-full bg-white shadow-sm active:scale-95 transition-transform">
            <Headphones className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Balance Card Carousel - EPIC ANIMATION */}
      <div className="px-4 py-3">
        <div
          className="relative"
          style={{ height: '220px', perspective: '1200px' }}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeCard}
              className="absolute inset-0 rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing"
              initial={{
                x: 300,
                opacity: 0,
                scale: 0.6,
                rotateY: -45,
                rotateZ: -8,
                filter: 'blur(8px) brightness(0.5)',
              }}
              animate={{
                x: 0,
                opacity: 1,
                scale: 1,
                rotateY: 0,
                rotateZ: 0,
                filter: 'blur(0px) brightness(1)',
              }}
              exit={{
                x: -300,
                opacity: 0,
                scale: 0.6,
                rotateY: 45,
                rotateZ: 8,
                filter: 'blur(8px) brightness(0.5)',
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 25,
                mass: 0.8,
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{ dragX }}
              whileDrag={{
                scale: 0.97,
                rotateZ: 0,
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              }}
            >
              <BalanceCard
                card={balanceCards[activeCard]}
                balanceVisible={balanceVisible}
                onToggleBalance={() => setBalanceVisible(!balanceVisible)}
                isActive={true}
              />
            </motion.div>
          </AnimatePresence>

          {/* Side peek cards (ghost effect) */}
          {activeCard > 0 && (
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
              initial={{ x: -100, scale: 0.85, opacity: 0 }}
              animate={{ x: -30, scale: 0.88, opacity: 0.15 }}
              style={{
                background: `linear-gradient(135deg, ${balanceCards[activeCard - 1].gradientFrom}, ${balanceCards[activeCard - 1].gradientTo})`,
                filter: 'blur(2px)',
              }}
            />
          )}
          {activeCard < balanceCards.length - 1 && (
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
              initial={{ x: 100, scale: 0.85, opacity: 0 }}
              animate={{ x: 30, scale: 0.88, opacity: 0.15 }}
              style={{
                background: `linear-gradient(135deg, ${balanceCards[activeCard + 1].gradientFrom}, ${balanceCards[activeCard + 1].gradientTo})`,
                filter: 'blur(2px)',
              }}
            />
          )}
        </div>

        {/* Dots Indicator */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {balanceCards.map((card, i) => (
            <motion.button
              key={i}
              onClick={() => goToCard(i)}
              className="relative"
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.2 }}
            >
              <motion.div
                className="rounded-full"
                animate={{
                  width: i === activeCard ? 32 : 10,
                  height: 10,
                  backgroundColor: i === activeCard ? card.gradientFrom : '#d1d5db',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
              {/* Active dot glow */}
              {i === activeCard && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: card.glowColor }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Currency Quick Switch Pills */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {balanceCards.map((card, i) => (
            <motion.button
              key={card.id}
              onClick={() => goToCard(i)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
                i === activeCard
                  ? 'bg-white shadow-md'
                  : 'bg-white/60'
              }`}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm">{card.flagEmoji}</span>
              <span className={`text-xs font-bold ${
                i === activeCard ? 'text-gray-800' : 'text-gray-500'
              }`}>
                {card.currency}
              </span>
              {i === activeCard && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: card.gradientFrom }}
                  layoutId="activeIndicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Service Grid */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-3 gap-2.5">
          {services.map((service, index) => (
            <motion.button
              key={index}
              className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm active:scale-95 transition-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              whileTap={{ scale: 0.92 }}
            >
              <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center shadow-sm`}>
                <service.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] text-gray-700 text-center leading-tight font-medium">
                {service.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="px-4 py-3">
        <motion.div
          className="relative bg-gradient-to-l from-[#6C63FF] to-[#4834d4] rounded-2xl p-4 overflow-hidden shadow-sm"
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-base mb-1">اشتركوا في بطولات</h3>
                <p className="text-white/70 text-xs">استمتعوا بمكافآت حصرية</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-white/60" />
                </div>
                <button className="bg-white/20 p-2 rounded-full active:scale-90 transition-transform">
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transactions Section */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">العمليات</h2>
          <button className="text-[#E63946] text-sm font-medium active:opacity-70">عرض الكل</button>
        </div>
        <div className="space-y-2">
          {transactions.map((tx, index) => {
            const txCurrency = balanceCards.find(c => c.currency === tx.currency);
            return (
              <motion.div
                key={tx.id}
                className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.amount > 0 ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {tx.amount > 0 ? (
                    <ArrowDownRight className="w-5 h-5 text-green-500" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-[#E63946]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900">{tx.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{tx.subtitle}</p>
                </div>
                <div className="text-left">
                  <p
                    className={`text-sm font-bold ${
                      tx.amount > 0 ? 'text-green-500' : 'text-[#E63946]'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : ''}
                    {tx.amount.toLocaleString('ar-SA')}
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-[10px]">{txCurrency?.flagEmoji}</span>
                    <p className="text-[10px] text-gray-400">{txCurrency?.currencyAr}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
