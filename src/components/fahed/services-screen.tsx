'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, Wallet, Gamepad2, Phone, CreditCard, PlayCircle, Bitcoin, TrendingUp, Layers, ChevronDown, ChevronUp } from 'lucide-react';
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
  createdAt?: string;
}

// Icon mapping by category type
const categoryIconMap: Record<string, React.ReactNode> = {};
function getCategoryIcon(iconKey: string, color: string) {
  const iconProps = { size: 16, strokeWidth: 2, color: color || '#8B1E3A' };
  // Check if it's a serviceIcons key
  if (serviceIcons[iconKey]) {
    return <img src={serviceIcons[iconKey]} alt="" className="w-4 h-4 object-contain" />;
  }
  switch (iconKey) {
    case 'phone': return <Phone {...iconProps} />;
    case 'gamepad-2': return <Gamepad2 {...iconProps} />;
    case 'credit-card': return <CreditCard {...iconProps} />;
    case 'play-circle': return <PlayCircle {...iconProps} />;
    case 'bitcoin': return <Bitcoin {...iconProps} />;
    case 'trending-up': return <TrendingUp {...iconProps} />;
    case 'layers': return <Layers {...iconProps} />;
    default: return <Wallet {...iconProps} />;
  }
}

// Only allow these categories
const ALLOWED_CATEGORIES = ['telecom', 'entertainment', 'games', 'gift-cards', 'digital-wallets'];

// Fallback icon for providers without custom icons
function getIconForProvider(providerId: string, providerIcon?: string, providerColor?: string): string {
  // 1. Check if provider has a base64 icon from Firebase
  if (providerIcon && providerIcon.startsWith('data:')) return providerIcon;
  // 2. Check productIcons first
  if (productIcons[providerId]) return productIcons[providerId];
  // 3. Check serviceIcons
  if (serviceIcons[providerId]) return serviceIcons[providerId];
  // 4. Return empty (will show colored circle with first letter)
  return '';
}

// Maximum items shown in compact (collapsed) view per section
const COMPACT_LIMIT = 8;

export default function ServicesScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const {
    setSelectedProvider,
    setOrderOpen,
    setActiveScreen,
    setSelectedCategory,
    providers: storeProviders,
  } = useAppStore();

  // Firebase data state
  const [fbCategories, setFbCategories] = useState<Record<string, FirebaseCategory>>({});
  const [fbSubCategories, setFbSubCategories] = useState<Record<string, FirebaseSubCategory>>({});
  const [fbProviders, setFbProviders] = useState<Record<string, FirebaseProvider>>({});
  const [visibilitySections, setVisibilitySections] = useState<Record<string, boolean>>({});
  const [visibilityProviders, setVisibilityProviders] = useState<Record<string, boolean>>({});
  const [visibilitySubCategories, setVisibilitySubCategories] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());

  const dividerColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
  const cardStyle = {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
    boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)',
  };

  // ─── Firebase Listeners ────────────────────────────────────

  useEffect(() => {
    const catRef = ref(database, 'categories');
    const unsub1 = onValue(catRef, (snapshot) => {
      if (snapshot.exists()) {
        setFbCategories(snapshot.val());
      } else {
        setFbCategories({});
      }
      setLoading(false);
    });

    const subRef = ref(database, 'subCategories');
    const unsub2 = onValue(subRef, (snapshot) => {
      if (snapshot.exists()) {
        setFbSubCategories(snapshot.val());
      } else {
        setFbSubCategories({});
      }
    });

    const provRef = ref(database, 'providers');
    const unsub3 = onValue(provRef, (snapshot) => {
      if (snapshot.exists()) {
        setFbProviders(snapshot.val());
      } else {
        setFbProviders({});
      }
    });

    const visRef = ref(database, 'adminSettings/visibility');
    const unsub4 = onValue(visRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setVisibilitySections(data.sections || {});
        setVisibilityProviders(data.providers || {});
        setVisibilitySubCategories(data.subCategories || {});
      }
    });

    // Legacy compatibility
    const legacyRef = ref(database, 'adminSettings/sectionVisibility');
    const unsub5 = onValue(legacyRef, (snapshot) => {
      if (snapshot.exists()) {
        setVisibilitySections(prev => ({ ...prev, ...snapshot.val() }));
      }
    });

    return () => { unsub1(); unsub2(); unsub3(); unsub4(); unsub5(); };
  }, []);

  // ─── Derived Data ─────────────────────────────────────────

  // Sorted categories - only show allowed categories
  const sortedCategories = Object.values(fbCategories)
    .filter(cat => cat.isVisible !== false && visibilitySections[cat.id] !== false)
    .filter(cat => ALLOWED_CATEGORIES.includes(cat.id))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Fallback: if Firebase has no categories, show the 5 allowed ones with local data
  const fallbackCategories: FirebaseCategory[] = ALLOWED_CATEGORIES.map((id, index) => ({
    id,
    nameAr: id === 'telecom' ? 'الاتصالات والشحن' : id === 'entertainment' ? 'الخدمات الترفيهية' : id === 'games' ? 'الألعاب' : id === 'gift-cards' ? 'بطاقات الهدايا' : 'المحافظ الرقمية',
    nameEn: id === 'telecom' ? 'Telecom' : id === 'entertainment' ? 'Entertainment' : id === 'games' ? 'Games' : id === 'gift-cards' ? 'Gift Cards' : 'Digital Wallets',
    icon: id === 'telecom' ? 'recharge' : id === 'entertainment' ? 'entertainment' : id === 'games' ? 'games-category' : id === 'gift-cards' ? 'gift-cards' : 'digital-wallets',
    color: id === 'telecom' ? '#8B1E3A' : id === 'entertainment' ? '#7C3AED' : id === 'games' ? '#F59E0B' : id === 'gift-cards' ? '#14B8A6' : '#2563EB',
    order: index,
    isVisible: true,
    type: id === 'telecom' ? 'telecom' : 'service',
  }));

  const displayCategories = sortedCategories.length > 0 ? sortedCategories : fallbackCategories;

  // Get sub-categories for a category
  const getSubCategories = (categoryId: string): FirebaseSubCategory[] => {
    return Object.values(fbSubCategories)
      .filter(sub => sub.categoryId === categoryId && sub.isVisible !== false && visibilitySubCategories[sub.id] !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  // Get providers for a category or sub-category
  const getProviders = (categoryId: string, subCategoryId?: string): FirebaseProvider[] => {
    return Object.values(fbProviders)
      .filter(p => {
        if (p.isActive === false) return false;
        if (visibilityProviders[p.id] === false) return false;
        if (subCategoryId) {
          return p.categoryId === categoryId && p.subCategoryId === subCategoryId;
        }
        return p.categoryId === categoryId;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  // Get total provider count for a category
  const getCategoryProviderCount = (categoryId: string): number => {
    return Object.values(fbProviders).filter(p =>
      p.categoryId === categoryId && p.isActive !== false && visibilityProviders[p.id] !== false
    ).length;
  };

  // ─── Handlers ──────────────────────────────────────────────

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const toggleSubCategoryExpand = (subCatId: string) => {
    setExpandedSubCategories(prev => {
      const next = new Set(prev);
      if (next.has(subCatId)) next.delete(subCatId);
      else next.add(subCatId);
      return next;
    });
  };

  const handleProviderClick = (provider: FirebaseProvider) => {
    // Telecom providers go to recharge screen
    if (provider.providerType === 'telecom') {
      setActiveScreen('recharge');
      return;
    }
    // Other providers - try to find in store providers for order system
    const storeProvider = storeProviders.find(p => p.id === provider.id);
    if (storeProvider) {
      setSelectedProvider(storeProvider);
      setOrderOpen(true);
    } else {
      // Create a temporary provider object for the order
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

  // ─── Render Helpers ────────────────────────────────────────

  const renderProviderItem = (provider: FirebaseProvider, index: number) => {
    const iconSrc = getIconForProvider(provider.id, provider.color);
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
        {/* Icon Container */}
        <div
          className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center shrink-0"
          style={{
            background: isDark
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.03)',
          }}
        >
          {hasCustomIcon ? (
            <img
              src={iconSrc}
              alt={provider.name}
              className="w-10 h-10 object-contain"
              draggable={false}
            />
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
        {/* Provider Name */}
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
  };

  const renderSubCategory = (subCat: FirebaseSubCategory, parentCategoryId: string, isExpanded: boolean) => {
    const providers = getProviders(parentCategoryId, subCat.id);
    if (providers.length === 0) return null;

    const displayProviders = isExpanded ? providers : providers.slice(0, COMPACT_LIMIT);

    return (
      <div key={subCat.id}>
        {/* Sub-section header */}
        <div
          className="mb-2 pr-2 mt-3"
          style={{
            borderRight: `2px solid ${fbCategories[parentCategoryId]?.color || '#8B1E3A'}`,
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-semibold"
              style={{ color: isDark ? '#AAA' : '#666' }}
            >
              {subCat.nameAr} ({providers.length})
            </span>
            {providers.length > COMPACT_LIMIT && (
              <button
                onClick={() => toggleSubCategoryExpand(subCat.id)}
                className="text-[10px] flex items-center gap-0.5"
                style={{ color: fbCategories[parentCategoryId]?.color || '#8B1E3A' }}
              >
                {isExpanded ? 'إخفاء' : `+${providers.length - COMPACT_LIMIT}`}
                {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>
            )}
          </div>
        </div>

        {/* Provider grid */}
        <div className="grid grid-cols-4 gap-x-2 gap-y-4">
          <AnimatePresence mode="popLayout">
            {displayProviders.map((provider, pIndex) =>
              renderProviderItem(provider, pIndex)
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // ─── Main Render ──────────────────────────────────────────

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
        transition={{ duration: 0.4 }}
        className="px-4 pt-4 pb-3"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
            القائمة
          </h1>
        </div>

        {/* Search Bar */}
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

      {/* Category Sections */}
      {displayCategories.map((category, sectionIndex) => {
        const isExpanded = expandedCategories.has(category.id) || !!searchQuery.trim();
        const subCategories = getSubCategories(category.id);
        const totalProviders = getCategoryProviderCount(category.id);

        // If no providers at all, skip this category
        if (totalProviders === 0 && !searchQuery.trim()) return null;

        // Search filtering
        let filteredProviders: FirebaseProvider[] = [];
        if (searchQuery.trim()) {
          filteredProviders = getProviders(category.id).filter(p =>
            p.name.includes(searchQuery.trim()) ||
            (p.nameEn && p.nameEn.toLowerCase().includes(searchQuery.trim().toLowerCase()))
          );
          if (filteredProviders.length === 0) return null;
        }

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * sectionIndex, duration: 0.4 }}
            className="px-4 mt-4"
          >
            {/* Section Header - Clickable to open category detail */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => {
                  if (category.id === 'telecom') {
                    setActiveScreen('recharge');
                  } else {
                    setSelectedCategory(category.id);
                    setActiveScreen('category-detail');
                  }
                }}
                className="flex items-center gap-2 active:scale-95 transition-transform"
              >
                {getCategoryIcon(category.icon, category.color)}
                <h3
                  className="text-sm font-bold"
                  style={{ color: isDark ? '#FFF' : '#1a1a1a' }}
                >
                  {category.nameAr}
                </h3>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: `${category.color}15`,
                    color: category.color,
                  }}
                >
                  {totalProviders}
                </span>
              </button>
              {totalProviders > COMPACT_LIMIT && !searchQuery.trim() && (
                <button
                  onClick={() => toggleCategoryExpand(category.id)}
                  className="text-xs font-medium flex items-center gap-0.5 active:scale-95 transition-transform"
                  style={{ color: category.color || '#8B1E3A' }}
                >
                  {isExpanded ? 'إخفاء' : 'الكل'}
                  <ChevronLeft
                    size={14}
                    strokeWidth={1.5}
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>
              )}
            </div>

            {/* Provider Content */}
            <div className="rounded-2xl p-4" style={cardStyle}>
              {searchQuery.trim() ? (
                /* Search results - flat grid */
                <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                  <AnimatePresence mode="popLayout">
                    {filteredProviders.map((provider, index) =>
                      renderProviderItem(provider, index)
                    )}
                  </AnimatePresence>
                </div>
              ) : subCategories.length > 0 ? (
                /* Sub-categories layout */
                <div>
                  {/* First show providers without sub-category */}
                  {(() => {
                    const noSubProviders = getProviders(category.id).filter(
                      p => !p.subCategoryId || p.subCategoryId === ''
                    );
                    if (noSubProviders.length === 0) return null;
                    const displayNoSub = isExpanded ? noSubProviders : noSubProviders.slice(0, COMPACT_LIMIT);
                    return (
                      <div className="grid grid-cols-4 gap-x-2 gap-y-4 mb-3">
                        <AnimatePresence mode="popLayout">
                          {displayNoSub.map((provider, index) =>
                            renderProviderItem(provider, index)
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })()}

                  {/* Then show sub-categories with their providers */}
                  {subCategories.map(subCat =>
                    renderSubCategory(subCat, category.id, expandedSubCategories.has(subCat.id))
                  )}
                </div>
              ) : (
                /* No sub-categories - flat grid */
                <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                  <AnimatePresence mode="popLayout">
                    {(isExpanded ? getProviders(category.id) : getProviders(category.id).slice(0, COMPACT_LIMIT))
                      .map((provider, index) => renderProviderItem(provider, index))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Empty state when search yields no results */}
      {displayCategories.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 mt-8"
        >
          <div className="rounded-2xl p-8 flex flex-col items-center" style={cardStyle}>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: isDark ? '#222' : '#F5F5F5' }}
            >
              <Search size={24} strokeWidth={1.5} color={isDark ? '#333' : '#DDD'} />
            </div>
            <p className="text-sm font-medium" style={{ color: isDark ? '#555' : '#AAA' }}>
              لا توجد أقسام بعد
            </p>
            <p className="text-[11px] mt-1" style={{ color: isDark ? '#444' : '#CCC' }}>
              قم بإضافة أقسام ومزودين من لوحة التحكم
            </p>
          </div>
        </motion.div>
      )}

      {/* No search results */}
      {searchQuery.trim() && displayCategories.every(cat => {
        const filtered = getProviders(cat.id).filter(p =>
          p.name.includes(searchQuery.trim()) ||
          (p.nameEn && p.nameEn.toLowerCase().includes(searchQuery.trim().toLowerCase()))
        );
        return filtered.length === 0;
      }) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 mt-8"
        >
          <div className="rounded-2xl p-8 flex flex-col items-center" style={cardStyle}>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: isDark ? '#222' : '#F5F5F5' }}
            >
              <Search size={24} strokeWidth={1.5} color={isDark ? '#333' : '#DDD'} />
            </div>
            <p className="text-sm font-medium" style={{ color: isDark ? '#555' : '#AAA' }}>
              لا توجد نتائج
            </p>
            <p className="text-[11px] mt-1" style={{ color: isDark ? '#444' : '#CCC' }}>
              جرب البحث بكلمات مختلفة
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
