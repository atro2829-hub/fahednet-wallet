'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, push, update, remove, set } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAdminStore } from '@/lib/store';
import { formatNumber, generateId } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search, ArrowUp, ArrowDown, RotateCcw, Smartphone, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface NetworkPrefix {
  id: string;
  prefix: string;
  networkId: string;
  networkName: string;
  color: string;
  icon: string;
  isActive: boolean;
  order: number;
}

interface TelecomProvider {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  categoryId: string;
}

const DEFAULT_PREFIXES: Omit<NetworkPrefix, 'id'>[] = [
  { prefix: '77', networkId: 'yemen-mobile', networkName: 'يمن موبايل', color: '#C41E3A', icon: '', isActive: true, order: 0 },
  { prefix: '78', networkId: 'yemen-mobile', networkName: 'يمن موبايل', color: '#C41E3A', icon: '', isActive: true, order: 1 },
  { prefix: '73', networkId: 'yemen-mobile', networkName: 'يمن موبايل', color: '#C41E3A', icon: '', isActive: true, order: 2 },
  { prefix: '70', networkId: 'yemen-mobile', networkName: 'يمن موبايل', color: '#C41E3A', icon: '', isActive: true, order: 3 },
  { prefix: '71', networkId: 'yo', networkName: 'يو', color: '#FF6B00', icon: '', isActive: true, order: 4 },
  { prefix: '75', networkId: 'yo', networkName: 'يو', color: '#FF6B00', icon: '', isActive: true, order: 5 },
  { prefix: '74', networkId: 'sabafon', networkName: 'سبأفون', color: '#2563EB', icon: '', isActive: true, order: 6 },
  { prefix: '76', networkId: 'sabafon', networkName: 'سبأفون', color: '#2563EB', icon: '', isActive: true, order: 7 },
  { prefix: '72', networkId: 'y', networkName: 'واي', color: '#059669', icon: '', isActive: true, order: 8 },
  { prefix: '79', networkId: 'y', networkName: 'واي', color: '#059669', icon: '', isActive: true, order: 9 },
];

export default function NetworkPrefixesPanel() {
  const { showToast } = useAdminStore();
  const [prefixes, setPrefixes] = useState<NetworkPrefix[]>([]);
  const [providers, setProviders] = useState<TelecomProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState<NetworkPrefix | null>(null);

  // Form state
  const [formPrefix, setFormPrefix] = useState('');
  const [formNetworkId, setFormNetworkId] = useState('');
  const [formNetworkName, setFormNetworkName] = useState('');
  const [formColor, setFormColor] = useState('#C41E3A');
  const [formIcon, setFormIcon] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formOrder, setFormOrder] = useState(0);

  useEffect(() => {
    const prefixRef = ref(database, 'adminSettings/networkPrefixes');
    const unsub1 = onValue(prefixRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list: NetworkPrefix[] = Object.entries(data).map(([id, val]: [string, any]) => ({
        id,
        ...val,
      }));
      list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setPrefixes(list);
      setLoading(false);
    });

    const provRef = ref(database, 'providers');
    const unsub2 = onValue(provRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list: TelecomProvider[] = Object.entries(data)
        .map(([id, val]: [string, any]) => ({ id, ...val }))
        .filter((p) => p.categoryId === 'telecom');
      setProviders(list);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const resetForm = () => {
    setFormPrefix('');
    setFormNetworkId('');
    setFormNetworkName('');
    setFormColor('#C41E3A');
    setFormIcon('');
    setFormIsActive(true);
    setFormOrder(prefixes.length);
    setEditing(null);
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
      setFormIcon(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formPrefix || !formNetworkId) {
      showToast('يرجى ملء الحقول المطلوبة', 'error');
      return;
    }
    if (formPrefix.length < 2 || formPrefix.length > 3) {
      showToast('البادئة يجب أن تكون 2-3 أرقام', 'error');
      return;
    }

    try {
      const data: Omit<NetworkPrefix, 'id'> = {
        prefix: formPrefix,
        networkId: formNetworkId,
        networkName: formNetworkName,
        color: formColor,
        icon: formIcon,
        isActive: formIsActive,
        order: formOrder,
      };

      if (editing?.id) {
        const updates: Record<string, any> = {
          [`adminSettings/networkPrefixes/${editing.id}`]: { ...data, id: editing.id },
          [`adminSettings/visibility/networkPrefixes/${editing.id}`]: formIsActive,
        };
        await update(ref(database), updates);
        showToast('تم تحديث البادئة', 'success');
      } else {
        const newRef = push(ref(database, 'adminSettings/networkPrefixes'));
        const newId = newRef.key!;
        const updates: Record<string, any> = {
          [`adminSettings/networkPrefixes/${newId}`]: { ...data, id: newId },
          [`adminSettings/visibility/networkPrefixes/${newId}`]: formIsActive,
        };
        await update(ref(database), updates);
        showToast('تم إضافة البادئة', 'success');
      }
      setDialog(false);
      resetForm();
    } catch (e) {
      showToast('حدث خطأ', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const updates: Record<string, any> = {
        [`adminSettings/networkPrefixes/${id}`]: null,
        [`adminSettings/visibility/networkPrefixes/${id}`]: null,
      };
      await update(ref(database), updates);
      showToast('تم حذف البادئة', 'success');
    } catch (e) {
      showToast('حدث خطأ', 'error');
    }
  };

  const handleBulkToggle = async (enable: boolean) => {
    try {
      const updates: Record<string, any> = {};
      filteredPrefixes.forEach((p) => {
        updates[`adminSettings/networkPrefixes/${p.id}/isActive`] = enable;
        updates[`adminSettings/visibility/networkPrefixes/${p.id}`] = enable;
      });
      await update(ref(database), updates);
      showToast(enable ? 'تم تفعيل جميع البادئات' : 'تم تعطيل جميع البادئات', 'success');
    } catch (e) {
      showToast('حدث خطأ', 'error');
    }
  };

  const handleMoveOrder = async (prefix: NetworkPrefix, direction: 'up' | 'down') => {
    const sorted = [...prefixes].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const currentIndex = sorted.findIndex((p) => p.id === prefix.id);
    if (currentIndex === -1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;

    const swapPrefix = sorted[swapIndex];
    try {
      const updates: Record<string, any> = {
        [`adminSettings/networkPrefixes/${prefix.id}/order`]: swapPrefix.order,
        [`adminSettings/networkPrefixes/${swapPrefix.id}/order`]: prefix.order,
      };
      await update(ref(database), updates);
      showToast('تم تحديث الترتيب', 'success');
    } catch (e) {
      showToast('حدث خطأ', 'error');
    }
  };

  const handleInitializeDefaults = async () => {
    try {
      const updates: Record<string, any> = {};
      DEFAULT_PREFIXES.forEach((def) => {
        const newId = generateId();
        updates[`adminSettings/networkPrefixes/${newId}`] = { ...def, id: newId };
        updates[`adminSettings/visibility/networkPrefixes/${newId}`] = def.isActive;
      });
      await update(ref(database), updates);
      showToast('تم تهيئة البادئات الافتراضية', 'success');
    } catch (e) {
      showToast('حدث خطأ أثناء التهيئة', 'error');
    }
  };

  const handleNetworkSelect = (networkId: string) => {
    setFormNetworkId(networkId);
    const provider = providers.find((p) => p.id === networkId);
    if (provider) {
      setFormNetworkName(provider.name);
      if (provider.color) setFormColor(provider.color);
      if (provider.icon) setFormIcon(provider.icon);
    }
  };

  const filteredPrefixes = prefixes.filter(
    (p) =>
      !search ||
      p.prefix?.includes(search) ||
      p.networkName?.includes(search) ||
      p.networkId?.includes(search)
  );

  const sortedPrefixes = [...filteredPrefixes].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

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
          <h1 className="text-2xl font-bold">كشف الشبكة التلقائي</h1>
          <p className="text-muted-foreground text-sm mt-1">ربط بادئات أرقام الهاتف بشبكات الاتصالات</p>
        </div>
        <div className="flex gap-2">
          {prefixes.length === 0 && (
            <Button variant="outline" size="sm" onClick={handleInitializeDefaults}>
              <RotateCcw className="w-4 h-4 ml-1" /> تهيئة الافتراضيات
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => handleBulkToggle(true)}>
            تفعيل الكل
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkToggle(false)}>
            تعطيل الكل
          </Button>
          <Button
            size="sm"
            onClick={() => {
              resetForm();
              setDialog(true);
            }}
          >
            <Plus className="w-4 h-4 ml-1" /> بادئة جديدة
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="بحث بالبادئة أو اسم الشبكة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Empty state with initialize defaults */}
      {prefixes.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="admin-card border-0 shadow-none">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">لا توجد بادئات شبكة</h3>
              <p className="text-sm text-muted-foreground mb-4">
                قم بتهيئة البادئات الافتراضية أو أضف بادئات يدوياً
              </p>
              <Button onClick={handleInitializeDefaults}>
                <RotateCcw className="w-4 h-4 ml-1" /> تهيئة البادئات الافتراضية
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Prefixes list */}
      {prefixes.length > 0 && (
        <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto scrollbar-thin">
          {sortedPrefixes.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
              <Card className="admin-card border-0 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Prefix badge */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: item.color || '#6C3CE1' }}
                      >
                        {item.icon ? (
                          <img src={item.icon} className="w-8 h-8 rounded-lg object-cover" alt="" />
                        ) : (
                          item.prefix
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{item.networkName}</p>
                          <Badge
                            className={item.isActive ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'}
                          >
                            {item.isActive ? 'نشط' : 'معطل'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          البادئة: {item.prefix} • الشبكة: {item.networkId}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Order arrows */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveOrder(item, 'up')}
                        disabled={item.order === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveOrder(item, 'down')}
                        disabled={item.order === prefixes.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>

                      {/* Active toggle */}
                      <Switch
                        checked={item.isActive !== false}
                        onCheckedChange={(v) => {
                          update(ref(database), {
                            [`adminSettings/networkPrefixes/${item.id}/isActive`]: v,
                            [`adminSettings/visibility/networkPrefixes/${item.id}`]: v,
                          });
                        }}
                      />

                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditing(item);
                          setFormPrefix(item.prefix);
                          setFormNetworkId(item.networkId);
                          setFormNetworkName(item.networkName);
                          setFormColor(item.color || '#C41E3A');
                          setFormIcon(item.icon || '');
                          setFormIsActive(item.isActive !== false);
                          setFormOrder(item.order ?? 0);
                          setDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      {/* Delete */}
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {filteredPrefixes.length === 0 && prefixes.length > 0 && (
            <p className="text-center text-muted-foreground py-8">لا توجد نتائج للبحث</p>
          )}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialog} onOpenChange={(open) => { setDialog(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'تعديل بادئة الشبكة' : 'إضافة بادئة شبكة جديدة'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Prefix */}
            <div>
              <Label>البادئة</Label>
              <Input
                value={formPrefix}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val.length <= 3) setFormPrefix(val);
                }}
                dir="ltr"
                placeholder="مثال: 77"
                maxLength={3}
              />
              <p className="text-xs text-muted-foreground mt-1">2-3 أرقام</p>
            </div>

            {/* Network select */}
            <div>
              <Label>الشبكة</Label>
              <Select value={formNetworkId} onValueChange={handleNetworkSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الشبكة" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <div className="flex items-center gap-2">
                        {p.icon && <img src={p.icon} className="w-5 h-5 rounded object-cover" alt="" />}
                        <span>{p.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {providers.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">لا يوجد مزودي اتصالات. أضف مزودين بتصنيف "الاتصالات" أولاً.</p>
              )}
            </div>

            {/* Network name (manual override) */}
            <div>
              <Label>اسم الشبكة</Label>
              <Input
                value={formNetworkName}
                onChange={(e) => setFormNetworkName(e.target.value)}
                placeholder="مثال: يمن موبايل"
              />
            </div>

            {/* Color */}
            <div>
              <Label>اللون</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="color"
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  className="w-12 h-8 p-1 cursor-pointer"
                />
                <Input
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  dir="ltr"
                  className="flex-1 text-xs"
                />
                <div
                  className="w-8 h-8 rounded-lg border"
                  style={{ backgroundColor: formColor }}
                />
              </div>
            </div>

            {/* Icon upload */}
            <div>
              <Label>الأيقونة</Label>
              <div className="flex items-center gap-3 mt-1">
                {formIcon && <img src={formIcon} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                <Button variant="outline" size="sm" asChild>
                  <label>
                    <Upload className="w-4 h-4 ml-1" /> رفع أيقونة
                    <input type="file" accept="image/*" className="hidden" onChange={handleIconUpload} />
                  </label>
                </Button>
                {formIcon && (
                  <Button variant="ghost" size="sm" onClick={() => setFormIcon('')}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Order */}
            <div>
              <Label>الترتيب</Label>
              <Input
                type="number"
                value={formOrder}
                onChange={(e) => setFormOrder(parseInt(e.target.value) || 0)}
                dir="ltr"
                min={0}
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-2">
              <Switch checked={formIsActive} onCheckedChange={setFormIsActive} />
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
