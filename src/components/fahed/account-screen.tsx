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
  Hash,
  ShieldCheck,
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
}

const menuItems: MenuItem[] = [
  { id: 'transfer', label: 'تحويل أموال', icon: Send, color: '#E60000' },
  { id: 'cards', label: 'إدارة البطاقات', icon: CreditCard, color: '#3B82F6' },
  { id: 'account', label: 'حسابي', icon: User, color: '#10B981' },
  { id: 'users', label: 'إدارة المستخدمين', icon: Users, color: '#F59E0B', adminOnly: true },
  { id: 'security', label: 'الأمان', icon: Shield, color: '#8B5CF6' },
  { id: 'settings', label: 'إعدادات التطبيق', icon: Settings, color: '#EC4899' },
  { id: 'support', label: 'الدعم', icon: Headphones, color: '#14B8A6' },
  { id: 'favorites', label: 'المفضلة', icon: Heart, color: '#E60000' },
  { id: 'share', label: 'شارك مع أصدقائك', icon: Share2, color: '#6366F1' },
  { id: 'theme', label: 'الوضع الداكن', icon: Moon, color: '#F59E0B', toggle: true },
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
  };

  const kycInfo = kycStatusLabels[user?.kycStatus || 'pending'] || kycStatusLabels.pending;

  // Filter menu items: hide admin-only items if not admin
  const visibleMenuItems = menuItems.filter(
    (item) => !item.adminOnly || user?.role === 'admin'
  );

  return (
    <div className="pb-4">
      {/* Profile Header */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #E60000 0%, #B30000 100%)',
              boxShadow: '0 4px 16px rgba(230,0,0,0.3)',
            }}
          >
            <User size={28} strokeWidth={1.5} color="#FFF" />
          </div>
          <div className="flex-1">
            <h1
              className="text-xl font-bold"
              style={{ color: isDark ? '#FFFFFF' : '#1a1a1a' }}
            >
              {user?.name || 'مستخدم'}
            </h1>
            <p
              className="text-sm mt-0.5"
              style={{ color: isDark ? '#888' : '#AAA' }}
            >
              مرحباً بك في فهد نت
            </p>
          </div>
          {/* KYC Status Badge */}
          <span
            className="text-[10px] px-2.5 py-1 rounded-full font-medium"
            style={{
              background: `${kycInfo.color}20`,
              color: kycInfo.color,
            }}
          >
            {kycInfo.label}
          </span>
        </div>
      </div>

      {/* User ID Card */}
      <div className="px-5 mt-4">
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #E60000 0%, #B30000 100%)',
            boxShadow: '0 4px 16px rgba(230,0,0,0.2)',
          }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-10 bg-white" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full opacity-10 bg-white" />

          <div className="relative z-10">
            <p className="text-white/70 text-xs font-medium mb-3">رقم الحساب</p>

            {/* User ID */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/50 text-[10px]">المعرف الرئيسي</p>
                <p className="text-white text-2xl font-bold tracking-wider" dir="ltr">
                  {user?.userId || '------'}
                </p>
              </div>
              <button
                onClick={() => handleCopy(user?.userId || '', 'userId')}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              >
                {copiedField === 'userId' ? (
                  <Check size={16} color="#FFF" />
                ) : (
                  <Copy size={16} color="#FFF" />
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 mb-3" />

            {/* Info rows */}
            <div className="space-y-2">
              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail size={12} color="rgba(255,255,255,0.5)" />
                <p className="text-white/50 text-[10px]">البريد</p>
                <p className="text-white/80 text-xs mr-auto" dir="ltr">
                  {user?.email || '--'}
                </p>
              </div>

              {/* Phone */}
              {user?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={12} color="rgba(255,255,255,0.5)" />
                  <p className="text-white/50 text-[10px]">الهاتف</p>
                  <p className="text-white/80 text-xs mr-auto" dir="ltr">
                    {user.phone}
                  </p>
                </div>
              )}

              {/* Governorate */}
              {user?.governorate && (
                <div className="flex items-center gap-2">
                  <MapPin size={12} color="rgba(255,255,255,0.5)" />
                  <p className="text-white/50 text-[10px]">المحافظة</p>
                  <p className="text-white/80 text-xs mr-auto">
                    {user.governorate}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-5 mt-5">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: isDark ? '#1A1A1A' : '#FFFFFF',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {visibleMenuItems.map((item, index) => {
            const Icon = item.id === 'theme' && isDark ? Sun : item.icon;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => handleMenuClick(item)}
                className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-[#E60000]/5 transition-colors"
                style={{
                  borderBottom:
                    index < visibleMenuItems.length - 1
                      ? isDark
                        ? '1px solid #2A2A2A'
                        : '1px solid #F0F0F0'
                      : 'none',
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${item.color}15` }}
                >
                  <Icon size={18} strokeWidth={1.5} color={item.color} />
                </div>
                <span
                  className="flex-1 text-right text-sm font-medium"
                  style={{ color: isDark ? '#FFF' : '#1a1a1a' }}
                >
                  {item.label}
                </span>

                {item.toggle ? (
                  <div
                    className="w-11 h-6 rounded-full relative transition-colors duration-300"
                    style={{
                      background: isDark ? '#E60000' : '#DDD',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300"
                      style={{
                        left: isDark ? '22px' : '2px',
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: item.color }}
                    />
                    <ChevronLeft
                      size={16}
                      strokeWidth={1.5}
                      color={isDark ? '#555' : '#CCC'}
                    />
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* App Version */}
      <div className="flex justify-center mt-5">
        <p className="text-xs" style={{ color: isDark ? '#555' : '#CCC' }}>
          فهد نت الإصدار 1.0.0
        </p>
      </div>

      {/* Logout Button */}
      <div className="px-5 mt-4">
        <button
          onClick={logout}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-medium text-sm active:scale-[0.98] transition-transform"
          style={{
            background: isDark ? '#1A1A1A' : '#FFF',
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
