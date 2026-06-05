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
  Sparkles,
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
    income: 2000,
    expense: 500,
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
    income: 1000,
    expense: 350,
    gradientFrom: '#1565C0',
    gradientVia: '#1976D2',
    gradientTo: '#1E88E5',
    flagEmoji: '🇺🇸',
    glowColor: 'rgba(21, 101, 192, 0.4)',
    sparkleColor: 'rgba(200, 220, 255, 0.8)',
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

// Floating sparkle
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
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {/* Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${card.gradientFrom}, ${card.gradientVia}, ${card.gradientTo})`,
        }}
      />

      {/* Animated mesh */}
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
            radial-gradient(circle at 80% 20%, white 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 80px 80px',
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Decorative circles */}
      <motion.div
        className="absolute -top-8 -left-8 w-36 h-36 rounded-full"
        style={{ background: 'rgba(255,255,255,0.06)' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full"
        style={{ background: 'rgba(255,255,255,0.05)' }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ boxShadow: `inset 0 0 25px ${card.glowColor}, 0 0 35px ${card.glowColor}` }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Sparkles */}
      <FloatingSparkle delay={0} x="20%" y="15%" color={card.sparkleColor} />
      <FloatingSparkle delay={1.8} x="80%" y="70%" color={card.sparkleColor} />
      <FloatingSparkle delay={3.2} x="60%" y="25%" color={card.sparkleColor} />

      {/* Content */}
      <div className="relative z-10 p-5 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-white/80" />
            <span className="text-white/80 text-sm">رصيد المحفظة</span>
          </div>
          <motion.div
            className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm">{card.flagEmoji}</span>
            <span className="text-white/70 text-xs font-medium">{card.currency}</span>
          </motion.div>
        </div>

        <motion.div
          className="flex items-baseline gap-2 mb-4"
          key={`wbal-${balanceVisible}-${card.currency}`}
          initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-white text-3xl font-bold">
            {balanceVisible ? card.balance.toLocaleString('ar-SA') : '••••'}
          </span>
          <span className="text-white/50 text-sm">{card.currencyAr}</span>
        </motion.div>

        <div className="flex gap-3 mb-4">
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 flex-1 backdrop-blur-sm">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-white/50 text-[10px]">وارد</p>
              <p className="text-white text-sm font-bold">
                {balanceVisible ? card.income.toLocaleString('ar-SA') : '••••'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 flex-1 backdrop-blur-sm">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-white/50 text-[10px]">صادر</p>
              <p className="text-white text-sm font-bold">
                {balanceVisible ? card.expense.toLocaleString('ar-SA') : '••••'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <motion.span
            className="text-white/40 text-xs"
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {card.currencyName}
          </motion.span>
          <motion.button
            onClick={onToggleBalance}
            className="p-1.5 rounded-full bg-white/15"
            whileTap={{ scale: 0.85, rotate: 15 }}
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
        <h1 className="text-xl font-bold text-gray-900">المحفظة</h1>
      </div>

      {/* Balance Card Carousel - EPIC */}
      <div className="px-4 py-3">
        <div
          className="relative"
          style={{ height: '260px', perspective: '1200px' }}
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
              whileDrag={{
                scale: 0.97,
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              }}
            >
              <WalletBalanceCard
                card={currentBalance}
                balanceVisible={balanceVisible}
                onToggleBalance={() => setBalanceVisible(!balanceVisible)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Ghost cards */}
          {activeCard > 0 && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
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
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ x: 100, scale: 0.85, opacity: 0 }}
              animate={{ x: 30, scale: 0.88, opacity: 0.15 }}
              style={{
                background: `linear-gradient(135deg, ${balanceCards[activeCard + 1].gradientFrom}, ${balanceCards[activeCard + 1].gradientTo})`,
                filter: 'blur(2px)',
              }}
            />
          )}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {balanceCards.map((card, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveCard(i)}
              whileTap={{ scale: 0.8 }}
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
            </motion.button>
          ))}
        </div>

        {/* Currency Switch */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {balanceCards.map((card, i) => (
            <motion.button
              key={card.id}
              onClick={() => setActiveCard(i)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
                i === activeCard ? 'bg-white shadow-md' : 'bg-white/60'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-sm">{card.flagEmoji}</span>
              <span className={`text-xs font-bold ${i === activeCard ? 'text-gray-800' : 'text-gray-500'}`}>
                {card.currency}
              </span>
            </motion.button>
          ))}
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
