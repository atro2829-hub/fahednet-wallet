'use client';

import { useEffect, useRef, useCallback } from 'react';
import { database } from '@/lib/firebase';
import { ref, get, onValue, query, orderByChild, equalTo, limitToLast } from 'firebase/database';
import { useAppStore } from '@/lib/store';

/**
 * Syncs user data and transactions from Firebase Realtime Database to the local Zustand store.
 * 
 * - On mount: Fetches fresh user data and transactions from Firebase
 * - Real-time: Listens for balance changes and new transactions via onValue
 * - On window focus: Refreshes user data and transactions
 * - On reconnect: Refreshes user data and transactions
 */
export function useFirebaseSync() {
  const { user, isAuthenticated, setUser, setTransactions, setNotifications, addNotification } = useAppStore();
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const txUnsubscribeRef = useRef<(() => void) | null>(null);
  const notifUnsubscribeRef = useRef<(() => void) | null>(null);
  const isRefreshing = useRef(false);

  // Fetch fresh user data from Firebase and update store
  const refreshUser = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return;
    if (isRefreshing.current) return;
    
    isRefreshing.current = true;
    try {
      const userRef = ref(database, `users/${user.id}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const currentUser = useAppStore.getState().user;
        
        // Only update if data actually changed (avoid unnecessary re-renders)
        if (currentUser && (
          currentUser.balanceYER !== (data.balanceYER || 0) ||
          currentUser.balanceSAR !== (data.balanceSAR || 0) ||
          currentUser.balanceUSD !== (data.balanceUSD || 0) ||
          currentUser.name !== (data.name || '') ||
          currentUser.firstName !== (data.firstName || '') ||
          currentUser.secondName !== (data.secondName || '') ||
          currentUser.thirdName !== (data.thirdName || '') ||
          currentUser.familyName !== (data.familyName || '') ||
          currentUser.nationalId !== (data.nationalId || '') ||
          currentUser.kycStatus !== (data.kycStatus || 'pending') ||
          currentUser.isBlocked !== (data.isBlocked || false) ||
          currentUser.phone !== (data.phone || '') ||
          currentUser.avatar !== (data.avatar || '') ||
          currentUser.cardType !== (data.cardType || '') ||
          currentUser.cardNumber !== (data.cardNumber || '') ||
          currentUser.governorate !== (data.governorate || '') ||
          currentUser.role !== (data.role || 'user') ||
          currentUser.theme !== (data.theme || 'light')
        )) {
          const fullName = [data.firstName, data.secondName, data.thirdName, data.familyName].filter((n: string) => n && n.trim()).join(' ') || data.name || '';
          setUser({
            id: user.id,
            email: data.email || currentUser.email,
            phone: data.phone || '',
            name: fullName,
            firstName: data.firstName || '',
            secondName: data.secondName || '',
            thirdName: data.thirdName || '',
            familyName: data.familyName || '',
            nationalId: data.nationalId || '',
            avatar: data.avatar || '',
            role: data.role || 'user',
            userId: data.userId || '',
            kycStatus: data.kycStatus || 'pending',
            isBlocked: data.isBlocked || false,
            balanceYER: data.balanceYER || 0,
            balanceSAR: data.balanceSAR || 0,
            balanceUSD: data.balanceUSD || 0,
            cardType: data.cardType || '',
            cardNumber: data.cardNumber || '',
            cardIssuedAt: data.cardIssuedAt || '',
            governorate: data.governorate || '',
            theme: data.theme || 'light',
          });
        }
      }

      // Also refresh transactions
      await refreshTransactions();
    } catch (error) {
      console.error('Firebase sync error:', error);
    } finally {
      isRefreshing.current = false;
    }
  }, [user?.id, isAuthenticated, setUser]);

  // Fetch transactions from Firebase
  const refreshTransactions = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return;
    
    try {
      const txRef = ref(database, 'transactions');
      const snapshot = await get(txRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const userTx = Object.values(data).filter((tx: any) => 
          tx.fromUserId === user.id || tx.toUserId === user.id
        ) as any[];
        
        const transactions = userTx
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((tx: any) => ({
            id: tx.id,
            fromUserId: tx.fromUserId || '',
            toUserId: tx.toUserId || '',
            amount: tx.amount || 0,
            currency: tx.currency || 'YER',
            type: tx.type || 'order',
            status: tx.status || 'completed',
            description: tx.description || '',
            createdAt: tx.createdAt || new Date().toISOString(),
          }));

        setTransactions(transactions);
      }
    } catch (error) {
      console.error('Firebase transactions sync error:', error);
    }
  }, [user?.id, isAuthenticated, setTransactions]);

  // Fetch notifications from Firebase
  const refreshNotifications = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return;

    try {
      const notifRef = ref(database, `notifications/${user.id}`);
      const snapshot = await get(notifRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const notifications = Object.values(data)
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((n: any) => ({
            id: n.id || '',
            title: n.title || '',
            body: n.body || '',
            type: n.type || 'info' as const,
            isRead: n.isRead || false,
            createdAt: n.createdAt || new Date().toISOString(),
          }));

        setNotifications(notifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Firebase notifications sync error:', error);
    }
  }, [user?.id, isAuthenticated, setNotifications]);

  // Set up real-time listener for user data
  useEffect(() => {
    if (!user?.id || !isAuthenticated) {
      // Clean up listener when not authenticated
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      if (txUnsubscribeRef.current) {
        txUnsubscribeRef.current();
        txUnsubscribeRef.current = null;
      }
      if (notifUnsubscribeRef.current) {
        notifUnsubscribeRef.current();
        notifUnsubscribeRef.current = null;
      }
      return;
    }

    const userRef = ref(database, `users/${user.id}`);
    
    // Real-time listener - updates store whenever Firebase data changes
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const currentUser = useAppStore.getState().user;
        
        if (currentUser) {
          const fullName = [data.firstName, data.secondName, data.thirdName, data.familyName].filter((n: string) => n && n.trim()).join(' ') || data.name || '';
          setUser({
            id: currentUser.id,
            email: data.email || currentUser.email,
            phone: data.phone || '',
            name: fullName,
            firstName: data.firstName || '',
            secondName: data.secondName || '',
            thirdName: data.thirdName || '',
            familyName: data.familyName || '',
            nationalId: data.nationalId || '',
            avatar: data.avatar || '',
            role: data.role || 'user',
            userId: data.userId || '',
            kycStatus: data.kycStatus || 'pending',
            isBlocked: data.isBlocked || false,
            balanceYER: data.balanceYER || 0,
            balanceSAR: data.balanceSAR || 0,
            balanceUSD: data.balanceUSD || 0,
            cardType: data.cardType || '',
            cardNumber: data.cardNumber || '',
            cardIssuedAt: data.cardIssuedAt || '',
            governorate: data.governorate || '',
            theme: data.theme || 'light',
          });
        }
      }
    }, (error) => {
      console.error('Firebase onValue error:', error);
    });

    unsubscribeRef.current = unsubscribe;

    // Real-time listener for transactions
    const txRef = ref(database, 'transactions');
    const txUnsubscribe = onValue(txRef, (snapshot) => {
      if (snapshot.exists() && user?.id) {
        const data = snapshot.val();
        const userId = useAppStore.getState().user?.id;
        if (!userId) return;
        
        const userTx = Object.values(data).filter((tx: any) => 
          tx.fromUserId === userId || tx.toUserId === userId
        ) as any[];
        
        const transactions = userTx
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((tx: any) => ({
            id: tx.id,
            fromUserId: tx.fromUserId || '',
            toUserId: tx.toUserId || '',
            amount: tx.amount || 0,
            currency: tx.currency || 'YER',
            type: tx.type || 'order',
            status: tx.status || 'completed',
            description: tx.description || '',
            createdAt: tx.createdAt || new Date().toISOString(),
          }));

        setTransactions(transactions);
      }
    }, (error) => {
      console.error('Firebase transactions onValue error:', error);
    });

    txUnsubscribeRef.current = txUnsubscribe;

    // Real-time listener for notifications
    const notifRef = ref(database, `notifications/${user.id}`);
    const notifUnsubscribe = onValue(notifRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const notifications = Object.values(data)
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((n: any) => ({
            id: n.id || '',
            title: n.title || '',
            body: n.body || '',
            type: n.type || 'info' as const,
            isRead: n.isRead || false,
            createdAt: n.createdAt || new Date().toISOString(),
          }));

        setNotifications(notifications);
      } else {
        setNotifications([]);
      }
    }, (error) => {
      console.error('Firebase notifications onValue error:', error);
    });

    notifUnsubscribeRef.current = notifUnsubscribe;

    return () => {
      unsubscribe();
      unsubscribeRef.current = null;
      txUnsubscribe();
      txUnsubscribeRef.current = null;
      notifUnsubscribe();
      notifUnsubscribeRef.current = null;
    };
  }, [user?.id, isAuthenticated, setUser, setTransactions, setNotifications]);

  // Refresh on mount
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      refreshUser();
      refreshNotifications();
    }
  }, [isAuthenticated, user?.id, refreshUser, refreshNotifications]);

  // Refresh on window focus (user returns to the app)
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated && user?.id) {
        refreshUser();
        refreshNotifications();
      }
    };

    window.addEventListener('focus', handleFocus);
    
    // Also handle visibility change (mobile browsers)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated && user?.id) {
        refreshUser();
        refreshNotifications();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle online/offline
    const handleOnline = () => {
      if (isAuthenticated && user?.id) {
        refreshUser();
        refreshNotifications();
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [isAuthenticated, user?.id, refreshUser, refreshNotifications]);

  return { refreshUser };
}
