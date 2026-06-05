'use client';

import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Download,
  Smartphone,
  QrCode,
  Receipt,
  Banknote,
  X,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

const quickActions = [
  { id: 'transfer', label: 'تحويل أموال', icon: Send, color: '#E60000' },
  { id: 'request', label: 'طلب أموال', icon: Download, color: '#10B981' },
  { id: 'recharge', label: 'شحن رصيد', icon: Smartphone, color: '#F59E0B' },
  { id: 'qr', label: 'مسح QR', icon: QrCode, color: '#6366F1' },
  { id: 'bills', label: 'دفع فواتير', icon: Receipt, color: '#EC4899' },
  { id: 'deposit', label: 'إيداع', icon: Banknote, color: '#14B8A6' },
];

export default function QuickActionDrawer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { isDrawerOpen, setDrawerOpen, setTransferOpen } = useAppStore();

  const handleClose = () => {
    setDrawerOpen(false);
  };

  const handleAction = (actionId: string) => {
    handleClose();
    if (actionId === 'transfer') {
      setTimeout(() => setTransferOpen(true), 300);
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 rounded-t-3xl overflow-hidden"
            style={{ background: isDark ? '#1A1A1A' : '#FFFFFF' }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: isDark ? '#444' : '#DDD' }} />
            </div>

            <div className="flex items-center justify-between px-6 py-3">
              <h2 className="text-lg font-bold" style={{ color: isDark ? '#FFFFFF' : '#1a1a1a' }}>إجراءات سريعة</h2>
              <button onClick={handleClose} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: isDark ? '#2D2D2D' : '#F5F5F5' }}>
                <X size={16} strokeWidth={1.5} color={isDark ? '#FFF' : '#666'} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 px-6 pb-8">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    onClick={() => handleAction(action.id)}
                    className="flex flex-col items-center gap-2.5 py-5 px-2 rounded-2xl active:scale-95 transition-transform"
                    style={{ background: isDark ? '#222' : '#F8F8F8' }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${action.color}15` }}>
                      <Icon size={24} strokeWidth={1.5} color={action.color} />
                    </div>
                    <span className="text-[11px] font-medium text-center leading-tight" style={{ color: isDark ? '#CCC' : '#555' }}>
                      {action.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
