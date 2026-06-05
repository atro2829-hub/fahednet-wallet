'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  ArrowLeftRight,
  ShieldCheck,
  UserX,
  Package,
  TrendingUp,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  ArrowLeft,
  Search,
  Bell,
  Mail,
  MapPin,
  Hash,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { currencySymbols, currencyBadgeColors } from '@/lib/utils';

type AdminTab = 'overview' | 'users' | 'transactions' | 'products';

interface StatsData {
  totalUsers: number;
  totalTransactions: number;
  verifiedUsers: number;
  blockedUsers: number;
}

interface UserData {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: string;
  kycStatus: string;
  isBlocked: boolean;
  balanceYER: number;
  balanceSAR: number;
  balanceUSD: number;
  userId: string;
  governorate: string;
  createdAt: string;
}

interface TransactionData {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  description: string;
  createdAt: string;
}

interface ProductData {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  price: number;
  currency: string;
  isActive: boolean;
}

// Currency badge component - NO emojis
function CurrencyBadge({ currency }: { currency: string }) {
  const bgColor = currencyBadgeColors[currency] || '#666';
  return (
    <span
      className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
      style={{ background: bgColor }}
    >
      {currency}
    </span>
  );
}

export default function AdminScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { setActiveScreen } = useAppStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Send notification state
  const [notifyUserId, setNotifyUserId] = useState<string | null>(null);
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyBody, setNotifyBody] = useState('');

  // Add product form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', nameEn: '', category: '', price: 0, currency: 'YER' });

  // Balance adjust
  const [adjustUserId, setAdjustUserId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustCurrency, setAdjustCurrency] = useState('YER');
  const [adjustOp, setAdjustOp] = useState<'add' | 'subtract'>('add');

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin?type=stats');
      const data = await res.json();
      setStats(data);
    } catch {}
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin?type=users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch {} finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin?type=transactions');
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch {} finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin?type=products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch {} finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) fetchUsers();
    if (activeTab === 'transactions' && transactions.length === 0) fetchTransactions();
    if (activeTab === 'products' && products.length === 0) fetchProducts();
  }, [activeTab]);

  const handleAdminAction = async (action: string, data: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data }),
      });
      const result = await res.json();
      if (res.ok) {
        // Refresh data
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'products') fetchProducts();
        fetchStats();
      }
    } catch {}
  };

  const handleSendNotification = async (targetUserId: string) => {
    if (!notifyTitle || !notifyBody) return;

    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetUserId,
          title: notifyTitle,
          body: notifyBody,
          type: 'info',
          createOnly: true,
        }),
      });
      setNotifyUserId(null);
      setNotifyTitle('');
      setNotifyBody('');
    } catch {}
  };

  // Filter users by search
  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.userId.includes(q) ||
      u.phone.includes(q)
    );
  });

  const tabs: { id: AdminTab; label: string; icon: typeof Users }[] = [
    { id: 'overview', label: 'نظرة عامة', icon: TrendingUp },
    { id: 'users', label: 'المستخدمون', icon: Users },
    { id: 'transactions', label: 'المعاملات', icon: ArrowLeftRight },
    { id: 'products', label: 'المنتجات', icon: Package },
  ];

  const statCards = [
    { label: 'إجمالي المستخدمين', value: stats?.totalUsers || 0, icon: Users, color: '#3B82F6' },
    { label: 'إجمالي المعاملات', value: stats?.totalTransactions || 0, icon: ArrowLeftRight, color: '#10B981' },
    { label: 'المتحقق منهم', value: stats?.verifiedUsers || 0, icon: ShieldCheck, color: '#F59E0B' },
    { label: 'المحظورون', value: stats?.blockedUsers || 0, icon: UserX, color: '#E60000' },
  ];

  const kycStatusColors: Record<string, string> = {
    pending: '#F59E0B',
    submitted: '#3B82F6',
    verified: '#10B981',
    rejected: '#E60000',
  };

  const kycStatusLabels: Record<string, string> = {
    pending: 'قيد الانتظار',
    submitted: 'تم الإرسال',
    verified: 'متحقق',
    rejected: 'مرفوض',
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: isDark ? '#0F0F0F' : '#F5F5F5' }}
    >
      {/* Header */}
      <div
        className="px-5 pt-4 pb-4"
        style={{
          background: 'linear-gradient(135deg, #1A1A1A 0%, #0F0F0F 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('main')}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <ArrowLeft size={16} strokeWidth={1.5} color="#FFF" />
          </button>
          <h1 className="text-white text-xl font-bold">لوحة التحكم</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mt-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                style={{
                  background: isActive ? '#E60000' : isDark ? '#1A1A1A' : '#FFF',
                  color: isActive ? '#FFF' : isDark ? '#BBB' : '#666',
                  boxShadow: isActive ? '0 2px 8px rgba(230,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <Icon size={14} strokeWidth={1.5} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-5 mt-4 pb-8">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 gap-3"
            >
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl p-4"
                    style={{
                      background: isDark ? '#1A1A1A' : '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                      style={{ background: `${stat.color}15` }}
                    >
                      <Icon size={20} strokeWidth={1.5} color={stat.color} />
                    </div>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: isDark ? '#FFF' : '#1a1a1a' }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: isDark ? '#888' : '#AAA' }}
                    >
                      {stat.label}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* Search Bar */}
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-2xl"
                style={{
                  background: isDark ? '#1A1A1A' : '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <Search size={18} strokeWidth={1.5} color={isDark ? '#777' : '#AAA'} />
                <input
                  type="text"
                  placeholder="ابحث بالاسم، البريد، رقم الحساب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: isDark ? '#FFF' : '#1a1a1a' }}
                />
              </div>

              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="rounded-2xl p-4"
                  style={{
                    background: isDark ? '#1A1A1A' : '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                        {u.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-1">
                          <Hash size={10} color={isDark ? '#888' : '#AAA'} />
                          <span className="text-xs font-medium" style={{ color: '#E60000' }} dir="ltr">
                            {u.userId}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Mail size={10} color={isDark ? '#888' : '#AAA'} />
                        <span className="text-xs" style={{ color: isDark ? '#888' : '#AAA' }} dir="ltr">
                          {u.email}
                        </span>
                      </div>
                      {u.phone && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-xs" style={{ color: isDark ? '#888' : '#AAA' }} dir="ltr">
                            {u.phone}
                          </span>
                        </div>
                      )}
                      {u.governorate && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={10} color={isDark ? '#888' : '#AAA'} />
                          <span className="text-xs" style={{ color: isDark ? '#888' : '#AAA' }}>
                            {u.governorate}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: `${kycStatusColors[u.kycStatus]}20`,
                          color: kycStatusColors[u.kycStatus],
                        }}
                      >
                        {kycStatusLabels[u.kycStatus]}
                      </span>
                      {u.isBlocked && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#E60000]/20 text-[#E60000]">
                          محظور
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Balances */}
                  <div className="flex gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      <CurrencyBadge currency="YER" />
                      <span className="text-xs" style={{ color: isDark ? '#AAA' : '#888' }}>
                        {u.balanceYER.toLocaleString()} ر.ي
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CurrencyBadge currency="SAR" />
                      <span className="text-xs" style={{ color: isDark ? '#AAA' : '#888' }}>
                        {u.balanceSAR.toLocaleString()} ر.س
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CurrencyBadge currency="USD" />
                      <span className="text-xs" style={{ color: isDark ? '#AAA' : '#888' }}>
                        ${u.balanceUSD.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleAdminAction(
                        u.isBlocked ? 'unblockUser' : 'blockUser',
                        { userId: u.id }
                      )}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium"
                      style={{
                        background: u.isBlocked ? 'rgba(16,185,129,0.1)' : 'rgba(230,0,0,0.1)',
                        color: u.isBlocked ? '#10B981' : '#E60000',
                      }}
                    >
                      {u.isBlocked ? <Unlock size={12} /> : <Lock size={12} />}
                      {u.isBlocked ? 'إلغاء الحظر' : 'حظر'}
                    </button>

                    {u.kycStatus === 'submitted' && (
                      <>
                        <button
                          onClick={() => handleAdminAction('verifyKyc', { userId: u.id })}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium"
                          style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}
                        >
                          <CheckCircle2 size={12} />
                          تحقق
                        </button>
                        <button
                          onClick={() => handleAdminAction('rejectKyc', { userId: u.id })}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium"
                          style={{ background: 'rgba(230,0,0,0.1)', color: '#E60000' }}
                        >
                          <XCircle size={12} />
                          رفض
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setAdjustUserId(u.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium"
                      style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}
                    >
                      <DollarSign size={12} />
                      تعديل الرصيد
                    </button>

                    <button
                      onClick={() => setNotifyUserId(u.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium"
                      style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}
                    >
                      <Bell size={12} />
                      إشعار
                    </button>
                  </div>

                  {/* Balance Adjustment */}
                  {adjustUserId === u.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-3 pt-3"
                      style={{ borderTop: isDark ? '1px solid #2A2A2A' : '1px solid #F0F0F0' }}
                    >
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="المبلغ"
                          value={adjustAmount}
                          onChange={(e) => setAdjustAmount(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                          style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }}
                          dir="ltr"
                        />
                        <select
                          value={adjustCurrency}
                          onChange={(e) => setAdjustCurrency(e.target.value)}
                          className="px-2 py-2 rounded-lg text-xs outline-none"
                          style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }}
                        >
                          <option value="YER">YER</option>
                          <option value="SAR">SAR</option>
                          <option value="USD">USD</option>
                        </select>
                        <button
                          onClick={() => {
                            handleAdminAction('updateBalance', {
                              userId: u.id,
                              currency: adjustCurrency,
                              amount: parseFloat(adjustAmount),
                              operation: adjustOp,
                            });
                            setAdjustUserId(null);
                            setAdjustAmount('');
                          }}
                          className="px-3 py-2 rounded-lg text-xs font-medium text-white"
                          style={{ background: '#E60000' }}
                        >
                          تطبيق
                        </button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => setAdjustOp('add')}
                          className="px-3 py-1 rounded-full text-[10px] font-medium"
                          style={{
                            background: adjustOp === 'add' ? 'rgba(16,185,129,0.2)' : isDark ? '#222' : '#F0F0F0',
                            color: adjustOp === 'add' ? '#10B981' : isDark ? '#888' : '#AAA',
                          }}
                        >
                          إضافة
                        </button>
                        <button
                          onClick={() => setAdjustOp('subtract')}
                          className="px-3 py-1 rounded-full text-[10px] font-medium"
                          style={{
                            background: adjustOp === 'subtract' ? 'rgba(230,0,0,0.2)' : isDark ? '#222' : '#F0F0F0',
                            color: adjustOp === 'subtract' ? '#E60000' : isDark ? '#888' : '#AAA',
                          }}
                        >
                          خصم
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Send Notification */}
                  {notifyUserId === u.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-3 pt-3"
                      style={{ borderTop: isDark ? '1px solid #2A2A2A' : '1px solid #F0F0F0' }}
                    >
                      <input
                        type="text"
                        placeholder="عنوان الإشعار"
                        value={notifyTitle}
                        onChange={(e) => setNotifyTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs outline-none mb-2"
                        style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }}
                      />
                      <input
                        type="text"
                        placeholder="نص الإشعار"
                        value={notifyBody}
                        onChange={(e) => setNotifyBody(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs outline-none mb-2"
                        style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSendNotification(u.id)}
                          className="flex-1 px-3 py-2 rounded-lg text-xs font-medium text-white"
                          style={{ background: '#F59E0B' }}
                        >
                          إرسال الإشعار
                        </button>
                        <button
                          onClick={() => { setNotifyUserId(null); setNotifyTitle(''); setNotifyBody(''); }}
                          className="px-3 py-2 rounded-lg text-xs font-medium"
                          style={{ background: isDark ? '#222' : '#F0F0F0', color: isDark ? '#888' : '#AAA' }}
                        >
                          إلغاء
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}

              {filteredUsers.length === 0 && !isLoading && (
                <div className="flex flex-col items-center py-8">
                  <Users size={40} strokeWidth={1.5} color={isDark ? '#444' : '#DDD'} />
                  <p className="text-sm mt-2" style={{ color: isDark ? '#777' : '#AAA' }}>
                    لا يوجد مستخدمون
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="rounded-2xl p-3"
                  style={{
                    background: isDark ? '#1A1A1A' : '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                        {tx.description || tx.type}
                      </p>
                      <p className="text-xs" style={{ color: isDark ? '#888' : '#AAA' }}>
                        {new Date(tx.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                        {tx.amount.toLocaleString()} {currencySymbols[tx.currency]}
                      </p>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: tx.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                          color: tx.status === 'completed' ? '#10B981' : '#F59E0B',
                        }}
                      >
                        {tx.status === 'completed' ? 'مكتمل' : 'معلق'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {transactions.length === 0 && !isLoading && (
                <div className="flex flex-col items-center py-8">
                  <ArrowLeftRight size={40} strokeWidth={1.5} color={isDark ? '#444' : '#DDD'} />
                  <p className="text-sm mt-2" style={{ color: isDark ? '#777' : '#AAA' }}>
                    لا توجد معاملات
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* Add Product Button */}
              <button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium"
                style={{
                  background: isDark ? '#1A1A1A' : '#FFFFFF',
                  color: '#E60000',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <Plus size={18} strokeWidth={1.5} />
                <span>إضافة منتج جديد</span>
              </button>

              {/* Add Product Form */}
              <AnimatePresence>
                {showAddProduct && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="rounded-2xl p-4 space-y-3 overflow-hidden"
                    style={{
                      background: isDark ? '#1A1A1A' : '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="اسم المنتج (عربي)"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }}
                    />
                    <input
                      type="text"
                      placeholder="اسم المنتج (إنجليزي)"
                      value={newProduct.nameEn}
                      onChange={(e) => setNewProduct({ ...newProduct, nameEn: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }}
                      dir="ltr"
                    />
                    <input
                      type="text"
                      placeholder="الفئة"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }}
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="السعر"
                        value={newProduct.price || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                        className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }}
                        dir="ltr"
                      />
                      <select
                        value={newProduct.currency}
                        onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value })}
                        className="px-3 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }}
                      >
                        <option value="YER">YER</option>
                        <option value="SAR">SAR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        handleAdminAction('addProduct', newProduct);
                        setShowAddProduct(false);
                        setNewProduct({ name: '', nameEn: '', category: '', price: 0, currency: 'YER' });
                      }}
                      className="w-full py-3 rounded-xl text-sm font-bold text-white"
                      style={{ background: '#E60000' }}
                    >
                      إضافة المنتج
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Products List */}
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl p-3 flex items-center justify-between"
                  style={{
                    background: isDark ? '#1A1A1A' : '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                      {product.name}
                    </p>
                    <p className="text-xs" style={{ color: isDark ? '#888' : '#AAA' }}>
                      {product.price} {currencySymbols[product.currency]} - {product.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAdminAction('toggleProduct', { productId: product.id })}
                    >
                      {product.isActive ? (
                        <ToggleRight size={22} color="#10B981" />
                      ) : (
                        <ToggleLeft size={22} color={isDark ? '#555' : '#CCC'} />
                      )}
                    </button>
                    <button
                      onClick={() => handleAdminAction('deleteProduct', { productId: product.id })}
                    >
                      <Trash2 size={16} color="#E60000" />
                    </button>
                  </div>
                </div>
              ))}

              {products.length === 0 && !isLoading && (
                <div className="flex flex-col items-center py-8">
                  <Package size={40} strokeWidth={1.5} color={isDark ? '#444' : '#DDD'} />
                  <p className="text-sm mt-2" style={{ color: isDark ? '#777' : '#AAA' }}>
                    لا توجد منتجات
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
