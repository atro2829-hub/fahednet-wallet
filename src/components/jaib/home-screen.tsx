'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
    bgColor: '#E60000',
    darkBg: '#1a1a1a',
    flagEmoji: '🇾🇪',
  },
  {
    id: 1,
    currency: 'SAR',
    currencyAr: 'ر.س',
    currencyName: 'الريال السعودي',
    balance: 0,
    bgColor: '#1B7A2B',
    darkBg: '#1a1a1a',
    flagEmoji: '🇸🇦',
  },
  {
    id: 2,
    currency: 'USD',
    currencyAr: '$',
    currencyName: 'الدولار الأمريكي',
    balance: 0,
    bgColor: '#1565C0',
    darkBg: '#1a1a1a',
    flagEmoji: '🇺🇸',
  },
];

// Dot pattern for card decoration
function CardDotPattern() {
  return (
    <div className="absolute left-0 top-0 w-1/2 h-full overflow-hidden opacity-[0.08]">
      <div className="grid grid-cols-6 grid-rows-8 gap-3 p-4 w-full h-full">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-white" />
        ))}
      </div>
    </div>
  );
}

// Balance Card matching original design
function BalanceCard({
  card,
  balanceVisible,
  onToggleBalance,
}: {
  card: typeof balanceCards[0];
  balanceVisible: boolean;
  onToggleBalance: () => void;
}) {
  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden"
      style={{ backgroundColor: card.bgColor }}
    >
      {/* Dot pattern on left side */}
      <CardDotPattern />

      {/* Decorative circles */}
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/[0.06] rounded-full" />
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/[0.04] rounded-full" />

      {/* Content */}
      <div className="relative z-10 p-5 h-full flex flex-col justify-between">
        {/* Top row: Logo + Currency badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-base">جيب</span>
          </div>
          <div className="flex items-center gap-1 bg-white/15 rounded-full px-2.5 py-1">
            <span className="text-sm">{card.flagEmoji}</span>
            <span className="text-white/80 text-[11px] font-semibold">{card.currency}</span>
          </div>
        </div>

        {/* Balance section */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-white/70 text-xs mb-1">رصيدك الحالي</p>
          <motion.div
            className="flex items-end gap-2"
            key={`bal-${balanceVisible}-${card.currency}`}
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-white text-5xl font-bold leading-none">
              {balanceVisible ? card.balance.toLocaleString('ar-SA') : '••••'}
            </span>
            <span className="text-white/50 text-base font-semibold mb-1">{card.currencyAr}</span>
          </motion.div>
        </div>

        {/* Bottom row: Currency name + Eye toggle */}
        <div className="flex items-center justify-between">
          <span className="text-white/40 text-[11px]">{card.currencyName}</span>
          <motion.button
            onClick={onToggleBalance}
            className="p-1.5 rounded-full bg-white/15"
            whileTap={{ scale: 0.85, rotate: 15 }}
          >
            {balanceVisible ? (
              <Eye className="w-4 h-4 text-white/70" />
            ) : (
              <EyeOff className="w-4 h-4 text-white/70" />
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

  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 40;
    if (info.offset.x < -threshold) {
      setActiveCard((prev) => Math.min(balanceCards.length - 1, prev + 1));
    } else if (info.offset.x > threshold) {
      setActiveCard((prev) => Math.max(0, prev - 1));
    }
  }, []);

  const goToCard = useCallback((index: number) => {
    setActiveCard(index);
  }, []);

  return (
    <div className="pb-4">
      {/* Header - matching original: icons left, text right */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <button className="relative p-2.5 rounded-full bg-white shadow-sm active:scale-95 transition-transform">
            <Bell className="w-5 h-5 text-[#E60000]" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E60000] rounded-full border-2 border-white" />
          </button>
          <button className="p-2.5 rounded-full bg-white shadow-sm active:scale-95 transition-transform">
            <Headphones className="w-5 h-5 text-[#E60000]" />
          </button>
        </div>
        <div className="text-right">
          <p className="text-[13px] text-gray-500">مساء الخير،</p>
          <p className="text-base font-bold text-gray-900">محمود</p>
        </div>
      </div>

      {/* Balance Card Carousel - matching original with side peek */}
      <div className="px-4 py-2">
        <div className="relative overflow-visible" style={{ height: '195px' }}>
          {/* Previous card peek (shows on the LEFT in RTL) */}
          {activeCard > 0 && (
            <motion.div
              className="absolute top-2 rounded-2xl pointer-events-none"
              style={{
                width: '85%',
                height: '92%',
                right: '-12%',
                backgroundColor: balanceCards[activeCard - 1].darkBg,
                zIndex: 0,
              }}
              initial={{ x: 0, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <CardDotPattern />
            </motion.div>
          )}

          {/* Next card peek (shows on the RIGHT in RTL) */}
          {activeCard < balanceCards.length - 1 && (
            <motion.div
              className="absolute top-2 rounded-2xl pointer-events-none"
              style={{
                width: '85%',
                height: '92%',
                left: '-12%',
                backgroundColor: balanceCards[activeCard + 1].darkBg,
                zIndex: 0,
              }}
              initial={{ x: 0, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <CardDotPattern />
            </motion.div>
          )}

          {/* Active card - with 3D epic animation */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeCard}
              className="absolute inset-0 rounded-2xl shadow-xl cursor-grab active:cursor-grabbing z-10"
              style={{ margin: '0 4px' }}
              initial={{
                x: 280,
                opacity: 0,
                scale: 0.5,
                rotateY: -50,
                rotateZ: -6,
                filter: 'blur(10px) brightness(0.4)',
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
                x: -280,
                opacity: 0,
                scale: 0.5,
                rotateY: 50,
                rotateZ: 6,
                filter: 'blur(10px) brightness(0.4)',
              }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 22,
                mass: 0.9,
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              whileDrag={{
                scale: 0.96,
                boxShadow: '0 30px 60px rgba(0,0,0,0.35)',
              }}
            >
              <BalanceCard
                card={balanceCards[activeCard]}
                balanceVisible={balanceVisible}
                onToggleBalance={() => setBalanceVisible(!balanceVisible)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {balanceCards.map((card, i) => (
            <motion.button
              key={i}
              onClick={() => goToCard(i)}
              className="relative"
              whileTap={{ scale: 0.8 }}
            >
              <motion.div
                className="rounded-full"
                animate={{
                  width: i === activeCard ? 24 : 8,
                  height: 8,
                  backgroundColor: i === activeCard ? card.bgColor : '#ccc',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Service Grid - matching original 3x3 layout */}
      <div className="px-4 py-3">
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
              <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center`}>
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
      <div className="px-4 py-2">
        <motion.div
          className="relative bg-gradient-to-l from-[#6C63FF] to-[#4834d4] rounded-2xl p-4 overflow-hidden"
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-sm mb-0.5">اشتركوا في بطولات</h3>
              <p className="text-white/70 text-[11px]">استمتعوا بمكافآت حصرية</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white/60" />
              </div>
              <button className="bg-white/20 p-1.5 rounded-full active:scale-90 transition-transform">
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transactions Section */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">العمليات</h2>
          <button className="text-[#E60000] text-xs font-medium">عرض الكل</button>
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
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    tx.amount > 0 ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {tx.amount > 0 ? (
                    <ArrowDownRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-[#E60000]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-semibold text-gray-900">{tx.title}</h4>
                  <p className="text-[11px] text-gray-500 truncate">{tx.subtitle}</p>
                </div>
                <div className="text-left">
                  <p
                    className={`text-[13px] font-bold ${
                      tx.amount > 0 ? 'text-green-500' : 'text-[#E60000]'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : ''}
                    {tx.amount.toLocaleString('ar-SA')}
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-[9px]">{txCurrency?.flagEmoji}</span>
                    <p className="text-[9px] text-gray-400">{txCurrency?.currencyAr}</p>
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
