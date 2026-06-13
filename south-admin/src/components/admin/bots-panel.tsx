'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, push, update, remove, set, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAdminStore } from '@/lib/store';
import { formatNumber, generateId } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Search, Bot, Play, Loader2, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface BotData {
  id: string;
  name: string;
  description: string;
  type: 'balance' | 'recharge' | 'info' | 'custom';
  networkId: string;
  networkName: string;
  icon: string;
  color: string;
  apiUrl: string;
  apiKey: string;
  apiMethod: 'GET' | 'POST';
  headersTemplate: string;
  bodyTemplate: string;
  responseParser: string;
  isActive: boolean;
  order: number;
  requiresPhone: boolean;
  requiresAmount: boolean;
  prefixPattern: string;
  successMessage: string;
  errorMessage: string;
}

interface Provider {
  id: string;
  name: string;
  categoryId?: string;
  color?: string;
  icon?: string;
  inputPrefix?: string;
}

const typeLabels: Record<BotData['type'], string> = {
  balance: 'رصيد',
  recharge: 'شحن',
  info: 'معلومات',
  custom: 'مخصص',
};

const typeColors: Record<BotData['type'], string> = {
  balance: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  recharge: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
  info: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  custom: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
};

const defaultBots: Omit<BotData, 'id'>[] = [
  {
    name: 'يمن موبايل رصيد',
    description: 'الاستعلام عن رصيد يمن موبايل',
    type: 'balance',
    networkId: 'yemen-mobile',
    networkName: 'يمن موبايل',
    icon: '',
    color: '#C41E3A',
    apiUrl: '',
    apiKey: '',
    apiMethod: 'GET',
    headersTemplate: '',
    bodyTemplate: '',
    responseParser: '',
    isActive: true,
    order: 1,
    requiresPhone: true,
    requiresAmount: false,
    prefixPattern: '77,78,73,70',
    successMessage: 'رصيدك: {{balance}} ر.ي',
    errorMessage: 'حدث خطأ في الاستعلام',
  },
  {
    name: 'يو رصيد',
    description: 'الاستعلام عن رصيد يو',
    type: 'balance',
    networkId: 'yo',
    networkName: 'يو',
    icon: '',
    color: '#E91E63',
    apiUrl: '',
    apiKey: '',
    apiMethod: 'GET',
    headersTemplate: '',
    bodyTemplate: '',
    responseParser: '',
    isActive: true,
    order: 2,
    requiresPhone: true,
    requiresAmount: false,
    prefixPattern: '71,75',
    successMessage: 'رصيدك: {{balance}} ر.ي',
    errorMessage: 'حدث خطأ في الاستعلام',
  },
  {
    name: 'سبأفون رصيد',
    description: 'الاستعلام عن رصيد سبأفون',
    type: 'balance',
    networkId: 'sabafon',
    networkName: 'سبأفون',
    icon: '',
    color: '#4CAF50',
    apiUrl: '',
    apiKey: '',
    apiMethod: 'GET',
    headersTemplate: '',
    bodyTemplate: '',
    responseParser: '',
    isActive: true,
    order: 3,
    requiresPhone: true,
    requiresAmount: false,
    prefixPattern: '74,76',
    successMessage: 'رصيدك: {{balance}} ر.ي',
    errorMessage: 'حدث خطأ في الاستعلام',
  },
  {
    name: 'واي رصيد',
    description: 'الاستعلام عن رصيد واي',
    type: 'balance',
    networkId: 'y',
    networkName: 'واي',
    icon: '',
    color: '#2196F3',
    apiUrl: '',
    apiKey: '',
    apiMethod: 'GET',
    headersTemplate: '',
    bodyTemplate: '',
    responseParser: '',
    isActive: true,
    order: 4,
    requiresPhone: true,
    requiresAmount: false,
    prefixPattern: '72,79',
    successMessage: 'رصيدك: {{balance}} ر.ي',
    errorMessage: 'حدث خطأ في الاستعلام',
  },
  {
    name: 'يمن موبايل شحن',
    description: 'شحن رصيد يمن موبايل',
    type: 'recharge',
    networkId: 'yemen-mobile',
    networkName: 'يمن موبايل',
    icon: '',
    color: '#C41E3A',
    apiUrl: '',
    apiKey: '',
    apiMethod: 'POST',
    headersTemplate: '{"Content-Type": "application/json"}',
    bodyTemplate: '{"phone": "{{phone}}", "amount": "{{amount}}"}',
    responseParser: '',
    isActive: true,
    order: 5,
    requiresPhone: true,
    requiresAmount: true,
    prefixPattern: '77,78,73,70',
    successMessage: 'تم الشحن بنجاح - المبلغ: {{amount}} ر.ي',
    errorMessage: 'حدث خطأ في الشحن',
  },
  {
    name: 'يو شحن',
    description: 'شحن رصيد يو',
    type: 'recharge',
    networkId: 'yo',
    networkName: 'يو',
    icon: '',
    color: '#E91E63',
    apiUrl: '',
    apiKey: '',
    apiMethod: 'POST',
    headersTemplate: '{"Content-Type": "application/json"}',
    bodyTemplate: '{"phone": "{{phone}}", "amount": "{{amount}}"}',
    responseParser: '',
    isActive: true,
    order: 6,
    requiresPhone: true,
    requiresAmount: true,
    prefixPattern: '71,75',
    successMessage: 'تم الشحن بنجاح - المبلغ: {{amount}} ر.ي',
    errorMessage: 'حدث خطأ في الشحن',
  },
  {
    name: 'سبأفون شحن',
    description: 'شحن رصيد سبأفون',
    type: 'recharge',
    networkId: 'sabafon',
    networkName: 'سبأفون',
    icon: '',
    color: '#4CAF50',
    apiUrl: '',
    apiKey: '',
    apiMethod: 'POST',
    headersTemplate: '{"Content-Type": "application/json"}',
    bodyTemplate: '{"phone": "{{phone}}", "amount": "{{amount}}"}',
    responseParser: '',
    isActive: true,
    order: 7,
    requiresPhone: true,
    requiresAmount: true,
    prefixPattern: '74,76',
    successMessage: 'تم الشحن بنجاح - المبلغ: {{amount}} ر.ي',
    errorMessage: 'حدث خطأ في الشحن',
  },
  {
    name: 'واي شحن',
    description: 'شحن رصيد واي',
    type: 'recharge',
    networkId: 'y',
    networkName: 'واي',
    icon: '',
    color: '#2196F3',
    apiUrl: '',
    apiKey: '',
    apiMethod: 'POST',
    headersTemplate: '{"Content-Type": "application/json"}',
    bodyTemplate: '{"phone": "{{phone}}", "amount": "{{amount}}"}',
    responseParser: '',
    isActive: true,
    order: 8,
    requiresPhone: true,
    requiresAmount: true,
    prefixPattern: '72,79',
    successMessage: 'تم الشحن بنجاح - المبلغ: {{amount}} ر.ي',
    errorMessage: 'حدث خطأ في الشحن',
  },
];

const emptyBot: Omit<BotData, 'id'> = {
  name: '',
  description: '',
  type: 'balance',
  networkId: '',
  networkName: '',
  icon: '',
  color: '#C41E3A',
  apiUrl: '',
  apiKey: '',
  apiMethod: 'GET',
  headersTemplate: '',
  bodyTemplate: '',
  responseParser: '',
  isActive: true,
  order: 0,
  requiresPhone: true,
  requiresAmount: false,
  prefixPattern: '',
  successMessage: '',
  errorMessage: '',
};

export default function BotsPanel() {
  const { showToast } = useAdminStore();
  const [bots, setBots] = useState<BotData[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState<BotData | null>(null);
  const [activeTab, setActiveTab] = useState('bots');
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ botId: string; success: boolean; data?: any; error?: string } | null>(null);
  const [testPhone, setTestPhone] = useState('777123456');

  // Form state
  const [form, setForm] = useState<Omit<BotData, 'id'>>(emptyBot);

  // Load bots from Firebase
  useEffect(() => {
    const botsRef = ref(database, 'adminSettings/bots');
    const unsub = onValue(botsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]: [string, any]) => ({
        id,
        ...val,
      })) as BotData[];
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      setBots(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Load providers from Firebase
  useEffect(() => {
    const provRef = ref(database, 'providers');
    const unsub = onValue(provRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data)
        .map(([id, val]: [string, any]) => ({ id, ...val }))
        .filter((p: any) => p.categoryId === 'telecom') as Provider[];
      setProviders(list);
    });
    return () => unsub();
  }, []);

  const resetForm = () => {
    setForm(emptyBot);
    setEditing(null);
  };

  const openAddDialog = () => {
    setForm({ ...emptyBot, order: bots.length + 1 });
    setEditing(null);
    setDialog(true);
  };

  const openEditDialog = (bot: BotData) => {
    setEditing(bot);
    setForm({
      name: bot.name,
      description: bot.description,
      type: bot.type,
      networkId: bot.networkId,
      networkName: bot.networkName,
      icon: bot.icon,
      color: bot.color,
      apiUrl: bot.apiUrl,
      apiKey: bot.apiKey,
      apiMethod: bot.apiMethod,
      headersTemplate: bot.headersTemplate,
      bodyTemplate: bot.bodyTemplate,
      responseParser: bot.responseParser,
      isActive: bot.isActive,
      order: bot.order,
      requiresPhone: bot.requiresPhone,
      requiresAmount: bot.requiresAmount,
      prefixPattern: bot.prefixPattern,
      successMessage: bot.successMessage,
      errorMessage: bot.errorMessage,
    });
    setDialog(true);
  };

  const handleSave = async () => {
    if (!form.name) {
      showToast('يرجى إدخال اسم البوت', 'error');
      return;
    }
    try {
      const data = { ...form };
      if (editing) {
        await update(ref(database, `adminSettings/bots/${editing.id}`), data);
        showToast('تم تحديث البوت', 'success');
      } else {
        const newRef = push(ref(database, 'adminSettings/bots'));
        const botId = newRef.key || generateId();
        await set(newRef, { ...data, id: botId });
        showToast('تم إضافة البوت', 'success');
      }
      setDialog(false);
      resetForm();
    } catch (e) {
      showToast('حدث خطأ أثناء الحفظ', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(ref(database, `adminSettings/bots/${id}`));
      showToast('تم حذف البوت', 'success');
    } catch (e) {
      showToast('حدث خطأ أثناء الحذف', 'error');
    }
  };

  const handleToggleActive = async (bot: BotData, value: boolean) => {
    try {
      await update(ref(database, `adminSettings/bots/${bot.id}`), { isActive: value });
      showToast(value ? 'تم تفعيل البوت' : 'تم تعطيل البوت', 'success');
    } catch (e) {
      showToast('حدث خطأ', 'error');
    }
  };

  const handleBulkToggle = async (enable: boolean) => {
    try {
      const updates: Record<string, any> = {};
      filteredBots.forEach((b) => {
        updates[`adminSettings/bots/${b.id}/isActive`] = enable;
      });
      await update(ref(database), updates);
      showToast(enable ? 'تم تفعيل جميع البوتات' : 'تم تعطيل جميع البوتات', 'success');
    } catch (e) {
      showToast('حدث خطأ', 'error');
    }
  };

  const handleInitializeDefaults = async () => {
    try {
      const updates: Record<string, any> = {};
      defaultBots.forEach((bot, i) => {
        const botId = generateId();
        updates[`adminSettings/bots/${botId}`] = { ...bot, id: botId };
      });
      await update(ref(database), updates);
      showToast('تم تهيئة البوتات الافتراضية', 'success');
    } catch (e) {
      showToast('حدث خطأ أثناء التهيئة', 'error');
    }
  };

  const handleTestBot = async (bot: BotData) => {
    if (!bot.apiUrl) {
      showToast('يرجى تعيين رابط API أولاً', 'error');
      return;
    }
    setTesting(bot.id);
    setTestResult(null);
    try {
      const headers: Record<string, string> = {};
      if (bot.headersTemplate) {
        try {
          Object.assign(headers, JSON.parse(bot.headersTemplate));
        } catch {}
      }
      if (bot.apiKey) {
        headers['Authorization'] = `Bearer ${bot.apiKey}`;
      }

      let body: string | undefined;
      if (bot.apiMethod === 'POST' && bot.bodyTemplate) {
        body = bot.bodyTemplate
          .replace(/\{\{phone\}\}/g, testPhone)
          .replace(/\{\{amount\}\}/g, '1000');
      }

      const response = await fetch(bot.apiUrl, {
        method: bot.apiMethod,
        headers,
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      let parsedResult: any = data;
      if (bot.responseParser) {
        try {
          parsedResult = new Function('response', `return ${bot.responseParser}`)(data);
        } catch {}
      }

      setTestResult({ botId: bot.id, success: true, data: parsedResult });
      showToast('نجح اختبار البوت', 'success');
    } catch (e: any) {
      setTestResult({ botId: bot.id, success: false, error: e.message });
      showToast('فشل اختبار البوت', 'error');
    } finally {
      setTesting(null);
    }
  };

  const handleNetworkSelect = (networkId: string) => {
    const provider = providers.find((p) => p.id === networkId);
    setForm((prev) => ({
      ...prev,
      networkId,
      networkName: provider?.name || '',
      color: provider?.color || prev.color,
      icon: provider?.icon || prev.icon,
    }));
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500000) {
      showToast('حجم الصورة يجب أن يكون أقل من 500KB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setForm((prev) => ({ ...prev, icon: result }));
    };
    reader.readAsDataURL(file);
  };

  const filteredBots = bots.filter((b) => {
    const matchesSearch =
      !search ||
      b.name?.includes(search) ||
      b.networkName?.includes(search) ||
      b.description?.includes(search);
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة البوتات</h1>
          <p className="text-muted-foreground text-sm mt-1">
            إدارة البوتات التلقائية للاستعلام والشحن
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleBulkToggle(true)}>
            تفعيل الكل
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkToggle(false)}>
            تعطيل الكل
          </Button>
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="w-4 h-4 ml-1" /> بوت جديد
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="bots" className="flex-1">
            البوتات
          </TabsTrigger>
          <TabsTrigger value="instructions" className="flex-1">
            تعليمات
          </TabsTrigger>
        </TabsList>

        {/* Bots Tab */}
        <TabsContent value="bots" className="space-y-4">
          {/* Search */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو الشبكة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* Empty State */}
          {bots.length === 0 && (
            <Card className="admin-card border-0 shadow-none">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">لا توجد بوتات</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  يمكنك تهيئة البوتات الافتراضية أو إضافة بوت جديد
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleInitializeDefaults} variant="outline">
                    <RotateCcw className="w-4 h-4 ml-2" />
                    تهيئة البوتات الافتراضية
                  </Button>
                  <Button onClick={openAddDialog}>
                    <Plus className="w-4 h-4 ml-1" /> بوت جديد
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bots List */}
          <div className="space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto scrollbar-thin">
            {filteredBots.map((bot, i) => (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
              >
                <Card className="admin-card border-0 shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {bot.icon ? (
                          <img
                            src={bot.icon}
                            className="w-10 h-10 rounded-lg object-cover"
                            alt={bot.name}
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: (bot.color || '#C41E3A') + '20' }}
                          >
                            <Bot
                              className="w-5 h-5"
                              style={{ color: bot.color || '#C41E3A' }}
                            />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{bot.name}</p>
                            <Badge className={typeColors[bot.type] || typeColors.custom}>
                              {typeLabels[bot.type] || bot.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{bot.networkName}</p>
                          {bot.prefixPattern && (
                            <p className="text-xs text-muted-foreground" dir="ltr">
                              البادئات: {bot.prefixPattern}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={bot.isActive !== false}
                          onCheckedChange={(v) => handleToggleActive(bot, v)}
                        />
                        <Badge
                          className={
                            bot.isActive !== false
                              ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                              : 'bg-red-500/20 text-red-600 dark:text-red-400'
                          }
                        >
                          {bot.isActive !== false ? 'نشط' : 'معطل'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTestBot(bot)}
                          disabled={testing === bot.id}
                          title="اختبار البوت"
                        >
                          {testing === bot.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(bot)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(bot.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    {/* Test Result */}
                    {testResult && testResult.botId === bot.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3"
                      >
                        <div
                          className={`p-3 rounded-xl ${
                            testResult.success
                              ? 'bg-green-500/10 border border-green-500/20'
                              : 'bg-red-500/10 border border-red-500/20'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {testResult.success ? (
                              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                نجح الاختبار
                              </span>
                            ) : (
                              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                فشل الاختبار
                              </span>
                            )}
                          </div>
                          {testResult.success && testResult.data && (
                            <pre
                              className="text-xs bg-muted p-2 rounded-lg overflow-auto max-h-40"
                              dir="ltr"
                            >
                              {JSON.stringify(testResult.data, null, 2)}
                            </pre>
                          )}
                          {testResult.error && (
                            <p className="text-xs text-red-500">{testResult.error}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {filteredBots.length === 0 && bots.length > 0 && (
              <p className="text-center text-muted-foreground py-8">لا توجد نتائج</p>
            )}
          </div>
        </TabsContent>

        {/* Instructions Tab */}
        <TabsContent value="instructions" className="space-y-4">
          <Card className="admin-card border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-500" /> تعليمات إدارة البوتات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h3 className="font-semibold text-sm mb-2">ما هي البوتات؟</h3>
                <p className="text-sm text-muted-foreground">
                  البوتات هي خدمات تلقائية تتصل بـ API المزودين للاستعلام عن الرصيد أو شحن
                  الرصيد أو تقديم معلومات. عندما يطلب المستخدم خدمة، يتم توجيه الطلب تلقائياً
                  إلى البوت المناسب بناءً على بادئة رقم الهاتف.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-sm mb-2">أنواع البوتات</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={typeColors.balance}>رصيد</Badge>
                    <span className="text-sm text-muted-foreground">
                      استعلام عن رصيد الحساب - يتطلب رقم هاتف فقط
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={typeColors.recharge}>شحن</Badge>
                    <span className="text-sm text-muted-foreground">
                      شحن رصيد - يتطلب رقم هاتف ومبلغ
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={typeColors.info}>معلومات</Badge>
                    <span className="text-sm text-muted-foreground">
                      معلومات عن الخدمة - لا يتطلب مدخلات
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={typeColors.custom}>مخصص</Badge>
                    <span className="text-sm text-muted-foreground">
                      بوت مخصص بإعدادات خاصة
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-sm mb-2">كيف تعمل البادئات؟</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  البادئات تحدد أرقام الهواتف التي يتعامل معها كل بوت. عند إدخال المستخدم رقم
                  هاتف، يتم مطابقة أول رقمين مع البادئات المحددة.
                </p>
                <div className="bg-muted p-3 rounded-xl space-y-1 text-sm" dir="ltr">
                  <p>77,78,73,70 → يمن موبايل</p>
                  <p>71,75 → يو</p>
                  <p>74,76 → سبأفون</p>
                  <p>72,79 → واي</p>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-sm mb-2">إعدادات API</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>رابط API:</strong> عنوان الـ endpoint الذي سيتصل به البوت
                  </p>
                  <p>
                    <strong>مفتاح API:</strong> مفتاح المصادقة للوصول إلى API المزود
                  </p>
                  <p>
                    <strong>طريقة الطلب:</strong> GET للاستعلام، POST للشحن والعمليات
                  </p>
                  <p>
                    <strong>قوالب الرأس:</strong> JSON يحتوي على الرأسوس الإضافية للطلب
                  </p>
                  <p>
                    <strong>قالب المحتوى:</strong> JSON مع متغيرات مثل{' '}
                    <code className="bg-muted px-1 rounded">{'{{phone}}'}</code> و{' '}
                    <code className="bg-muted px-1 rounded">{'{{amount}}'}</code>
                  </p>
                  <p>
                    <strong>محلل الاستجابة:</strong> تعبير JavaScript لاستخراج النتيجة من رد API
                    - مثال: <code className="bg-muted px-1 rounded">response.data.balance</code>
                  </p>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-sm mb-2">رسائل النجاح والخطأ</h3>
                <p className="text-sm text-muted-foreground">
                  يمكنك استخدام المتغيرات التالية في قوالب الرسائل:
                </p>
                <div className="bg-muted p-3 rounded-xl space-y-1 text-sm mt-2" dir="ltr">
                  <p>{'{{balance}}'} - الرصيد المستخرج</p>
                  <p>{'{{amount}}'} - المبلغ المحدد</p>
                  <p>{'{{phone}}'} - رقم الهاتف</p>
                  <p>{'{{transactionId}}'} - رقم المعاملة</p>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-sm mb-2">اختبار البوت</h3>
                <p className="text-sm text-muted-foreground">
                  استخدم زر التشغيل (▶) بجانب كل بوت لاختبار الاتصال بـ API. أدخل رقم هاتف
                  تجريبي أولاً ثم اضغط على زر الاختبار. سيتم عرض نتيجة الاستجابة أو رسالة
                  الخطأ.
                </p>
              </section>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Phone Input (shown when testing) */}
      {testing && (
        <div className="fixed bottom-4 left-4 z-50 bg-background border border-border rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Label className="text-xs">رقم تجريبي:</Label>
            <Input
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              dir="ltr"
              className="w-36 h-8 text-sm"
              placeholder="777123456"
            />
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialog} onOpenChange={(open) => { setDialog(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'تعديل بوت' : 'إضافة بوت جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground">المعلومات الأساسية</h4>
              <div>
                <Label>اسم البوت</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="يمن موبايل رصيد"
                />
              </div>
              <div>
                <Label>الوصف</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="الاستعلام عن رصيد يمن موبايل"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>النوع</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) =>
                      setForm((p) => ({
                        ...p,
                        type: v as BotData['type'],
                        requiresAmount: v === 'recharge',
                        requiresPhone: v === 'balance' || v === 'recharge',
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balance">رصيد</SelectItem>
                      <SelectItem value="recharge">شحن</SelectItem>
                      <SelectItem value="info">معلومات</SelectItem>
                      <SelectItem value="custom">مخصص</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>الترتيب</Label>
                  <Input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))
                    }
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Network */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground">الشبكة</h4>
              <div>
                <Label>المزود / الشبكة</Label>
                <Select value={form.networkId} onValueChange={handleNetworkSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المزود" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>اسم الشبكة</Label>
                <Input
                  value={form.networkName}
                  onChange={(e) => setForm((p) => ({ ...p, networkName: e.target.value }))}
                  placeholder="يمن موبايل"
                />
              </div>
              <div>
                <Label>البادئات (مفصولة بفاصلة)</Label>
                <Input
                  value={form.prefixPattern}
                  onChange={(e) => setForm((p) => ({ ...p, prefixPattern: e.target.value }))}
                  dir="ltr"
                  placeholder="77,78,73,70"
                />
              </div>
            </div>

            {/* Appearance */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground">المظهر</h4>
              <div>
                <Label>اللون</Label>
                <Input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                  className="w-full h-10"
                />
              </div>
              <div>
                <Label>الأيقونة</Label>
                <div className="flex items-center gap-3 mt-1">
                  {form.icon && (
                    <img src={form.icon} className="w-10 h-10 rounded-lg object-cover" alt="" />
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <label>
                      رفع أيقونة
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleIconUpload}
                      />
                    </label>
                  </Button>
                  {form.icon && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setForm((p) => ({ ...p, icon: '' }))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* API Settings */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground">إعدادات API</h4>
              <div>
                <Label>رابط API</Label>
                <Input
                  value={form.apiUrl}
                  onChange={(e) => setForm((p) => ({ ...p, apiUrl: e.target.value }))}
                  dir="ltr"
                  placeholder="https://api.example.com/balance"
                />
              </div>
              <div>
                <Label>مفتاح API</Label>
                <Input
                  type="password"
                  value={form.apiKey}
                  onChange={(e) => setForm((p) => ({ ...p, apiKey: e.target.value }))}
                  dir="ltr"
                  placeholder="sk-xxxx..."
                />
              </div>
              <div>
                <Label>طريقة الطلب</Label>
                <Select
                  value={form.apiMethod}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, apiMethod: v as 'GET' | 'POST' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>قوالب الرأس (JSON)</Label>
                <Textarea
                  value={form.headersTemplate}
                  onChange={(e) => setForm((p) => ({ ...p, headersTemplate: e.target.value }))}
                  dir="ltr"
                  placeholder='{"Content-Type": "application/json"}'
                  rows={3}
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <Label>قالب المحتوى (JSON)</Label>
                <Textarea
                  value={form.bodyTemplate}
                  onChange={(e) => setForm((p) => ({ ...p, bodyTemplate: e.target.value }))}
                  dir="ltr"
                  placeholder='{"phone": "{{phone}}", "amount": "{{amount}}"}'
                  rows={3}
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <Label>محلل الاستجابة (JavaScript)</Label>
                <Input
                  value={form.responseParser}
                  onChange={(e) => setForm((p) => ({ ...p, responseParser: e.target.value }))}
                  dir="ltr"
                  placeholder="response.data.balance"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  تعبير JavaScript يستخدم المتغير <code>response</code> لاستخراج النتيجة
                </p>
              </div>
            </div>

            {/* Input Requirements */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground">متطلبات الإدخال</h4>
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.requiresPhone}
                  onCheckedChange={(v) => setForm((p) => ({ ...p, requiresPhone: v }))}
                />
                <Label>يتطلب رقم هاتف</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.requiresAmount}
                  onCheckedChange={(v) => setForm((p) => ({ ...p, requiresAmount: v }))}
                />
                <Label>يتطلب مبلغ</Label>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground">الرسائل</h4>
              <div>
                <Label>رسالة النجاح</Label>
                <Input
                  value={form.successMessage}
                  onChange={(e) => setForm((p) => ({ ...p, successMessage: e.target.value }))}
                  placeholder="رصيدك: {{balance}} ر.ي"
                />
              </div>
              <div>
                <Label>رسالة الخطأ</Label>
                <Input
                  value={form.errorMessage}
                  onChange={(e) => setForm((p) => ({ ...p, errorMessage: e.target.value }))}
                  placeholder="حدث خطأ في الاستعلام"
                />
              </div>
            </div>

            {/* Active */}
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: v }))}
              />
              <Label>نشط</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialog(false); resetForm(); }}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>{editing ? 'تحديث' : 'إضافة'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
