'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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

const walletTransactions = [
  { id: 1, title: 'تحويل إلى أحمد', subtitle: 'تحويل أموال', amount: -500, date: 'اليوم ١١:٤٥', type: 'transfer' },
  { id: 2, title: 'إيداع رصيد', subtitle: 'عبر نقطة البيع', amount: 2000, date: 'اليوم ٠٩:٣٠', type: 'deposit' },
  { id: 3, title: 'شراء من المتجر', subtitle: 'متجر إلكتروني', amount: -350, date: 'أمس ١٥:٢٠', type: 'purchase' },
  { id: 4, title: 'تحويل وارد', subtitle: 'من محمد', amount: 800, date: 'أمس ١٢:٠٠', type: 'incoming' },
  { id: 5, title: 'دفع فاتورة كهرباء', subtitle: 'شركة الكهرباء', amount: -180, date: '٠٤/٠٦', type: 'bill' },
  { id: 6, title: 'شحن رصيد', subtitle: 'خط 773649653', amount: -25, date: '٠٣/٠٦', type: 'recharge' },
  { id: 7, title: 'تحويل وارد', subtitle: 'من ليلى', amount: 1500, date: '٠٢/٠٦', type: 'incoming' },
  { id: 8, title: 'شراء بطاقة لعبة', subtitle: 'ببجي موبايل', amount: -75, date: '٠١/٠٦', type: 'purchase' },
];

const filterTabs = ['الكل', 'وارد', 'صادر'];

export default function WalletScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeFilter, setActiveFilter] = useState('الكل');

  const filteredTransactions = walletTransactions.filter((tx) => {
    if (activeFilter === 'الكل') return true;
    if (activeFilter === 'وارد') return tx.amount > 0;
    return tx.amount < 0;
  });

  const totalBalance = 0;
  const totalIncome = walletTransactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = walletTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-gray-900">المحفظة</h1>
      </div>

      {/* Balance Card */}
      <div className="px-4 py-3">
        <motion.div
          className="bg-gradient-to-bl from-[#E63946] to-[#C1121F] rounded-2xl p-5 overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-white/80" />
                <span className="text-white/80 text-sm">رصيد المحفظة</span>
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
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-white text-3xl font-bold">
                {balanceVisible ? totalBalance.toLocaleString('ar-SA') : '••••'}
              </span>
              <span className="text-white/60 text-sm">ر.س</span>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 flex-1">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-white/60 text-[10px]">وارد</p>
                  <p className="text-white text-sm font-bold">
                    {balanceVisible ? totalIncome.toLocaleString('ar-SA') : '••••'}
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
                    {balanceVisible ? totalExpense.toLocaleString('ar-SA') : '••••'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
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
          {filteredTransactions.map((tx, index) => (
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
                  {tx.amount}
                </p>
                <p className="text-[10px] text-gray-400">{tx.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
