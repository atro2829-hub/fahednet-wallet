'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, useMotionValue, animate } from 'framer-motion';
import {
  Search,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  TrendingDown,
  Receipt,
  Wifi as Contactless,
  Filter,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatBalance, currencySymbols, currencyNames, currencyBadgeColors } from '@/lib/utils';

type FilterTab = 'all' | 'incoming' | 'outgoing';

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

export default function WalletScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user, balanceVisible, toggleBalance, transactions } = useAppStore();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(375);
  const x = useMotionValue(0);

  const CARD_GAP = 14;

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) setCarouselWidth(carouselRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const getBalance = (currency: string): number => {
    if (!user) return 0;
    const field = `balance${currency}` as keyof typeof user;
    return (user[field] as number) || 0;
  };

  const getCardWidth = useCallback(() => carouselWidth * 0.78, [carouselWidth]);
  const getStepWidth = useCallback(() => getCardWidth() + CARD_GAP, [getCardWidth]);

  const income = transactions.filter(tx => tx.toUserId === user?.id).reduce((sum, tx) => sum + tx.amount, 0);
  const expense = transactions.filter(tx => tx.fromUserId === user?.id).reduce((sum, tx) => sum + tx.amount, 0);

  const filteredTransactions = transactions.filter((tx) => {
    const isIncoming = tx.toUserId === user?.id;
    if (activeFilter === 'incoming' && !isIncoming) return false;
    if (activeFilter === 'outgoing' && isIncoming) return false;
    if (searchQuery && !tx.description.includes(searchQuery)) return false;
    return true;
  });

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'الكل' },
    { id: 'incoming', label: 'وارد' },
    { id: 'outgoing', label: 'صادر' },
  ];

  const snapTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, balanceCards.length - 1));
    setActiveCardIndex(clamped);
    animate(x, -clamped * getStepWidth(), { type: 'spring', stiffness: 300, damping: 30 });
  }, [x, getStepWidth]);

  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    let newIndex = activeCardIndex;
    if (offset < -40 || velocity < -300) newIndex = Math.min(activeCardIndex + 1, balanceCards.length - 1);
    else if (offset > 40 || velocity > 300) newIndex = Math.max(activeCardIndex - 1, 0);
    snapTo(newIndex);
  }, [activeCardIndex, snapTo]);

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-xl font-bold" style={{ color: isDark ? '#FFFFFF' : '#1a1a1a' }}>المحفظة</h1>
      </div>

      {/* Balance Card Carousel */}
      <div className="px-5 mt-2">
        <div ref={carouselRef} className="relative overflow-hidden" style={{ touchAction: 'pan-y' }}>
          <motion.div
            className="flex cursor-grab active:cursor-grabbing"
            style={{ gap: CARD_GAP, x }}
            drag="x"
            dragConstraints={{ left: -(balanceCards.length - 1) * getStepWidth(), right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
          >
            {balanceCards.map((card, index) => (
              <motion.div
                key={card.currency}
                className="shrink-0 rounded-3xl relative overflow-hidden select-none"
                style={{
                  width: getCardWidth(),
                  height: 210,
                  background: `linear-gradient(145deg, ${card.gradient} 0%, ${card.gradientEnd} 100%)`,
                  boxShadow: index === activeCardIndex
                    ? `0 12px 32px ${card.accentColor}44, 0 4px 12px rgba(0,0,0,0.15)`
                    : '0 2px 8px rgba(0,0,0,0.08)',
                }}
                animate={{
                  scale: index === activeCardIndex ? 1 : 0.9,
                  opacity: index === activeCardIndex ? 1 : 0.5,
                  y: index === activeCardIndex ? 0 : 8,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={() => snapTo(index)}
              >
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id={`wallet-grid-${card.currency}`} width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="1" fill={card.patternColor} />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#wallet-grid-${card.currency})`} />
                </svg>
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />

                <div className="relative z-10 h-full flex flex-col justify-between p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                        <span className="text-white text-[8px] font-bold">FH</span>
                      </div>
                      <span className="text-white/70 text-xs font-bold">فهد نت</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Contactless size={16} strokeWidth={1.5} color="rgba(255,255,255,0.5)" />
                      <button onClick={(e) => { e.stopPropagation(); toggleBalance(); }}>
                        {balanceVisible ? <Eye size={16} strokeWidth={1.5} color="rgba(255,255,255,0.5)" /> : <EyeOff size={16} strokeWidth={1.5} color="rgba(255,255,255,0.5)" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 rounded-md" style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.5) 0%, rgba(255,215,0,0.3) 100%)', border: '1px solid rgba(255,215,0,0.3)' }} />
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold text-white" style={{ background: currencyBadgeColors[card.currency] }}>{card.currency}</span>
                    <span className="text-white/50 text-[10px]">{currencyNames[card.currency]}</span>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="text-white text-2xl font-bold">
                        {balanceVisible ? formatBalance(getBalance(card.currency), card.currency) : '****'}
                      </span>
                      <span className="text-white/50 text-xs">{currencySymbols[card.currency]}</span>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                          <TrendingUp size={11} strokeWidth={2} color="#FFF" />
                        </div>
                        <div>
                          <p className="text-white/40 text-[9px]">وارد</p>
                          <p className="text-white text-xs font-bold">{balanceVisible ? income.toLocaleString('ar-SA') : '****'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                          <TrendingDown size={11} strokeWidth={2} color="#FFF" />
                        </div>
                        <div>
                          <p className="text-white/40 text-[9px]">صادر</p>
                          <p className="text-white text-xs font-bold">{balanceVisible ? expense.toLocaleString('ar-SA') : '****'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex items-center justify-center gap-1.5 mt-4">
            {balanceCards.map((_, index) => (
              <button
                key={index}
                onClick={() => snapTo(index)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: activeCardIndex === index ? 24 : 8,
                  height: 8,
                  background: activeCardIndex === index ? balanceCards[activeCardIndex].accentColor : isDark ? '#333' : '#DDD',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-5 mt-4">
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-2xl"
          style={{ background: isDark ? '#1E1E1E' : '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <Search size={18} strokeWidth={1.5} color={isDark ? '#555' : '#AAA'} />
          <input
            type="text"
            placeholder="ابحث في المعاملات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: isDark ? '#FFF' : '#1a1a1a' }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 mt-3">
        <div className="flex gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className="px-4 py-2 rounded-full text-xs font-medium transition-all"
              style={{
                background: activeFilter === tab.id ? '#E60000' : isDark ? '#1E1E1E' : '#F5F5F5',
                color: activeFilter === tab.id ? '#FFF' : isDark ? '#BBB' : '#666',
                boxShadow: activeFilter === tab.id ? '0 2px 8px rgba(230,0,0,0.25)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-5 mt-4">
        {filteredTransactions.length === 0 ? (
          <div className="rounded-2xl p-8 flex flex-col items-center" style={{ background: isDark ? '#1E1E1E' : '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Receipt size={40} strokeWidth={1.5} color={isDark ? '#333' : '#DDD'} />
            <p className="text-sm mt-2" style={{ color: isDark ? '#666' : '#AAA' }}>لا توجد معاملات</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
            {filteredTransactions.map((tx) => {
              const isIncoming = tx.toUserId === user?.id;
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{ background: isDark ? '#1E1E1E' : '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: isIncoming ? 'rgba(16,185,129,0.1)' : 'rgba(230,0,0,0.1)' }}>
                    {isIncoming ? <ArrowDownLeft size={18} strokeWidth={1.5} color="#10B981" /> : <ArrowUpRight size={18} strokeWidth={1.5} color="#E60000" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>{tx.description}</p>
                    <p className="text-xs" style={{ color: isDark ? '#666' : '#AAA' }}>{new Date(tx.createdAt).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold" style={{ color: isIncoming ? '#10B981' : '#E60000' }}>
                      {isIncoming ? '+' : '-'}{tx.amount.toLocaleString()}
                    </p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold text-white" style={{ background: currencyBadgeColors[tx.currency] || '#666' }}>
                      {tx.currency}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
