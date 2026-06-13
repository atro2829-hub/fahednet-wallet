'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { productIcons } from '@/lib/product-icons';
import { serviceIcons } from '@/lib/service-icons';
import { database } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

// ─── Types ──────────────────────────────────────────────────

interface FirebaseCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
  order: number;
  isVisible: boolean;
  type: string;
  description?: string;
}

interface FirebaseSubCategory {
  id: string;
  categoryId: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  order: number;
  isVisible: boolean;
}

interface FirebaseProvider {
  id: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  nameEn?: string;
  icon: string;
  color: string;
  isActive: boolean;
  inputLabel: string;
  inputType: string;
  inputPrefix?: string;
  inputPlaceholder?: string;
  providerType: string;
  executionType: string;
  order: number;
}

// ─── Helper: get icon for provider ──────────────────────────

function getIconForProvider(providerId: string): string {
  if (productIcons[providerId]) return productIcons[providerId];
  if (serviceIcons[providerId]) return serviceIcons[providerId];
  return '';
}

// ─── Component ──────────────────────────────────────────────

export default function CategoryDetailScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const {
    selectedCategory,
    setActiveScreen,
    setSelectedProvider,
    setOrderOpen,
    providers: storeProviders,
  } = useAppStore();

  // Firebase data
  const [category, setCategory] = useState<FirebaseCategory | null>(null);
  const [subCategories, setSubCategories] = useState<FirebaseSubCategory[]>([]);
  const [providers, setProviders] = useState<FirebaseProvider[]>([]);
  const [visibilityProviders, setVisibilityProviders] = useState<Record<string, boolean>>({});
  const [visibilitySubCategories, setVisibilitySubCategories] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);

  const cardStyle = {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
    boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)',
  };

  // ─── Firebase Listeners ────────────────────────────────────

  useEffect(() => {
    if (!selectedCategory) return;

    // Listen to category details
    const catRef = ref(database, `categories/${selectedCategory}`);
    const unsub1 = onValue(catRef, (snapshot) => {
      if (snapshot.exists()) {
        setCategory(snapshot.val());
      }
    });

    // Listen to sub-categories for this category
    const subRef = ref(database, 'subCategories');
    const unsub2 = onValue(subRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const subs = Object.values(data)
          .filter((sub: any) => sub.categoryId === selectedCategory)
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0)) as FirebaseSubCategory[];
        setSubCategories(subs);
        // Auto-select first sub-category
        if (subs.length > 0 && !activeSubCategory) {
          setActiveSubCategory(subs[0].id);
        }
      }
    });

    // Listen to providers for this category
    const provRef = ref(database, 'providers');
    const unsub3 = onValue(provRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const provs = Object.values(data)
          .filter((p: any) => p.categoryId === selectedCategory && p.isActive !== false)
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0)) as FirebaseProvider[];
        setProviders(provs);
      }
      setLoading(false);
    });

    // Listen to visibility
    const visRef = ref(database, 'adminSettings/visibility');
    const unsub4 = onValue(visRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setVisibilityProviders(data.providers || {});
        setVisibilitySubCategories(data.subCategories || {});
      }
    });

    return () => { unsub1(); unsub2(); unsub3(); unsub4(); };
  }, [selectedCategory]);

  // ─── Derived Data ─────────────────────────────────────────

  const visibleSubCategories = subCategories.filter(
    sub => sub.isVisible !== false && visibilitySubCategories[sub.id] !== false
  );

  const visibleProviders = providers.filter(
    p => visibilityProviders[p.id] !== false
  );

  // Filter by active sub-category or show all
  const displayProviders = activeSubCategory
    ? visibleProviders.filter(p => p.subCategoryId === activeSubCategory)
    : visibleProviders;

  // Search filter
  const filteredProviders = searchQuery.trim()
    ? displayProviders.filter(p =>
        p.name.includes(searchQuery.trim()) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(searchQuery.trim().toLowerCase()))
      )
    : displayProviders;

  // ─── Handlers ──────────────────────────────────────────────

  const handleProviderClick = (provider: FirebaseProvider) => {
    if (provider.providerType === 'telecom') {
      setActiveScreen('recharge');
      return;
    }
    const storeProvider = storeProviders.find(p => p.id === provider.id);
    if (storeProvider) {
      setSelectedProvider(storeProvider);
      setOrderOpen(true);
    } else {
      setSelectedProvider({
        id: provider.id,
        categoryId: provider.categoryId,
        name: provider.name,
        color: provider.color,
        icon: provider.icon,
        isActive: provider.isActive,
        inputLabel: provider.inputLabel,
        inputType: provider.inputType as 'phone' | 'text',
        inputPrefix: provider.inputPrefix,
      });
      setOrderOpen(true);
    }
  };

  // ─── Render ────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#8B1E3A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-4 pb-3"
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setActiveScreen('services')}
            className="p-2 rounded-xl active:scale-95 transition-transform"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
          >
            <ArrowLeft size={20} color={isDark ? '#FFF' : '#1a1a1a'} />
          </button>
          <div>
            <h1 className="text-xl font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
              {category?.nameAr || selectedCategory}
            </h1>
            {category?.description && (
              <p className="text-xs mt-0.5" style={{ color: isDark ? '#777' : '#999' }}>
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-2xl"
          style={{
            background: isDark ? '#1A1A1A' : '#F0F0F0',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <Search size={18} strokeWidth={1.5} color={isDark ? '#555' : '#AAA'} />
          <input
            type="text"
            placeholder="ابحث عن خدمة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: isDark ? '#FFF' : '#1a1a1a' }}
          />
        </div>
      </motion.div>

      {/* Sub-category tabs */}
      {visibleSubCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 mb-3"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
            <button
              onClick={() => setActiveSubCategory(null)}
              className="shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: !activeSubCategory
                  ? (category?.color || '#8B1E3A')
                  : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                color: !activeSubCategory ? '#FFF' : (isDark ? '#BBB' : '#666'),
              }}
            >
              الكل ({visibleProviders.length})
            </button>
            {visibleSubCategories.map(sub => {
              const subProvCount = visibleProviders.filter(p => p.subCategoryId === sub.id).length;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubCategory(sub.id)}
                  className="shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: activeSubCategory === sub.id
                      ? (category?.color || '#8B1E3A')
                      : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                    color: activeSubCategory === sub.id ? '#FFF' : (isDark ? '#BBB' : '#666'),
                  }}
                >
                  {sub.nameAr} ({subProvCount})
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Provider grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4"
      >
        <div className="rounded-2xl p-4" style={cardStyle}>
          {filteredProviders.length > 0 ? (
            <div className="grid grid-cols-4 gap-x-2 gap-y-4">
              <AnimatePresence mode="popLayout">
                {filteredProviders.map((provider, index) => {
                  const iconSrc = getIconForProvider(provider.id);
                  const hasCustomIcon = iconSrc !== '';

                  return (
                    <motion.button
                      key={provider.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: 0.02 * index, duration: 0.25 }}
                      onClick={() => handleProviderClick(provider)}
                      whileTap={{ scale: 0.92 }}
                      className="flex flex-col items-center justify-center gap-1.5 py-2"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center shrink-0"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        }}
                      >
                        {hasCustomIcon ? (
                          <img src={iconSrc} alt={provider.name} className="w-10 h-10 object-contain" draggable={false} />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: provider.color || '#8B1E3A' }}
                          >
                            <span className="text-white text-xs font-bold">
                              {(provider.nameEn || provider.name).substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <span
                        className="text-[10px] font-medium text-center leading-tight max-w-[72px]"
                        style={{
                          color: isDark ? '#BBB' : '#555',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {provider.name}
                      </span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm" style={{ color: isDark ? '#555' : '#AAA' }}>
                لا توجد خدمات في هذا القسم
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
