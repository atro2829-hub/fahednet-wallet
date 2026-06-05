'use client';

import { useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { useAppStore, type ServiceProvider } from '@/lib/store';
import { LOGO_BASE64 } from '@/lib/logo';
import {
  Search,
  Smartphone,
  Wifi,
  Gamepad2,
  Gift,
  ChevronLeft,
  Heart,
  Package,
  Clock,
  Star,
} from 'lucide-react';

// Provider icon component
function ProviderIcon({ provider, size = 28 }: { provider: ServiceProvider; size?: number }) {
  if (provider.icon && provider.icon.startsWith('data:')) {
    return (
      <img
        src={provider.icon}
        alt={provider.name}
        className="rounded-lg object-cover"
        style={{ width: size + 8, height: size + 8 }}
      />
    );
  }

  return (
    <div
      className="rounded-xl flex items-center justify-center"
      style={{
        width: size + 12,
        height: size + 12,
        background: `${provider.color}12`,
      }}
    >
      <span
        className="font-bold"
        style={{
          color: provider.color,
          fontSize: size * 0.5,
        }}
      >
        {provider.name.charAt(0)}
      </span>
    </div>
  );
}

const categoryChips = [
  { id: 'all', label: 'الكل', icon: null },
  { id: 'telecom', label: 'اتصالات وإنترنت', icon: Smartphone },
  { id: 'games', label: 'ألعاب وبطاقات', icon: Gamepad2 },
];

const howItWorksSteps = [
  { step: '1', title: 'اختر الخدمة', desc: 'اختر مزود الخدمة ثم الباقة المناسبة', color: '#E60000' },
  { step: '2', title: 'أدخل بياناتك', desc: 'رقم الهاتف أو معرف اللاعب', color: '#F59E0B' },
  { step: '3', title: 'تأكيد الشراء', desc: 'يخصم المبلغ من رصيدك تلقائياً', color: '#3B82F6' },
  { step: '4', title: 'استلم الخدمة', desc: 'يتم تنفيذ الطلب في أقرب وقت', color: '#10B981' },
];

export default function ServicesScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { categories, providers, favorites, toggleFavorite, recentServices, setSelectedProvider, setOrderOpen } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const handleProviderClick = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setOrderOpen(true);
    useAppStore.getState().addRecentService(provider.id);
  };

  const getCategoryIcon = (type: string, size: number) => {
    switch (type) {
      case 'telecom': return <Smartphone size={size} strokeWidth={1.5} color="#E60000" />;
      case 'internet': return <Wifi size={size} strokeWidth={1.5} color="#3B82F6" />;
      case 'games': return <Gamepad2 size={size} strokeWidth={1.5} color="#F59E0B" />;
      case 'cards': return <Gift size={size} strokeWidth={1.5} color="#14B8A6" />;
      default: return <Smartphone size={size} strokeWidth={1.5} color="#E60000" />;
    }
  };

  const filteredProviders = useMemo(() => {
    let result = providers.filter(p => p.isActive);
    if (activeCategory !== 'all') {
      result = result.filter(p => p.categoryId === activeCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }
    return result;
  }, [providers, activeCategory, searchQuery]);

  const favoriteProviders = useMemo(() => {
    return providers.filter(p => favorites.includes(p.id) && p.isActive);
  }, [providers, favorites]);

  const recentProviders = useMemo(() => {
    return recentServices
      .slice(0, 4)
      .map(id => providers.find(p => p.id === id && p.isActive))
      .filter(Boolean) as ServiceProvider[];
  }, [recentServices, providers]);

  return (
    <div className="pb-4">
      {/* Header - Clean Jaib Style */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between" style={{ height: 50 }}>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold relative inline-block"
              style={{ color: isDark ? '#FFFFFF' : '#1a1a1a' }}
            >
              الخدمات
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute -bottom-1 right-0 h-[3px] rounded-full"
                style={{ background: '#E60000' }}
              />
            </motion.h1>
            <p className="text-[11px] mt-1.5" style={{ color: isDark ? '#555' : '#999' }}>الاتصالات والإنترنت والألعاب</p>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-2xl mt-3"
          style={{
            background: isDark ? '#1A1A1A' : '#FFFFFF',
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
      </div>

      {/* Category Filter Chips */}
      <div className="px-4 mt-3">
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {categoryChips.map((chip) => {
            const Icon = chip.icon;
            return (
              <button
                key={chip.id}
                onClick={() => setActiveCategory(chip.id)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all card-press"
                style={{
                  background: activeCategory === chip.id ? '#E60000' : (isDark ? '#1A1A1A' : '#F5F5F5'),
                  color: activeCategory === chip.id ? '#FFF' : (isDark ? '#AAA' : '#666'),
                  border: `1px solid ${activeCategory === chip.id ? 'transparent' : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)')}`,
                  boxShadow: activeCategory === chip.id ? '0 2px 8px rgba(230,0,0,0.2)' : 'none',
                }}
              >
                {Icon && <Icon size={14} />}
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Favorites Section */}
      {favoriteProviders.length > 0 && activeCategory === 'all' && !searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 mt-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} color="#F59E0B" fill="#F59E0B" strokeWidth={1.5} />
            <h3 className="text-sm font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>المفضلة</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {favoriteProviders.map((provider) => (
              <motion.button
                key={provider.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleProviderClick(provider)}
                className="shrink-0 flex flex-col items-center gap-2 py-3 px-4 rounded-2xl relative"
                style={{
                  background: isDark ? '#1A1A1A' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                  minWidth: 80,
                }}
              >
                <div className="absolute top-1.5 left-1.5">
                  <Heart size={10} fill="#E60000" color="#E60000" strokeWidth={2} />
                </div>
                <ProviderIcon provider={provider} size={24} />
                <span className="text-[10px] font-medium text-center leading-tight max-w-[70px]" style={{ color: isDark ? '#CCC' : '#555' }}>
                  {provider.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Services */}
      {recentProviders.length > 0 && activeCategory === 'all' && !searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="px-4 mt-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} color="#8B5CF6" strokeWidth={1.5} />
            <h3 className="text-sm font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>آخر المستخدمة</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {recentProviders.map((provider) => (
              <motion.button
                key={provider.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleProviderClick(provider)}
                className="shrink-0 flex flex-col items-center gap-2 py-3 px-4 rounded-2xl"
                style={{
                  background: isDark ? '#1A1A1A' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                  minWidth: 80,
                }}
              >
                <ProviderIcon provider={provider} size={24} />
                <span className="text-[10px] font-medium text-center leading-tight max-w-[70px]" style={{ color: isDark ? '#CCC' : '#555' }}>
                  {provider.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Service Categories - 3-column grid */}
      {activeCategory === 'all' && !searchQuery ? (
        categories.map((category, catIndex) => {
          const categoryProviders = filteredProviders.filter(p => p.categoryId === category.id);
          if (categoryProviders.length === 0) return null;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (catIndex + 2) }}
              className="px-4 mt-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: category.type === 'telecom' || category.type === 'internet'
                      ? 'rgba(230,0,0,0.08)'
                      : 'rgba(245,158,11,0.08)',
                  }}
                >
                  {getCategoryIcon(category.type, 18)}
                </div>
                <h3 className="text-sm font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                  {category.name}
                </h3>
              </div>

              {/* 3-column Grid - Jaib spec */}
              <div className="grid grid-cols-3 gap-3">
                {categoryProviders.map((provider, index) => {
                  const isFav = favorites.includes(provider.id);
                  return (
                    <motion.button
                      key={provider.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * index }}
                      onClick={() => handleProviderClick(provider)}
                      className="flex flex-col items-center justify-center gap-2 py-4 px-2 card-press relative"
                      style={{
                        background: isDark ? '#1A1A1A' : '#FFFFFF',
                        borderRadius: 16,
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                        boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                        aspectRatio: '1 / 0.95',
                      }}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(provider.id); }}
                        className="absolute top-1.5 left-1.5 z-10"
                      >
                        <Heart
                          size={10}
                          fill={isFav ? '#E60000' : 'none'}
                          color={isFav ? '#E60000' : (isDark ? '#333' : '#DDD')}
                          strokeWidth={2}
                        />
                      </button>

                      <ProviderIcon provider={provider} size={28} />
                      <span
                        className="text-[12px] font-medium text-center leading-tight max-w-[90px]"
                        style={{
                          color: isDark ? '#CCC' : '#444',
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
              </div>
            </motion.div>
          );
        })
      ) : (
        /* Filtered/Search results */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 mt-4"
        >
          {filteredProviders.length === 0 ? (
            <div
              className="rounded-2xl p-8 flex flex-col items-center"
              style={{
                background: isDark ? '#1A1A1A' : '#FFFFFF',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
              }}
            >
              <Search size={32} strokeWidth={1.5} color={isDark ? '#333' : '#DDD'} />
              <p className="text-sm mt-3" style={{ color: isDark ? '#555' : '#AAA' }}>لا توجد نتائج</p>
              <p className="text-[11px] mt-1" style={{ color: isDark ? '#444' : '#CCC' }}>حاول البحث بكلمات أخرى</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filteredProviders.map((provider, index) => {
                const isFav = favorites.includes(provider.id);
                return (
                  <motion.button
                    key={provider.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 * index }}
                    onClick={() => handleProviderClick(provider)}
                    className="flex flex-col items-center justify-center gap-2 py-4 px-2 card-press relative"
                    style={{
                      background: isDark ? '#1A1A1A' : '#FFFFFF',
                      borderRadius: 16,
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                      boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                      aspectRatio: '1 / 0.95',
                    }}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(provider.id); }}
                      className="absolute top-1.5 left-1.5 z-10"
                    >
                      <Heart
                        size={10}
                        fill={isFav ? '#E60000' : 'none'}
                        color={isFav ? '#E60000' : (isDark ? '#333' : '#DDD')}
                        strokeWidth={2}
                      />
                    </button>
                    <ProviderIcon provider={provider} size={28} />
                    <span
                      className="text-[12px] font-medium text-center leading-tight max-w-[90px]"
                      style={{
                        color: isDark ? '#CCC' : '#444',
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
            </div>
          )}
        </motion.div>
      )}

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-4 mt-6"
      >
        <div
          className="rounded-2xl p-5"
          style={{
            background: isDark ? '#1A1A1A' : '#FFFFFF',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <h3 className="text-sm font-bold mb-4" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
            كيف تعمل الخدمة؟
          </h3>
          <div className="space-y-4">
            {howItWorksSteps.map((item, i) => (
              <div key={item.step} className="flex items-start gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                  style={{ background: item.color }}
                >
                  {item.step}
                </motion.div>
                <div>
                  <p className="text-xs font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                    {item.title}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: isDark ? '#666' : '#AAA' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* My Orders */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4 mt-5"
      >
        <button
          onClick={() => useAppStore.getState().setActiveTab('wallet')}
          className="w-full flex items-center justify-between py-3 px-4 rounded-2xl card-press"
          style={{
            background: isDark ? '#1A1A1A' : '#FFFFFF',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(230,0,0,0.08)' }}>
              <Package size={18} strokeWidth={1.5} color="#E60000" />
            </div>
            <div className="text-right">
              <span className="text-sm font-medium block" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>طلباتي</span>
              <span className="text-[10px] block" style={{ color: isDark ? '#555' : '#AAA' }}>متابعة حالة الطلبات</span>
            </div>
          </div>
          <ChevronLeft size={16} strokeWidth={1.5} color={isDark ? '#444' : '#CCC'} />
        </button>
      </motion.div>
    </div>
  );
}
