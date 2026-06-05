'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HomeScreen from '@/components/jaib/home-screen';
import ServicesScreen from '@/components/jaib/services-screen';
import WalletScreen from '@/components/jaib/wallet-screen';
import AccountScreen from '@/components/jaib/account-screen';
import BottomNav, { TabType } from '@/components/jaib/bottom-nav';
import QuickActionDrawer from '@/components/jaib/quick-action-drawer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'services':
        return <ServicesScreen />;
      case 'wallet':
        return <WalletScreen />;
      case 'account':
        return <AccountScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col max-w-md mx-auto relative">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onFabClick={() => setIsDrawerOpen(true)}
      />

      {/* Quick Action Drawer */}
      <QuickActionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
