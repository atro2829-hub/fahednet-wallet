'use client';

import { useState, useEffect, useRef } from 'react';
import { ref, onValue, push, update, remove, set, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAdminStore } from '@/lib/store';
import { formatNumber, formatDateAr, generateId } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Bell, Send, Loader2, Save, Eye, Palette, Zap, Clock, Users, User, Plus, Trash2, Image, Volume2, ExternalLink, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import { sendFCMDirect } from '@/lib/fcm-sender';

// --- Types ---
interface ActionButton {
  id: string;
  label: string;
  action: string;
  color: string;
  deepLink: string;
}

interface NotificationTemplate {
  id: string;
  title: string;
  body: string;
  icon: string;
  image: string;
  color: string;
  sound: string;
  priority: 'default' | 'high' | 'max';
  channel: string;
  clickAction: string;
  buttons: ActionButton[];
  targetType: 'all' | 'specific' | 'segment';
  targetSegment: string;
  targetUserId: string;
  targetPhone: string;
  type: 'info' | 'transaction' | 'security' | 'promo';
  isTemplate: boolean;
  templateName: string;
  scheduledAt: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

interface NotificationHistoryItem {
  id?: string;
  title: string;
  body: string;
  type: 'info' | 'transaction' | 'security' | 'promo';
  targetType: 'all' | 'specific' | 'segment';
  targetSegment?: string;
  icon?: string;
  image?: string;
  color?: string;
  priority?: string;
  clickAction?: string;
  buttons?: ActionButton[];
  sentAt: string;
  sentBy: string;
  sentByName: string;
  recipientCount?: number;
  deliveryCount?: number;
  status?: string;
  scheduledAt?: string;
}

// --- Helpers ---
const TYPE_LABELS: Record<string, string> = {
  info: 'معلومات',
  transaction: 'معاملة',
  security: 'أمان',
  promo: 'ترويجي',
};
const TYPE_COLORS: Record<string, string> = {
  info: 'bg-blue-500/20 text-blue-600',
  transaction: 'bg-green-500/20 text-green-600',
  security: 'bg-red-500/20 text-red-600',
  promo: 'bg-purple-500/20 text-purple-600',
};
const PRIORITY_LABELS: Record<string, string> = {
  default: 'عادي',
  high: 'مرتفع',
  max: 'أقصى',
};
const SEGMENT_LABELS: Record<string, string> = {
  verified: 'موثقين',
  active: 'نشطين',
  blocked: 'محظورين',
  'non-kyc': 'غير موثقين',
};

const BUTTON_PRESETS: { label: string; buttons: ActionButton[] }[] = [
  {
    label: 'قبول / رفض',
    buttons: [
      { id: 'accept', label: 'قبول', action: 'accept', color: '#22c55e', deepLink: '' },
      { id: 'reject', label: 'رفض', action: 'reject', color: '#ef4444', deepLink: '' },
    ],
  },
  {
    label: 'فتح / تجاهل',
    buttons: [
      { id: 'open', label: 'فتح', action: 'open', color: '#3b82f6', deepLink: '' },
      { id: 'dismiss', label: 'تجاهل', action: 'dismiss', color: '#6b7280', deepLink: '' },
    ],
  },
];

function createEmptyButton(): ActionButton {
  return {
    id: generateId(),
    label: '',
    action: '',
    color: '#6C3CE1',
    deepLink: '',
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// --- Component ---
export default function AdvancedNotificationsPanel() {
  const { adminUser, showToast } = useAdminStore();

  // Form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [notifType, setNotifType] = useState<'info' | 'transaction' | 'security' | 'promo'>('info');
  const [icon, setIcon] = useState('');
  const [notifImage, setNotifImage] = useState('');
  const [notifColor, setNotifColor] = useState('#6C3CE1');
  const [sound, setSound] = useState('default');
  const [customSoundName, setCustomSoundName] = useState('');
  const [priority, setPriority] = useState<'default' | 'high' | 'max'>('high');
  const [channel, setChannel] = useState('general');
  const [clickAction, setClickAction] = useState('');
  const [headsUp, setHeadsUp] = useState(true);
  const [buttons, setButtons] = useState<ActionButton[]>([]);
  const [targetType, setTargetType] = useState<'all' | 'specific' | 'segment'>('all');
  const [targetSegment, setTargetSegment] = useState('verified');
  const [targetUserId, setTargetUserId] = useState('');
  const [targetPhone, setTargetPhone] = useState('');
  const [sendNow, setSendNow] = useState(true);
  const [scheduledAt, setScheduledAt] = useState('');
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [sending, setSending] = useState(false);

  // Data
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [history, setHistory] = useState<NotificationHistoryItem[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('create');

  // History filters
  const [historyTypeFilter, setHistoryTypeFilter] = useState<string>('all');
  const [historyDateFilter, setHistoryDateFilter] = useState('');

  // Template dialog
  const [editTemplateDialog, setEditTemplateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);

  // File input refs
  const iconInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // --- Load data ---
  useEffect(() => {
    const templatesRef = ref(database, 'adminSettings/advancedNotificationTemplates');
    const unsub1 = onValue(templatesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list: NotificationTemplate[] = Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val }));
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTemplates(list);
    });

    const histRef = ref(database, 'adminNotifications');
    const unsub2 = onValue(histRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list: NotificationHistoryItem[] = Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val }));
      list.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
      setHistory(list);
      setLoading(false);
    });

    const usersRef = ref(database, 'users');
    const unsub3 = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([uid, val]: [string, any]) => ({ uid, ...val }));
      setUsers(list);
    });

    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  // --- Segment helpers ---
  const getSegmentUsers = () => {
    switch (targetSegment) {
      case 'verified': return users.filter((u) => u.kycStatus === 'verified');
      case 'active': return users.filter((u) => !u.isBlocked && u.lastLogin);
      case 'blocked': return users.filter((u) => u.isBlocked);
      case 'non-kyc': return users.filter((u) => !u.kycStatus || u.kycStatus === 'none');
      default: return users;
    }
  };

  // --- Button management ---
  const addButton = () => {
    if (buttons.length >= 3) return;
    setButtons([...buttons, createEmptyButton()]);
  };

  const removeButton = (idx: number) => {
    setButtons(buttons.filter((_, i) => i !== idx));
  };

  const updateButton = (idx: number, field: keyof ActionButton, value: string) => {
    const updated = [...buttons];
    updated[idx] = { ...updated[idx], [field]: value };
    setButtons(updated);
  };

  const applyPreset = (preset: ActionButton[]) => {
    setButtons(preset.map((b) => ({ ...b, id: generateId() })));
  };

  // --- File uploads ---
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setIcon(base64);
    } catch {
      showToast('فشل في تحميل الأيقونة', 'error');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setNotifImage(base64);
    } catch {
      showToast('فشل في تحميل الصورة', 'error');
    }
  };

  // --- Reset form ---
  const resetForm = () => {
    setTitle('');
    setBody('');
    setNotifType('info');
    setIcon('');
    setNotifImage('');
    setNotifColor('#6C3CE1');
    setSound('default');
    setCustomSoundName('');
    setPriority('high');
    setChannel('general');
    setClickAction('');
    setHeadsUp(true);
    setButtons([]);
    setTargetType('all');
    setTargetSegment('verified');
    setTargetUserId('');
    setTargetPhone('');
    setSendNow(true);
    setScheduledAt('');
    setSaveAsTemplate(false);
    setTemplateName('');
  };

  // --- Load template into form ---
  const loadTemplate = (tpl: NotificationTemplate) => {
    setTitle(tpl.title);
    setBody(tpl.body);
    setNotifType(tpl.type);
    setIcon(tpl.icon);
    setNotifImage(tpl.image);
    setNotifColor(tpl.color);
    setSound(tpl.sound);
    setCustomSoundName(tpl.sound !== 'default' ? tpl.sound : '');
    setPriority(tpl.priority);
    setChannel(tpl.channel);
    setClickAction(tpl.clickAction);
    setHeadsUp(tpl.priority === 'high' || tpl.priority === 'max');
    setButtons(tpl.buttons ? [...tpl.buttons] : []);
    setTargetType(tpl.targetType);
    setTargetSegment(tpl.targetSegment);
    setTargetUserId(tpl.targetUserId);
    setTargetPhone(tpl.targetPhone);
    setActiveTab('create');
    showToast('تم تحميل القالب', 'success');
  };

  // --- Delete template ---
  const deleteTemplate = async (tplId: string) => {
    try {
      await remove(ref(database, `adminSettings/advancedNotificationTemplates/${tplId}`));
      showToast('تم حذف القالب', 'success');
    } catch {
      showToast('فشل في حذف القالب', 'error');
    }
  };

  // --- Save template ---
  const saveTemplateToDb = async (tplData: Omit<NotificationTemplate, 'id'>) => {
    const newRef = push(ref(database, 'adminSettings/advancedNotificationTemplates'));
    const id = newRef.key || generateId();
    await set(newRef, { ...tplData, id });
    return id;
  };

  const updateTemplateInDb = async (tplId: string, tplData: Partial<NotificationTemplate>) => {
    await update(ref(database, `adminSettings/advancedNotificationTemplates/${tplId}`), tplData);
  };

  // --- Build FCM Android config ---
  const buildAndroidConfig = () => {
    const effectivePriority = headsUp ? 'high' : priority;
    const effectiveSound = sound === 'custom' ? customSoundName : 'default';

    const androidPriority = effectivePriority === 'max' ? 'high' : effectivePriority === 'high' ? 'high' : 'normal';
    const notificationPriority = effectivePriority === 'max' ? 'PRIORITY_MAX' : effectivePriority === 'high' ? 'PRIORITY_HIGH' : 'PRIORITY_DEFAULT';

    return {
      priority: androidPriority,
      notification: {
        color: notifColor,
        sound: effectiveSound,
        click_action: clickAction || undefined,
        icon: '@drawable/ic_notification',
        channel_id: channel,
        notification_priority: notificationPriority,
        default_sound: effectiveSound === 'default',
        default_vibrate_timings: false,
        vibrate_timings: effectivePriority === 'max'
          ? [0.0, 0.2, 0.1, 0.2, 0.1, 0.2]
          : effectivePriority === 'high'
          ? [0.0, 0.1, 0.05, 0.1, 0.05, 0.1]
          : [0.0, 0.1],
        visibility: 'private' as const,
        sticky: false,
        local_only: false,
        ticker: body,
        tag: notifType,
      },
    };
  };

  // --- Send notification ---
  const handleSend = async () => {
    if (!title || !body) {
      showToast('يرجى ملء العنوان والمحتوى', 'error');
      return;
    }

    if (!sendNow && !scheduledAt) {
      showToast('يرجى تحديد وقت الجدولة', 'error');
      return;
    }

    if (saveAsTemplate && !templateName) {
      showToast('يرجى إدخال اسم القالب', 'error');
      return;
    }

    if (targetType === 'specific' && !targetUserId && !targetPhone) {
      showToast('يرجى إدخال معرف المستخدم أو رقم الهاتف', 'error');
      return;
    }

    setSending(true);
    try {
      const notifId = generateId();
      const effectivePriority = headsUp ? 'high' : priority;
      const effectiveSound = sound === 'custom' ? customSoundName : 'default';
      const now = new Date().toISOString();

      // Base notification data
      const notifData: Record<string, any> = {
        id: notifId,
        title,
        body,
        type: notifType,
        icon: icon || '',
        image: notifImage || '',
        color: notifColor,
        sound: effectiveSound,
        priority: effectivePriority,
        channel,
        clickAction: clickAction || '',
        buttons: buttons.filter((b) => b.label && b.action),
        targetType,
        targetSegment: targetType === 'segment' ? targetSegment : '',
        targetUserId: targetType === 'specific' ? targetUserId : '',
        targetPhone: targetType === 'specific' ? targetPhone : '',
        sentAt: now,
        sentBy: adminUser?.uid || '',
        sentByName: adminUser?.displayName || '',
        status: sendNow ? 'sent' : 'scheduled',
        scheduledAt: sendNow ? '' : scheduledAt,
        recipientCount: 0,
        deliveryCount: 0,
      };

      // Determine target users
      let targetUsers: any[] = [];
      if (targetType === 'all') {
        targetUsers = users;
      } else if (targetType === 'segment') {
        targetUsers = getSegmentUsers();
      } else if (targetType === 'specific') {
        let foundUser = null;
        if (targetUserId) foundUser = users.find((u) => u.uid === targetUserId || u.userId === targetUserId);
        else if (targetPhone) foundUser = users.find((u) => u.phone === targetPhone);
        if (!foundUser) {
          showToast('لم يتم العثور على المستخدم', 'error');
          setSending(false);
          return;
        }
        targetUsers = [foundUser];
      }

      notifData.recipientCount = targetUsers.length;

      // 1. Save to adminNotifications/{id} for history
      await set(ref(database, `adminNotifications/${notifId}`), notifData);

      // 2. Save to notifications/{userId}/{id} for each targeted user
      let deliveryCount = 0;
      const batchSize = 50;
      for (let i = 0; i < targetUsers.length; i += batchSize) {
        const batch = targetUsers.slice(i, i + batchSize);
        const updates: Record<string, any> = {};
        batch.forEach((user) => {
          updates[`notifications/${user.uid}/${notifId}`] = {
            id: notifId,
            title,
            body,
            type: notifType,
            icon: icon || '',
            image: notifImage || '',
            color: notifColor,
            clickAction: clickAction || '',
            buttons: buttons.filter((b) => b.label && b.action),
            isRead: false,
            createdAt: now,
          };
          deliveryCount++;
        });
        await update(ref(database), updates);
      }

      // 3. Send via FCM
      if (sendNow) {
        try {
          const tokens: string[] = [];
          targetUsers.forEach((user) => {
            if (user.fcmToken) tokens.push(user.fcmToken);
          });
          if (tokens.length > 0) {
            const androidConfig = buildAndroidConfig();
            const fcmData: Record<string, any> = {
              type: notifType,
              title,
              body,
              click_action: clickAction || '/',
              notificationId: notifId,
              color: notifColor,
              priority: effectivePriority,
              sound: effectiveSound,
              buttons: JSON.stringify(buttons.filter((b) => b.label && b.action)),
            };

            // We use sendFCMDirect for the actual sending, but we need custom android config
            // sendFCMDirect accepts tokens, title, body, type, and data
            await sendFCMDirect(tokens, title, body, notifType, fcmData);
          }
        } catch (pushError) {
          console.warn('FCM push failed:', pushError);
        }
      }

      // Update delivery count
      await update(ref(database, `adminNotifications/${notifId}`), { deliveryCount });

      // 4. Save as template if requested
      if (saveAsTemplate && templateName) {
        await saveTemplateToDb({
          title,
          body,
          type: notifType,
          icon: icon || '',
          image: notifImage || '',
          color: notifColor,
          sound: effectiveSound,
          priority: effectivePriority,
          channel,
          clickAction: clickAction || '',
          buttons: buttons.filter((b) => b.label && b.action),
          targetType,
          targetSegment,
          targetUserId,
          targetPhone,
          isTemplate: true,
          templateName,
          scheduledAt: '',
          isActive: true,
          createdAt: now,
          createdBy: adminUser?.uid || '',
        });
        showToast('تم حفظ القالب وإرسال الإشعار', 'success');
      } else {
        showToast(
          sendNow
            ? `تم إرسال الإشعار لـ ${targetUsers.length} مستخدم`
            : `تم جدولة الإشعار`,
          'success'
        );
      }

      resetForm();
    } catch (e) {
      console.error('Send error:', e);
      showToast('حدث خطأ في إرسال الإشعار', 'error');
    } finally {
      setSending(false);
    }
  };

  // --- Save template only (without sending) ---
  const handleSaveTemplateOnly = async () => {
    if (!title || !body) {
      showToast('يرجى ملء العنوان والمحتوى', 'error');
      return;
    }
    if (!templateName) {
      showToast('يرجى إدخال اسم القالب', 'error');
      return;
    }
    try {
      const effectivePriority = headsUp ? 'high' : priority;
      const effectiveSound = sound === 'custom' ? customSoundName : 'default';
      const now = new Date().toISOString();

      await saveTemplateToDb({
        title,
        body,
        type: notifType,
        icon: icon || '',
        image: notifImage || '',
        color: notifColor,
        sound: effectiveSound,
        priority: effectivePriority,
        channel,
        clickAction: clickAction || '',
        buttons: buttons.filter((b) => b.label && b.action),
        targetType,
        targetSegment,
        targetUserId,
        targetPhone,
        isTemplate: true,
        templateName,
        scheduledAt: '',
        isActive: true,
        createdAt: now,
        createdBy: adminUser?.uid || '',
      });

      showToast('تم حفظ القالب بنجاح', 'success');
      setSaveAsTemplate(false);
      setTemplateName('');
    } catch {
      showToast('فشل في حفظ القالب', 'error');
    }
  };

  // --- Edit template dialog ---
  const openEditTemplate = (tpl: NotificationTemplate) => {
    setEditingTemplate({ ...tpl });
    setEditTemplateDialog(true);
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;
    try {
      await updateTemplateInDb(editingTemplate.id, {
        title: editingTemplate.title,
        body: editingTemplate.body,
        type: editingTemplate.type,
        icon: editingTemplate.icon,
        image: editingTemplate.image,
        color: editingTemplate.color,
        sound: editingTemplate.sound,
        priority: editingTemplate.priority,
        channel: editingTemplate.channel,
        clickAction: editingTemplate.clickAction,
        buttons: editingTemplate.buttons,
        templateName: editingTemplate.templateName,
        targetType: editingTemplate.targetType,
        targetSegment: editingTemplate.targetSegment,
        targetUserId: editingTemplate.targetUserId,
        targetPhone: editingTemplate.targetPhone,
      });
      setEditTemplateDialog(false);
      setEditingTemplate(null);
      showToast('تم تحديث القالب', 'success');
    } catch {
      showToast('فشل في تحديث القالب', 'error');
    }
  };

  // --- Filtered history ---
  const filteredHistory = history.filter((n) => {
    if (historyTypeFilter !== 'all' && n.type !== historyTypeFilter) return false;
    if (historyDateFilter && n.sentAt) {
      const notifDate = new Date(n.sentAt).toISOString().split('T')[0];
      if (notifDate !== historyDateFilter) return false;
    }
    return true;
  });

  // --- Section wrapper ---
  const SectionCard = ({ icon: Icon, title: sectionTitle, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
    <Card className="admin-card border-0 shadow-none">
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="w-4 h-4 text-purple-500" />
          {sectionTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {children}
      </CardContent>
    </Card>
  );

  // --- Notification Preview ---
  const NotificationPreview = () => (
    <Card className="admin-card border-0 shadow-none">
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-500" />
          معاينة الإشعار
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="rounded-xl overflow-hidden border border-border/50 bg-background shadow-md max-w-sm mx-auto">
          {/* Status bar area */}
          <div className="h-6 bg-gray-900 dark:bg-gray-800 flex items-center px-3">
            <span className="text-[8px] text-gray-400">9:41</span>
          </div>
          {/* Notification content */}
          <div className="p-3 bg-white dark:bg-gray-900" style={{ borderRight: `4px solid ${notifColor}` }}>
            <div className="flex items-start gap-2">
              {/* App icon */}
              <div
                className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: notifColor }}
              >
                {icon ? (
                  <img src={icon} alt="icon" className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground truncate">{title || 'عنوان الإشعار'}</span>
                  <span className="text-[10px] text-muted-foreground mr-1 flex-shrink-0">الآن</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-3">
                  {body || 'محتوى الإشعار سيظهر هنا...'}
                </p>
                {/* Large image */}
                {notifImage && (
                  <div className="mt-2 rounded-lg overflow-hidden">
                    <img src={notifImage} alt="notification" className="w-full h-24 object-cover" />
                  </div>
                )}
              </div>
            </div>
            {/* Action buttons preview */}
            {buttons.filter((b) => b.label).length > 0 && (
              <div className="flex items-center gap-2 mt-2 mr-10">
                {buttons.filter((b) => b.label).map((btn, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md text-white font-medium"
                    style={{ backgroundColor: btn.color || notifColor }}
                  >
                    {btn.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="w-6 h-6 text-purple-500" />
          الإشعارات المتقدمة
        </h1>
        <p className="text-muted-foreground text-sm mt-1">تحكم كامل في شكل وسلوك الإشعارات</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="create" className="flex-1 gap-1">
            <Send className="w-4 h-4" />
            إنشاء إشعار
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex-1 gap-1">
            <Layout className="w-4 h-4" />
            القوالب
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 gap-1">
            <Clock className="w-4 h-4" />
            السجل
          </TabsTrigger>
        </TabsList>

        {/* ==================== CREATE TAB ==================== */}
        <TabsContent value="create" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left column - Form */}
            <div className="lg:col-span-2 space-y-4">

              {/* Content Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <SectionCard icon={Bell} title="المحتوى">
                  <div>
                    <Label>عنوان الإشعار</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="أدخل عنوان الإشعار..." />
                  </div>
                  <div>
                    <Label>محتوى الإشعار</Label>
                    <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="أدخل محتوى الإشعار..." className="min-h-[100px]" />
                  </div>
                  <div>
                    <Label>نوع الإشعار</Label>
                    <Select value={notifType} onValueChange={(v: any) => setNotifType(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">معلومات</SelectItem>
                        <SelectItem value="transaction">معاملة</SelectItem>
                        <SelectItem value="security">أمان</SelectItem>
                        <SelectItem value="promo">ترويجي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </SectionCard>
              </motion.div>

              {/* Appearance Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <SectionCard icon={Palette} title="المظهر">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>أيقونة مخصصة</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          ref={iconInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleIconUpload}
                          className="hidden"
                        />
                        <Button variant="outline" size="sm" onClick={() => iconInputRef.current?.click()} className="flex-shrink-0">
                          <Image className="w-4 h-4 ml-1" />
                          رفع أيقونة
                        </Button>
                        {icon && (
                          <div className="flex items-center gap-1">
                            <img src={icon} alt="icon" className="w-8 h-8 rounded object-cover" />
                            <Button variant="ghost" size="sm" onClick={() => setIcon('')}>
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>صورة كبيرة مرفقة</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button variant="outline" size="sm" onClick={() => imageInputRef.current?.click()} className="flex-shrink-0">
                          <Image className="w-4 h-4 ml-1" />
                          رفع صورة
                        </Button>
                        {notifImage && (
                          <div className="flex items-center gap-1">
                            <img src={notifImage} alt="preview" className="w-8 h-8 rounded object-cover" />
                            <Button variant="ghost" size="sm" onClick={() => setNotifImage('')}>
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>لون الإشعار</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={notifColor}
                        onChange={(e) => setNotifColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                      />
                      <Input
                        value={notifColor}
                        onChange={(e) => setNotifColor(e.target.value)}
                        dir="ltr"
                        className="w-32"
                        placeholder="#6C3CE1"
                      />
                    </div>
                  </div>
                </SectionCard>
              </motion.div>

              {/* Behavior Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <SectionCard icon={Zap} title="السلوك">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>الأولوية</Label>
                      <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">عادي</SelectItem>
                          <SelectItem value="high">مرتفع</SelectItem>
                          <SelectItem value="max">أقصى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>الصوت</Label>
                      <Select value={sound} onValueChange={setSound}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">افتراضي</SelectItem>
                          <SelectItem value="custom">مخصص</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {sound === 'custom' && (
                    <div>
                      <Label>اسم ملف الصوت</Label>
                      <Input
                        value={customSoundName}
                        onChange={(e) => setCustomSoundName(e.target.value)}
                        dir="ltr"
                        placeholder="مثال: promo_sound"
                      />
                    </div>
                  )}
                  <div>
                    <Label>إجراء النقر / رابط عميق</Label>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <Input
                        value={clickAction}
                        onChange={(e) => setClickAction(e.target.value)}
                        dir="ltr"
                        placeholder="مثال: /transactions أو اسم الشاشة"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>قناة الإشعار</Label>
                    <Select value={channel} onValueChange={setChannel}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">عام</SelectItem>
                        <SelectItem value="transfers">تحويلات</SelectItem>
                        <SelectItem value="security">أمان</SelectItem>
                        <SelectItem value="promo">ترويجي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>إشعار عائم (Heads-up)</Label>
                      <p className="text-xs text-muted-foreground">يظهر الإشعار كشريط عائم في أعلى الشاشة</p>
                    </div>
                    <Switch
                      checked={headsUp}
                      onCheckedChange={(checked) => {
                        setHeadsUp(checked);
                        if (checked && priority === 'default') {
                          setPriority('high');
                        }
                      }}
                    />
                  </div>
                </SectionCard>
              </motion.div>

              {/* Action Buttons Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <SectionCard icon={Plus} title="الأزرار">
                  {/* Presets */}
                  {buttons.length === 0 && (
                    <div>
                      <Label className="text-xs text-muted-foreground">تطبيق قالب أزرار جاهز</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {BUTTON_PRESETS.map((preset, idx) => (
                          <Button key={idx} variant="outline" size="sm" onClick={() => applyPreset(preset.buttons)}>
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Button list */}
                  <div className="space-y-3">
                    {buttons.map((btn, idx) => (
                      <div key={btn.id} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">عنوان الزر</Label>
                              <Input
                                value={btn.label}
                                onChange={(e) => updateButton(idx, 'label', e.target.value)}
                                placeholder="قبول"
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">معرف الإجراء</Label>
                              <Input
                                value={btn.action}
                                onChange={(e) => updateButton(idx, 'action', e.target.value)}
                                placeholder="accept"
                                dir="ltr"
                                className="h-8 text-sm"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">لون الزر</Label>
                              <div className="flex items-center gap-1">
                                <input
                                  type="color"
                                  value={btn.color}
                                  onChange={(e) => updateButton(idx, 'color', e.target.value)}
                                  className="w-6 h-6 rounded border-0 cursor-pointer"
                                />
                                <Input
                                  value={btn.color}
                                  onChange={(e) => updateButton(idx, 'color', e.target.value)}
                                  dir="ltr"
                                  className="h-7 text-xs flex-1"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs">رابط عميق (اختياري)</Label>
                              <Input
                                value={btn.deepLink}
                                onChange={(e) => updateButton(idx, 'deepLink', e.target.value)}
                                placeholder="/screen"
                                dir="ltr"
                                className="h-8 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeButton(idx)} className="mt-4 flex-shrink-0">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {buttons.length < 3 && (
                    <Button variant="outline" size="sm" onClick={addButton} className="w-full">
                      <Plus className="w-4 h-4 ml-1" />
                      إضافة زر ({buttons.length}/3)
                    </Button>
                  )}
                </SectionCard>
              </motion.div>

              {/* Targeting Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <SectionCard icon={Users} title="الاستهداف">
                  <div>
                    <Label>نوع الاستهداف</Label>
                    <Select value={targetType} onValueChange={(v: any) => setTargetType(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center gap-2"><Users className="w-4 h-4" /> لجميع المستخدمين</div>
                        </SelectItem>
                        <SelectItem value="specific">
                          <div className="flex items-center gap-2"><User className="w-4 h-4" /> لمستخدم محدد</div>
                        </SelectItem>
                        <SelectItem value="segment">
                          <div className="flex items-center gap-2"><Users className="w-4 h-4" /> لشريحة محددة</div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {targetType === 'specific' && (
                    <div className="space-y-2">
                      <div>
                        <Label>معرف المستخدم</Label>
                        <Input value={targetUserId} onChange={(e) => setTargetUserId(e.target.value)} dir="ltr" placeholder="UID أو userId" />
                      </div>
                      <div className="text-center text-xs text-muted-foreground">أو</div>
                      <div>
                        <Label>رقم الهاتف</Label>
                        <Input value={targetPhone} onChange={(e) => setTargetPhone(e.target.value)} dir="ltr" placeholder="+967..." />
                      </div>
                    </div>
                  )}

                  {targetType === 'segment' && (
                    <div>
                      <Label>الشريحة المستهدفة</Label>
                      <Select value={targetSegment} onValueChange={setTargetSegment}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="verified">موثقين</SelectItem>
                          <SelectItem value="active">نشطين</SelectItem>
                          <SelectItem value="blocked">محظورين</SelectItem>
                          <SelectItem value="non-kyc">غير موثقين</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatNumber(getSegmentUsers().length)} مستخدم في الشريحة
                      </p>
                    </div>
                  )}
                </SectionCard>
              </motion.div>

              {/* Scheduling Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <SectionCard icon={Clock} title="الجدولة">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>إرسال الآن</Label>
                      <p className="text-xs text-muted-foreground">إرسال فوري عند الضغط على زر الإرسال</p>
                    </div>
                    <Switch checked={sendNow} onCheckedChange={setSendNow} />
                  </div>
                  {!sendNow && (
                    <div>
                      <Label>وقت الإرسال المجدول</Label>
                      <Input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        dir="ltr"
                      />
                    </div>
                  )}
                </SectionCard>
              </motion.div>

              {/* Save as Template Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <SectionCard icon={Save} title="حفظ كقالب">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>حفظ كقالب قابل لإعادة الاستخدام</Label>
                      <p className="text-xs text-muted-foreground">سيتم حفظ الإعدادات الحالية كقالب</p>
                    </div>
                    <Switch checked={saveAsTemplate} onCheckedChange={setSaveAsTemplate} />
                  </div>
                  {saveAsTemplate && (
                    <div>
                      <Label>اسم القالب</Label>
                      <Input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="أدخل اسم القالب..."
                      />
                    </div>
                  )}
                </SectionCard>
              </motion.div>

              {/* Send button */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSend}
                    disabled={sending || !title || !body}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 h-12 text-base"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 ml-2" />
                    )}
                    {sendNow ? 'إرسال الإشعار' : 'جدولة الإشعار'}
                  </Button>
                  {saveAsTemplate && templateName && (
                    <Button
                      onClick={handleSaveTemplateOnly}
                      variant="outline"
                      className="h-12"
                      disabled={!title || !body}
                    >
                      <Save className="w-4 h-4 ml-2" />
                      حفظ القالب فقط
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right column - Preview */}
            <div className="space-y-4">
              <NotificationPreview />
              {/* Quick info */}
              <Card className="admin-card border-0 shadow-none">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">
                      الصوت: {sound === 'default' ? 'افتراضي' : customSoundName || 'مخصص'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">
                      الأولوية: {PRIORITY_LABELS[headsUp && priority === 'default' ? 'high' : priority]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">
                      الاستهداف: {targetType === 'all' ? `الجميع (${users.length})` : targetType === 'segment' ? `شريحة (${getSegmentUsers().length})` : 'مستخدم محدد'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">
                      {sendNow ? 'إرسال فوري' : `مجدول: ${scheduledAt ? new Date(scheduledAt).toLocaleString('ar-SA') : '-'}`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ==================== TEMPLATES TAB ==================== */}
        <TabsContent value="templates" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {templates.length === 0 ? (
              <Card className="admin-card border-0 shadow-none">
                <CardContent className="p-8 text-center">
                  <Layout className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">لا توجد قوالب محفوظة</p>
                  <p className="text-xs text-muted-foreground mt-1">يمكنك حفظ إشعار كقالب من تبويب إنشاء إشعار</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin">
                {templates.map((tpl, i) => (
                  <motion.div key={tpl.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <Card className="admin-card border-0 shadow-none">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div
                              className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                              style={{ backgroundColor: `${tpl.color}20` }}
                            >
                              {tpl.icon ? (
                                <img src={tpl.icon} alt="" className="w-6 h-6 rounded object-cover" />
                              ) : (
                                <Bell className="w-5 h-5" style={{ color: tpl.color }} />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm truncate">{tpl.templateName || tpl.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{tpl.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 truncate">{tpl.body?.substring(0, 80)}{tpl.body?.length > 80 ? '...' : ''}</p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge className={`${TYPE_COLORS[tpl.type] || ''} text-xs`}>{TYPE_LABELS[tpl.type] || tpl.type}</Badge>
                                <Badge className="bg-purple-500/20 text-purple-600 text-xs">{PRIORITY_LABELS[tpl.priority] || tpl.priority}</Badge>
                                {tpl.buttons && tpl.buttons.length > 0 && (
                                  <Badge className="bg-orange-500/20 text-orange-600 text-xs">{tpl.buttons.length} أزرار</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => loadTemplate(tpl)} title="تحميل القالب">
                              <Send className="w-4 h-4 text-green-500" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditTemplate(tpl)} title="تعديل">
                              <Palette className="w-4 h-4 text-blue-500" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteTemplate(tpl.id!)} title="حذف">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </TabsContent>

        {/* ==================== HISTORY TAB ==================== */}
        <TabsContent value="history" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Filters */}
            <Card className="admin-card border-0 shadow-none">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">فلترة حسب النوع</Label>
                    <Select value={historyTypeFilter} onValueChange={setHistoryTypeFilter}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">الكل</SelectItem>
                        <SelectItem value="info">معلومات</SelectItem>
                        <SelectItem value="transaction">معاملة</SelectItem>
                        <SelectItem value="security">أمان</SelectItem>
                        <SelectItem value="promo">ترويجي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">فلترة حسب التاريخ</Label>
                    <Input
                      type="date"
                      value={historyDateFilter}
                      onChange={(e) => setHistoryDateFilter(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History list */}
            {filteredHistory.length === 0 ? (
              <Card className="admin-card border-0 shadow-none">
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">لا يوجد سجل إشعارات</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto scrollbar-thin">
                {filteredHistory.map((notif, i) => (
                  <motion.div key={notif.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                    <Card className="admin-card border-0 shadow-none">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                              {notif.icon ? (
                                <img src={notif.icon} alt="" className="w-6 h-6 rounded object-cover" />
                              ) : (
                                <Bell className="w-5 h-5 text-purple-500" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm truncate">{notif.title}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {notif.body?.substring(0, 80)}{notif.body?.length > 80 ? '...' : ''}
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge className={`${TYPE_COLORS[notif.type] || 'bg-gray-500/20'} text-xs`}>
                                  {TYPE_LABELS[notif.type] || notif.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {notif.targetType === 'all'
                                    ? 'للجميع'
                                    : notif.targetType === 'specific'
                                    ? 'لمستخدم'
                                    : `شريحة: ${SEGMENT_LABELS[notif.targetSegment || ''] || notif.targetSegment}`}
                                </span>
                                {notif.deliveryCount !== undefined && (
                                  <span className="text-xs text-green-600">تم التسليم: {notif.deliveryCount}</span>
                                )}
                                {notif.priority && (
                                  <Badge className="bg-purple-500/20 text-purple-600 text-xs">
                                    {PRIORITY_LABELS[notif.priority] || notif.priority}
                                  </Badge>
                                )}
                                {notif.status === 'scheduled' && (
                                  <Badge className="bg-yellow-500/20 text-yellow-600 text-xs">مجدول</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-left flex-shrink-0">
                            <p className="text-xs text-muted-foreground">{notif.sentAt ? formatDateAr(notif.sentAt) : ''}</p>
                            {notif.recipientCount && (
                              <p className="text-xs text-muted-foreground">({notif.recipientCount} مستلم)</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* ==================== EDIT TEMPLATE DIALOG ==================== */}
      <Dialog open={editTemplateDialog} onOpenChange={setEditTemplateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل القالب</DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-3">
              <div>
                <Label>اسم القالب</Label>
                <Input
                  value={editingTemplate.templateName}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, templateName: e.target.value })}
                />
              </div>
              <div>
                <Label>عنوان الإشعار</Label>
                <Input
                  value={editingTemplate.title}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                />
              </div>
              <div>
                <Label>محتوى الإشعار</Label>
                <Textarea
                  value={editingTemplate.body}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>النوع</Label>
                  <Select
                    value={editingTemplate.type}
                    onValueChange={(v: any) => setEditingTemplate({ ...editingTemplate, type: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">معلومات</SelectItem>
                      <SelectItem value="transaction">معاملة</SelectItem>
                      <SelectItem value="security">أمان</SelectItem>
                      <SelectItem value="promo">ترويجي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>الأولوية</Label>
                  <Select
                    value={editingTemplate.priority}
                    onValueChange={(v: any) => setEditingTemplate({ ...editingTemplate, priority: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">عادي</SelectItem>
                      <SelectItem value="high">مرتفع</SelectItem>
                      <SelectItem value="max">أقصى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>اللون</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editingTemplate.color}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, color: e.target.value })}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <Input
                    value={editingTemplate.color}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, color: e.target.value })}
                    dir="ltr"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTemplateDialog(false)}>إلغاء</Button>
            <Button onClick={handleUpdateTemplate} className="bg-purple-600 hover:bg-purple-700">حفظ التعديلات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
