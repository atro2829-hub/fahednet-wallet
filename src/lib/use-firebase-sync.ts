'use client';

import { useEffect, useRef, useCallback } from 'react';
import { database } from '@/lib/firebase';
import { ref, get, onValue } from 'firebase/database';
import { useAppStore } from '@/lib/store';

/**
 * Syncs user data from Firebase Realtime Database to the local Zustand store.
 * 
 * - On mount: Fetches fresh user data from Firebase
 * - Real-time: Listens for balance changes via onValue
 * - On window focus: Refreshes user data
 * - On reconnect: Refreshes user data
 */
export function useFirebaseSync() {
  const { user, isAuthenticated, setUser } = useAppStore();
  const unsubscribeRef = useRef<(() => void) | null>(null);
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
          setUser({
            id: user.id,
            email: data.email || currentUser.email,
            phone: data.phone || '',
            name: data.name || '',
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
    } catch (error) {
      console.error('Firebase sync error:', error);
    } finally {
      isRefreshing.current = false;
    }
  }, [user?.id, isAuthenticated, setUser]);

  // Set up real-time listener for user data
  useEffect(() => {
    if (!user?.id || !isAuthenticated) {
      // Clean up listener when not authenticated
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
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
          setUser({
            id: currentUser.id,
            email: data.email || currentUser.email,
            phone: data.phone || '',
            name: data.name || '',
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

    return () => {
      unsubscribe();
      unsubscribeRef.current = null;
    };
  }, [user?.id, isAuthenticated, setUser]);

  // Refresh on mount
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      refreshUser();
    }
  }, [isAuthenticated, user?.id, refreshUser]);

  // Refresh on window focus (user returns to the app)
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated && user?.id) {
        refreshUser();
      }
    };

    window.addEventListener('focus', handleFocus);
    
    // Also handle visibility change (mobile browsers)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated && user?.id) {
        refreshUser();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle online/offline
    const handleOnline = () => {
      if (isAuthenticated && user?.id) {
        refreshUser();
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [isAuthenticated, user?.id, refreshUser]);

  return { refreshUser };
}
