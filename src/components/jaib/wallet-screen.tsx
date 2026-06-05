'use client';

import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Wallet,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
} from 'lucide-react';

const balanceCards = [
  {
    id: 0,
    currency: 'YER',
    currencyAr: 'ر.ي',
    currencyName: 'الريال اليمني',
    balance: 0,
    income: 4300,
    expense: 1130,
    gradient: 'from-[#E63946] via-[#D62839] to-[#B91C2B]',
    flagEmoji: '🇾🇪',
  },
  {
    id: 1,
    currency: 'SAR',
    currencyAr: 'ر.س',
    currencyName: 'الريال السعودي',
    balance: 0,
    income: 2000,
    expense: 500,
    gradient: 'from-[#1B5E20] via-[#2E7D32] to-[#388E3C]',
    flagEmoji: '🇸🇦',
  },
  {
    id: 2,
    currency: 'USD',
    currencyAr: '$',
    currencyName: 'الدولار الأمريكي',
    balance: 0,
    income: 1000,
    expense: 350,
    gradient: 'from-[#1565C0] via-[#1976D2] to-[#1E88E5]',
    flagEmoji: '🇺🇸',
  },
];

const walletTransactions = [
  { id: 1, title: 'تحويل إلى أحمد', subtitle: 'تحويل أموال', amount: -500, currency: 'SAR', date: 'اليوم ١١:٤٥', type: 'transfer' },
  { id: 2, title: 'إيداع رصيد', subtitle: 'عبر نقطة البيع', amount: 2000, currency: 'YER', date: 'اليوم ٠٩:٣٠', type: 'deposit' },
  { id: 3, title: 'شراء من المتجر', subtitle: 'متجر إلكتروني', amount: -350, currency: 'USD', date: 'أمس ١٥:٢٠', type: 'purchase' },
  { id: 4, title: 'تحويل وارد', subtitle: 'من محمد', amount: 800, currency: 'SAR', date: 'أمس ١٢:٠٠', type: 'incoming' },
  { id: 5, title: 'دفع فاتورة كهرباء', subtitle: 'شركة الكهرباء', amount: -180, currency: 'YER', date: '٠٤/٠٦', type: 'bill' },
  { id: 6, title: 'شحن رصيد', subtitle: 'خط 773649653', amount: -25, currency: 'YER', date: '٠٣/٠٦', type: 'recharge' },
  { id: 7, title: 'تحويل وارد', subtitle: 'من ليلى', amount: 1500, currency: 'USD', date: '٠٢/٠٦', type: 'incoming' },
  { id: 8, title: 'شراء بطاقة لعبة', subtitle: 'ببجي موبايل', amount: -75, currency: 'SAR', date: '٠١/٠٦', type: 'purchase' },
];

const filterTabs = ['الكل', 'وارد', 'صادر'];

export default function WalletScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeFilter, setActiveFilter] = useState('الكل');
  const [activeCard, setActiveCard] = useState(0);
  const [dragDirection, setDragDirection] = useState(0);

  const currentBalance = balanceCards[activeCard];

  const filteredTransactions = walletTransactions.filter((tx) => {
    if (activeFilter === 'الكل') return true;
    if (activeFilter === 'وارد') return tx.amount > 0;
    return tx.amount < 0;
  });

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      setActiveCard((prev) => Math.max(0, prev - 1));
    } else if (info.offset.x < -threshold) {
      setActiveCard((prev) => Math.min(balanceCards.length - 1, prev + 1));
    }
  };

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-gray-900">المحفظة</h1>
      </div>

      {/* Balance Card Carousel */}
      <div className="px-4 py-3">
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard}
              className="rounded-2xl p-5 overflow-hidden relative cursor-grab active:cursor-grabbing"
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
              {/* Dynamic gradient */}
              <div className={`absolute inset-0 bg-gradient-to-bl ${currentBalance.gradient}`}></div>
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-white/80" />
                    <span className="text-white/80 text-sm">رصيد المحفظة</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{currentBalance.flagEmoji}</span>
                    <span className="text-white/60 text-xs">{currentBalance.currency}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-white text-3xl font-bold">
                    {balanceVisible ? currentBalance.balance.toLocaleString('ar-SA') : '••••'}
                  </span>
                  <span className="text-white/60 text-sm">{currentBalance.currencyAr}</span>
                </div>

                <div className="flex gap-3 mb-4">
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 flex-1">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px]">وارد</p>
                      <p className="text-white text-sm font-bold">
                        {balanceVisible ? currentBalance.income.toLocaleString('ar-SA') : '••••'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 flex-1">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px]">صادر</p>
                      <p className="text-white text-sm font-bold">
                        {balanceVisible ? currentBalance.expense.toLocaleString('ar-SA') : '••••'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* All 3 balances mini display */}
                <div className="flex gap-2 mb-3">
                  {balanceCards.map((card, i) => (
                    <button
                      key={card.id}
                      onClick={() => {
                        setDragDirection(i > activeCard ? -1 : 1);
                        setActiveCard(i);
                      }}
                      className={`flex-1 rounded-xl px-2 py-2 transition-all duration-300 ${
                        i === activeCard
                          ? 'bg-white/20 backdrop-blur-sm'
                          : 'bg-white/[0.06] hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
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
                    className="p-1.5 rounded-full bg-white/15 active:scale-90 transition-transform"
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

      {/* Search Bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 shadow-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث في العمليات..."
            className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
          />
          <button className="p-1.5 rounded-lg bg-gray-100 active:scale-90 transition-transform">
            <Filter className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 pb-3">
        <div className="flex gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeFilter === tab
                  ? 'bg-[#E63946] text-white shadow-sm'
                  : 'bg-white text-gray-600 shadow-sm'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">آخر العمليات</h2>
          <button className="text-[#E63946] text-sm font-medium active:opacity-70">عرض الكل</button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTransactions.map((tx, index) => {
            const txCurrency = balanceCards.find(c => c.currency === tx.currency);
            return (
              <motion.div
                key={tx.id}
                className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
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
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{tx.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{tx.subtitle}</p>
                </div>
                <div className="text-left shrink-0">
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
