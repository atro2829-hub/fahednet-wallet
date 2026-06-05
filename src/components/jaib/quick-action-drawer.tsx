'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowLeftRight,
  Smartphone,
  FileText,
  QrCode,
  RotateCcw,
  HandCoins,
} from 'lucide-react';

interface QuickActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickActions = [
  { icon: ArrowLeftRight, label: 'تحويل أموال', color: 'bg-[#2EC4B6]', desc: 'إرسال أموال فوراً' },
  { icon: RotateCcw, label: 'طلب أموال', color: 'bg-[#FF9F1C]', desc: 'اطلب تحويلاً' },
  { icon: Smartphone, label: 'شحن رصيد', color: 'bg-[#6C63FF]', desc: 'شحن خطك' },
  { icon: QrCode, label: 'مسح QR', color: 'bg-[#E63946]', desc: 'ادفع بالمسح' },
  { icon: FileText, label: 'دفع فواتير', color: 'bg-[#2EC4B6]', desc: 'سدد فواتيرك' },
  { icon: HandCoins, label: 'إيداع رصيد', color: 'bg-[#FF9F1C]', desc: 'أضف رصيدك' },
];

export default function QuickActionDrawer({ isOpen, onClose }: QuickActionDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-w-md mx-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3">
              <h2 className="text-lg font-bold text-gray-900">إجراء سريع</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 active:scale-90 transition-transform"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="px-5 pb-8 pt-2">
              <div className="grid grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl active:scale-95 transition-transform"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                  >
                    <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                      <action.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-800 text-center leading-tight">
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
