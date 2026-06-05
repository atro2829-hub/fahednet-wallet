'use client';

import { useState, useRef } from 'react';
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
    gradient: 'from-[#E63946] via-[#D62839] to-[#B91C2B]',
    flagEmoji: '🇾🇪',
  },
  {
    id: 1,
    currency: 'SAR',
    currencyAr: 'ر.س',
    currencyName: 'الريال السعودي',
    balance: 0,
    gradient: 'from-[#1B5E20] via-[#2E7D32] to-[#388E3C]',
    flagEmoji: '🇸🇦',
  },
  {
    id: 2,
    currency: 'USD',
    currencyAr: '$',
    currencyName: 'الدولار الأمريكي',
    balance: 0,
    gradient: 'from-[#1565C0] via-[#1976D2] to-[#1E88E5]',
    flagEmoji: '🇺🇸',
  },
];

export default function HomeScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeCard, setActiveCard] = useState(0);
  const [dragDirection, setDragDirection] = useState(0);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      // Swiped right (in RTL means previous)
      setActiveCard((prev) => Math.max(0, prev - 1));
    } else if (info.offset.x < -threshold) {
      // Swiped left (in RTL means next)
      setActiveCard((prev) => Math.min(balanceCards.length - 1, prev + 1));
    }
  };

  const currentBalance = balanceCards[activeCard];

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

      {/* Balance Card Carousel */}
      <div className="px-4 py-3">
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard}
              className="relative rounded-2xl p-6 overflow-hidden shadow-lg cursor-grab active:cursor-grabbing"
              initial={{ opacity: 0, x: dragDirection >= 0 ? 80 : -80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: dragDirection >= 0 ? -80 : 80, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              onDragStart={(_, info) => {
                setDragDirection(info.offset.x > 0 ? 1 : -1);
              }}
            >
              {/* Dynamic gradient based on currency */}
              <div className={`absolute inset-0 bg-gradient-to-bl ${currentBalance.gradient}`}></div>

              {/* Decorative pattern */}
              <div className="absolute top-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute bottom-0 right-0 w-36 h-36 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4"></div>
              <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-white/[0.03] rounded-full"></div>
              <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-white/[0.04] rounded-full"></div>
              {/* Subtle diagonal lines pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 11px)',
              }}></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/90 font-bold text-lg">جيب</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">{currentBalance.flagEmoji}</span>
                    <span className="text-white/70 text-xs font-medium">{currentBalance.currencyName}</span>
                  </div>
                </div>
                <p className="text-white/70 text-sm mb-2">رصيدك الحالي</p>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-white text-5xl font-bold tracking-tight">
                    {balanceVisible ? currentBalance.balance.toLocaleString('ar-SA') : '••••'}
                  </span>
                  <span className="text-white/50 text-lg mt-auto mb-2 font-semibold">{currentBalance.currencyAr}</span>
                </div>

                {/* All 3 balances mini display */}
                <div className="flex gap-2 mb-4">
                  {balanceCards.map((card, i) => (
                    <button
                      key={card.id}
                      onClick={() => {
                        setDragDirection(i > activeCard ? -1 : 1);
                        setActiveCard(i);
                      }}
                      className={`flex-1 rounded-xl px-2.5 py-2 transition-all duration-300 ${
                        i === activeCard
                          ? 'bg-white/20 backdrop-blur-sm'
                          : 'bg-white/[0.06] hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-sm">{card.flagEmoji}</span>
                        <span className="text-white/60 text-[10px] font-medium">{card.currency}</span>
                      </div>
                      <p className="text-white text-xs font-bold text-center mt-0.5">
                        {balanceVisible ? card.balance.toLocaleString('ar-SA') : '••••'}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {balanceCards.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setDragDirection(i > activeCard ? -1 : 1);
                          setActiveCard(i);
                        }}
                        className={`rounded-full transition-all duration-300 ${
                          i === activeCard ? 'bg-white w-6 h-2' : 'bg-white/30 w-2 h-2'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="p-2 rounded-full bg-white/15 backdrop-blur-sm active:scale-90 transition-transform"
                  >
                    {balanceVisible ? (
                      <Eye className="w-4 h-4 text-white/80" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-white/80" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
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
          <div className="absolute top-3 left-1/3 w-2 h-2 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-4 left-1/4 w-3 h-3 bg-white/5 rounded-full"></div>
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
