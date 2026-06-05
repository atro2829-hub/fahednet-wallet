'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
  Gamepad,
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
  { id: 1, title: 'شراء', subtitle: 'متجر إلكتروني', amount: -150, date: 'اليوم ١٠:٣٠', type: 'purchase' },
  { id: 2, title: 'تحويل وارد', subtitle: 'من أحمد', amount: 500, date: 'أمس ٠٢:١٥', type: 'incoming' },
  { id: 3, title: 'دفع فاتورة', subtitle: 'فاتورة كهرباء', amount: -200, date: '٠٣/٠٦', type: 'bill' },
  { id: 4, title: 'شحن رصيد', subtitle: 'خط 773649653', amount: -50, date: '٠٢/٠٦', type: 'recharge' },
  { id: 5, title: 'تحويل وارد', subtitle: 'من سارة', amount: 1000, date: '٠١/٠٦', type: 'incoming' },
];

export default function HomeScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeCard, setActiveCard] = useState(0);

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

      {/* Balance Card */}
      <div className="px-4 py-3">
        <motion.div
          className="relative bg-gradient-to-bl from-[#E63946] via-[#D62839] to-[#B91C2B] rounded-2xl p-6 overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 font-bold text-lg">جيب</span>
              </div>
              <span className="text-white/50 text-xs font-medium">Jaib</span>
            </div>
            <p className="text-white/70 text-sm mb-2">رصيدك الحالي</p>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-white text-5xl font-bold tracking-tight">
                {balanceVisible ? '0' : '••••'}
              </span>
              <span className="text-white/50 text-sm mt-auto mb-2">ر.س</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCard(i)}
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
          {transactions.map((tx, index) => (
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
