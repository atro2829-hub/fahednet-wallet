'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, update, remove, set, push } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAdminStore } from '@/lib/store';
import { formatNumber, generateId } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, Trash2, Server, Upload, FileJson, CheckCircle, XCircle, Package, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const categoryOptions = [
  { value: 'telecom', label: 'الاتصالات' },
  { value: 'internet', label: 'الإنترنت' },
  { value: 'entertainment', label: 'خدمات ترفيهية' },
  { value: 'cards', label: 'بطاقات رقمية' },
  { value: 'wallet-services', label: 'خدمات المحفظة' },
  { value: 'electricity', label: 'الكهرباء والماء' },
  { value: 'government', label: 'خدمات حكومية' },
  { value: 'crypto', label: 'الكريبتو' },
  { value: 'crypto-invest', label: 'استثمار الكريبتو' },
  { value: 'api-services', label: 'خدمات API' },
  { value: 'shopping', label: 'التسوق' },
  { value: 'education', label: 'التعليم' },
  { value: 'health', label: 'الصحة' },
  { value: 'travel', label: 'السفر والسياحة' },
  { value: 'food', label: 'الطعام والتوصيل' },
];

export default function ProvidersPanel() {
  const { showToast } = useAdminStore();
  const [providers, setProviders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState('all');

  // Form
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('telecom');
  const [color, setColor] = useState('#6C3CE1');
  const [icon, setIcon] = useState('');
  const [inputLabel, setInputLabel] = useState('رقم الهاتف');
  const [inputType, setInputType] = useState('phone');
  const [inputPrefix, setInputPrefix] = useState('');
  const [isActive, setIsActive] = useState(true);

  // JSON Import state
  const [jsonInput, setJsonInput] = useState('');
  const [jsonImportCategory, setJsonImportCategory] = useState('telecom');
  const [jsonPreview, setJsonPreview] = useState<{ provider: any; packages: any[] } | null>(null);
  const [jsonError, setJsonError] = useState('');
  const [jsonImporting, setJsonImporting] = useState(false);

  useEffect(() => {
    const provRef = ref(database, 'providers');
    const unsub = onValue(provRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val }));
      setProviders(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const resetForm = () => {
    setName(''); setCategoryId('telecom'); setColor('#6C3CE1');
    setIcon(''); setInputLabel('رقم الهاتف'); setInputType('phone');
    setInputPrefix(''); setIsActive(true); setEditing(null);
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
      setIcon(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name) { showToast('يرجى إدخال الاسم', 'error'); return; }
    try {
      const data = {
        name, categoryId, color, icon, inputLabel, inputType, inputPrefix, isActive,
      };
      if (editing) {
        const updates: Record<string, any> = {
          [`providers/${editing.id}`]: { ...data, id: editing.id },
        };
        updates[`adminSettings/visibility/providers/${editing.id}`] = isActive;
        await update(ref(database), updates);
        showToast('تم تحديث المزود', 'success');
      } else {
        const cleanId = name.trim()
          .replace(/[\s]+/g, '-')
          .replace(/[^\u0600-\u06FFa-zA-Z0-9\-]/g, '')
          .toLowerCase();
        const providerId = cleanId || `provider-${Date.now()}`;
        const updates: Record<string, any> = {
          [`providers/${providerId}`]: { ...data, id: providerId },
        };
        updates[`adminSettings/visibility/providers/${providerId}`] = isActive;
        await update(ref(database), updates);
        showToast('تم إضافة المزود', 'success');
      }
      setDialog(false);
      resetForm();
    } catch (e) { showToast('حدث خطأ', 'error'); }
  };

  const handleDelete = async (id: string) => {
    try {
      const updates: Record<string, any> = {
        [`providers/${id}`]: null,
        [`adminSettings/visibility/providers/${id}`]: null,
      };
      await update(ref(database), updates);
      showToast('تم حذف المزود', 'success');
    } catch (e) { showToast('حدث خطأ', 'error'); }
  };

  const handleBulkToggle = async (enable: boolean) => {
    try {
      const updates: Record<string, any> = {};
      filteredProviders.forEach(p => {
        updates[`providers/${p.id}/isActive`] = enable;
        updates[`adminSettings/visibility/providers/${p.id}`] = enable;
      });
      await update(ref(database), updates);
      showToast(enable ? 'تم تفعيل جميع المزودين' : 'تم تعطيل جميع المزودين', 'success');
    } catch (e) { showToast('حدث خطأ', 'error'); }
  };

  // ─── JSON Import Logic ───
  const parseJsonImport = () => {
    setJsonError('');
    setJsonPreview(null);
    if (!jsonInput.trim()) {
      setJsonError('يرجى لصق JSON أولاً');
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      
      // Support multiple formats:
      // Format 1: { provider: {...}, products: [...] }
      // Format 2: { name: "...", products: [...] }
      // Format 3: Array of products with provider info embedded
      // Format 4: Codashop/SEAGM API response format
      
      let providerData: any = {};
      let packagesList: any[] = [];

      if (Array.isArray(parsed)) {
        // Array of products - try to extract provider info from first item
        if (parsed.length === 0) {
          setJsonError('المصفوفة فارغة');
          return;
        }
        const first = parsed[0];
        providerData = {
          name: first.provider_name || first.providerName || first.brand || first.game || first.category || 'مزود جديد',
          icon: first.icon || first.image || first.logo || '',
        };
        packagesList = parsed.map((item: any, idx: number) => ({
          name: item.name || item.product_name || item.productName || item.title || item.package_name || `باقة ${idx + 1}`,
          price: parseFloat(item.price || item.amount || item.cost || item.value || 0),
          currency: item.currency || 'YER',
          icon: item.icon || item.image || item.product_image || '',
          productId: item.id || item.product_id || item.sku || item.code || '',
          description: item.description || item.desc || '',
          originalData: item,
        }));
      } else if (parsed.provider || parsed.products || parsed.packages || parsed.items) {
        // Object with provider info and products array
        const prov = parsed.provider || parsed;
        providerData = {
          name: prov.name || prov.provider_name || prov.providerName || prov.brand || prov.game || 'مزود جديد',
          icon: prov.icon || prov.image || prov.logo || '',
          color: prov.color || '#6C3CE1',
          inputLabel: prov.inputLabel || 'رقم الحساب',
          inputType: prov.inputType || 'text',
        };
        const items = parsed.products || parsed.packages || parsed.items || [];
        packagesList = items.map((item: any, idx: number) => ({
          name: item.name || item.product_name || item.productName || item.title || item.package_name || `باقة ${idx + 1}`,
          price: parseFloat(item.price || item.amount || item.cost || item.value || 0),
          currency: item.currency || 'YER',
          icon: item.icon || item.image || item.product_image || '',
          productId: item.id || item.product_id || item.sku || item.code || '',
          description: item.description || item.desc || '',
          originalData: item,
        }));
      } else {
        // Try to treat the whole object as a provider with nested arrays
        const keys = Object.keys(parsed);
        const arrayKey = keys.find(k => Array.isArray(parsed[k]));
        if (arrayKey) {
          providerData = {
            name: parsed.name || parsed.provider_name || parsed.brand || 'مزود جديد',
            icon: parsed.icon || parsed.image || '',
          };
          packagesList = parsed[arrayKey].map((item: any, idx: number) => ({
            name: item.name || item.product_name || item.title || `باقة ${idx + 1}`,
            price: parseFloat(item.price || item.amount || 0),
            currency: item.currency || 'YER',
            icon: item.icon || item.image || '',
            productId: item.id || item.product_id || '',
            originalData: item,
          }));
        } else {
          setJsonError('لم يتم التعرف على بنية JSON. يرجى استخدام صيغة {provider, products} أو مصفوفة منتجات');
          return;
        }
      }

      setJsonPreview({
        provider: providerData,
        packages: packagesList,
      });
    } catch (e: any) {
      setJsonError(`خطأ في تحليل JSON: ${e.message}`);
    }
  };

  const handleJsonImport = async () => {
    if (!jsonPreview) return;
    setJsonImporting(true);
    try {
      const prov = jsonPreview.provider;
      const cleanId = (prov.name || 'provider')
        .trim()
        .replace(/[\s]+/g, '-')
        .replace(/[^\u0600-\u06FFa-zA-Z0-9\-]/g, '')
        .toLowerCase();
      const providerId = cleanId || `provider-${Date.now()}`;
      
      const updates: Record<string, any> = {};
      
      // Create provider
      updates[`providers/${providerId}`] = {
        id: providerId,
        name: prov.name || 'مزود جديد',
        categoryId: jsonImportCategory,
        color: prov.color || '#6C3CE1',
        icon: prov.icon || '',
        inputLabel: prov.inputLabel || 'رقم الحساب',
        inputType: prov.inputType || 'text',
        inputPrefix: prov.inputPrefix || '',
        isActive: true,
      };
      updates[`adminSettings/visibility/providers/${providerId}`] = true;
      
      // Create packages
      jsonPreview.packages.forEach((pkg) => {
        const pkgId = generateId();
        updates[`packages/${pkgId}`] = {
          id: pkgId,
          providerId,
          providerName: prov.name || 'مزود جديد',
          name: pkg.name,
          price: pkg.price,
          currency: pkg.currency || 'YER',
          executionType: 'manual',
          isActive: true,
          available: -1,
          sold: 0,
          autoDisableAtZero: false,
          icon: pkg.icon || '',
          productId: pkg.productId || '',
          description: pkg.description || '',
        };
      });
      
      await update(ref(database), updates);
      showToast(`تم استيراد المزود مع ${jsonPreview.packages.length} باقة`, 'success');
      setJsonInput('');
      setJsonPreview(null);
      setJsonError('');
    } catch (e) {
      showToast('حدث خطأ أثناء الاستيراد', 'error');
    } finally {
      setJsonImporting(false);
    }
  };

  const filteredProviders = providers.filter(p => {
    const matchesSearch = !search || p.name?.includes(search) || p.categoryId?.includes(search);
    const matchesCategory = filterCategory === 'all' || p.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">المزودون والخدمات</h1>
          <p className="text-muted-foreground text-sm mt-1">{formatNumber(providers.length)} مزود</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleBulkToggle(true)}>تفعيل الكل</Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkToggle(false)}>تعطيل الكل</Button>
          <Button size="sm" onClick={() => { resetForm(); setDialog(true); }}>
            <Plus className="w-4 h-4 ml-1" /> مزود جديد
          </Button>
        </div>
      </div>

      <Tabs defaultValue="providers">
        <TabsList className="w-full">
          <TabsTrigger value="providers" className="flex-1">المزودون</TabsTrigger>
          <TabsTrigger value="json-import" className="flex-1">استيراد JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40"><SelectValue placeholder="التصنيف" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                {categoryOptions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto scrollbar-thin">
            {filteredProviders.map((prov, i) => (
              <motion.div key={prov.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                <Card className="admin-card border-0 shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {prov.icon ? (
                          <img src={prov.icon} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: prov.color + '20' }}>
                            <Server className="w-5 h-5" style={{ color: prov.color }} />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{prov.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {categoryOptions.find(c => c.value === prov.categoryId)?.label || prov.categoryId}
                          </p>
                          {prov.inputLabel && <p className="text-xs text-muted-foreground">حقل: {prov.inputLabel} ({prov.inputType})</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={prov.isActive !== false}
                          onCheckedChange={(v) => update(ref(database), { [`providers/${prov.id}/isActive`]: v, [`adminSettings/visibility/providers/${prov.id}`]: v })}
                        />
                        <Badge className={prov.isActive !== false ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'}>
                          {prov.isActive !== false ? 'نشط' : 'معطل'}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setEditing(prov);
                          setName(prov.name); setCategoryId(prov.categoryId || 'telecom');
                          setColor(prov.color || '#6C3CE1'); setIcon(prov.icon || '');
                          setInputLabel(prov.inputLabel || 'رقم الهاتف'); setInputType(prov.inputType || 'phone');
                          setInputPrefix(prov.inputPrefix || ''); setIsActive(prov.isActive !== false);
                          setDialog(true);
                        }}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(prov.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {filteredProviders.length === 0 && <p className="text-center text-muted-foreground py-8">لا توجد مزودين</p>}
          </div>
        </TabsContent>

        {/* JSON Import Tab */}
        <TabsContent value="json-import" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="admin-card border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-purple-500" />
                  استيراد مزود وباقاته من JSON
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  الصق JSON الخاص بالمزود وسيتم استخراج المتغيرات والباقات تلقائياً
                </p>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                {/* Category selection */}
                <div>
                  <Label>تصنيف المزود</Label>
                  <Select value={jsonImportCategory} onValueChange={setJsonImportCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* JSON Input */}
                <div>
                  <Label>JSON المزود</Label>
                  <Textarea
                    value={jsonInput}
                    onChange={(e) => { setJsonInput(e.target.value); setJsonError(''); setJsonPreview(null); }}
                    className="min-h-[200px] font-mono text-xs"
                    dir="ltr"
                    placeholder={`{
  "provider": {
    "name": "يمن موبايل",
    "icon": "https://...",
    "color": "#C41E3A"
  },
  "products": [
    { "name": "شحنة 100", "price": 100, "currency": "YER" },
    { "name": "شحنة 200", "price": 200, "currency": "YER" }
  ]
}`}
                  />
                </div>

                {/* Supported formats info */}
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">الصيغ المدعومة:</p>
                  <div className="text-xs text-muted-foreground space-y-1" dir="ltr">
                    <p>1. {'{ "provider": {...}, "products": [...] }'}</p>
                    <p>2. {'{ "name": "...", "products": [...] }'}</p>
                    <p>3. {'[{ "name": "باقة", "price": 100 }, ...]'}</p>
                    <p>4. API response with nested arrays</p>
                  </div>
                </div>

                {/* Parse button */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={parseJsonImport} disabled={!jsonInput.trim()}>
                    <FileJson className="w-4 h-4 ml-1" /> تحليل JSON
                  </Button>
                  {jsonPreview && (
                    <Button onClick={handleJsonImport} disabled={jsonImporting} className="bg-green-600 hover:bg-green-700">
                      {jsonImporting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-1" /> : <CheckCircle className="w-4 h-4 ml-1" />}
                      استيراد ({jsonPreview.packages.length} باقة)
                    </Button>
                  )}
                </div>

                {/* Error */}
                {jsonError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-xs text-red-600 dark:text-red-400">{jsonError}</p>
                  </div>
                )}

                {/* Preview */}
                {jsonPreview && (
                  <div className="space-y-3 border border-green-500/20 rounded-xl p-4 bg-green-500/5">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-sm text-green-600 dark:text-green-400">تم التعرف على البيانات بنجاح</span>
                    </div>
                    
                    {/* Provider preview */}
                    <div className="p-3 rounded-xl bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">المزود:</p>
                      <div className="flex items-center gap-2">
                        {jsonPreview.provider.icon && (
                          <img src={jsonPreview.provider.icon} className="w-8 h-8 rounded-lg object-cover" alt="" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{jsonPreview.provider.name}</p>
                          <p className="text-xs text-muted-foreground">{categoryOptions.find(c => c.value === jsonImportCategory)?.label}</p>
                        </div>
                      </div>
                    </div>

                    {/* Packages preview */}
                    <div className="p-3 rounded-xl bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-2">الباقات ({jsonPreview.packages.length}):</p>
                      <div className="space-y-1 max-h-[200px] overflow-y-auto">
                        {jsonPreview.packages.map((pkg, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-purple-500" />
                              <span className="text-xs">{pkg.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold">{pkg.price}</span>
                              <span className="text-xs text-muted-foreground">{pkg.currency}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Provider Dialog */}
      <Dialog open={dialog} onOpenChange={(open) => { setDialog(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'تعديل مزود' : 'إضافة مزود'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>الاسم</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>التصنيف</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>اللون</Label><Input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></div>
            <div>
              <Label>الأيقونة</Label>
              <div className="flex items-center gap-3 mt-1">
                {icon && <img src={icon} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                <Button variant="outline" size="sm" asChild>
                  <label><Upload className="w-4 h-4 ml-1" /> رفع أيقونة<input type="file" accept="image/*" className="hidden" onChange={handleIconUpload} /></label>
                </Button>
                {icon && <Button variant="ghost" size="sm" onClick={() => setIcon('')}><Trash2 className="w-4 h-4" /></Button>}
              </div>
            </div>
            <div><Label>تسمية الحقل</Label><Input value={inputLabel} onChange={(e) => setInputLabel(e.target.value)} /></div>
            <div><Label>نوع الحقل</Label>
              <Select value={inputType} onValueChange={setInputType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">هاتف</SelectItem>
                  <SelectItem value="text">نص</SelectItem>
                  <SelectItem value="number">رقم</SelectItem>
                  <SelectItem value="account">حساب</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>بادئة الحقل</Label><Input value={inputPrefix} onChange={(e) => setInputPrefix(e.target.value)} dir="ltr" placeholder="مثال: 967" /></div>
            <div className="flex items-center gap-2"><Switch checked={isActive} onCheckedChange={setIsActive} /><Label>نشط</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialog(false); resetForm(); }}>إلغاء</Button>
            <Button onClick={handleSave}>{editing ? 'تحديث' : 'إضافة'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
