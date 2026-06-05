'use client';

import { useState, useCallback } from 'react';
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
    bgColor: '#E60000',
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
    bgColor: '#1B7A2B',
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
    bgColor: '#1565C0',
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

function WalletBalanceCard({
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
      <CardDotPattern />
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/[0.06] rounded-full" />
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/[0.04] rounded-full" />

      <div className="relative z-10 p-5 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-white/80" />
            <span className="text-white/70 text-sm">رصيد المحفظة</span>
          </div>
          <div className="flex items-center gap-1 bg-white/15 rounded-full px-2.5 py-1">
            <span className="text-sm">{card.flagEmoji}</span>
            <span className="text-white/70 text-xs font-medium">{card.currency}</span>
          </div>
        </div>

        <motion.div
          className="flex items-baseline gap-2 mb-4"
          key={`wbal-${balanceVisible}-${card.currency}`}
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-white text-3xl font-bold">
            {balanceVisible ? card.balance.toLocaleString('ar-SA') : '••••'}
          </span>
          <span className="text-white/50 text-sm">{card.currencyAr}</span>
        </motion.div>

        <div className="flex gap-3 mb-4">
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 flex-1">
            <div className="w-7 h-7 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-green-400" />
            </div>
            <div>
              <p className="text-white/50 text-[9px]">وارد</p>
              <p className="text-white text-xs font-bold">
                {balanceVisible ? card.income.toLocaleString('ar-SA') : '••••'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 flex-1">
            <div className="w-7 h-7 bg-red-500/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div>
              <p className="text-white/50 text-[9px]">صادر</p>
              <p className="text-white text-xs font-bold">
                {balanceVisible ? card.expense.toLocaleString('ar-SA') : '••••'}
              </p>
            </div>
          </div>
        </div>

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

export default function WalletScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeFilter, setActiveFilter] = useState('الكل');
  const [activeCard, setActiveCard] = useState(0);

  const currentBalance = balanceCards[activeCard];

  const filteredTransactions = walletTransactions.filter((tx) => {
    if (activeFilter === 'الكل') return true;
    if (activeFilter === 'وارد') return tx.amount > 0;
    return tx.amount < 0;
  });

  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 40;
    if (info.offset.x < -threshold) {
      setActiveCard((prev) => Math.min(balanceCards.length - 1, prev + 1));
    } else if (info.offset.x > threshold) {
      setActiveCard((prev) => Math.max(0, prev - 1));
    }
  }, []);

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-lg font-bold text-gray-900">المحفظة</h1>
      </div>

      {/* Balance Card Carousel */}
      <div className="px-4 py-2">
        <div className="relative overflow-visible" style={{ height: '240px' }}>
          {/* Previous card peek */}
          {activeCard > 0 && (
            <motion.div
              className="absolute top-2 rounded-2xl pointer-events-none"
              style={{ width: '85%', height: '92%', right: '-12%', backgroundColor: '#1a1a1a', zIndex: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
            >
              <CardDotPattern />
            </motion.div>
          )}

          {/* Next card peek */}
          {activeCard < balanceCards.length - 1 && (
            <motion.div
              className="absolute top-2 rounded-2xl pointer-events-none"
              style={{ width: '85%', height: '92%', left: '-12%', backgroundColor: '#1a1a1a', zIndex: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
            >
              <CardDotPattern />
            </motion.div>
          )}

          {/* Active card */}
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
              whileDrag={{ scale: 0.96, boxShadow: '0 30px 60px rgba(0,0,0,0.35)' }}
            >
              <WalletBalanceCard
                card={currentBalance}
                balanceVisible={balanceVisible}
                onToggleBalance={() => setBalanceVisible(!balanceVisible)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {balanceCards.map((card, i) => (
            <motion.button key={i} onClick={() => setActiveCard(i)} whileTap={{ scale: 0.8 }}>
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

      {/* Search Bar */}
      <div className="px-4 pb-2">
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
      <div className="px-4 pb-2">
        <div className="flex gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeFilter === tab
                  ? 'bg-[#E60000] text-white shadow-sm'
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
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-900">آخر العمليات</h2>
          <button className="text-[#E60000] text-xs font-medium">عرض الكل</button>
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
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
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
                  <h4 className="text-[13px] font-semibold text-gray-900 truncate">{tx.title}</h4>
                  <p className="text-[11px] text-gray-500 truncate">{tx.subtitle}</p>
                </div>
                <div className="text-left shrink-0">
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
