'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import {
  User,
  Send,
  CreditCard,
  Users,
  Shield,
  Settings,
  Headphones,
  Heart,
  Share2,
  Moon,
  Sun,
  LogOut,
  Copy,
  Check,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  FileText,
  CreditCard as CardIcon,
  Lock,
  Bell,
  HelpCircle,
  Info,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useState } from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: typeof User;
  color: string;
  toggle?: boolean;
  adminOnly?: boolean;
  desc: string;
}

const menuItems: MenuItem[] = [
  { id: 'transfer', label: 'تحويل أموال', icon: Send, color: '#E60000', desc: 'إرسال واستقبال الأموال' },
  { id: 'cards', label: 'إدارة البطاقات', icon: CreditCard, color: '#3B82F6', desc: 'بطاقات التعريف والبيانات' },
  { id: 'account', label: 'التحقق من الهوية', icon: ShieldCheck, color: '#10B981', desc: 'تحقق من هويتك لتفعيل الخدمات' },
  { id: 'users', label: 'لوحة التحكم', icon: Users, color: '#F59E0B', adminOnly: true, desc: 'إدارة المستخدمين والنظام' },
  { id: 'security', label: 'الأمان والخصوصية', icon: Lock, color: '#8B5CF6', desc: 'كلمة المرور والتحقق الثنائي' },
  { id: 'notifications', label: 'إعدادات الإشعارات', icon: Bell, color: '#EC4899', desc: 'إدارة التنبيهات والإشعارات' },
  { id: 'support', label: 'الدعم والمساعدة', icon: Headphones, color: '#14B8A6', desc: 'تواصل مع فريق الدعم' },
  { id: 'about', label: 'حول فهد نت', icon: Info, color: '#6366F1', desc: 'معلومات التطبيق والإصدار' },
  { id: 'share', label: 'شارك مع أصدقائك', icon: Share2, color: '#F97316', desc: 'ادعو أصدقاءك للتسجيل' },
  { id: 'theme', label: 'الوضع الداكن', icon: Moon, color: '#F59E0B', toggle: true, desc: 'تبديل المظهر' },
];

const kycStatusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'قيد الانتظار', color: '#F59E0B' },
  submitted: { label: 'تم الإرسال', color: '#3B82F6' },
  verified: { label: 'متحقق', color: '#10B981' },
  rejected: { label: 'مرفوض', color: '#E60000' },
};

export default function AccountScreen() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const { user, logout, setActiveScreen } = useAppStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.id === 'theme') {
      setTheme(isDark ? 'light' : 'dark');
      useAppStore.getState().toggleTheme();
    }
    if (item.id === 'account') {
      setActiveScreen('kyc');
    }
    if (item.id === 'users' && user?.role === 'admin') {
      setActiveScreen('admin');
    }
    if (item.id === 'transfer') {
      useAppStore.getState().setTransferOpen(true);
    }
    if (item.id === 'notifications') {
      setActiveScreen('notifications');
    }
  };

  const kycInfo = kycStatusLabels[user?.kycStatus || 'pending'] || kycStatusLabels.pending;
  const visibleMenuItems = menuItems.filter((item) => !item.adminOnly || user?.role === 'admin');

  return (
    <div className="pb-4">
      {/* Profile Header */}
      <div className="px-5 pt-4 pb-5">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #E60000 0%, #8B0000 100%)',
              boxShadow: '0 4px 16px rgba(230,0,0,0.3)',
            }}
          >
            <User size={28} strokeWidth={1.5} color="#FFF" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold" style={{ color: isDark ? '#FFFFFF' : '#1a1a1a' }}>
              {user?.name || 'مستخدم'}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: isDark ? '#777' : '#AAA' }}>مرحباً بك في فهد نت</p>
          </div>
          <span
            className="text-[10px] px-2.5 py-1 rounded-full font-medium"
            style={{ background: `${kycInfo.color}20`, color: kycInfo.color }}
          >
            {kycInfo.label}
          </span>
        </div>
      </div>

      {/* User ID Card */}
      <div className="px-5">
        <div
          className="rounded-3xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #E60000 0%, #8B0000 100%)',
            boxShadow: '0 8px 24px rgba(230,0,0,0.25)',
          }}
        >
          {/* Card Pattern */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="account-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.06)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#account-grid)" />
          </svg>
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <span className="text-white text-[8px] font-bold">FH</span>
              </div>
              <span className="text-white/70 text-xs font-bold">فهد نت</span>
            </div>

            {/* User ID */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/40 text-[10px]">رقم الحساب</p>
                <p className="text-white text-2xl font-bold tracking-[0.25em]" dir="ltr">
                  {user?.userId || '------'}
                </p>
              </div>
              <button
                onClick={() => handleCopy(user?.userId || '', 'userId')}
                className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm"
              >
                {copiedField === 'userId' ? <Check size={16} color="#FFF" /> : <Copy size={16} color="#FFF" />}
              </button>
            </div>

            <div className="h-px bg-white/10 mb-3" />

            {/* Info rows */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail size={12} color="rgba(255,255,255,0.4)" />
                <p className="text-white/40 text-[10px]">البريد</p>
                <p className="text-white/70 text-xs mr-auto" dir="ltr">{user?.email || '--'}</p>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={12} color="rgba(255,255,255,0.4)" />
                  <p className="text-white/40 text-[10px]">الهاتف</p>
                  <p className="text-white/70 text-xs mr-auto" dir="ltr">{user.phone}</p>
                </div>
              )}
              {user?.governorate && (
                <div className="flex items-center gap-2">
                  <MapPin size={12} color="rgba(255,255,255,0.4)" />
                  <p className="text-white/40 text-[10px]">المحافظة</p>
                  <p className="text-white/70 text-xs mr-auto">{user.governorate}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-5 mt-5">
        <div className="space-y-2">
          {visibleMenuItems.map((item, index) => {
            const Icon = item.id === 'theme' && isDark ? Sun : item.icon;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleMenuClick(item)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl active:scale-[0.98] transition-transform"
                style={{
                  background: isDark ? '#1E1E1E' : '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}12` }}>
                  <Icon size={18} strokeWidth={1.5} color={item.color} />
                </div>
                <div className="flex-1 text-right">
                  <span className="text-sm font-medium block" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>{item.label}</span>
                  <span className="text-[10px] block mt-0.5" style={{ color: isDark ? '#666' : '#AAA' }}>{item.desc}</span>
                </div>

                {item.toggle ? (
                  <div
                    className="w-11 h-6 rounded-full relative transition-colors duration-300"
                    style={{ background: isDark ? '#E60000' : '#DDD' }}
                  >
                    <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300" style={{ left: isDark ? '22px' : '2px' }} />
                  </div>
                ) : (
                  <ChevronLeft size={16} strokeWidth={1.5} color={isDark ? '#444' : '#CCC'} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* App Version */}
      <div className="flex justify-center mt-5">
        <p className="text-xs" style={{ color: isDark ? '#444' : '#CCC' }}>فهد نت الإصدار 1.0.0</p>
      </div>

      {/* Logout */}
      <div className="px-5 mt-4">
        <button
          onClick={logout}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-medium text-sm active:scale-[0.98] transition-transform"
          style={{
            background: isDark ? '#1E1E1E' : '#FFF',
            color: '#E60000',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <LogOut size={18} strokeWidth={1.5} color="#E60000" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}
