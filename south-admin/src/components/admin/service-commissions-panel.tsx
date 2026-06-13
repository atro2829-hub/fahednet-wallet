'use client';

import { useState, useEffect, useMemo } from 'react';
import { ref, onValue, set, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAdminStore } from '@/lib/store';
import { formatNumber, currencySymbols, generateId } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Percent, Search, Loader2, Save, RefreshCw,
  ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Wallet,
  Gamepad2, Zap, Globe, Server, Settings, ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────

interface ServiceCommission {
  providerId: string;
  providerName: string;
  categoryId: string;
  commissionYER: number;
  commissionSAR: number;
  commissionUSD: number;
  useCustom: boolean;
}

interface DefaultCommissionSettings {
  defaultYER: number;
  defaultSAR: number;
  defaultUSD: number;
  enabled: boolean;
}

interface CategoryGroup {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

// ─── Constants ───────────────────────────────────────────

const DEFAULT_COMMISSION: DefaultCommissionSettings = {
  defaultYER: 150,
  defaultSAR: 1,
  defaultUSD: 0.25,
  enabled: true,
};

const CATEGORY_GROUPS: CategoryGroup[] = [
  { id: 'telecom', name: 'الاتصالات', icon: Zap, color: 'text-blue-500' },
  { id: 'internet', name: 'الإنترنت', icon: Globe, color: 'text-purple-500' },
  { id: 'wallet-services', name: 'خدمات المحفظة', icon: Gamepad2, color: 'text-pink-500' },
  { id: 'electricity', name: 'الكهرباء والماء', icon: Zap, color: 'text-yellow-500' },
  { id: 'government', name: 'خدمات حكومية', icon: Server, color: 'text-gray-500' },
  { id: 'crypto', name: 'الكريبتو', icon: Wallet, color: 'text-orange-500' },
  { id: 'crypto-invest', name: 'استثمار الكريبتو', icon: Wallet, color: 'text-emerald-500' },
  { id: 'service-providers', name: 'مزودين الخدمات', icon: Server, color: 'text-teal-500' },
];

// Category name mapping
const CATEGORY_NAMES: Record<string, string> = {
  'telecom': 'الاتصالات',
  'internet': 'الإنترنت',
  'wallet-services': 'خدمات المحفظة',
  'electricity': 'الكهرباء والماء',
  'government': 'خدمات حكومية',
  'crypto': 'الكريبتو',
  'crypto-invest': 'استثمار الكريبتو',
  'service-providers': 'مزودين الخدمات',
  'providers': 'مزودين الخدمات',
};

// ─── Main Component ──────────────────────────────────────

export default function ServiceCommissionsPanel() {
  const { showToast } = useAdminStore();

  // ── Data State ──
  const [commissions, setCommissions] = useState<Record<string, ServiceCommission>>({});
  const [defaultSettings, setDefaultSettings] = useState<DefaultCommissionSettings>(DEFAULT_COMMISSION);
  const [providers, setProviders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // ── UI State ──
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [editDialog, setEditDialog] = useState(false);
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ServiceCommission | null>(null);

  // ── Firebase Listeners ──
  useEffect(() => {
    // Listen for commission settings
    const commRef = ref(database, 'adminSettings/commissions/services');
    const unsub1 = onValue(commRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.commissions) {
          setCommissions(data.commissions as Record<string, ServiceCommission>);
        }
        if (data.defaultSettings) {
          setDefaultSettings({
            defaultYER: data.defaultSettings.defaultYER || 150,
            defaultSAR: data.defaultSettings.defaultSAR || 1,
            defaultUSD: data.defaultSettings.defaultUSD || 0.25,
            enabled: data.defaultSettings.enabled !== false,
          });
        }
      }
      setLoading(false);
    });

    // Listen for providers
    const provRef = ref(database, 'providers');
    const unsub2 = onValue(provRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]: [string, any]) => ({
        id,
        ...val,
      }));
      setProviders(list);
    });

    // Listen for categories
    const catRef = ref(database, 'categories');
    const unsub3 = onValue(catRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]: [string, any]) => ({
        id,
        ...val,
      }));
      setCategories(list);
    });

    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  // ── Build provider list from Firebase or defaults ──
  const allProviders = useMemo(() => {
    if (providers.length > 0) return providers;
    // Default providers from the store definition
    return [
      { id: 'yemen-mobile', categoryId: 'telecom', name: 'يمن موبايل' },
      { id: 'yo', categoryId: 'telecom', name: 'يو' },
      { id: 'sabafon', categoryId: 'telecom', name: 'سبأفون' },
      { id: 'y', categoryId: 'telecom', name: 'واي' },
      { id: 'yemen-net', categoryId: 'internet', name: 'يمن نت' },
      { id: 'y-net-internet', categoryId: 'internet', name: 'واي نت' },
      { id: 'sabafon-internet', categoryId: 'internet', name: 'سبأفون نت' },
      { id: 'pubg', categoryId: 'wallet-services', name: 'ببجي موبايل' },
      { id: 'freefire', categoryId: 'wallet-services', name: 'فري فاير' },
      { id: 'call-of-duty', categoryId: 'wallet-services', name: 'كال اوف ديوتي' },
      { id: 'clash-royale', categoryId: 'wallet-services', name: 'كلاش رويال' },
      { id: 'clash-of-clans', categoryId: 'wallet-services', name: 'كلاش اوف كلانس' },
      { id: 'roblox', categoryId: 'wallet-services', name: 'روبلوكس' },
      { id: 'fortnite', categoryId: 'wallet-services', name: 'فورتنايت' },
      { id: 'minecraft', categoryId: 'wallet-services', name: 'ماينكرافت' },
      { id: 'valorant', categoryId: 'wallet-services', name: 'فالورانت' },
      { id: 'league-legends', categoryId: 'wallet-services', name: 'ليق اوف ليجندز' },
      { id: 'apex-legends', categoryId: 'wallet-services', name: 'ابيكس ليجندز' },
      { id: 'genshin-impact', categoryId: 'wallet-services', name: 'جينشين امباكت' },
      { id: 'honkai-star', categoryId: 'wallet-services', name: 'هنكاي ستار ريل' },
      { id: 'ea-fc', categoryId: 'wallet-services', name: 'EA FC 25' },
      { id: 'steam', categoryId: 'wallet-services', name: 'ستيم' },
      { id: 'netflix', categoryId: 'wallet-services', name: 'نتفلكس' },
      { id: 'spotify', categoryId: 'wallet-services', name: 'سبوتيفاي' },
      { id: 'youtube-premium', categoryId: 'wallet-services', name: 'يوتيوب بريميوم' },
      { id: 'google-play', categoryId: 'wallet-services', name: 'بطاقة جوجل بلاي' },
      { id: 'apple-itunes', categoryId: 'wallet-services', name: 'بطاقة آيتونز' },
      { id: 'amazon-gift', categoryId: 'wallet-services', name: 'بطاقة امازون' },
      { id: 'psn-card', categoryId: 'wallet-services', name: 'بطاقة بلايستيشن' },
      { id: 'xbox-card', categoryId: 'wallet-services', name: 'بطاقة اكسبوكس' },
      { id: 'nintendo-card', categoryId: 'wallet-services', name: 'بطاقة نينتندو' },
      { id: 'visa-virtual', categoryId: 'wallet-services', name: 'بطاقة فيزا افتراضية' },
      { id: 'mastercard-virtual', categoryId: 'wallet-services', name: 'بطاقة ماستركارد افتراضية' },
      { id: 'paypal', categoryId: 'wallet-services', name: 'شحن بايبال' },
      { id: 'elec-sanaa', categoryId: 'electricity', name: 'كهرباء صنعاء' },
      { id: 'elec-aden', categoryId: 'electricity', name: 'كهرباء عدن' },
      { id: 'water-sanaa', categoryId: 'electricity', name: 'مياه صنعاء' },
      { id: 'water-aden', categoryId: 'electricity', name: 'مياه عدن' },
      { id: 'civil-registry', categoryId: 'government', name: 'السجل المدني' },
      { id: 'passport', categoryId: 'government', name: 'جواز السفر' },
      { id: 'traffic', categoryId: 'government', name: 'المرور' },
      { id: 'municipal', categoryId: 'government', name: 'البلدية' },
      { id: 'bitcoin', categoryId: 'crypto', name: 'بيتكوين BTC' },
      { id: 'ethereum', categoryId: 'crypto', name: 'إيثريوم ETH' },
      { id: 'usdt', categoryId: 'crypto', name: 'تيثر USDT' },
      { id: 'bnb', categoryId: 'crypto', name: 'بينانس BNB' },
      { id: 'solana', categoryId: 'crypto', name: 'سولانا SOL' },
      { id: 'tron', categoryId: 'crypto', name: 'ترون TRX' },
      { id: 'usdt-daily', categoryId: 'crypto-invest', name: 'USDT يومي' },
      { id: 'usdt-weekly', categoryId: 'crypto-invest', name: 'USDT أسبوعي' },
      { id: 'usdt-monthly', categoryId: 'crypto-invest', name: 'USDT شهري' },
      { id: 'usdt-quarterly', categoryId: 'crypto-invest', name: 'USDT ربع سنوي' },
    ];
  }, [providers]);

  // ── Group providers by category ──
  const groupedProviders = useMemo(() => {
    const groups: Record<string, { category: CategoryGroup; providers: any[] }> = {};

    allProviders.forEach((prov) => {
      const catId = prov.categoryId || 'wallet-services';
      const group = CATEGORY_GROUPS.find(g => g.id === catId) ||
        { id: catId, name: CATEGORY_NAMES[catId] || catId, icon: Server, color: 'text-gray-500' };

      if (!groups[catId]) {
        groups[catId] = { category: group, providers: [] };
      }
      groups[catId].providers.push(prov);
    });

    return Object.values(groups);
  }, [allProviders]);

  // ── Get commission for a provider ──
  const getCommission = (providerId: string): ServiceCommission => {
    if (commissions[providerId]) {
      return commissions[providerId];
    }
    // Default commission
    const prov = allProviders.find(p => p.id === providerId);
    return {
      providerId,
      providerName: prov?.name || providerId,
      categoryId: prov?.categoryId || '',
      commissionYER: defaultSettings.defaultYER,
      commissionSAR: defaultSettings.defaultSAR,
      commissionUSD: defaultSettings.defaultUSD,
      useCustom: false,
    };
  };

  // ── Toggle category expansion ──
  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  // ── Open edit dialog ──
  const openEditDialog = (providerId: string) => {
    const comm = getCommission(providerId);
    const prov = allProviders.find(p => p.id === providerId);
    setEditForm({
      ...comm,
      providerName: prov?.name || providerId,
      categoryId: prov?.categoryId || '',
    });
    setEditingProvider(providerId);
    setEditDialog(true);
  };

  // ── Save single commission ──
  const handleSaveCommission = async () => {
    if (!editForm || !editingProvider) return;
    setSaving(true);
    try {
      const updatedCommissions = {
        ...commissions,
        [editingProvider]: {
          ...editForm,
          useCustom: true,
        },
      };
      await set(ref(database, 'adminSettings/commissions/services/commissions'), updatedCommissions);
      setCommissions(updatedCommissions);
      setEditDialog(false);
      setEditingProvider(null);
      setEditForm(null);
      showToast('تم حفظ العمولة بنجاح', 'success');
    } catch (e) {
      showToast('حدث خطأ أثناء الحفظ', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Save default settings ──
  const handleSaveDefaults = async () => {
    setSaving(true);
    try {
      await set(ref(database, 'adminSettings/commissions/services/defaultSettings'), defaultSettings);
      showToast('تم حفظ الإعدادات الافتراضية', 'success');
    } catch (e) {
      showToast('حدث خطأ أثناء الحفظ', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Apply default commission to all services ──
  const handleApplyToAll = async () => {
    setSaving(true);
    try {
      const updatedCommissions: Record<string, ServiceCommission> = {};

      allProviders.forEach((prov) => {
        updatedCommissions[prov.id] = {
          providerId: prov.id,
          providerName: prov.name || prov.id,
          categoryId: prov.categoryId || '',
          commissionYER: defaultSettings.defaultYER,
          commissionSAR: defaultSettings.defaultSAR,
          commissionUSD: defaultSettings.defaultUSD,
          useCustom: false,
        };
      });

      await set(ref(database, 'adminSettings/commissions/services/commissions'), updatedCommissions);
      await set(ref(database, 'adminSettings/commissions/services/defaultSettings'), defaultSettings);

      setCommissions(updatedCommissions);
      showToast(`تم تطبيق العمولة الافتراضية (${defaultSettings.defaultYER} ر.ي) على جميع الخدمات`, 'success');
    } catch (e) {
      showToast('حدث خطأ أثناء التطبيق', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Reset a single provider to default ──
  const handleResetToDefault = async (providerId: string) => {
    setSaving(true);
    try {
      const updatedCommissions = { ...commissions };
      delete updatedCommissions[providerId];
      await set(ref(database, 'adminSettings/commissions/services/commissions'), updatedCommissions);
      setCommissions(updatedCommissions);
      showToast('تم إعادة العمولة للقيمة الافتراضية', 'success');
    } catch (e) {
      showToast('حدث خطأ', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Filter by search ──
  const filteredGroups = useMemo(() => {
    if (!search) return groupedProviders;

    return groupedProviders.filter(group => {
      const matchCategory = group.category.name.includes(search);
      const matchProviders = group.providers.some(p => p.name?.includes(search));
      return matchCategory || matchProviders;
    });
  }, [groupedProviders, search]);

  // ── Stats ──
  const totalServices = allProviders.length;
  const customCommissions = Object.values(commissions).filter(c => c.useCustom).length;
  const usingDefault = totalServices - customCommissions;

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#8B1E3A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">جاري تحميل بيانات العمولات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="ios-large-title text-foreground">عمولات الخدمات</h1>
        <p className="text-muted-foreground text-sm mt-1">
          إدارة عمولات الخدمات لكل مزود — العمولة الافتراضية: {defaultSettings.defaultYER} ر.ي
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="ios-card p-4">
            <div className="p-2 rounded-xl w-fit bg-[#8B1E3A]/10">
              <Server className="w-4 h-4 text-[#8B1E3A]" />
            </div>
            <p className="text-xl font-bold text-foreground mt-2">{formatNumber(totalServices)}</p>
            <p className="text-[11px] text-muted-foreground">إجمالي الخدمات</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="ios-card p-4">
            <div className="p-2 rounded-xl w-fit bg-green-500/10">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-xl font-bold text-foreground mt-2">{formatNumber(usingDefault)}</p>
            <p className="text-[11px] text-muted-foreground">تستخدم الافتراضي</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="ios-card p-4">
            <div className="p-2 rounded-xl w-fit bg-orange-500/10">
              <Percent className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-xl font-bold text-foreground mt-2">{formatNumber(customCommissions)}</p>
            <p className="text-[11px] text-muted-foreground">عمولة مخصصة</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="ios-card p-4">
            <div className="p-2 rounded-xl w-fit bg-blue-500/10">
              <Wallet className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-xl font-bold text-foreground mt-2">{defaultSettings.defaultYER} {currencySymbols.YER}</p>
            <p className="text-[11px] text-muted-foreground">العمولة الافتراضية</p>
          </div>
        </motion.div>
      </div>

      {/* Default Commission Settings */}
      <div className="ios-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-[#8B1E3A]/10">
            <Settings className="w-5 h-5 text-[#8B1E3A]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">الإعدادات الافتراضية</h3>
            <p className="text-[11px] text-muted-foreground">تعيين العمولة الافتراضية لجميع الخدمات</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">العمولة بالريال اليمني (ر.ي)</Label>
            <div className="relative">
              <Input
                type="number"
                value={defaultSettings.defaultYER}
                onChange={(e) => setDefaultSettings(prev => ({ ...prev, defaultYER: Number(e.target.value) }))}
                className="text-left pl-14"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ر.ي</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">العمولة بالريال السعودي (ر.س)</Label>
            <div className="relative">
              <Input
                type="number"
                step="0.01"
                value={defaultSettings.defaultSAR}
                onChange={(e) => setDefaultSettings(prev => ({ ...prev, defaultSAR: Number(e.target.value) }))}
                className="text-left pl-12"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ر.س</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">العمولة بالدولار ($)</Label>
            <div className="relative">
              <Input
                type="number"
                step="0.01"
                value={defaultSettings.defaultUSD}
                onChange={(e) => setDefaultSettings(prev => ({ ...prev, defaultUSD: Number(e.target.value) }))}
                className="text-left pl-8"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 text-[11px] text-muted-foreground mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            التحويل التقريبي: {defaultSettings.defaultYER} ر.ي ≈ {defaultSettings.defaultSAR} ر.س ≈ {defaultSettings.defaultUSD}$ (بسعر 1$ ≈ 580 ر.ي)
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleSaveDefaults}
            disabled={saving}
            className="bg-[#8B1E3A] hover:bg-[#6B1430] text-white rounded-xl"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
            حفظ الإعدادات
          </Button>
          <Button
            onClick={handleApplyToAll}
            disabled={saving}
            className="bg-gradient-to-r from-[#8B1E3A] to-[#A82850] hover:from-[#6B1430] hover:to-[#8B1E3A] text-white rounded-xl shadow-lg shadow-[#8B1E3A]/20"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <RefreshCw className="w-4 h-4 ml-2" />}
            تطبيق على الكل
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="بحث عن خدمة أو مزود..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Services by Category */}
      <div className="space-y-2">
        {filteredGroups.map((group) => {
          const isExpanded = expandedCategories[group.category.id] !== false; // default expanded
          const CategoryIcon = group.category.icon;

          return (
            <div key={group.category.id} className="ios-card overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(group.category.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className={cn('p-2 rounded-xl bg-muted/50', group.category.color)}>
                  <CategoryIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 text-right">
                  <span className="text-sm font-semibold text-foreground">{group.category.name}</span>
                  <span className="text-[11px] text-muted-foreground mr-2">({group.providers.length} مزود)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="text-[10px] bg-[#8B1E3A]/10 text-[#8B1E3A]">
                    {defaultSettings.defaultYER} ر.ي
                  </Badge>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Providers List */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border/30">
                      {group.providers.map((prov, i) => {
                        const comm = getCommission(prov.id);
                        const isCustom = comm.useCustom;

                        return (
                          <motion.div
                            key={prov.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.02 }}
                            className="flex items-center gap-3 px-4 py-3 border-b border-border/20 last:border-b-0 hover:bg-muted/20 transition-colors"
                          >
                            {/* Provider Name */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-foreground truncate">{prov.name || prov.id}</p>
                                {isCustom && (
                                  <Badge className="text-[9px] bg-orange-500/15 text-orange-500 px-1.5 py-0">
                                    مخصص
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {prov.id}
                              </p>
                            </div>

                            {/* Commission Values */}
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-center">
                                <p className="text-xs font-bold text-foreground">{comm.commissionYER}</p>
                                <p className="text-[9px] text-muted-foreground">ر.ي</p>
                              </div>
                              <div className="w-px h-6 bg-border/30" />
                              <div className="text-center">
                                <p className="text-xs font-medium text-muted-foreground">{comm.commissionSAR}</p>
                                <p className="text-[9px] text-muted-foreground">ر.س</p>
                              </div>
                              <div className="w-px h-6 bg-border/30" />
                              <div className="text-center">
                                <p className="text-xs font-medium text-muted-foreground">{comm.commissionUSD}</p>
                                <p className="text-[9px] text-muted-foreground">$</p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => openEditDialog(prov.id)}
                                className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                                title="تعديل العمولة"
                              >
                                <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                              {isCustom && (
                                <button
                                  onClick={() => handleResetToDefault(prov.id)}
                                  className="p-1.5 rounded-lg hover:bg-orange-500/10 transition-colors"
                                  title="إعادة للافتراضي"
                                >
                                  <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Percent className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">لا توجد نتائج</p>
          </div>
        )}
      </div>

      {/* Edit Commission Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">تعديل العمولة</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">{editForm.providerName}</p>
                <p className="text-[11px] text-muted-foreground">{editForm.providerId}</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">العمولة بالريال اليمني (ر.ي)</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={editForm.commissionYER}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, commissionYER: Number(e.target.value) } : null)}
                      className="text-left pl-14"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ر.ي</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">العمولة بالريال السعودي (ر.س)</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      value={editForm.commissionSAR}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, commissionSAR: Number(e.target.value) } : null)}
                      className="text-left pl-12"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ر.س</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">العمولة بالدولار ($)</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      value={editForm.commissionUSD}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, commissionUSD: Number(e.target.value) } : null)}
                      className="text-left pl-8"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                  </div>
                </div>
              </div>

              {/* Quick equivalent conversion */}
              <div className="p-3 rounded-xl bg-muted/30 text-[11px] space-y-1">
                <p className="font-semibold text-muted-foreground mb-1">التحويل التقريبي:</p>
                <p>• {editForm.commissionYER} ر.ي ≈ {(editForm.commissionYER / 530).toFixed(2)} ر.س ≈ {(editForm.commissionYER / 580).toFixed(3)}$</p>
                <p>• {editForm.commissionSAR} ر.س ≈ {(editForm.commissionSAR * 530).toFixed(0)} ر.ي ≈ {(editForm.commissionSAR * 0.89).toFixed(3)}$</p>
                <p>• {editForm.commissionUSD}$ ≈ {(editForm.commissionUSD * 580).toFixed(0)} ر.ي ≈ {(editForm.commissionUSD * 1.09).toFixed(2)} ر.س</p>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  onClick={handleSaveCommission}
                  disabled={saving}
                  className="bg-[#8B1E3A] hover:bg-[#6B1430] text-white rounded-xl"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
                  حفظ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditDialog(false)}
                  className="rounded-xl"
                >
                  إلغاء
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
