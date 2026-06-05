'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import {
  Bell,
  ChevronLeft,
  CheckCheck,
  Info,
  Shield,
  ShoppingCart,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { timeAgo } from '@/lib/utils';

const notifIcons: Record<string, typeof Info> = {
  info: Info,
  transaction: ShoppingCart,
  security: Shield,
  promo: Sparkles,
};

const notifColors: Record<string, string> = {
  info: '#2563EB',
  transaction: '#E60000',
  security: '#F59E0B',
  promo: '#8B5CF6',
};

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { notifications, markNotificationRead, setActiveScreen } = useAppStore();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (!n.isRead) markNotificationRead(n.id);
    });
  };

  const getNotifIcon = (type: string) => notifIcons[type] || Bell;
  const getNotifColor = (type: string) => notifColors[type] || '#666';

  return (
    <div className="min-h-screen pb-4">
      {/* Header - Jaib Style */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-4 pb-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveScreen('main')}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
            >
              <ChevronLeft size={20} strokeWidth={1.5} color={isDark ? '#FFF' : '#666'} />
            </button>
            <div>
              <h1 className="text-xl font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>الإشعارات</h1>
              {unreadCount > 0 && (
                <p className="text-[11px]" style={{ color: '#E60000' }}>
                  {unreadCount} إشعار غير مقروء
                </p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(230,0,0,0.08)' }}
            >
              <CheckCheck size={14} strokeWidth={1.5} color="#E60000" />
              <span className="text-[11px] font-medium" style={{ color: '#E60000' }}>قراءة الكل</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 mt-8"
        >
          <div
            className="rounded-2xl p-8 flex flex-col items-center"
            style={{
              background: isDark ? '#1A1A1A' : '#FFFFFF',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: isDark ? '#222' : '#F5F5F5' }}>
              <Bell size={32} strokeWidth={1.5} color={isDark ? '#333' : '#DDD'} />
            </div>
            <p className="text-sm mt-3 font-medium" style={{ color: isDark ? '#555' : '#AAA' }}>لا توجد إشعارات</p>
            <p className="text-[11px] mt-1" style={{ color: isDark ? '#444' : '#CCC' }}>الإشعارات ستظهر هنا</p>
          </div>
        </motion.div>
      ) : (
        <div className="px-4 space-y-2">
          {notifications.map((notif, index) => {
            const NotifIcon = getNotifIcon(notif.type);
            const notifColor = getNotifColor(notif.type);
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * index }}
                onClick={() => markNotificationRead(notif.id)}
                className="flex items-start gap-3 p-4 rounded-2xl cursor-pointer"
                style={{
                  background: !notif.isRead
                    ? (isDark ? '#1A1A1A' : '#FFFFFF')
                    : (isDark ? '#141414' : '#FAFAFA'),
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                  borderRight: !notif.isRead ? `3px solid ${notifColor}` : undefined,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${notifColor}12` }}
                >
                  <NotifIcon size={18} strokeWidth={1.5} color={notifColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold truncate" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                      {notif.title}
                    </h3>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: notifColor }} />
                    )}
                  </div>
                  <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: isDark ? '#999' : '#666' }}>
                    {notif.body}
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: isDark ? '#555' : '#BBB' }}>
                    {timeAgo(notif.createdAt)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
