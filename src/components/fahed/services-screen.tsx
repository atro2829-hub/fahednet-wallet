'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import {
  Receipt,
  CalendarClock,
  CreditCard,
  Building2,
  Clock,
  Landmark,
  Smartphone,
  Wifi,
  Tv,
  Gamepad2,
  Zap,
  Gift,
  Send,
  QrCode,
  Banknote,
} from 'lucide-react';

interface ServiceItem {
  id: string;
  label: string;
  icon: typeof Receipt;
  color: string;
  desc: string;
}

const mainServices: ServiceItem[] = [
  { id: 'bills', label: 'دفع الفواتير', icon: Receipt, color: '#E60000', desc: 'دفع جميع أنواع الفواتير' },
  { id: 'installments', label: 'الأقساط', icon: CalendarClock, color: '#10B981', desc: 'سداد الأقساط الشهرية' },
  { id: 'future', label: 'الفواتير المستقبلية', icon: CreditCard, color: '#3B82F6', desc: 'جدولة الدفعات القادمة' },
  { id: 'method', label: 'وسيلة الدفع', icon: Building2, color: '#F59E0B', desc: 'إدارة وسائل الدفع' },
  { id: 'bank', label: 'تحويل بنكي', icon: Landmark, color: '#8B5CF6', desc: 'تحويل إلى حساب بنكي' },
  { id: 'history', label: 'سجل المدفوعات', icon: Clock, color: '#EC4899', desc: 'عرض جميع المدفوعات' },
];

const quickAccess: ServiceItem[] = [
  { id: 'transfer', label: 'تحويل أموال', icon: Send, color: '#E60000', desc: '' },
  { id: 'recharge', label: 'شحن رصيد', icon: Smartphone, color: '#F59E0B', desc: '' },
  { id: 'internet', label: 'باقات إنترنت', icon: Wifi, color: '#3B82F6', desc: '' },
  { id: 'qr', label: 'مسح QR', icon: QrCode, color: '#6366F1', desc: '' },
];

const products: ServiceItem[] = [
  { id: 'p1', label: 'بطاقة PSN', icon: Gamepad2, color: '#6366F1', desc: '' },
  { id: 'p2', label: 'شحن MTN', icon: Smartphone, color: '#F59E0B', desc: '' },
  { id: 'p3', label: 'بطاقة Xbox', icon: Gift, color: '#10B981', desc: '' },
  { id: 'p4', label: 'باقة يمن موبايل', icon: Wifi, color: '#E60000', desc: '' },
  { id: 'p5', label: 'كهرباء عدن', icon: Zap, color: '#EC4899', desc: '' },
  { id: 'p6', label: 'شحن Y', icon: Smartphone, color: '#3B82F6', desc: '' },
];

export default function ServicesScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-5 pt-4 pb-6 rounded-b-3xl" style={{ background: 'linear-gradient(145deg, #E60000 0%, #8B0000 100%)' }}>
        <h1 className="text-white text-xl font-bold">خدمات الدفع</h1>
        <p className="text-white/50 text-sm mt-1">جميع خدمات الدفع والتحويل في مكان واحد</p>
      </div>

      {/* Quick Access */}
      <div className="px-5 -mt-4">
        <div className="grid grid-cols-4 gap-3">
          {quickAccess.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl active:scale-95 transition-transform"
                style={{
                  background: isDark ? '#1E1E1E' : '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${service.color}15` }}>
                  <Icon size={22} strokeWidth={1.5} color={service.color} />
                </div>
                <span className="text-[10px] font-medium text-center leading-tight" style={{ color: isDark ? '#CCC' : '#666' }}>
                  {service.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Services */}
      <div className="px-5 mt-5">
        <h3 className="text-sm font-bold mb-3" style={{ color: isDark ? '#FFFFFF' : '#1a1a1a' }}>الخدمات الرئيسية</h3>
        <div className="rounded-2xl overflow-hidden" style={{ background: isDark ? '#1E1E1E' : '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {mainServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className="w-full flex items-center gap-3 px-4 py-4 active:bg-[#E60000]/5 transition-colors"
                style={{ borderBottom: index < mainServices.length - 1 ? (isDark ? '1px solid #2A2A2A' : '1px solid #F0F0F0') : 'none' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${service.color}12` }}>
                  <Icon size={20} strokeWidth={1.5} color={service.color} />
                </div>
                <div className="flex-1 text-right">
                  <span className="text-sm font-medium block" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>{service.label}</span>
                  <span className="text-[10px] block mt-0.5" style={{ color: isDark ? '#666' : '#AAA' }}>{service.desc}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: service.color }} />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Products */}
      <div className="px-5 mt-5">
        <h3 className="text-sm font-bold mb-3" style={{ color: isDark ? '#FFFFFF' : '#1a1a1a' }}>المنتجات</h3>
        <div className="grid grid-cols-3 gap-3">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <motion.button
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl active:scale-95 transition-transform"
                style={{ background: isDark ? '#1E1E1E' : '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${product.color}12` }}>
                  <Icon size={20} strokeWidth={1.5} color={product.color} />
                </div>
                <span className="text-[10px] font-medium text-center leading-tight" style={{ color: isDark ? '#BBB' : '#666' }}>
                  {product.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
