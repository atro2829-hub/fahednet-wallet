'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import {
  Receipt,
  ArrowRightLeft,
  Globe,
  Printer,
  Building2,
  Wallet,
  ChevronRight,
  Phone,
  Gamepad2,
  ShoppingBag,
  Shield,
  Zap,
  CreditCard,
  Smartphone,
  ArrowLeft,
  Heart,
  Search,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

// Jaib-style menu items - exact matching
const menuSections = [
  {
    title: 'إجراءات الدفع',
    items: [
      { id: 'pay-bill', label: 'دفع فاتورة', icon: Receipt, color: '#E60000' },
      { id: 'transfer-local', label: 'تحويل الأموال (داخل اليمن)', icon: ArrowRightLeft, color: '#E60000' },
      { id: 'transfer-intl', label: 'تحويل الأموال خارج اليمن', icon: Globe, color: '#2563EB' },
      { id: 'print-receipt', label: 'طباعة إيصال دفع', icon: Printer, color: '#666' },
      { id: 'pay-bills', label: 'دفع فواتير', icon: Building2, color: '#2563EB' },
      { id: 'transfer-account', label: 'التحويل إلى الحساب', icon: Wallet, color: '#E60000' },
    ],
  },
  {
    title: 'شركات الشحن',
    items: [
      { id: 'yemen-mobile', label: 'يمن موبايل', icon: Phone, color: '#E60000' },
      { id: 'yo', label: 'يو', icon: Phone, color: '#FF6B00' },
      { id: 'sabafon', label: 'سبأفون', icon: Phone, color: '#2563EB' },
      { id: 'y', label: 'واي', icon: Phone, color: '#059669' },
    ],
  },
  {
    title: 'الألعاب والترفيه',
    items: [
      { id: 'pubg', label: 'ببجي موبايل', icon: Gamepad2, color: '#F59E0B' },
      { id: 'freefire', label: 'فري فاير', icon: Gamepad2, color: '#EC4899' },
      { id: 'gift-cards', label: 'بطاقات هدايا', icon: ShoppingBag, color: '#14B8A6' },
    ],
  },
  {
    title: 'خدمات أخرى',
    items: [
      { id: 'recharge', label: 'شحن رصيد', icon: Smartphone, color: '#8B5CF6' },
      { id: 'instant-pay', label: 'مدفوعات فورية', icon: Zap, color: '#E60000' },
      { id: 'health', label: 'صحة', icon: Shield, color: '#2563EB' },
      { id: 'digital-wallet', label: 'المحفظة الرقمية', icon: CreditCard, color: '#2563EB' },
    ],
  },
];

export default function ServicesScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { setActiveScreen, setSelectedProvider, setOrderOpen, providers } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleItemClick = (itemId: string) => {
    const provider = providers.find(p => p.id === itemId);
    if (provider) {
      setSelectedProvider(provider);
      setOrderOpen(true);
      return;
    }
    // For non-provider items, open appropriate screen
    if (itemId === 'transfer-local' || itemId === 'transfer-intl' || itemId === 'transfer-account') {
      useAppStore.getState().setTransferOpen(true);
    }
  };

  const filteredSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.label.includes(searchQuery)
    ),
  })).filter(section => section.items.length > 0);

  return (
    <div className="pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-4 pb-3"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>القائمة</h1>
        </div>

        {/* Search Bar */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-2xl"
          style={{
            background: isDark ? '#1A1A1A' : '#F0F0F0',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <Search size={18} strokeWidth={1.5} color={isDark ? '#555' : '#AAA'} />
          <input
            type="text"
            placeholder="ابحث عن خدمة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: isDark ? '#FFF' : '#1a1a1a' }}
          />
        </div>
      </motion.div>

      {/* Menu Sections */}
      {filteredSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * sectionIndex, duration: 0.4 }}
          className="px-4 mt-4"
        >
          <h3 className="text-sm font-bold mb-2" style={{ color: isDark ? '#AAA' : '#888' }}>
            {section.title}
          </h3>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: isDark ? '#1A1A1A' : '#FFFFFF',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            {section.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 active:scale-[0.99] transition-transform"
                  style={{
                    borderBottom: index < section.items.length - 1
                      ? `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`
                      : 'none',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${item.color}12` }}
                  >
                    <Icon size={20} strokeWidth={1.5} color={item.color} />
                  </div>
                  <span className="flex-1 text-right text-sm font-medium" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                    {item.label}
                  </span>
                  <ChevronRight size={16} strokeWidth={1.5} color={isDark ? '#444' : '#CCC'} />
                </button>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
