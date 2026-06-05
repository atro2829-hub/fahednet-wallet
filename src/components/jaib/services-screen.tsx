'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  FileText,
  CreditCard,
  CalendarClock,
  Settings,
  ArrowLeftRight,
  Receipt,
  Wallet,
  HandCoins,
  Store,
} from 'lucide-react';

const mainServices = [
  { icon: FileText, label: 'دفع فواتيري الآن', desc: 'ادفع فواتيرك بسهولة وسرعة', color: 'bg-[#E63946]' },
  { icon: CreditCard, label: 'دفع فواتيري في أقساط', desc: 'ميزة الدفع بالتقسيط', color: 'bg-[#2EC4B6]', badge: 'ميزة' },
  { icon: CalendarClock, label: 'فواتيري المستقبلية', desc: 'إدارة الفواتير القادمة', color: 'bg-[#FF9F1C]' },
  { icon: Settings, label: 'طريقة دفع فاتورتي', desc: 'تخصيص طريقة الدفع', color: 'bg-[#6C63FF]' },
  { icon: ArrowLeftRight, label: 'تحويل وبنك', desc: 'التحويل البنكي السريع', color: 'bg-[#E63946]' },
  { icon: Receipt, label: 'المدفوعات التي تمت عبر جيب', desc: 'سجل المدفوعات', color: 'bg-[#2EC4B6]' },
];

const quickActions = [
  { icon: Wallet, label: 'المدفوعات', color: 'bg-[#E63946]' },
  { icon: FileText, label: 'فواتير قابلة', color: 'bg-[#6C63FF]' },
  { icon: Store, label: 'من صرافي', color: 'bg-[#FF9F1C]' },
  { icon: HandCoins, label: 'لدفع فواتيري', color: 'bg-[#2EC4B6]' },
];

export default function ServicesScreen() {
  return (
    <div className="pb-4">
      {/* Header */}
      <div className="relative px-4 pt-4 pb-6 bg-gradient-to-bl from-[#E63946] to-[#C1121F] rounded-b-3xl overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-4 left-8 w-3 h-3 bg-white/10 rounded-full"></div>
        <div className="absolute top-12 left-16 w-2 h-2 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-8 left-6 w-4 h-4 bg-white/5 rounded-full"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <button className="p-1.5 rounded-full bg-white/15 active:scale-90 transition-transform">
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">خدمات الدفع</h1>
          </div>
        </div>
      </div>

      {/* Main Services List */}
      <div className="px-4 -mt-4 space-y-3">
        {mainServices.map((service, index) => (
          <motion.button
            key={index}
            className="w-full flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm active:scale-[0.98] transition-transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
          >
            <div className={`w-11 h-11 ${service.color} rounded-xl flex items-center justify-center shrink-0`}>
              <service.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0 text-right">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">{service.label}</h3>
                {service.badge && (
                  <span className="text-[10px] bg-[#E63946] text-white px-1.5 py-0.5 rounded-full">
                    {service.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{service.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
          </motion.button>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 pt-5">
        <h2 className="text-base font-bold text-gray-900 mb-3">الوصول السريع</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm active:scale-95 transition-transform"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
            >
              <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center shrink-0`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
