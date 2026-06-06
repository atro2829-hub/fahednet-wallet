'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { productIcons } from '@/lib/product-icons';
import { serviceIcons } from '@/lib/service-icons';

// Category display order with display names
const categoryOrder = [
  { id: 'telecom', name: 'خدمات الاتصالات' },
  { id: 'entertainment', name: 'خدمات ترفيهية' },
  { id: 'cards', name: 'بطاقات رقمية' },
  { id: 'electricity', name: 'الكهرباء والماء' },
  { id: 'government', name: 'خدمات حكومية' },
  { id: 'internet', name: 'الإنترنت' },
];

// Icon fallback mapping for providers without dedicated product icons
const iconFallbackMap: Record<string, string> = {
  'elec-sanaa': 'electricity',
  'elec-aden': 'electricity',
  'water-sanaa': 'water',
  'water-aden': 'water',
  'y-net-internet': 'y-net-internet',
  'sabafon-internet': 'sabafon-internet',
};

// Telecom provider IDs that navigate to recharge screen
const telecomProviderIds = ['yemen-mobile', 'yo', 'sabafon', 'y'];

// Maximum items shown in compact (collapsed) view per section
const COMPACT_LIMIT = 8;

function getIconForProvider(providerId: string): string {
  // 1. Check productIcons first
  if (productIcons[providerId]) return productIcons[providerId];
  // 2. Check iconFallbackMap → productIcons
  const fallbackKey = iconFallbackMap[providerId];
  if (fallbackKey && productIcons[fallbackKey]) return productIcons[fallbackKey];
  // 3. Check serviceIcons
  if (serviceIcons[providerId]) return serviceIcons[providerId];
  // 4. Fallback key → serviceIcons
  if (fallbackKey && serviceIcons[fallbackKey]) return serviceIcons[fallbackKey];
  // 5. Generic fallback
  return serviceIcons['instant-pay'] || '';
}

export default function ServicesScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const {
    providers,
    categories,
    setSelectedProvider,
    setOrderOpen,
    setActiveScreen,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const dividerColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
  const cardStyle = {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
    boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)',
  };

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleProviderClick = (providerId: string) => {
    // Telecom providers go to recharge screen
    if (telecomProviderIds.includes(providerId)) {
      setActiveScreen('recharge');
      return;
    }
    // Other providers open the order bottom sheet
    const provider = providers.find(p => p.id === providerId);
    if (provider) {
      setSelectedProvider(provider);
      setOrderOpen(true);
    }
  };

  // Build sections: group providers by category in the specified order
  const sections = categoryOrder
    .map(cat => {
      const catProviders = providers.filter(p => p.categoryId === cat.id && p.isActive);
      return {
        id: cat.id,
        name: cat.name,
        providers: catProviders,
      };
    })
    .filter(section => section.providers.length > 0);

  // Filter by search query
  const filteredSections = searchQuery.trim()
    ? sections
        .map(section => ({
          ...section,
          providers: section.providers.filter(p =>
            p.name.includes(searchQuery.trim())
          ),
        }))
        .filter(section => section.providers.length > 0)
    : sections;

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
      {filteredSections.map((section, sectionIndex) => {
        const isExpanded = expandedCategories.has(section.id) || !!searchQuery.trim();
        const displayProviders = isExpanded
          ? section.providers
          : section.providers.slice(0, COMPACT_LIMIT);
        const hasMore = section.providers.length > COMPACT_LIMIT;

        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * sectionIndex, duration: 0.4 }}
            className="px-4 mt-4"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-sm font-bold"
                style={{ color: isDark ? '#FFF' : '#1a1a1a' }}
              >
                {section.name}
              </h3>
              {hasMore && !searchQuery.trim() && (
                <button
                  onClick={() => toggleCategoryExpand(section.id)}
                  className="text-xs font-medium flex items-center gap-0.5 active:scale-95 transition-transform"
                  style={{ color: '#E60000' }}
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

            {/* Provider Icon Grid */}
            <div
              className="rounded-2xl p-4"
              style={cardStyle}
            >
              <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                <AnimatePresence mode="popLayout">
                  {displayProviders.map((provider, index) => {
                    const iconSrc = getIconForProvider(provider.id);
                    return (
                      <motion.button
                        key={provider.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: 0.02 * index, duration: 0.25 }}
                        onClick={() => handleProviderClick(provider.id)}
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
                          <img
                            src={iconSrc}
                            alt={provider.name}
                            className="w-10 h-10 object-contain"
                            draggable={false}
                          />
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
                  })}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Empty state when search yields no results */}
      {filteredSections.length === 0 && searchQuery.trim() && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 mt-8"
        >
          <div
            className="rounded-2xl p-8 flex flex-col items-center"
            style={cardStyle}
          >
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
