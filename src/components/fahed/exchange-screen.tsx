'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRightLeft, RefreshCw, TrendingUp, TrendingDown,
  Globe, Calculator, History, X, CheckCircle2, Copy
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { currencySymbols, currencyNames, currencyBadgeColors, formatNumber, formatBalance, timeAgo, defaultExchangeRates } from '@/lib/utils';
import { LOGO_BASE64 } from '@/lib/logo';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase';

interface ConversionRecord {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rate: number;
  commission: number;
  date: string;
  referenceNumber?: string;
}

interface VoucherData {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rate: number;
  commission: number;
  commissionAmount: number;
  rawResult: number;
  referenceNumber: string;
  date: string;
  userName: string;
  userId: string;
}

function generateReferenceNumber(): string {
  const prefix = 'EX';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

function formatVoucherDate(isoString: string): string {
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

export default function ExchangeScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user, setActiveScreen, exchangeRates, setExchangeRates } = useAppStore();

  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toISOString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [commission, setCommission] = useState<number>(0);

  // Converter state
  const [fromAmount, setFromAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState<'YER' | 'SAR' | 'USD'>('YER');
  const [toCurrency, setToCurrency] = useState<'YER' | 'SAR' | 'USD'>('SAR');
  const [conversionHistory, setConversionHistory] = useState<ConversionRecord[]>([]);

  // Voucher state
  const [showVoucher, setShowVoucher] = useState(false);
  const [voucherData, setVoucherData] = useState<VoucherData | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Rate pairs with trend
  const [trends, setTrends] = useState<Record<string, 'up' | 'down' | 'stable'>>({
    'YER-SAR': 'stable', 'YER-USD': 'stable', 'SAR-USD': 'stable'
  });

  // Fetch exchange rates from Firebase on mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const snapshot = await get(ref(database, 'adminSettings/exchangeRates'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const rates = {
            YER: 1,
            SAR: data.YER_SAR ?? defaultExchangeRates.SAR,
            USD: data.YER_USD ?? defaultExchangeRates.USD,
          };
          setExchangeRates(rates);
          if (typeof data.commission === 'number') {
            setCommission(data.commission);
          }
        }
      } catch {
        // Fall back to default rates from store (already initialized)
      }
    };
    fetchRates();
  }, [setExchangeRates]);

  // Calculate conversion result inline
  const getRate = (from: string, to: string): number => {
    if (from === to) return 1;
    if (from === 'YER' && to === 'SAR') return exchangeRates.SAR;
    if (from === 'YER' && to === 'USD') return exchangeRates.USD;
    if (from === 'SAR' && to === 'YER') return 1 / exchangeRates.SAR;
    if (from === 'SAR' && to === 'USD') return exchangeRates.USD / exchangeRates.SAR;
    if (from === 'USD' && to === 'YER') return 1 / exchangeRates.USD;
    if (from === 'USD' && to === 'SAR') return exchangeRates.SAR / exchangeRates.USD;
    return 1;
  };

  const currentRate = getRate(fromCurrency, toCurrency);
  const rawResult = (parseFloat(fromAmount) || 0) * currentRate;
  const commissionAmount = rawResult * (commission / 100);
  const result = rawResult - commissionAmount;

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const snapshot = await get(ref(database, 'adminSettings/exchangeRates'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const newRates = {
          YER: 1,
          SAR: data.YER_SAR ?? exchangeRates.SAR,
          USD: data.YER_USD ?? exchangeRates.USD,
        };
        // Update trends
        setTrends({
          'YER-SAR': newRates.SAR > exchangeRates.SAR ? 'up' : newRates.SAR < exchangeRates.SAR ? 'down' : 'stable',
          'YER-USD': newRates.USD > exchangeRates.USD ? 'up' : newRates.USD < exchangeRates.USD ? 'down' : 'stable',
          'SAR-USD': (newRates.USD / newRates.SAR) > (exchangeRates.USD / exchangeRates.SAR) ? 'up' : 'down',
        });
        setExchangeRates(newRates);
        if (typeof data.commission === 'number') {
          setCommission(data.commission);
        }
      }
    } catch {
      // Keep existing rates on error
    }
    setLastUpdate(new Date().toISOString());
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleSaveConversion = () => {
    if (!fromAmount || result === 0) return;

    const refNum = generateReferenceNumber();
    const now = new Date().toISOString();

    const record: ConversionRecord = {
      fromAmount: parseFloat(fromAmount) || 0,
      fromCurrency,
      toAmount: result,
      toCurrency,
      rate: currentRate,
      commission,
      date: now,
      referenceNumber: refNum,
    };
    setConversionHistory(prev => [record, ...prev].slice(0, 10));

    // Show voucher
    setVoucherData({
      fromAmount: parseFloat(fromAmount) || 0,
      fromCurrency,
      toAmount: result,
      toCurrency,
      rate: currentRate,
      commission,
      commissionAmount,
      rawResult,
      referenceNumber: refNum,
      date: now,
      userName: user?.name || 'مستخدم',
      userId: user?.userId || '------',
    });
    setShowVoucher(true);
  };

  const handleCopyRef = () => {
    if (voucherData) {
      navigator.clipboard.writeText(voucherData.referenceNumber).catch(() => {});
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const ratePairs = [
    { from: 'YER', to: 'SAR', key: 'YER-SAR' },
    { from: 'YER', to: 'USD', key: 'YER-USD' },
    { from: 'SAR', to: 'USD', key: 'SAR-USD' },
  ];

  const voucherBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const voucherBorderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  const voucherDividerColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <div className="min-h-screen" style={{ background: isDark ? '#0F0F0F' : '#F5F5F5' }}>
      {/* Header */}
      <div className="animated-gradient relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1A1A1A 0%, #2A0A0A 50%, #0F0F0F 100%)' }}>
        <div className="absolute inset-0 glass-dark opacity-30" />
        <div className="relative px-5 pt-4 pb-5">
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveScreen('main')} className="w-10 h-10 rounded-xl glass flex items-center justify-center">
              <ArrowLeft size={18} strokeWidth={1.5} color="#FFF" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-white text-xl font-bold">اسعار الصرف</h1>
              <p className="text-white/40 text-xs">تحديث مباشر للعملات</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.2)' }}>
              <Globe size={20} strokeWidth={1.5} color="#10B981" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 pb-8 space-y-4">
        {/* Live Rates Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="pulse-dot w-2 h-2 rounded-full" style={{ background: '#10B981' }} />
              <span className="text-xs font-medium" style={{ color: '#10B981' }}>اسعار مباشرة</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color: isDark ? '#666' : '#AAA' }}>اخر تحديث: {timeAgo(lastUpdate)}</span>
              <motion.button whileTap={{ scale: 0.85 }} onClick={handleRefresh} animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 0.8 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }}>
                <RefreshCw size={14} color={isDark ? '#AAA' : '#888'} />
              </motion.button>
            </div>
          </div>

          <div className="space-y-3">
            {ratePairs.map((pair) => {
              const rate = getRate(pair.from, pair.to);
              const trend = trends[pair.key];
              return (
                <div key={pair.key} className="flex items-center justify-between p-3 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ background: `${currencyBadgeColors[pair.from]}15`, color: currencyBadgeColors[pair.from] }}>
                      {currencySymbols[pair.from]}
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                        {currencyNames[pair.from]}
                      </p>
                      <p className="text-[10px]" style={{ color: isDark ? '#666' : '#AAA' }}>
                        {pair.from} {'->'} {pair.to}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" dir="ltr" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                      {rate < 1 ? rate.toFixed(4) : rate.toFixed(2)}
                    </span>
                    {trend === 'up' && <TrendingUp size={12} color="#10B981" />}
                    {trend === 'down' && <TrendingDown size={12} color="#E60000" />}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Currency Converter */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-4" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Calculator size={16} color="#E60000" />
            <h3 className="text-sm font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>محول العملات</h3>
          </div>

          {/* From */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
              <input type="number" value={fromAmount} onChange={e => setFromAmount(e.target.value)} placeholder="0" dir="ltr"
                className="flex-1 bg-transparent outline-none text-2xl font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }} />
              <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value as 'YER' | 'SAR' | 'USD')}
                className="px-3 py-2 rounded-lg text-sm font-bold outline-none" style={{ background: `${currencyBadgeColors[fromCurrency]}15`, color: currencyBadgeColors[fromCurrency] }}>
                <option value="YER">ر.ي</option><option value="SAR">ر.س</option><option value="USD">$</option>
              </select>
            </div>

            {/* Swap button */}
            <div className="flex justify-center">
              <motion.button whileTap={{ scale: 0.85, rotate: 180 }} onClick={handleSwap}
                className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(230,0,0,0.15)' }}>
                <ArrowRightLeft size={18} color="#E60000" />
              </motion.button>
            </div>

            {/* To */}
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
              <motion.p key={result} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex-1 text-2xl font-bold" dir="ltr" style={{ color: '#E60000' }}>
                {result < 0.01 && result > 0 ? result.toFixed(6) : result < 1 ? result.toFixed(4) : formatNumber(parseFloat(result.toFixed(2)))}
              </motion.p>
              <select value={toCurrency} onChange={e => setToCurrency(e.target.value as 'YER' | 'SAR' | 'USD')}
                className="px-3 py-2 rounded-lg text-sm font-bold outline-none" style={{ background: `${currencyBadgeColors[toCurrency]}15`, color: currencyBadgeColors[toCurrency] }}>
                <option value="YER">ر.ي</option><option value="SAR">ر.س</option><option value="USD">$</option>
              </select>
            </div>

            {/* Rate info */}
            <div className="flex items-center justify-center gap-3 p-2 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
              <p className="text-[10px]" style={{ color: isDark ? '#888' : '#AAA' }}>
                1 {currencySymbols[fromCurrency]} = {getRate(fromCurrency, toCurrency) < 1 ? getRate(fromCurrency, toCurrency).toFixed(4) : getRate(fromCurrency, toCurrency).toFixed(2)} {currencySymbols[toCurrency]}
              </p>
              {commission > 0 && (
                <span className="text-[10px]" style={{ color: '#E60000' }}>
                  عمولة {commission}%
                </span>
              )}
            </div>

            <motion.button whileTap={{ scale: 0.95 }} onClick={handleSaveConversion}
              className="w-full py-3 rounded-xl text-xs font-bold text-white" style={{ background: '#E60000' }}>
              تاكيد التحويل
            </motion.button>
          </div>
        </motion.div>

        {/* Conversion History */}
        {conversionHistory.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl p-4" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <History size={16} color="#E60000" />
              <h3 className="text-sm font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>سجل التحويلات</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
              {conversionHistory.map((rec, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: currencyBadgeColors[rec.fromCurrency] }}>
                      {rec.fromAmount.toLocaleString()} {currencySymbols[rec.fromCurrency]}
                    </span>
                    <ArrowRightLeft size={10} color={isDark ? '#555' : '#AAA'} />
                    <span className="text-xs font-bold" style={{ color: currencyBadgeColors[rec.toCurrency] }}>
                      {rec.toAmount < 1 ? rec.toAmount.toFixed(4) : rec.toAmount.toLocaleString()} {currencySymbols[rec.toCurrency]}
                    </span>
                  </div>
                  <span className="text-[9px]" style={{ color: isDark ? '#555' : '#BBB' }}>{timeAgo(rec.date)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TRANSFER VOUCHER MODAL
          ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showVoucher && voucherData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowVoucher(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-w-lg rounded-t-3xl overflow-hidden"
              style={{ background: isDark ? '#0F0F0F' : '#F5F5F5', maxHeight: '90vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Voucher Header */}
              <div className="relative px-5 pt-5 pb-4" style={{ background: 'linear-gradient(145deg, #1A1A1A 0%, #2A0A0A 50%, #0F0F0F 100%)' }}>
                <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(230,0,0,0.15), transparent 50%)' }} />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.2)' }}>
                      <CheckCircle2 size={20} strokeWidth={1.5} color="#10B981" />
                    </div>
                    <div>
                      <h2 className="text-white text-base font-bold">تم التحويل بنجاح</h2>
                      <p className="text-white/40 text-[11px]">ايصال تحويل عملات</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowVoucher(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    <X size={16} color="#FFF" />
                  </button>
                </div>
              </div>

              {/* Voucher Body */}
              <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: voucherBg,
                    border: `1px solid ${voucherBorderColor}`,
                    boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                >
                  {/* Logo + Brand Row */}
                  <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px dashed ${voucherDividerColor}` }}>
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: 'rgba(230,0,0,0.1)' }}>
                      <img src={LOGO_BASE64} alt="الجنوب" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>محفظة الجنوب</p>
                      <p className="text-[10px]" style={{ color: isDark ? '#666' : '#AAA' }}>ايصال تبديل عملات</p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: 'rgba(16,185,129,0.1)' }}>
                      <CheckCircle2 size={10} color="#10B981" />
                      <span className="text-[9px] font-bold" style={{ color: '#10B981' }}>مكتمل</span>
                    </div>
                  </div>

                  {/* From -> To Section */}
                  <div className="p-4" style={{ borderBottom: `1px dashed ${voucherDividerColor}` }}>
                    <div className="flex items-center gap-3">
                      {/* From */}
                      <div className="flex-1 text-center">
                        <p className="text-[10px] mb-1" style={{ color: isDark ? '#666' : '#999' }}>من</p>
                        <div className="py-2 px-3 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
                          <p className="text-lg font-bold" dir="ltr" style={{ color: currencyBadgeColors[voucherData.fromCurrency] }}>
                            {formatBalance(voucherData.fromAmount, voucherData.fromCurrency)}
                          </p>
                          <p className="text-[10px] font-medium mt-0.5" style={{ color: isDark ? '#888' : '#AAA' }}>
                            {currencyNames[voucherData.fromCurrency]} ({voucherData.fromCurrency})
                          </p>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(230,0,0,0.1)' }}>
                        <ArrowRightLeft size={14} color="#E60000" />
                      </div>

                      {/* To */}
                      <div className="flex-1 text-center">
                        <p className="text-[10px] mb-1" style={{ color: isDark ? '#666' : '#999' }}>الى</p>
                        <div className="py-2 px-3 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
                          <p className="text-lg font-bold" dir="ltr" style={{ color: '#10B981' }}>
                            {voucherData.toAmount < 0.01 && voucherData.toAmount > 0 ? voucherData.toAmount.toFixed(6) : voucherData.toAmount < 1 ? voucherData.toAmount.toFixed(4) : formatBalance(voucherData.toAmount, voucherData.toCurrency)}
                          </p>
                          <p className="text-[10px] font-medium mt-0.5" style={{ color: isDark ? '#888' : '#AAA' }}>
                            {currencyNames[voucherData.toCurrency]} ({voucherData.toCurrency})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Rows */}
                  <div className="p-4 space-y-0">
                    {/* Exchange Rate */}
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${voucherDividerColor}` }}>
                      <span className="text-xs" style={{ color: isDark ? '#888' : '#888' }}>سعر الصرف</span>
                      <span className="text-xs font-bold" dir="ltr" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                        1 {currencySymbols[voucherData.fromCurrency]} = {voucherData.rate < 1 ? voucherData.rate.toFixed(4) : voucherData.rate.toFixed(2)} {currencySymbols[voucherData.toCurrency]}
                      </span>
                    </div>

                    {/* Commission */}
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${voucherDividerColor}` }}>
                      <span className="text-xs" style={{ color: isDark ? '#888' : '#888' }}>العمولة ({voucherData.commission}%)</span>
                      <span className="text-xs font-bold" dir="ltr" style={{ color: '#E60000' }}>
                        {voucherData.commissionAmount < 1 ? voucherData.commissionAmount.toFixed(4) : formatNumber(parseFloat(voucherData.commissionAmount.toFixed(2)))} {currencySymbols[voucherData.toCurrency]}
                      </span>
                    </div>

                    {/* Amount Before Commission */}
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${voucherDividerColor}` }}>
                      <span className="text-xs" style={{ color: isDark ? '#888' : '#888' }}>المبلغ قبل العمولة</span>
                      <span className="text-xs font-bold" dir="ltr" style={{ color: isDark ? '#CCC' : '#555' }}>
                        {voucherData.rawResult < 1 ? voucherData.rawResult.toFixed(4) : formatNumber(parseFloat(voucherData.rawResult.toFixed(2)))} {currencySymbols[voucherData.toCurrency]}
                      </span>
                    </div>

                    {/* Net Amount */}
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${voucherDividerColor}` }}>
                      <span className="text-xs" style={{ color: isDark ? '#888' : '#888' }}>صافي المبلغ المحول</span>
                      <span className="text-xs font-bold" dir="ltr" style={{ color: '#10B981' }}>
                        {voucherData.toAmount < 1 ? voucherData.toAmount.toFixed(4) : formatNumber(parseFloat(voucherData.toAmount.toFixed(2)))} {currencySymbols[voucherData.toCurrency]}
                      </span>
                    </div>

                    {/* Reference Number */}
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${voucherDividerColor}` }}>
                      <span className="text-xs" style={{ color: isDark ? '#888' : '#888' }}>رقم المرجع</span>
                      <button
                        onClick={handleCopyRef}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md active:scale-95 transition-transform"
                        style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                      >
                        <span className="text-[11px] font-mono font-bold" dir="ltr" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                          {voucherData.referenceNumber}
                        </span>
                        {copiedRef ? (
                          <CheckCircle2 size={12} color="#10B981" />
                        ) : (
                          <Copy size={12} color={isDark ? '#888' : '#AAA'} />
                        )}
                      </button>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${voucherDividerColor}` }}>
                      <span className="text-xs" style={{ color: isDark ? '#888' : '#888' }}>التاريخ والوقت</span>
                      <span className="text-xs font-medium" dir="ltr" style={{ color: isDark ? '#CCC' : '#555' }}>
                        {formatVoucherDate(voucherData.date)}
                      </span>
                    </div>

                    {/* User Name */}
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${voucherDividerColor}` }}>
                      <span className="text-xs" style={{ color: isDark ? '#888' : '#888' }}>اسم المستخدم</span>
                      <span className="text-xs font-medium" style={{ color: isDark ? '#CCC' : '#555' }}>
                        {voucherData.userName}
                      </span>
                    </div>

                    {/* Account Number */}
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-xs" style={{ color: isDark ? '#888' : '#888' }}>رقم الحساب</span>
                      <span className="text-xs font-mono font-medium" dir="ltr" style={{ color: isDark ? '#CCC' : '#555' }}>
                        {voucherData.userId}
                      </span>
                    </div>
                  </div>

                  {/* Dashed line with circles (receipt tear-off style) */}
                  <div className="relative h-6" style={{ borderTop: `2px dashed ${voucherDividerColor}` }}>
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full" style={{ background: isDark ? '#0F0F0F' : '#F5F5F5' }} />
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full" style={{ background: isDark ? '#0F0F0F' : '#F5F5F5' }} />
                  </div>

                  {/* Footer */}
                  <div className="px-4 pb-4 text-center">
                    <p className="text-[10px]" style={{ color: isDark ? '#555' : '#BBB' }}>
                      هذا الايصال صادر من محفظة الجنوب
                    </p>
                    <p className="text-[9px] mt-1" style={{ color: isDark ? '#444' : '#DDD' }}>
                      {voucherData.referenceNumber}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowVoucher(false)}
                  className="w-full mt-4 py-3.5 rounded-xl text-sm font-bold"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    color: isDark ? '#FFF' : '#1a1a1a',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  اغلاق
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
