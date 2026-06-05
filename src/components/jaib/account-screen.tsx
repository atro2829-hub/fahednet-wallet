'use client';

import { motion } from 'framer-motion';
import {
  Cloud,
  CreditCard,
  User,
  Users,
  Shield,
  Settings,
  MessageCircle,
  Diamond,
  Share2,
  ChevronLeft,
  QrCode,
  Copy,
  Check,
} from 'lucide-react';
import { useState } from 'react';

const settingsItems = [
  { icon: Cloud, label: 'تحويل الأموال بسهولة', hasArrow: false, color: 'bg-[#2EC4B6]' },
  { icon: CreditCard, label: 'إدارة البطاقات', hasArrow: false, color: 'bg-[#6C63FF]' },
  { icon: User, label: 'حسابي', hasArrow: true, color: 'bg-[#E63946]' },
  { icon: Users, label: 'إدارة المستخدمين والشركات', hasArrow: true, color: 'bg-[#FF9F1C]' },
  { icon: Shield, label: 'الأمان والحماية', hasArrow: true, color: 'bg-[#2EC4B6]' },
  { icon: Settings, label: 'إعدادات التطبيق', hasArrow: true, color: 'bg-[#6C63FF]' },
  { icon: MessageCircle, label: 'الدعم والمساعدة', hasArrow: true, color: 'bg-[#E63946]' },
  { icon: Diamond, label: 'المدفوعات المفضلة', hasArrow: true, color: 'bg-[#FF9F1C]' },
  { icon: Share2, label: 'شارك مع أصدقائك', hasArrow: false, color: 'bg-[#2EC4B6]' },
];

export default function AccountScreen() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="pb-4">
      {/* Profile Section */}
      <div className="flex flex-col items-center pt-6 pb-4 px-4">
        {/* Avatar */}
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-bl from-[#E63946] to-[#C1121F] flex items-center justify-center mb-3 shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
            <svg viewBox="0 0 80 80" className="w-16 h-16">
              <circle cx="40" cy="30" r="14" fill="#E63946" />
              <ellipse cx="40" cy="65" rx="22" ry="16" fill="#E63946" />
              <circle cx="34" cy="28" r="2.5" fill="white" />
              <circle cx="46" cy="28" r="2.5" fill="white" />
              <path d="M35 35 Q40 40 45 35" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <p className="text-gray-700 text-sm leading-relaxed">
            بسم الله الرحمن الرحيم
          </p>
          <p className="text-gray-900 font-bold text-base mt-1">
            مرحباً بك في محفظتك
          </p>
        </motion.div>

        {/* Account Numbers Card */}
        <motion.div
          className="w-full bg-gradient-to-bl from-[#E63946] to-[#C1121F] rounded-2xl p-4 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="absolute top-0 left-0 w-28 h-28 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm">أرقام الحساب</h3>
              <button className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center active:scale-90 transition-transform">
                <QrCode className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2.5">
                <div>
                  <p className="text-white/60 text-[10px]">الرقم الأول</p>
                  <p className="text-white font-bold text-sm tracking-wide" dir="ltr">7824461</p>
                </div>
                <button
                  onClick={() => handleCopy('7824461', 'first')}
                  className="p-1.5 rounded-lg bg-white/10 active:scale-90 transition-transform"
                >
                  {copied === 'first' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/70" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2.5">
                <div>
                  <p className="text-white/60 text-[10px]">الرقم الثاني</p>
                  <p className="text-white font-bold text-sm tracking-wide" dir="ltr">773649653</p>
                </div>
                <button
                  onClick={() => handleCopy('773649653', 'second')}
                  className="p-1.5 rounded-lg bg-white/10 active:scale-90 transition-transform"
                >
                  {copied === 'second' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/70" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Settings Menu */}
      <div className="px-4 pt-2">
        <div className="space-y-2">
          {settingsItems.map((item, index) => (
            <motion.button
              key={index}
              className="w-full flex items-center gap-3 bg-white rounded-xl p-3.5 shadow-sm active:scale-[0.98] transition-transform"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            >
              <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center shrink-0`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <span className="flex-1 text-sm font-semibold text-gray-900 text-right">{item.label}</span>
              {item.hasArrow && (
                <ChevronLeft className="w-4 h-4 text-gray-400 shrink-0" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* App Version */}
      <div className="text-center py-4 mt-2">
        <p className="text-xs text-gray-400">جيب الإصدار 2.0.1</p>
      </div>
    </div>
  );
}
