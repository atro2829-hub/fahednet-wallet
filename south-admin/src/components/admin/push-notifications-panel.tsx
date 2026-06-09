'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, push, set, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAdminStore } from '@/lib/store';
import { formatNumber, formatDateAr } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Bell, Loader2, Users, User, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotificationHistory {
  id?: string;
  title: string;
  body: string;
  type: string;
  targetType: 'all' | 'specific' | 'segment';
  targetSegment?: string;
  sentAt: string;
  sentBy: string;
  sentByName: string;
  recipientCount?: number;
  icon?: string;
  data?: string;
  scheduledAt?: string;
}

export default function PushNotificationsPanel() {
  const { adminUser, showToast } = useAdminStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [icon, setIcon] = useState('');
  const [dataUrl, setDataUrl] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'specific' | 'segment'>('all');
  const [targetUserId, setTargetUserId] = useState('');
  const [targetPhone, setTargetPhone] = useState('');
  const [targetSegment, setTargetSegment] = useState('verified');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load notification history
    const histRef = ref(database, 'fcmNotifications');
    const unsub1 = onValue(histRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list: NotificationHistory[] = Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val }));
      list.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
      setHistory(list);
      setLoading(false);
    });

    // Load users for segment targeting
    const usersRef = ref(database, 'users');
    const unsub2 = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([uid, val]: [string, any]) => ({ uid, ...val }));
      setUsers(list);
    });

    return () => { unsub1(); unsub2(); };
  }, []);

  const getSegmentUsers = () => {
    switch (targetSegment) {
      case 'verified':
        return users.filter((u) => u.kycStatus === 'verified');
      case 'active':
        return users.filter((u) => !u.isBlocked && u.lastLogin);
      case 'blocked':
        return users.filter((u) => u.isBlocked);
      case 'non-kyc':
        return users.filter((u) => !u.kycStatus || u.kycStatus === 'none');
      default:
        return users;
    }
  };

  const handleSend = async () => {
    if (!title || !body) {
      showToast('يرجى ملء العنوان والمحتوى', 'error');
      return;
    }
    setSending(true);
    try {
      const notifData: any = {
        title,
        body,
        targetType,
        sentAt: new Date().toISOString(),
        sentBy: adminUser?.uid || '',
        sentByName: adminUser?.displayName || '',
        icon: icon || '',
        data: dataUrl || '',
      };

      if (scheduleEnabled && scheduledAt) {
        notifData.scheduledAt = scheduledAt;
        notifData.status = 'scheduled';
      }

      if (targetType === 'all') {
        // Send to all users - save in FCM notifications
        const fcmRef = await push(ref(database, 'fcmNotifications'), {
          ...notifData,
          type: 'broadcast',
          recipientCount: users.length,
        });

        // Also save to each user's inbox
        const batchSize = 50;
        for (let i = 0; i < users.length; i += batchSize) {
          const batch = users.slice(i, i + batchSize);
          const updates: Record<string, any> = {};
          batch.forEach((user) => {
            const notifId = fcmRef.key || Date.now().toString();
            updates[`notifications/${user.uid}/push/${notifId}`] = {
              title,
              body,
              type: 'broadcast',
              isRead: false,
              createdAt: new Date().toISOString(),
              icon: icon || '',
              data: dataUrl || '',
            };
          });
          await set(ref(database), updates).catch(() => {});
        }

        showToast(`تم إرسال الإشعار لجميع المستخدمين (${users.length})`, 'success');
      } else if (targetType === 'specific') {
        let targetUser = null;
        if (targetUserId) {
          targetUser = users.find((u) => u.uid === targetUserId || u.userId === targetUserId);
        } else if (targetPhone) {
          targetUser = users.find((u) => u.phone === targetPhone);
        }

        if (!targetUser) {
          showToast('لم يتم العثور على المستخدم', 'error');
          setSending(false);
          return;
        }

        await push(ref(database, 'fcmNotifications'), {
          ...notifData,
          type: 'specific',
          targetUid: targetUser.uid,
          recipientCount: 1,
        });

        await push(ref(database, `notifications/${targetUser.uid}/push`), {
          title,
          body,
          type: 'admin',
          isRead: false,
          createdAt: new Date().toISOString(),
          icon: icon || '',
          data: dataUrl || '',
        });

        showToast('تم إرسال الإشعار للمستخدم', 'success');
      } else if (targetType === 'segment') {
        const segmentUsers = getSegmentUsers();

        await push(ref(database, 'fcmNotifications'), {
          ...notifData,
          type: 'segment',
          targetSegment,
          recipientCount: segmentUsers.length,
        });

        // Save to each segment user's inbox
        const batchSize = 50;
        for (let i = 0; i < segmentUsers.length; i += batchSize) {
          const batch = segmentUsers.slice(i, i + batchSize);
          const updates: Record<string, any> = {};
          batch.forEach((user) => {
            updates[`notifications/${user.uid}/push/${Date.now()}_${user.uid}`] = {
              title,
              body,
              type: 'segment',
              isRead: false,
              createdAt: new Date().toISOString(),
              icon: icon || '',
              data: dataUrl || '',
            };
          });
          await set(ref(database), updates).catch(() => {});
        }

        showToast(`تم إرسال الإشعار لـ ${segmentUsers.length} مستخدم`, 'success');
      }

      setTitle('');
      setBody('');
      setIcon('');
      setDataUrl('');
      setTargetUserId('');
      setTargetPhone('');
      setScheduleEnabled(false);
      setScheduledAt('');
    } catch (e) {
      showToast('حدث خطأ في إرسال الإشعار', 'error');
    } finally {
      setSending(false);
    }
  };

  const segmentLabels: Record<string, string> = {
    verified: 'موثقين (KYC)',
    active: 'نشطين',
    blocked: 'محظورين',
    'non-kyc': 'غير موثقين',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إرسال إشعارات</h1>
        <p className="text-muted-foreground text-sm mt-1">إرسال إشعارات فورية للمستخدمين</p>
      </div>

      <Tabs defaultValue="send">
        <TabsList className="w-full">
          <TabsTrigger value="send" className="flex-1">إرسال إشعار</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">سجل الإشعارات</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="admin-card border-0 shadow-none">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10">
                  <Send className="w-6 h-6 text-purple-500" />
                  <div>
                    <p className="font-medium text-sm">إرسال إشعار جديد</p>
                    <p className="text-xs text-muted-foreground">إرسال إشعار فوري أو مجدول للمستخدمين</p>
                  </div>
                </div>

                <div>
                  <Label>نوع الإرسال</Label>
                  <Select value={targetType} onValueChange={(v: any) => setTargetType(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" /> لجميع المستخدمين
                        </div>
                      </SelectItem>
                      <SelectItem value="specific">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" /> لمستخدم محدد
                        </div>
                      </SelectItem>
                      <SelectItem value="segment">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" /> لشريحة محددة
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {targetType === 'specific' && (
                  <div className="space-y-3">
                    <div>
                      <Label>معرف المستخدم (UID أو userId)</Label>
                      <Input value={targetUserId} onChange={(e) => setTargetUserId(e.target.value)} dir="ltr" placeholder="أدخل معرف المستخدم..." />
                    </div>
                    <div className="text-center text-xs text-muted-foreground">أو</div>
                    <div>
                      <Label>رقم الهاتف</Label>
                      <Input value={targetPhone} onChange={(e) => setTargetPhone(e.target.value)} dir="ltr" placeholder="مثال: 967770000000" />
                    </div>
                  </div>
                )}

                {targetType === 'segment' && (
                  <div>
                    <Label>الشريحة المستهدفة</Label>
                    <Select value={targetSegment} onValueChange={setTargetSegment}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verified">موثقين (KYC)</SelectItem>
                        <SelectItem value="active">نشطين</SelectItem>
                        <SelectItem value="blocked">محظورين</SelectItem>
                        <SelectItem value="non-kyc">غير موثقين</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      عدد المستخدمين في هذه الشريحة: {formatNumber(getSegmentUsers().length)}
                    </p>
                  </div>
                )}

                <div>
                  <Label>عنوان الإشعار</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الإشعار..." />
                </div>

                <div>
                  <Label>محتوى الإشعار</Label>
                  <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="محتوى الإشعار..." className="min-h-[120px]" />
                </div>

                <div>
                  <Label>أيقونة الإشعار (رابط صورة - اختياري)</Label>
                  <Input value={icon} onChange={(e) => setIcon(e.target.value)} dir="ltr" placeholder="https://example.com/icon.png" />
                </div>

                <div>
                  <Label>رابط البيانات / URL (اختياري)</Label>
                  <Input value={dataUrl} onChange={(e) => setDataUrl(e.target.value)} dir="ltr" placeholder="https://example.com/page" />
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted">
                  <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
                  <div>
                    <Label>جدولة الإرسال</Label>
                    <p className="text-xs text-muted-foreground">إرسال الإشعار في وقت محدد</p>
                  </div>
                </div>

                {scheduleEnabled && (
                  <div>
                    <Label>وقت الإرسال</Label>
                    <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
                  </div>
                )}

                <Button onClick={handleSend} disabled={sending || !title || !body} className="w-full bg-purple-600 hover:bg-purple-700">
                  {sending ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Send className="w-4 h-4 ml-2" />}
                  {scheduleEnabled ? 'جدولة الإشعار' : 'إرسال الإشعار'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin">
            {history.map((notif, i) => (
              <motion.div key={notif.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                <Card className="admin-card border-0 shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Bell className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{notif.title}</p>
                          <p className="text-xs text-muted-foreground">{notif.body?.substring(0, 60)}...</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs">
                              {notif.targetType === 'all' ? 'للجميع' : notif.targetType === 'specific' ? 'لمستخدم' : `شريحة: ${segmentLabels[notif.targetSegment || ''] || notif.targetSegment}`}
                            </Badge>
                            {notif.recipientCount && (
                              <span className="text-xs text-muted-foreground">({notif.recipientCount} مستلم)</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">{notif.sentAt ? formatDateAr(notif.sentAt) : ''}</p>
                        {notif.scheduledAt && (
                          <Badge className="bg-yellow-500/20 text-yellow-600 text-xs mt-1">
                            <Clock className="w-3 h-3 ml-1" /> مجدول
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {history.length === 0 && (
              <p className="text-center text-muted-foreground py-8">لا يوجد سجل إشعارات</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
