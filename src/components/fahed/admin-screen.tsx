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
  BarChart3,
  PieChart,
  Activity,
  CreditCard,
  Phone,
  Globe,
  Calendar,
  ChevronDown,
  ChevronUp,
  Settings,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { currencySymbols, currencyBadgeColors } from '@/lib/utils';

type AdminTab = 'overview' | 'users' | 'transactions' | 'products' | 'settings';

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

export default function AdminScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { setActiveScreen, user } = useAppStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifyUserId, setNotifyUserId] = useState<string | null>(null);
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyBody, setNotifyBody] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', nameEn: '', category: '', price: 0, currency: 'YER' });
  const [adjustUserId, setAdjustUserId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustCurrency, setAdjustCurrency] = useState('YER');
  const [adjustOp, setAdjustOp] = useState<'add' | 'subtract'>('add');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

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
    } catch {} finally { setIsLoading(false); }
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin?type=transactions');
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch {} finally { setIsLoading(false); }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin?type=products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch {} finally { setIsLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

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
      if (res.ok) {
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
        body: JSON.stringify({ userId: targetUserId, title: notifyTitle, body: notifyBody, type: 'info', createOnly: true }),
      });
      setNotifyUserId(null); setNotifyTitle(''); setNotifyBody('');
    } catch {}
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.userId.includes(q) || u.phone.includes(q);
  });

  const tabs: { id: AdminTab; label: string; icon: typeof Users }[] = [
    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { id: 'users', label: 'المستخدمون', icon: Users },
    { id: 'transactions', label: 'المعاملات', icon: ArrowLeftRight },
    { id: 'products', label: 'المنتجات', icon: Package },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const statCards = [
    { label: 'إجمالي المستخدمين', value: stats?.totalUsers || 0, icon: Users, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'إجمالي المعاملات', value: stats?.totalTransactions || 0, icon: ArrowLeftRight, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'المتحقق منهم', value: stats?.verifiedUsers || 0, icon: ShieldCheck, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    { label: 'المحظورون', value: stats?.blockedUsers || 0, icon: UserX, color: '#E60000', bg: 'rgba(230,0,0,0.1)' },
  ];

  const kycStatusColors: Record<string, string> = { pending: '#F59E0B', submitted: '#3B82F6', verified: '#10B981', rejected: '#E60000' };
  const kycStatusLabels: Record<string, string> = { pending: 'قيد الانتظار', submitted: 'تم الإرسال', verified: 'متحقق', rejected: 'مرفوض' };

  // Simple bar chart data for overview
  const chartData = [
    { label: 'سبت', value: 12 },
    { label: 'أحد', value: 19 },
    { label: 'إثنين', value: 8 },
    { label: 'ثلاثاء', value: 15 },
    { label: 'أربعاء', value: 22 },
    { label: 'خميس', value: 18 },
    { label: 'جمعة', value: 6 },
  ];
  const maxChartValue = Math.max(...chartData.map(d => d.value));

  const cardBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const cardShadow = '0 2px 8px rgba(0,0,0,0.04)';

  return (
    <div className="min-h-screen" style={{ background: isDark ? '#0F0F0F' : '#F5F5F5' }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-5" style={{ background: 'linear-gradient(145deg, #1A1A1A 0%, #0F0F0F 100%)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveScreen('main')} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <ArrowLeft size={16} strokeWidth={1.5} color="#FFF" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-xl font-bold">لوحة التحكم</h1>
            <p className="text-white/40 text-xs">إدارة محفظة فهد نت</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(230,0,0,0.2)' }}>
            <ShieldCheck size={18} strokeWidth={1.5} color="#E60000" />
          </div>
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
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all"
                style={{
                  background: isActive ? '#E60000' : isDark ? '#1E1E1E' : '#FFF',
                  color: isActive ? '#FFF' : isDark ? '#BBB' : '#666',
                  boxShadow: isActive ? '0 4px 12px rgba(230,0,0,0.3)' : cardShadow,
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
          {/* Overview */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-3">
                {statCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-2xl p-4"
                      style={{ background: cardBg, boxShadow: cardShadow }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                          <Icon size={20} strokeWidth={1.5} color={stat.color} />
                        </div>
                        <TrendingUp size={14} strokeWidth={1.5} color="#10B981" />
                      </div>
                      <p className="text-2xl font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>{stat.value}</p>
                      <p className="text-xs mt-0.5" style={{ color: isDark ? '#666' : '#AAA' }}>{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Weekly Activity Chart */}
              <div className="rounded-2xl p-5" style={{ background: cardBg, boxShadow: cardShadow }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>النشاط الأسبوعي</h3>
                  <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(230,0,0,0.1)', color: '#E60000' }}>هذا الأسبوع</span>
                </div>
                <div className="flex items-end gap-2 h-32">
                  {chartData.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full relative" style={{ height: '100px' }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(item.value / maxChartValue) * 100}%` }}
                          transition={{ delay: i * 0.05, duration: 0.5 }}
                          className="absolute bottom-0 w-full rounded-t-lg"
                          style={{
                            background: i === 4 ? 'linear-gradient(to top, #E60000, #FF3333)' : isDark ? '#2A2A2A' : '#F0F0F0',
                          }}
                        />
                      </div>
                      <span className="text-[9px]" style={{ color: isDark ? '#666' : '#AAA' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="rounded-2xl p-5" style={{ background: cardBg, boxShadow: cardShadow }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>ملخص سريع</h3>
                <div className="space-y-3">
                  {[
                    { icon: DollarSign, label: 'إجمالي الأرصدة (ر.ي)', value: users.reduce((s, u) => s + u.balanceYER, 0).toLocaleString(), color: '#E60000' },
                    { icon: Globe, label: 'إجمالي الأرصدة (ر.س)', value: users.reduce((s, u) => s + u.balanceSAR, 0).toLocaleString(), color: '#10B981' },
                    { icon: CreditCard, label: 'إجمالي الأرصدة ($)', value: users.reduce((s, u) => s + u.balanceUSD, 0).toLocaleString(), color: '#3B82F6' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${item.color}15` }}>
                            <Icon size={16} strokeWidth={1.5} color={item.color} />
                          </div>
                          <span className="text-xs" style={{ color: isDark ? '#AAA' : '#888' }}>{item.label}</span>
                        </div>
                        <span className="text-sm font-bold" dir="ltr" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>{item.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ background: cardBg, boxShadow: cardShadow }}>
                <Search size={18} strokeWidth={1.5} color={isDark ? '#555' : '#AAA'} />
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
                <div key={u.id} className="rounded-2xl overflow-hidden" style={{ background: cardBg, boxShadow: cardShadow }}>
                  <button
                    onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                    className="w-full p-4 flex items-start justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(230,0,0,0.1)' }}>
                        <span className="text-sm font-bold" style={{ color: '#E60000' }}>{u.name.charAt(0)}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>{u.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Hash size={10} color={isDark ? '#666' : '#AAA'} />
                          <span className="text-xs font-medium" style={{ color: '#E60000' }} dir="ltr">{u.userId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${kycStatusColors[u.kycStatus]}20`, color: kycStatusColors[u.kycStatus] }}>
                        {kycStatusLabels[u.kycStatus]}
                      </span>
                      {u.isBlocked && <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(230,0,0,0.15)', color: '#E60000' }}>محظور</span>}
                      {expandedUser === u.id ? <ChevronUp size={16} color={isDark ? '#666' : '#AAA'} /> : <ChevronDown size={16} color={isDark ? '#666' : '#AAA'} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedUser === u.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3" style={{ borderTop: isDark ? '1px solid #2A2A2A' : '1px solid #F0F0F0' }}>
                          {/* User details */}
                          <div className="pt-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail size={12} color={isDark ? '#666' : '#AAA'} />
                              <span className="text-xs" style={{ color: isDark ? '#AAA' : '#888' }} dir="ltr">{u.email}</span>
                            </div>
                            {u.phone && (
                              <div className="flex items-center gap-2">
                                <Phone size={12} color={isDark ? '#666' : '#AAA'} />
                                <span className="text-xs" style={{ color: isDark ? '#AAA' : '#888' }} dir="ltr">{u.phone}</span>
                              </div>
                            )}
                            {u.governorate && (
                              <div className="flex items-center gap-2">
                                <MapPin size={12} color={isDark ? '#666' : '#AAA'} />
                                <span className="text-xs" style={{ color: isDark ? '#AAA' : '#888' }}>{u.governorate}</span>
                              </div>
                            )}
                          </div>

                          {/* Balances */}
                          <div className="flex gap-2">
                            {['YER', 'SAR', 'USD'].map((c) => (
                              <div key={c} className="flex-1 rounded-xl p-2 text-center" style={{ background: isDark ? '#222' : '#F8F8F8' }}>
                                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold text-white" style={{ background: currencyBadgeColors[c] }}>{c}</span>
                                <p className="text-xs font-bold mt-1" dir="ltr" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                                  {c === 'YER' ? u.balanceYER : c === 'SAR' ? u.balanceSAR : u.balanceUSD}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 flex-wrap">
                            <button onClick={() => handleAdminAction(u.isBlocked ? 'unblockUser' : 'blockUser', { userId: u.id })} className="flex items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-medium" style={{ background: u.isBlocked ? 'rgba(16,185,129,0.1)' : 'rgba(230,0,0,0.1)', color: u.isBlocked ? '#10B981' : '#E60000' }}>
                              {u.isBlocked ? <Unlock size={12} /> : <Lock size={12} />}
                              {u.isBlocked ? 'إلغاء الحظر' : 'حظر'}
                            </button>
                            {u.kycStatus === 'submitted' && (
                              <>
                                <button onClick={() => handleAdminAction('verifyKyc', { userId: u.id })} className="flex items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-medium" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                                  <CheckCircle2 size={12} /> تحقق
                                </button>
                                <button onClick={() => handleAdminAction('rejectKyc', { userId: u.id })} className="flex items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-medium" style={{ background: 'rgba(230,0,0,0.1)', color: '#E60000' }}>
                                  <XCircle size={12} /> رفض
                                </button>
                              </>
                            )}
                            <button onClick={() => setAdjustUserId(u.id)} className="flex items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-medium" style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}>
                              <DollarSign size={12} /> تعديل الرصيد
                            </button>
                            <button onClick={() => setNotifyUserId(u.id)} className="flex items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-medium" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
                              <Bell size={12} /> إشعار
                            </button>
                          </div>

                          {/* Balance Adjustment Panel */}
                          {adjustUserId === u.id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="pt-3" style={{ borderTop: isDark ? '1px solid #2A2A2A' : '1px solid #F0F0F0' }}>
                              <div className="flex gap-2">
                                <input type="number" placeholder="المبلغ" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} className="flex-1 px-3 py-2 rounded-xl text-xs outline-none" style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }} dir="ltr" />
                                <select value={adjustCurrency} onChange={(e) => setAdjustCurrency(e.target.value)} className="px-2 py-2 rounded-xl text-xs outline-none" style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }}>
                                  <option value="YER">YER</option><option value="SAR">SAR</option><option value="USD">USD</option>
                                </select>
                                <button onClick={() => { handleAdminAction('updateBalance', { userId: u.id, currency: adjustCurrency, amount: parseFloat(adjustAmount), operation: adjustOp }); setAdjustUserId(null); setAdjustAmount(''); }} className="px-3 py-2 rounded-xl text-xs font-medium text-white" style={{ background: '#E60000' }}>تطبيق</button>
                              </div>
                              <div className="flex gap-2 mt-2">
                                <button onClick={() => setAdjustOp('add')} className="px-3 py-1.5 rounded-full text-[10px] font-medium" style={{ background: adjustOp === 'add' ? 'rgba(16,185,129,0.2)' : isDark ? '#222' : '#F0F0F0', color: adjustOp === 'add' ? '#10B981' : isDark ? '#888' : '#AAA' }}>إضافة</button>
                                <button onClick={() => setAdjustOp('subtract')} className="px-3 py-1.5 rounded-full text-[10px] font-medium" style={{ background: adjustOp === 'subtract' ? 'rgba(230,0,0,0.2)' : isDark ? '#222' : '#F0F0F0', color: adjustOp === 'subtract' ? '#E60000' : isDark ? '#888' : '#AAA' }}>خصم</button>
                              </div>
                            </motion.div>
                          )}

                          {/* Send Notification Panel */}
                          {notifyUserId === u.id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="pt-3 space-y-2" style={{ borderTop: isDark ? '1px solid #2A2A2A' : '1px solid #F0F0F0' }}>
                              <input type="text" placeholder="عنوان الإشعار" value={notifyTitle} onChange={(e) => setNotifyTitle(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs outline-none" style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }} />
                              <input type="text" placeholder="نص الإشعار" value={notifyBody} onChange={(e) => setNotifyBody(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs outline-none" style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }} />
                              <div className="flex gap-2">
                                <button onClick={() => handleSendNotification(u.id)} className="flex-1 px-3 py-2 rounded-xl text-xs font-medium text-white" style={{ background: '#F59E0B' }}>إرسال</button>
                                <button onClick={() => { setNotifyUserId(null); setNotifyTitle(''); setNotifyBody(''); }} className="px-3 py-2 rounded-xl text-xs font-medium" style={{ background: isDark ? '#222' : '#F0F0F0', color: isDark ? '#888' : '#AAA' }}>إلغاء</button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {filteredUsers.length === 0 && !isLoading && (
                <div className="flex flex-col items-center py-8">
                  <Users size={40} strokeWidth={1.5} color={isDark ? '#333' : '#DDD'} />
                  <p className="text-sm mt-2" style={{ color: isDark ? '#666' : '#AAA' }}>لا يوجد مستخدمون</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Transactions */}
          {activeTab === 'transactions' && (
            <motion.div key="transactions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="rounded-2xl p-4" style={{ background: cardBg, boxShadow: cardShadow }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>{tx.description || tx.type}</p>
                      <p className="text-xs mt-0.5" style={{ color: isDark ? '#666' : '#AAA' }}>{new Date(tx.createdAt).toLocaleDateString('ar-SA')}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                        {tx.amount.toLocaleString()} {currencySymbols[tx.currency]}
                      </p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: tx.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: tx.status === 'completed' ? '#10B981' : '#F59E0B' }}>
                        {tx.status === 'completed' ? 'مكتمل' : 'معلق'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && !isLoading && (
                <div className="flex flex-col items-center py-8">
                  <ArrowLeftRight size={40} strokeWidth={1.5} color={isDark ? '#333' : '#DDD'} />
                  <p className="text-sm mt-2" style={{ color: isDark ? '#666' : '#AAA' }}>لا توجد معاملات</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              <button onClick={() => setShowAddProduct(!showAddProduct)} className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium" style={{ background: cardBg, color: '#E60000', boxShadow: cardShadow }}>
                <Plus size={18} strokeWidth={1.5} />
                <span>إضافة منتج جديد</span>
              </button>

              <AnimatePresence>
                {showAddProduct && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="rounded-2xl p-4 space-y-3 overflow-hidden" style={{ background: cardBg, boxShadow: cardShadow }}>
                    <input type="text" placeholder="اسم المنتج (عربي)" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }} />
                    <input type="text" placeholder="اسم المنتج (إنجليزي)" value={newProduct.nameEn} onChange={(e) => setNewProduct({ ...newProduct, nameEn: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }} dir="ltr" />
                    <input type="text" placeholder="الفئة" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }} />
                    <div className="flex gap-2">
                      <input type="number" placeholder="السعر" value={newProduct.price || ''} onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })} className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }} dir="ltr" />
                      <select value={newProduct.currency} onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value })} className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: isDark ? '#222' : '#F8F8F8', color: isDark ? '#FFF' : '#1a1a1a' }}>
                        <option value="YER">YER</option><option value="SAR">SAR</option><option value="USD">USD</option>
                      </select>
                    </div>
                    <button onClick={() => { handleAdminAction('addProduct', newProduct); setShowAddProduct(false); setNewProduct({ name: '', nameEn: '', category: '', price: 0, currency: 'YER' }); }} className="w-full py-3 rounded-xl text-sm font-bold text-white" style={{ background: '#E60000' }}>إضافة المنتج</button>
                  </motion.div>
                )}
              </AnimatePresence>

              {products.map((product) => (
                <div key={product.id} className="rounded-2xl p-4 flex items-center justify-between" style={{ background: cardBg, boxShadow: cardShadow }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>{product.name}</p>
                    <p className="text-xs" style={{ color: isDark ? '#666' : '#AAA' }}>{product.price} {currencySymbols[product.currency]} - {product.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleAdminAction('toggleProduct', { productId: product.id })}>
                      {product.isActive ? <ToggleRight size={22} color="#10B981" /> : <ToggleLeft size={22} color={isDark ? '#444' : '#CCC'} />}
                    </button>
                    <button onClick={() => handleAdminAction('deleteProduct', { productId: product.id })}>
                      <Trash2 size={16} color="#E60000" />
                    </button>
                  </div>
                </div>
              ))}

              {products.length === 0 && !isLoading && (
                <div className="flex flex-col items-center py-8">
                  <Package size={40} strokeWidth={1.5} color={isDark ? '#333' : '#DDD'} />
                  <p className="text-sm mt-2" style={{ color: isDark ? '#666' : '#AAA' }}>لا توجد منتجات</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              <div className="rounded-2xl p-5" style={{ background: cardBg, boxShadow: cardShadow }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(230,0,0,0.1)' }}>
                    <ShieldCheck size={24} strokeWidth={1.5} color="#E60000" />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>مدير النظام</p>
                    <p className="text-xs" style={{ color: isDark ? '#666' : '#AAA' }} dir="ltr">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2" style={{ borderBottom: isDark ? '1px solid #2A2A2A' : '1px solid #F0F0F0' }}>
                    <span className="text-xs" style={{ color: isDark ? '#AAA' : '#888' }}>الدور</span>
                    <span className="text-xs font-bold" style={{ color: '#E60000' }}>مدير</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs" style={{ color: isDark ? '#AAA' : '#888' }}>رقم الحساب</span>
                    <span className="text-xs font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }} dir="ltr">{user?.userId}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-5" style={{ background: cardBg, boxShadow: cardShadow }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>إعدادات النظام</h3>
                <div className="space-y-3">
                  {[
                    { icon: AlertTriangle, label: 'حد التحويل اليومي', value: '50,000 ر.ي', color: '#F59E0B' },
                    { icon: ShieldCheck, label: 'التحقق المطلوب للتحويل', value: 'مفعّل', color: '#10B981' },
                    { icon: Lock, label: 'قفل الحساب بعد محاولات خاطئة', value: '5 محاولات', color: '#E60000' },
                    { icon: Bell, label: 'إشعارات المعاملات', value: 'مفعّل', color: '#3B82F6' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <Icon size={14} strokeWidth={1.5} color={item.color} />
                          <span className="text-xs" style={{ color: isDark ? '#CCC' : '#666' }}>{item.label}</span>
                        </div>
                        <span className="text-xs font-medium" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>{item.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={async () => { await fetch('/api/seed', { method: 'POST' }); fetchStats(); fetchUsers(); fetchTransactions(); fetchProducts(); }}
                className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium"
                style={{ background: cardBg, color: '#E60000', boxShadow: cardShadow }}
              >
                <Plus size={16} strokeWidth={1.5} />
                <span>إعادة تهيئة البيانات التجريبية</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
