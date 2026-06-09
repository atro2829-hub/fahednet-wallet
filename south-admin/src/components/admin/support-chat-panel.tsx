'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, push, update, off } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAdminStore } from '@/lib/store';
import { timeAgo } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, CheckCircle, Search, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SupportChatPanel() {
  const { adminUser, showToast } = useAdminStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'resolved'>('all');

  useEffect(() => {
    const chatRef = ref(database, 'supportChat');
    const unsub = onValue(chatRef, (snapshot) => {
      const data = snapshot.val() || {};
      const convs = Object.entries(data).map(([ticketId, val]: [string, any]) => ({
        ticketId,
        ...val,
      }));
      convs.sort((a, b) => new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime());
      setConversations(convs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!selectedConv) return;
    const msgRef = ref(database, `supportChat/${selectedConv}/messages`);
    const unsub = onValue(msgRef, (snapshot) => {
      const data = snapshot.val() || {};
      const msgs = Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val }));
      msgs.sort((a, b) => new Date(a.time || 0).getTime() - new Date(b.time || 0).getTime());
      setMessages(msgs);

      // Mark as read by admin
      update(ref(database, `supportChat/${selectedConv}`), { unreadAdmin: 0 }).catch(() => {});
    });
    return () => unsub();
  }, [selectedConv]);

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedConv) return;
    try {
      await push(ref(database, `supportChat/${selectedConv}/messages`), {
        sender: 'admin',
        text: messageText.trim(),
        type: 'text',
        time: new Date().toISOString(),
        isRead: false,
        adminName: adminUser?.displayName || 'المدير',
      });
      await update(ref(database, `supportChat/${selectedConv}`), {
        lastMessage: messageText.trim(),
        lastMessageTime: new Date().toISOString(),
        unreadUser: (conversations.find(c => c.ticketId === selectedConv)?.unreadUser || 0) + 1,
      });
      setMessageText('');
    } catch (e) { showToast('حدث خطأ', 'error'); }
  };

  const resolveConversation = async () => {
    if (!selectedConv) return;
    try {
      await update(ref(database, `supportChat/${selectedConv}`), {
        status: 'resolved',
        resolvedAt: new Date().toISOString(),
        resolvedBy: adminUser?.displayName || 'المدير',
      });
      showToast('تم إغلاق التذكرة', 'success');
    } catch (e) { showToast('حدث خطأ', 'error'); }
  };

  const reopenConversation = async () => {
    if (!selectedConv) return;
    try {
      await update(ref(database, `supportChat/${selectedConv}`), {
        status: 'open',
        resolvedAt: null,
        resolvedBy: null,
      });
      showToast('تم إعادة فتح التذكرة', 'success');
    } catch (e) { showToast('حدث خطأ', 'error'); }
  };

  const filtered = conversations.filter(c => {
    const matchesSearch = !search || c.userName?.includes(search) || c.lastMessage?.includes(search) || c.ticketId?.includes(search);
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const openTickets = conversations.filter(c => c.status === 'open').length;
  const resolvedTickets = conversations.filter(c => c.status === 'resolved').length;

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">شات الدعم المباشر</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {openTickets} تذكرة نشطة - {resolvedTickets} تم إغلاقها
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className={filterStatus === 'all' ? 'bg-purple-500/10' : ''} onClick={() => setFilterStatus('all')} style={{ cursor: 'pointer' }}>الكل ({conversations.length})</Badge>
          <Badge variant="outline" className={filterStatus === 'open' ? 'bg-green-500/10' : ''} onClick={() => setFilterStatus('open')} style={{ cursor: 'pointer' }}>نشطة ({openTickets})</Badge>
          <Badge variant="outline" className={filterStatus === 'resolved' ? 'bg-gray-500/10' : ''} onClick={() => setFilterStatus('resolved')} style={{ cursor: 'pointer' }}>مغلقة ({resolvedTickets})</Badge>
        </div>
      </div>

      <div className="flex gap-4 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className="w-80 shrink-0 border border-border rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 h-9" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {filtered.map((conv) => (
              <div
                key={conv.ticketId}
                onClick={() => setSelectedConv(conv.ticketId)}
                className={`p-3 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${selectedConv === conv.ticketId ? 'bg-purple-500/10' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-xs font-bold text-purple-600">
                      {(conv.userName || '?')[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{conv.userName || 'مستخدم'}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-40">{conv.lastMessage || ''}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {conv.unreadAdmin > 0 && <Badge className="bg-red-500 text-white text-xs h-5 min-w-5">{conv.unreadAdmin}</Badge>}
                    <Badge className={conv.status === 'open' ? 'bg-green-500/20 text-green-600 text-xs' : 'bg-gray-500/20 text-gray-500 text-xs'}>
                      {conv.status === 'open' ? 'نشط' : 'مغلق'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 border border-border rounded-xl flex flex-col">
          {selectedConv ? (
            <>
              <div className="p-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-sm">{conversations.find(c => c.ticketId === selectedConv)?.userName || 'مستخدم'}</span>
                  <Badge className={conversations.find(c => c.ticketId === selectedConv)?.status === 'open' ? 'bg-green-500/20 text-green-600 text-xs' : 'bg-gray-500/20 text-gray-500 text-xs'}>
                    {conversations.find(c => c.ticketId === selectedConv)?.status === 'open' ? 'نشطة' : 'مغلقة'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {conversations.find(c => c.ticketId === selectedConv)?.status === 'open' ? (
                    <Button variant="outline" size="sm" onClick={resolveConversation}>
                      <CheckCircle className="w-4 h-4 ml-1" /> إغلاق التذكرة
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={reopenConversation}>
                      <XCircle className="w-4 h-4 ml-1" /> إعادة فتح
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] p-3 rounded-xl text-sm ${
                      msg.sender === 'admin' ? 'bg-purple-600/20 text-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm'
                    }`}>
                      {msg.sender === 'admin' && msg.adminName && (
                        <p className="text-xs text-purple-500 mb-1">{msg.adminName}</p>
                      )}
                      {msg.type === 'image' && msg.imageUrl ? (
                        <img src={msg.imageUrl} alt="" className="rounded-lg max-h-40 mb-1" />
                      ) : null}
                      <p>{msg.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{msg.time ? timeAgo(msg.time) : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border flex gap-2">
                <Input
                  placeholder="اكتب رسالة..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} size="icon"><Send className="w-4 h-4" /></Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>اختر تذكرة للبدء</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
