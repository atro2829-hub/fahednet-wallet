// محفظة الجنوب - South Wallet Products Data
// Comprehensive product catalog for all service providers

export interface ProductItem {
  id: string;
  providerId: string;
  name: string;
  price: number;      // YER price with markup
  priceUSD: number;   // Original USD price
  currency: 'YER';
  executionType: 'manual' | 'auto';
  isActive: boolean;
}

export const EXCHANGE_RATES = {
  USD_TO_YER: 1550,
  SAR_TO_YER: 410,
  YER_TO_USD: 1 / 1550,
  YER_TO_SAR: 1 / 410,
};

export function convertUSDToYER(usd: number): number {
  return Math.round(usd * 1550 * 1.03); // 3% markup
}

export function convertSARToYER(sar: number): number {
  return Math.round(sar * 410 * 1.03);
}

export function getProductsByProvider(providerId: string): ProductItem[] {
  return allProducts.filter(p => p.providerId === providerId);
}

export function getProductsByCategory(
  categoryId: string,
  providers: { id: string; categoryId: string }[]
): ProductItem[] {
  const providerIds = providers.filter(p => p.categoryId === categoryId).map(p => p.id);
  return allProducts.filter(p => providerIds.includes(p.providerId));
}

// Helper to create USD-based products
function usdProduct(
  providerId: string,
  idSuffix: string,
  name: string,
  priceUSD: number,
  executionType: 'manual' | 'auto' = 'auto'
): ProductItem {
  return {
    id: `${providerId}-${idSuffix}`,
    providerId,
    name,
    price: convertUSDToYER(priceUSD),
    priceUSD,
    currency: 'YER',
    executionType,
    isActive: true,
  };
}

// Helper to create YER-based products (telecom, utilities, government)
function yerProduct(
  providerId: string,
  idSuffix: string,
  name: string,
  baseYER: number,
  executionType: 'manual' | 'auto' = 'auto'
): ProductItem {
  return {
    id: `${providerId}-${idSuffix}`,
    providerId,
    name,
    price: Math.round(baseYER * 1.03), // 3% markup
    priceUSD: Math.round((baseYER / 1550) * 100) / 100, // Reverse conversion
    currency: 'YER',
    executionType,
    isActive: true,
  };
}

// ============================================================
// 1. PUBG Mobile (providerId: 'pubg')
// ============================================================
const pubgProducts: ProductItem[] = [
  usdProduct('pubg', 'uc-60', '60 UC', 0.99),
  usdProduct('pubg', 'uc-325', '325 UC', 4.99),
  usdProduct('pubg', 'uc-660', '660 UC', 9.99),
  usdProduct('pubg', 'uc-1800', '1800 UC', 24.99),
  usdProduct('pubg', 'uc-3850', '3850 UC', 49.99),
  usdProduct('pubg', 'uc-8100', '8100 UC', 99.99),
  usdProduct('pubg', 'royal-pass', 'Royal Pass', 11.99),
  usdProduct('pubg', 'royal-pass-elite', 'Royal Pass Elite', 24.99),
  usdProduct('pubg', 'wedding-pack', 'Wedding Pack', 0.99),
  usdProduct('pubg', 'starter-pack', 'Starter Pack', 4.99),
  usdProduct('pubg', 'custom-room-card', 'Custom Room Card', 1.99),
  usdProduct('pubg', 'rename-card', 'Rename Card', 1.99),
  usdProduct('pubg', 'avatar-frame', 'Avatar Frame', 0.99),
  usdProduct('pubg', 'uc-180-bonus', '180 UC Bonus Pack', 3.99),
  usdProduct('pubg', 'uc-400-bonus', '400 UC Bonus Pack', 7.99),
  usdProduct('pubg', 'uc-900-bonus', '900 UC Bonus Pack', 15.99),
  usdProduct('pubg', 'royal-pass-upgrade', 'Royal Pass Upgrade', 11.99),
  usdProduct('pubg', 'skin-crate', 'Skin Crate Coupon', 2.99),
  usdProduct('pubg', 'partner-pack', 'Partner Pack', 9.99),
  usdProduct('pubg', 'anniversary-pack', 'Anniversary Pack', 14.99),
];

// ============================================================
// 2. Free Fire (providerId: 'freefire')
// ============================================================
const freefireProducts: ProductItem[] = [
  usdProduct('freefire', 'diamonds-100', '100 Diamonds', 0.99),
  usdProduct('freefire', 'diamonds-310', '310 Diamonds', 2.99),
  usdProduct('freefire', 'diamonds-520', '520 Diamonds', 4.99),
  usdProduct('freefire', 'diamonds-1060', '1060 Diamonds', 9.99),
  usdProduct('freefire', 'diamonds-2180', '2180 Diamonds', 19.99),
  usdProduct('freefire', 'diamonds-5600', '5600 Diamonds', 49.99),
  usdProduct('freefire', 'membership', 'Membership Monthly', 3.99),
  usdProduct('freefire', 'level-up-pass', 'Level Up Pass', 9.99),
  usdProduct('freefire', 'elite-pass', 'Elite Pass', 9.99),
  usdProduct('freefire', 'elite-bundle', 'Elite Bundle', 19.99),
  usdProduct('freefire', 'incubator-pack', 'Incubator Pack', 4.99),
  usdProduct('freefire', 'weapon-crate', 'Weapon Loot Crate', 1.99),
  usdProduct('freefire', 'diamonds-210-bonus', '210 Diamonds Bonus', 1.99),
  usdProduct('freefire', 'diamonds-1050-bonus', '1050 Diamonds Bonus', 9.99),
  usdProduct('freefire', 'rename-card', 'Rename Card', 1.99),
  usdProduct('freefire', 'resupply-card', 'Resupply Card', 0.99),
  usdProduct('freefire', 'anniversary-pack', 'Anniversary Pack', 14.99),
  usdProduct('freefire', 'summer-pack', 'Summer Pack', 7.99),
  usdProduct('freefire', 'legend-pack', 'Legend Pack', 29.99),
  usdProduct('freefire', 'premium-bundle', 'Premium Bundle', 39.99),
];

// ============================================================
// 3. Call of Duty Mobile (providerId: 'call-of-duty')
// ============================================================
const callOfDutyProducts: ProductItem[] = [
  usdProduct('call-of-duty', 'cp-80', '80 CP', 0.99),
  usdProduct('call-of-duty', 'cp-400', '400 CP', 4.99),
  usdProduct('call-of-duty', 'cp-800', '800 CP', 9.99),
  usdProduct('call-of-duty', 'cp-2000', '2000 CP', 24.99),
  usdProduct('call-of-duty', 'cp-4000', '4000 CP', 49.99),
  usdProduct('call-of-duty', 'cp-8000', '8000 CP', 99.99),
  usdProduct('call-of-duty', 'battle-pass', 'Battle Pass', 9.99),
  usdProduct('call-of-duty', 'battle-pass-bundle', 'Battle Pass Bundle', 24.99),
  usdProduct('call-of-duty', 'starter-pack', 'Starter Pack', 4.99),
  usdProduct('call-of-duty', 'cp-200-bonus', '200 CP Bonus', 2.99),
  usdProduct('call-of-duty', 'cp-1600-bonus', '1600 CP Bonus', 19.99),
  usdProduct('call-of-duty', 'seasonal-pack', 'Seasonal Pack', 14.99),
  usdProduct('call-of-duty', 'weapon-crate', 'Weapon Crate', 1.99),
  usdProduct('call-of-duty', 'legendary-pack', 'Legendary Pack', 29.99),
  usdProduct('call-of-duty', 'rename-token', 'Rename Token', 1.99),
  usdProduct('call-of-duty', 'loadout-slot', 'Extra Loadout Slot', 2.99),
  usdProduct('call-of-duty', 'prime-gaming', 'Prime Gaming Bundle', 9.99),
  usdProduct('call-of-duty', 'zombie-pass', 'Zombie Pass', 9.99),
  usdProduct('call-of-duty', 'elite-pack', 'Elite Pack', 7.99),
  usdProduct('call-of-duty', 'pro-pack', 'Pro Pack', 19.99),
];

// ============================================================
// 4. Clash Royale (providerId: 'clash-royale')
// ============================================================
const clashRoyaleProducts: ProductItem[] = [
  usdProduct('clash-royale', 'gems-80', '80 Gems', 0.99),
  usdProduct('clash-royale', 'gems-500', '500 Gems', 4.99),
  usdProduct('clash-royale', 'gems-1200', '1200 Gems', 9.99),
  usdProduct('clash-royale', 'gems-2500', '2500 Gems', 19.99),
  usdProduct('clash-royale', 'gems-6500', '6500 Gems', 49.99),
  usdProduct('clash-royale', 'gems-14000', '14000 Gems', 99.99),
  usdProduct('clash-royale', 'pass-royale', 'Pass Royale', 4.99),
  usdProduct('clash-royale', 'gold-100k', '100,000 Gold', 0.99),
  usdProduct('clash-royale', 'gold-500k', '500,000 Gold', 4.99),
  usdProduct('clash-royale', 'gold-1m', '1,000,000 Gold', 9.99),
  usdProduct('clash-royale', 'magic-item-1', 'Wild Card Common', 0.99),
  usdProduct('clash-royale', 'magic-item-2', 'Wild Card Rare', 1.99),
  usdProduct('clash-royale', 'magic-item-3', 'Wild Card Epic', 4.99),
  usdProduct('clash-royale', 'magic-item-4', 'Wild Card Legendary', 19.99),
  usdProduct('clash-royale', 'emote-pack', 'Emote Pack', 2.99),
  usdProduct('clash-royale', 'tower-skin', 'Tower Skin', 4.99),
  usdProduct('clash-royale', 'arena-pack', 'Arena Pack', 9.99),
  usdProduct('clash-royale', 'diamond-pass', 'Diamond Pass Royale', 14.99),
  usdProduct('clash-royale', 'mega-chest', 'Mega Lightning Chest', 4.99),
  usdProduct('clash-royale', 'legendary-chest', 'Legendary Chest', 9.99),
];

// ============================================================
// 5. Clash of Clans (providerId: 'clash-of-clans')
// ============================================================
const clashOfClansProducts: ProductItem[] = [
  usdProduct('clash-of-clans', 'gems-80', '80 Gems', 0.99),
  usdProduct('clash-of-clans', 'gems-500', '500 Gems', 4.99),
  usdProduct('clash-of-clans', 'gems-1200', '1200 Gems', 9.99),
  usdProduct('clash-of-clans', 'gems-2500', '2500 Gems', 19.99),
  usdProduct('clash-of-clans', 'gems-6500', '6500 Gems', 49.99),
  usdProduct('clash-of-clans', 'gems-14000', '14000 Gems', 99.99),
  usdProduct('clash-of-clans', 'gold-pass', 'Gold Pass', 4.99),
  usdProduct('clash-of-clans', 'gold-1m', '1,000,000 Gold', 0.99),
  usdProduct('clash-of-clans', 'gold-5m', '5,000,000 Gold', 4.99),
  usdProduct('clash-of-clans', 'elixir-1m', '1,000,000 Elixir', 0.99),
  usdProduct('clash-of-clans', 'elixir-5m', '5,000,000 Elixir', 4.99),
  usdProduct('clash-of-clans', 'dark-elixir-10k', '10,000 Dark Elixir', 4.99),
  usdProduct('clash-of-clans', 'dark-elixir-50k', '50,000 Dark Elixir', 19.99),
  usdProduct('clash-of-clans', 'builder-potion', 'Builder Potion', 0.99),
  usdProduct('clash-of-clans', 'research-potion', 'Research Potion', 0.99),
  usdProduct('clash-of-clans', 'resource-potion', 'Resource Potion', 1.99),
  usdProduct('clash-of-clans', 'hero-potion', 'Hero Potion', 4.99),
  usdProduct('clash-of-clans', 'power-potion', 'Power Potion', 4.99),
  usdProduct('clash-of-clans', 'wall-ring-5', '5 Wall Rings', 0.99),
  usdProduct('clash-of-clans', 'wall-ring-25', '25 Wall Rings', 4.99),
];

// ============================================================
// 6. Roblox (providerId: 'roblox')
// ============================================================
const robloxProducts: ProductItem[] = [
  usdProduct('roblox', 'robux-80', '80 Robux', 0.99),
  usdProduct('roblox', 'robux-200', '200 Robux', 2.99),
  usdProduct('roblox', 'robux-400', '400 Robux', 4.99),
  usdProduct('roblox', 'robux-800', '800 Robux', 9.99),
  usdProduct('roblox', 'robux-1700', '1700 Robux', 19.99),
  usdProduct('roblox', 'robux-4500', '4500 Robux', 49.99),
  usdProduct('roblox', 'robux-10000', '10000 Robux', 99.99),
  usdProduct('roblox', 'premium-450', 'Premium 450', 4.99),
  usdProduct('roblox', 'premium-1000', 'Premium 1000', 9.99),
  usdProduct('roblox', 'premium-2200', 'Premium 2200', 19.99),
  usdProduct('roblox', 'robux-1600-bonus', '1600 Robux Bonus', 19.99),
  usdProduct('roblox', 'robux-400-bonus', '400 Robux Bonus', 4.99),
  usdProduct('roblox', 'game-pass-1', 'Game Pass - Basic', 0.99),
  usdProduct('roblox', 'game-pass-2', 'Game Pass - Standard', 4.99),
  usdProduct('roblox', 'game-pass-3', 'Game Pass - Premium', 9.99),
  usdProduct('roblox', 'classic-clothing', 'Classic Clothing Bundle', 2.99),
  usdProduct('roblox', 'avatar-upgrade', 'Avatar Upgrade Pack', 4.99),
  usdProduct('roblox', 'limited-item', 'Limited Item Access', 14.99),
  usdProduct('roblox', 'robux-4000', '4000 Robux', 44.99),
  usdProduct('roblox', 'robux-750-bonus', '750 Robux Bonus', 9.99),
];

// ============================================================
// 7. Fortnite (providerId: 'fortnite')
// ============================================================
const fortniteProducts: ProductItem[] = [
  usdProduct('fortnite', 'vbucks-1000', '1000 V-Bucks', 9.99),
  usdProduct('fortnite', 'vbucks-2800', '2800 V-Bucks', 24.99),
  usdProduct('fortnite', 'vbucks-5000', '5000 V-Bucks', 39.99),
  usdProduct('fortnite', 'vbucks-13500', '13500 V-Bucks', 79.99),
  usdProduct('fortnite', 'battle-pass', 'Battle Pass', 9.99),
  usdProduct('fortnite', 'battle-bundle', 'Battle Bundle', 24.99),
  usdProduct('fortnite', 'vbucks-500', '500 V-Bucks', 4.99),
  usdProduct('fortnite', 'starter-pack', 'Starter Pack', 3.99),
  usdProduct('fortnite', 'legends-pack', 'Legends Pack', 19.99),
  usdProduct('fortnite', 'manga-pack', 'Manga Series Pack', 14.99),
  usdProduct('fortnite', 'icon-pack', 'Icon Series Pack', 9.99),
  usdProduct('fortnite', 'glider-pack', 'Glider Bundle', 4.99),
  usdProduct('fortnite', 'emote-pack', 'Emote Bundle', 2.99),
  usdProduct('fortnite', 'skin-bundle', 'Skin Bundle', 14.99),
  usdProduct('fortnite', 'wrap-pack', 'Wrap Bundle', 1.99),
  usdProduct('fortnite', 'crew-pack', 'Crew Pack Monthly', 11.99),
  usdProduct('fortnite', 'vbucks-2500', '2500 V-Bucks', 19.99),
  usdProduct('fortnite', 'save-world', 'Save the World', 14.99),
  usdProduct('fortnite', 'neon-pack', 'Neon Pack', 7.99),
  usdProduct('fortnite', 'summer-pack', 'Summer Pack', 12.99),
];

// ============================================================
// 8. Minecraft (providerId: 'minecraft')
// ============================================================
const minecraftProducts: ProductItem[] = [
  usdProduct('minecraft', 'minecoins-320', '320 Minecoins', 1.99),
  usdProduct('minecraft', 'minecoins-1020', '1020 Minecoins', 5.99),
  usdProduct('minecraft', 'minecoins-1720', '1720 Minecoins', 9.99),
  usdProduct('minecraft', 'minecoins-3220', '3220 Minecoins', 18.99),
  usdProduct('minecraft', 'realm-plus-monthly', 'Realm Plus Monthly', 7.99),
  usdProduct('minecraft', 'realm-plus-3m', 'Realm Plus 3 Months', 21.99),
  usdProduct('minecraft', 'realm-plus-6m', 'Realm Plus 6 Months', 39.99),
  usdProduct('minecraft', 'minecoins-5500', '5500 Minecoins', 29.99),
  usdProduct('minecraft', 'minecoins-11000', '11000 Minecoins', 59.99),
  usdProduct('minecraft', 'skin-pack-1', 'Adventure Skin Pack', 2.99),
  usdProduct('minecraft', 'skin-pack-2', 'Fantasy Skin Pack', 3.99),
  usdProduct('minecraft', 'texture-pack-1', 'Natural Texture Pack', 2.99),
  usdProduct('minecraft', 'texture-pack-2', 'City Texture Pack', 2.99),
  usdProduct('minecraft', 'mashup-1', 'Greek Mythology Mashup', 5.99),
  usdProduct('minecraft', 'mashup-2', 'Medieval Mashup', 5.99),
  usdProduct('minecraft', 'world-1', 'Adventure World', 4.99),
  usdProduct('minecraft', 'world-2', 'Survival Island World', 3.99),
  usdProduct('minecraft', 'realm-monthly', 'Realm Monthly (2 Players)', 3.99),
  usdProduct('minecraft', 'marketplace-pass', 'Marketplace Pass', 3.99),
  usdProduct('minecraft', 'minecoins-880', '880 Minecoins', 4.99),
];

// ============================================================
// 9. Valorant (providerId: 'valorant')
// ============================================================
const valorantProducts: ProductItem[] = [
  usdProduct('valorant', 'vp-125', '125 VP', 1.49),
  usdProduct('valorant', 'vp-420', '420 VP', 4.99),
  usdProduct('valorant', 'vp-700', '700 VP', 9.99),
  usdProduct('valorant', 'vp-1375', '1375 VP', 19.99),
  usdProduct('valorant', 'vp-2400', '2400 VP', 34.99),
  usdProduct('valorant', 'vp-4000', '4000 VP', 49.99),
  usdProduct('valorant', 'vp-8150', '8150 VP', 99.99),
  usdProduct('valorant', 'battlepass', 'Battlepass', 9.99),
  usdProduct('valorant', 'battlepass-bundle', 'Battlepass Bundle (20 Levels)', 24.99),
  usdProduct('valorant', 'vp-200-bonus', '200 VP Bonus', 2.99),
  usdProduct('valorant', 'skin-pack-1', 'Deluxe Skin Pack', 14.99),
  usdProduct('valorant', 'skin-pack-2', 'Premium Skin Pack', 29.99),
  usdProduct('valorant', 'player-card', 'Player Card Pack', 2.99),
  usdProduct('valorant', 'buddy-pack', 'Gun Buddy Pack', 4.99),
  usdProduct('valorant', 'spray-pack', 'Spray Pack', 1.99),
  usdProduct('valorant', 'vp-1050-bonus', '1050 VP Bonus', 14.99),
  usdProduct('valorant', 'starter-pack', 'Starter Pack', 4.99),
  usdProduct('valorant', 'night-market', 'Night Market Token', 9.99),
  usdProduct('valorant', 'rgx-pack', 'RGX 11z Pro Pack', 39.99),
  usdProduct('valorant', 'elderflame', 'Elderflame Pack', 49.99),
];

// ============================================================
// 10. League of Legends (providerId: 'league-legends')
// ============================================================
const leagueLegendsProducts: ProductItem[] = [
  usdProduct('league-legends', 'rp-250', '250 RP', 2),
  usdProduct('league-legends', 'rp-500', '500 RP', 5),
  usdProduct('league-legends', 'rp-750', '750 RP', 7.5),
  usdProduct('league-legends', 'rp-1000', '1000 RP', 10),
  usdProduct('league-legends', 'rp-1500', '1500 RP', 15),
  usdProduct('league-legends', 'rp-3000', '3000 RP', 30),
  usdProduct('league-legends', 'rp-5000', '5000 RP', 50),
  usdProduct('league-legends', 'rp-7200', '7200 RP', 72),
  usdProduct('league-legends', 'rp-15000', '15000 RP', 150),
  usdProduct('league-legends', 'skin-1', 'Champion Skin - Basic', 3.9),
  usdProduct('league-legends', 'skin-2', 'Champion Skin - Epic', 7.5),
  usdProduct('league-legends', 'skin-3', 'Champion Skin - Legendary', 13.5),
  usdProduct('league-legends', 'skin-4', 'Champion Skin - Ultimate', 22),
  usdProduct('league-legends', 'champion-1', 'Champion Unlock', 4.9),
  usdProduct('league-legends', 'champion-bundle', 'Champion Bundle (3)', 11.99),
  usdProduct('league-legends', 'emote-pack', 'Emote Pack', 2.5),
  usdProduct('league-legends', 'ward-skin', 'Ward Skin', 2.5),
  usdProduct('league-legends', 'icon-pack', 'Icon Pack', 1.5),
  usdProduct('league-legends', 'pass', 'Event Pass', 13),
  usdProduct('league-legends', 'pass-bundle', 'Event Pass Bundle', 26),
];

// ============================================================
// 11. Genshin Impact (providerId: 'genshin-impact')
// ============================================================
const genshinImpactProducts: ProductItem[] = [
  usdProduct('genshin-impact', 'crystal-60', '60 Genesis Crystals', 0.99),
  usdProduct('genshin-impact', 'crystal-330', '300+30 Genesis Crystals', 4.99),
  usdProduct('genshin-impact', 'crystal-1090', '980+110 Genesis Crystals', 14.99),
  usdProduct('genshin-impact', 'crystal-2240', '1980+260 Genesis Crystals', 29.99),
  usdProduct('genshin-impact', 'crystal-3880', '3280+600 Genesis Crystals', 49.99),
  usdProduct('genshin-impact', 'crystal-8080', '6480+1600 Genesis Crystals', 99.99),
  usdProduct('genshin-impact', 'welkin', 'Blessing of the Welkin Moon', 4.99),
  usdProduct('genshin-impact', 'gnostic-chorus', 'Gnostic Chorus', 9.99),
  usdProduct('genshin-impact', 'gnostic-hymn', 'Gnostic Hymn', 9.99),
  usdProduct('genshin-impact', 'starter-pack', 'Beginner Pack', 0.99),
  usdProduct('genshin-impact', 'adventure-pack', 'Adventure Pack', 4.99),
  usdProduct('genshin-impact', 'vision-pack', 'Vision Pack', 19.99),
  usdProduct('genshin-impact', 'crystal-660', '660 Genesis Crystals', 9.99),
  usdProduct('genshin-impact', 'crystal-2000', '2000 Genesis Crystals', 29.99),
  usdProduct('genshin-impact', 'crystal-4000', '4000 Genesis Crystals', 49.99),
  usdProduct('genshin-impact', 'top-up-1', 'First Top-Up Bonus', 4.99),
  usdProduct('genshin-impact', 'top-up-2', 'Double Crystal Bonus', 9.99),
  usdProduct('genshin-impact', 'namecard', 'Namecard Set', 1.99),
  usdProduct('genshin-impact', 'glider-skin', 'Wind Glider Skin', 14.99),
  usdProduct('genshin-impact', 'anniversary-pack', 'Anniversary Pack', 24.99),
];

// ============================================================
// 12. Honkai Star Rail (providerId: 'honkai-star')
// ============================================================
const honkaiStarProducts: ProductItem[] = [
  usdProduct('honkai-star', 'shard-60', '60 Oneiric Shards', 0.99),
  usdProduct('honkai-star', 'shard-330', '300+30 Oneiric Shards', 4.99),
  usdProduct('honkai-star', 'shard-1090', '980+110 Oneiric Shards', 14.99),
  usdProduct('honkai-star', 'shard-2240', '1980+260 Oneiric Shards', 29.99),
  usdProduct('honkai-star', 'shard-3880', '3280+600 Oneiric Shards', 49.99),
  usdProduct('honkai-star', 'shard-8080', '6480+1600 Oneiric Shards', 99.99),
  usdProduct('honkai-star', 'express-pass', 'Express Supply Pass', 4.99),
  usdProduct('honkai-star', 'nameless-honor', 'Nameless Honor', 9.99),
  usdProduct('honkai-star', 'nameless-medal', 'Nameless Medal', 19.99),
  usdProduct('honkai-star', 'starter-pack', 'Trailblaze Starter Pack', 0.99),
  usdProduct('honkai-star', 'adventure-pack', 'Adventure Pack', 4.99),
  usdProduct('honkai-star', 'shard-660', '660 Oneiric Shards', 9.99),
  usdProduct('honkai-star', 'shard-2000', '2000 Oneiric Shards', 29.99),
  usdProduct('honkai-star', 'shard-4000', '4000 Oneiric Shards', 49.99),
  usdProduct('honkai-star', 'double-bonus', 'First Top-Up Double', 4.99),
  usdProduct('honkai-star', 'phone-wallpaper', 'Phone Wallpaper Pack', 1.99),
  usdProduct('honkai-star', 'anniversary-pack', 'Anniversary Pack', 24.99),
  usdProduct('honkai-star', 'cosmetic-pack', 'Cosmetic Pack', 7.99),
  usdProduct('honkai-star', 'express-bundle', 'Express Bundle', 14.99),
  usdProduct('honkai-star', 'starlight-pack', 'Starlight Pack', 39.99),
];

// ============================================================
// 13. Steam (providerId: 'steam')
// ============================================================
const steamProducts: ProductItem[] = [
  usdProduct('steam', 'wallet-5', 'Steam Wallet $5', 5),
  usdProduct('steam', 'wallet-10', 'Steam Wallet $10', 10),
  usdProduct('steam', 'wallet-20', 'Steam Wallet $20', 20),
  usdProduct('steam', 'wallet-25', 'Steam Wallet $25', 25),
  usdProduct('steam', 'wallet-50', 'Steam Wallet $50', 50),
  usdProduct('steam', 'wallet-100', 'Steam Wallet $100', 100),
  usdProduct('steam', 'wallet-3', 'Steam Wallet $3', 3, 'manual'),
  usdProduct('steam', 'wallet-15', 'Steam Wallet $15', 15, 'manual'),
  usdProduct('steam', 'wallet-30', 'Steam Wallet $30', 30, 'manual'),
  usdProduct('steam', 'game-valve', 'Valve Complete Pack', 39.99, 'manual'),
  usdProduct('steam', 'game-indie-1', 'Indie Game Bundle', 9.99, 'manual'),
  usdProduct('steam', 'game-indie-2', 'Indie Mega Bundle', 19.99, 'manual'),
  usdProduct('steam', 'game-aaa-1', 'AAA Title $29.99', 29.99, 'manual'),
  usdProduct('steam', 'game-aaa-2', 'AAA Title $49.99', 49.99, 'manual'),
  usdProduct('steam', 'game-aaa-3', 'AAA Title $59.99', 59.99, 'manual'),
  usdProduct('steam', 'dlc-basic', 'DLC - Basic', 4.99, 'manual'),
  usdProduct('steam', 'dlc-expansion', 'DLC - Expansion', 14.99, 'manual'),
  usdProduct('steam', 'season-pass', 'Season Pass', 24.99, 'manual'),
  usdProduct('steam', 'gift-card-200', 'Gift Card $200', 200, 'manual'),
  usdProduct('steam', 'wallet-75', 'Steam Wallet $75', 75, 'manual'),
];

// ============================================================
// 14. Netflix (providerId: 'netflix')
// ============================================================
const netflixProducts: ProductItem[] = [
  usdProduct('netflix', 'basic-1m', 'Basic Monthly', 6.99),
  usdProduct('netflix', 'standard-1m', 'Standard Monthly', 15.49),
  usdProduct('netflix', 'premium-1m', 'Premium Monthly', 22.99),
  usdProduct('netflix', 'basic-3m', 'Basic 3 Months', 20.97),
  usdProduct('netflix', 'standard-3m', 'Standard 3 Months', 46.47),
  usdProduct('netflix', 'premium-3m', 'Premium 3 Months', 68.97),
  usdProduct('netflix', 'basic-6m', 'Basic 6 Months', 41.94),
  usdProduct('netflix', 'standard-6m', 'Standard 6 Months', 92.94),
  usdProduct('netflix', 'premium-6m', 'Premium 6 Months', 137.94),
  usdProduct('netflix', 'basic-1y', 'Basic 1 Year', 83.88),
  usdProduct('netflix', 'standard-1y', 'Standard 1 Year', 185.88),
  usdProduct('netflix', 'premium-1y', 'Premium 1 Year', 275.88),
  usdProduct('netflix', 'mobile-1m', 'Mobile Plan Monthly', 4.99),
  usdProduct('netflix', 'mobile-3m', 'Mobile Plan 3 Months', 14.97),
  usdProduct('netflix', 'mobile-6m', 'Mobile Plan 6 Months', 29.94),
  usdProduct('netflix', 'mobile-1y', 'Mobile Plan 1 Year', 59.88),
  usdProduct('netflix', 'standard-ads-1m', 'Standard with Ads Monthly', 6.99),
  usdProduct('netflix', 'standard-ads-3m', 'Standard with Ads 3 Months', 20.97),
  usdProduct('netflix', 'standard-ads-6m', 'Standard with Ads 6 Months', 41.94),
  usdProduct('netflix', 'standard-ads-1y', 'Standard with Ads 1 Year', 83.88),
];

// ============================================================
// 15. Spotify (providerId: 'spotify')
// ============================================================
const spotifyProducts: ProductItem[] = [
  usdProduct('spotify', 'individual-1m', 'Individual Monthly', 9.99),
  usdProduct('spotify', 'duo-1m', 'Duo Monthly', 12.99),
  usdProduct('spotify', 'family-1m', 'Family Monthly', 15.99),
  usdProduct('spotify', 'student-1m', 'Student Monthly', 4.99),
  usdProduct('spotify', 'individual-3m', 'Individual 3 Months', 29.97),
  usdProduct('spotify', 'individual-6m', 'Individual 6 Months', 59.94),
  usdProduct('spotify', 'individual-1y', 'Individual 1 Year', 119.88),
  usdProduct('spotify', 'duo-3m', 'Duo 3 Months', 38.97),
  usdProduct('spotify', 'duo-6m', 'Duo 6 Months', 77.94),
  usdProduct('spotify', 'duo-1y', 'Duo 1 Year', 155.88),
  usdProduct('spotify', 'family-3m', 'Family 3 Months', 47.97),
  usdProduct('spotify', 'family-6m', 'Family 6 Months', 95.94),
  usdProduct('spotify', 'family-1y', 'Family 1 Year', 191.88),
  usdProduct('spotify', 'student-3m', 'Student 3 Months', 14.97),
  usdProduct('spotify', 'student-6m', 'Student 6 Months', 29.94),
  usdProduct('spotify', 'student-1y', 'Student 1 Year', 59.88),
  usdProduct('spotify', 'gift-1m', 'Gift Card 1 Month', 9.99),
  usdProduct('spotify', 'gift-3m', 'Gift Card 3 Months', 29.97),
  usdProduct('spotify', 'gift-6m', 'Gift Card 6 Months', 59.94),
  usdProduct('spotify', 'gift-1y', 'Gift Card 1 Year', 119.88),
];

// ============================================================
// 16. YouTube Premium (providerId: 'youtube-premium')
// ============================================================
const youtubePremiumProducts: ProductItem[] = [
  usdProduct('youtube-premium', 'individual-1m', 'Individual Monthly', 13.99),
  usdProduct('youtube-premium', 'family-1m', 'Family Monthly', 22.99),
  usdProduct('youtube-premium', 'student-1m', 'Student Monthly', 7.99),
  usdProduct('youtube-premium', 'individual-3m', 'Individual 3 Months', 41.97),
  usdProduct('youtube-premium', 'individual-6m', 'Individual 6 Months', 83.94),
  usdProduct('youtube-premium', 'individual-1y', 'Individual 1 Year', 167.88),
  usdProduct('youtube-premium', 'family-3m', 'Family 3 Months', 68.97),
  usdProduct('youtube-premium', 'family-6m', 'Family 6 Months', 137.94),
  usdProduct('youtube-premium', 'family-1y', 'Family 1 Year', 275.88),
  usdProduct('youtube-premium', 'student-3m', 'Student 3 Months', 23.97),
  usdProduct('youtube-premium', 'student-6m', 'Student 6 Months', 47.94),
  usdProduct('youtube-premium', 'student-1y', 'Student 1 Year', 95.88),
  usdProduct('youtube-premium', 'music-1m', 'YouTube Music Monthly', 9.99),
  usdProduct('youtube-premium', 'music-3m', 'YouTube Music 3 Months', 29.97),
  usdProduct('youtube-premium', 'music-6m', 'YouTube Music 6 Months', 59.94),
  usdProduct('youtube-premium', 'music-1y', 'YouTube Music 1 Year', 119.88),
  usdProduct('youtube-premium', 'trial-1m', '1 Month Free Trial', 0.99),
  usdProduct('youtube-premium', 'gift-3m', 'Gift Card 3 Months', 41.97),
  usdProduct('youtube-premium', 'gift-6m', 'Gift Card 6 Months', 83.94),
  usdProduct('youtube-premium', 'gift-1y', 'Gift Card 1 Year', 167.88),
];

// ============================================================
// 17. Google Play (providerId: 'google-play')
// ============================================================
const googlePlayProducts: ProductItem[] = [
  usdProduct('google-play', 'card-5', 'Google Play $5', 5),
  usdProduct('google-play', 'card-10', 'Google Play $10', 10),
  usdProduct('google-play', 'card-15', 'Google Play $15', 15),
  usdProduct('google-play', 'card-25', 'Google Play $25', 25),
  usdProduct('google-play', 'card-50', 'Google Play $50', 50),
  usdProduct('google-play', 'card-100', 'Google Play $100', 100),
  usdProduct('google-play', 'card-200', 'Google Play $200', 200),
  usdProduct('google-play', 'card-300', 'Google Play $300', 300),
  usdProduct('google-play', 'card-500', 'Google Play $500', 500),
  usdProduct('google-play', 'promo-5', 'Promo Code $5', 5),
  usdProduct('google-play', 'promo-10', 'Promo Code $10', 10),
  usdProduct('google-play', 'promo-25', 'Promo Code $25', 25),
  usdProduct('google-play', 'promo-50', 'Promo Code $50', 50),
  usdProduct('google-play', 'gift-5', 'Gift Card $5', 5),
  usdProduct('google-play', 'gift-10', 'Gift Card $10', 10),
  usdProduct('google-play', 'gift-25', 'Gift Card $25', 25),
  usdProduct('google-play', 'gift-50', 'Gift Card $50', 50),
  usdProduct('google-play', 'gift-100', 'Gift Card $100', 100),
  usdProduct('google-play', 'bundle-30', 'Bundle $30', 30),
  usdProduct('google-play', 'bundle-75', 'Bundle $75', 75),
];

// ============================================================
// 18. iTunes (providerId: 'itunes')
// ============================================================
const itunesProducts: ProductItem[] = [
  usdProduct('itunes', 'card-5', 'iTunes $5', 5),
  usdProduct('itunes', 'card-10', 'iTunes $10', 10),
  usdProduct('itunes', 'card-15', 'iTunes $15', 15),
  usdProduct('itunes', 'card-25', 'iTunes $25', 25),
  usdProduct('itunes', 'card-50', 'iTunes $50', 50),
  usdProduct('itunes', 'card-100', 'iTunes $100', 100),
  usdProduct('itunes', 'card-200', 'iTunes $200', 200),
  usdProduct('itunes', 'card-300', 'iTunes $300', 300),
  usdProduct('itunes', 'card-500', 'iTunes $500', 500),
  usdProduct('itunes', 'app-store-5', 'App Store $5', 5),
  usdProduct('itunes', 'app-store-10', 'App Store $10', 10),
  usdProduct('itunes', 'app-store-25', 'App Store $25', 25),
  usdProduct('itunes', 'app-store-50', 'App Store $50', 50),
  usdProduct('itunes', 'app-store-100', 'App Store $100', 100),
  usdProduct('itunes', 'gift-5', 'Gift Card $5', 5),
  usdProduct('itunes', 'gift-10', 'Gift Card $10', 10),
  usdProduct('itunes', 'gift-25', 'Gift Card $25', 25),
  usdProduct('itunes', 'gift-50', 'Gift Card $50', 50),
  usdProduct('itunes', 'bundle-30', 'Bundle $30', 30),
  usdProduct('itunes', 'bundle-75', 'Bundle $75', 75),
];

// ============================================================
// 19. Amazon (providerId: 'amazon')
// ============================================================
const amazonProducts: ProductItem[] = [
  usdProduct('amazon', 'card-5', 'Amazon Gift Card $5', 5),
  usdProduct('amazon', 'card-10', 'Amazon Gift Card $10', 10),
  usdProduct('amazon', 'card-15', 'Amazon Gift Card $15', 15),
  usdProduct('amazon', 'card-25', 'Amazon Gift Card $25', 25),
  usdProduct('amazon', 'card-50', 'Amazon Gift Card $50', 50),
  usdProduct('amazon', 'card-100', 'Amazon Gift Card $100', 100),
  usdProduct('amazon', 'card-200', 'Amazon Gift Card $200', 200),
  usdProduct('amazon', 'card-300', 'Amazon Gift Card $300', 300),
  usdProduct('amazon', 'card-500', 'Amazon Gift Card $500', 500),
  usdProduct('amazon', 'prime-1m', 'Amazon Prime Monthly', 14.99),
  usdProduct('amazon', 'prime-1y', 'Amazon Prime 1 Year', 139),
  usdProduct('amazon', 'prime-student', 'Prime Student Monthly', 7.49),
  usdProduct('amazon', 'music-1m', 'Amazon Music Monthly', 9.99),
  usdProduct('amazon', 'kindle-unlimited', 'Kindle Unlimited Monthly', 11.99),
  usdProduct('amazon', 'audible-1m', 'Audible Monthly', 14.95),
  usdProduct('amazon', 'card-25-gift', 'Gift Box $25', 25),
  usdProduct('amazon', 'card-50-gift', 'Gift Box $50', 50),
  usdProduct('amazon', 'card-75', 'Gift Card $75', 75),
  usdProduct('amazon', 'card-150', 'Gift Card $150', 150),
  usdProduct('amazon', 'card-250', 'Gift Card $250', 250),
];

// ============================================================
// 20. PlayStation Network (providerId: 'psn')
// ============================================================
const psnProducts: ProductItem[] = [
  usdProduct('psn', 'card-5', 'PSN Card $5', 5),
  usdProduct('psn', 'card-10', 'PSN Card $10', 10),
  usdProduct('psn', 'card-15', 'PSN Card $15', 15),
  usdProduct('psn', 'card-25', 'PSN Card $25', 25),
  usdProduct('psn', 'card-50', 'PSN Card $50', 50),
  usdProduct('psn', 'card-100', 'PSN Card $100', 100),
  usdProduct('psn', 'plus-1m', 'PS Plus Essential Monthly', 9.99),
  usdProduct('psn', 'plus-3m', 'PS Plus Essential 3 Months', 24.99),
  usdProduct('psn', 'plus-1y', 'PS Plus Essential 1 Year', 59.99),
  usdProduct('psn', 'plus-extra-1y', 'PS Plus Extra 1 Year', 99.99),
  usdProduct('psn', 'plus-premium-1y', 'PS Plus Premium 1 Year', 159.99),
  usdProduct('psn', 'now-1m', 'PS Now Monthly', 9.99),
  usdProduct('psn', 'card-200', 'PSN Card $200', 200),
  usdProduct('psn', 'card-300', 'PSN Card $300', 300),
  usdProduct('psn', 'card-500', 'PSN Card $500', 500),
  usdProduct('psn', 'game-29', 'Game Download $29.99', 29.99, 'manual'),
  usdProduct('psn', 'game-49', 'Game Download $49.99', 49.99, 'manual'),
  usdProduct('psn', 'game-69', 'Game Download $69.99', 69.99, 'manual'),
  usdProduct('psn', 'add-on-10', 'Add-On $9.99', 9.99, 'manual'),
  usdProduct('psn', 'add-on-25', 'Add-On $24.99', 24.99, 'manual'),
];

// ============================================================
// 21. Xbox (providerId: 'xbox')
// ============================================================
const xboxProducts: ProductItem[] = [
  usdProduct('xbox', 'card-5', 'Xbox Gift Card $5', 5),
  usdProduct('xbox', 'card-10', 'Xbox Gift Card $10', 10),
  usdProduct('xbox', 'card-15', 'Xbox Gift Card $15', 15),
  usdProduct('xbox', 'card-25', 'Xbox Gift Card $25', 25),
  usdProduct('xbox', 'card-50', 'Xbox Gift Card $50', 50),
  usdProduct('xbox', 'card-100', 'Xbox Gift Card $100', 100),
  usdProduct('xbox', 'game-pass-1m', 'Game Pass Core Monthly', 9.99),
  usdProduct('xbox', 'game-pass-3m', 'Game Pass Core 3 Months', 24.99),
  usdProduct('xbox', 'game-pass-1y', 'Game Pass Core 1 Year', 59.99),
  usdProduct('xbox', 'game-pass-ultimate-1m', 'Game Pass Ultimate Monthly', 16.99),
  usdProduct('xbox', 'game-pass-ultimate-3m', 'Game Pass Ultimate 3 Months', 49.99),
  usdProduct('xbox', 'live-1m', 'Xbox Live Gold Monthly', 9.99),
  usdProduct('xbox', 'live-3m', 'Xbox Live Gold 3 Months', 24.99),
  usdProduct('xbox', 'live-1y', 'Xbox Live Gold 1 Year', 59.99),
  usdProduct('xbox', 'card-200', 'Xbox Gift Card $200', 200),
  usdProduct('xbox', 'card-300', 'Xbox Gift Card $300', 300),
  usdProduct('xbox', 'card-500', 'Xbox Gift Card $500', 500),
  usdProduct('xbox', 'game-29', 'Game Download $29.99', 29.99, 'manual'),
  usdProduct('xbox', 'game-49', 'Game Download $49.99', 49.99, 'manual'),
  usdProduct('xbox', 'game-69', 'Game Download $69.99', 69.99, 'manual'),
];

// ============================================================
// 22. Nintendo (providerId: 'nintendo')
// ============================================================
const nintendoProducts: ProductItem[] = [
  usdProduct('nintendo', 'card-5', 'Nintendo eShop $5', 5),
  usdProduct('nintendo', 'card-10', 'Nintendo eShop $10', 10),
  usdProduct('nintendo', 'card-15', 'Nintendo eShop $15', 15),
  usdProduct('nintendo', 'card-25', 'Nintendo eShop $25', 25),
  usdProduct('nintendo', 'card-50', 'Nintendo eShop $50', 50),
  usdProduct('nintendo', 'card-100', 'Nintendo eShop $100', 100),
  usdProduct('nintendo', 'online-1m', 'Nintendo Switch Online Monthly', 3.99),
  usdProduct('nintendo', 'online-3m', 'Nintendo Switch Online 3 Months', 7.99),
  usdProduct('nintendo', 'online-1y', 'Nintendo Switch Online 1 Year', 19.99),
  usdProduct('nintendo', 'online-family-1y', 'NSO Family 1 Year', 34.99),
  usdProduct('nintendo', 'online-expansion-1y', 'NSO + Expansion Pack 1 Year', 49.99),
  usdProduct('nintendo', 'online-expansion-family', 'NSO + Expansion Family', 79.99),
  usdProduct('nintendo', 'card-200', 'Nintendo eShop $200', 200),
  usdProduct('nintendo', 'card-300', 'Nintendo eShop $300', 300),
  usdProduct('nintendo', 'card-500', 'Nintendo eShop $500', 500),
  usdProduct('nintendo', 'game-29', 'Game Download $29.99', 29.99, 'manual'),
  usdProduct('nintendo', 'game-49', 'Game Download $49.99', 49.99, 'manual'),
  usdProduct('nintendo', 'game-59', 'Game Download $59.99', 59.99, 'manual'),
  usdProduct('nintendo', 'dlc-10', 'DLC $9.99', 9.99, 'manual'),
  usdProduct('nintendo', 'dlc-25', 'DLC $24.99', 24.99, 'manual'),
];

// ============================================================
// 23. Visa Virtual (providerId: 'visa-virtual')
// ============================================================
const visaVirtualProducts: ProductItem[] = [
  usdProduct('visa-virtual', 'card-5', 'Visa Virtual $5', 5),
  usdProduct('visa-virtual', 'card-10', 'Visa Virtual $10', 10),
  usdProduct('visa-virtual', 'card-15', 'Visa Virtual $15', 15),
  usdProduct('visa-virtual', 'card-25', 'Visa Virtual $25', 25),
  usdProduct('visa-virtual', 'card-50', 'Visa Virtual $50', 50),
  usdProduct('visa-virtual', 'card-100', 'Visa Virtual $100', 100),
  usdProduct('visa-virtual', 'card-200', 'Visa Virtual $200', 200),
  usdProduct('visa-virtual', 'card-300', 'Visa Virtual $300', 300),
  usdProduct('visa-virtual', 'card-500', 'Visa Virtual $500', 500),
  usdProduct('visa-virtual', 'card-1000', 'Visa Virtual $1000', 1000),
  usdProduct('visa-virtual', 'card-20', 'Visa Virtual $20', 20),
  usdProduct('visa-virtual', 'card-30', 'Visa Virtual $30', 30),
  usdProduct('visa-virtual', 'card-40', 'Visa Virtual $40', 40),
  usdProduct('visa-virtual', 'card-75', 'Visa Virtual $75', 75),
  usdProduct('visa-virtual', 'card-150', 'Visa Virtual $150', 150),
  usdProduct('visa-virtual', 'card-250', 'Visa Virtual $250', 250),
  usdProduct('visa-virtual', 'card-750', 'Visa Virtual $750', 750),
  usdProduct('visa-virtual', 'prepaid-25', 'Prepaid Visa $25', 25),
  usdProduct('visa-virtual', 'prepaid-50', 'Prepaid Visa $50', 50),
  usdProduct('visa-virtual', 'prepaid-100', 'Prepaid Visa $100', 100),
];

// ============================================================
// 24. Mastercard Virtual (providerId: 'mastercard-virtual')
// ============================================================
const mastercardVirtualProducts: ProductItem[] = [
  usdProduct('mastercard-virtual', 'card-5', 'Mastercard Virtual $5', 5),
  usdProduct('mastercard-virtual', 'card-10', 'Mastercard Virtual $10', 10),
  usdProduct('mastercard-virtual', 'card-15', 'Mastercard Virtual $15', 15),
  usdProduct('mastercard-virtual', 'card-25', 'Mastercard Virtual $25', 25),
  usdProduct('mastercard-virtual', 'card-50', 'Mastercard Virtual $50', 50),
  usdProduct('mastercard-virtual', 'card-100', 'Mastercard Virtual $100', 100),
  usdProduct('mastercard-virtual', 'card-200', 'Mastercard Virtual $200', 200),
  usdProduct('mastercard-virtual', 'card-300', 'Mastercard Virtual $300', 300),
  usdProduct('mastercard-virtual', 'card-500', 'Mastercard Virtual $500', 500),
  usdProduct('mastercard-virtual', 'card-1000', 'Mastercard Virtual $1000', 1000),
  usdProduct('mastercard-virtual', 'card-20', 'Mastercard Virtual $20', 20),
  usdProduct('mastercard-virtual', 'card-30', 'Mastercard Virtual $30', 30),
  usdProduct('mastercard-virtual', 'card-40', 'Mastercard Virtual $40', 40),
  usdProduct('mastercard-virtual', 'card-75', 'Mastercard Virtual $75', 75),
  usdProduct('mastercard-virtual', 'card-150', 'Mastercard Virtual $150', 150),
  usdProduct('mastercard-virtual', 'card-250', 'Mastercard Virtual $250', 250),
  usdProduct('mastercard-virtual', 'card-750', 'Mastercard Virtual $750', 750),
  usdProduct('mastercard-virtual', 'prepaid-25', 'Prepaid Mastercard $25', 25),
  usdProduct('mastercard-virtual', 'prepaid-50', 'Prepaid Mastercard $50', 50),
  usdProduct('mastercard-virtual', 'prepaid-100', 'Prepaid Mastercard $100', 100),
];

// ============================================================
// 25. PayPal (providerId: 'paypal')
// ============================================================
const paypalProducts: ProductItem[] = [
  usdProduct('paypal', 'card-5', 'PayPal $5', 5),
  usdProduct('paypal', 'card-10', 'PayPal $10', 10),
  usdProduct('paypal', 'card-15', 'PayPal $15', 15),
  usdProduct('paypal', 'card-25', 'PayPal $25', 25),
  usdProduct('paypal', 'card-50', 'PayPal $50', 50),
  usdProduct('paypal', 'card-100', 'PayPal $100', 100),
  usdProduct('paypal', 'card-200', 'PayPal $200', 200),
  usdProduct('paypal', 'card-300', 'PayPal $300', 300),
  usdProduct('paypal', 'card-500', 'PayPal $500', 500),
  usdProduct('paypal', 'card-1000', 'PayPal $1000', 1000),
  usdProduct('paypal', 'card-20', 'PayPal $20', 20),
  usdProduct('paypal', 'card-30', 'PayPal $30', 30),
  usdProduct('paypal', 'card-40', 'PayPal $40', 40),
  usdProduct('paypal', 'card-75', 'PayPal $75', 75),
  usdProduct('paypal', 'card-150', 'PayPal $150', 150),
  usdProduct('paypal', 'card-250', 'PayPal $250', 250),
  usdProduct('paypal', 'card-750', 'PayPal $750', 750),
  usdProduct('paypal', 'gift-25', 'Gift Card $25', 25),
  usdProduct('paypal', 'gift-50', 'Gift Card $50', 50),
  usdProduct('paypal', 'gift-100', 'Gift Card $100', 100),
];

// ============================================================
// 26. Yemen Mobile (providerId: 'yemen-mobile')
// ============================================================
const yemenMobileProducts: ProductItem[] = [
  // Recharge
  yerProduct('yemen-mobile', 'recharge-50', 'شحن رصيد 50 ريال', 50),
  yerProduct('yemen-mobile', 'recharge-100', 'شحن رصيد 100 ريال', 100),
  yerProduct('yemen-mobile', 'recharge-200', 'شحن رصيد 200 ريال', 200),
  yerProduct('yemen-mobile', 'recharge-300', 'شحن رصيد 300 ريال', 300),
  yerProduct('yemen-mobile', 'recharge-500', 'شحن رصيد 500 ريال', 500),
  yerProduct('yemen-mobile', 'recharge-1000', 'شحن رصيد 1000 ريال', 1000),
  yerProduct('yemen-mobile', 'recharge-2000', 'شحن رصيد 2000 ريال', 2000),
  yerProduct('yemen-mobile', 'recharge-3000', 'شحن رصيد 3000 ريال', 3000),
  yerProduct('yemen-mobile', 'recharge-5000', 'شحن رصيد 5000 ريال', 5000),
  // Internet Packages
  yerProduct('yemen-mobile', 'net-daily-500mb', 'باقة يومية 500 ميجا', 100),
  yerProduct('yemen-mobile', 'net-daily-1gb', 'باقة يومية 1 جيجا', 200),
  yerProduct('yemen-mobile', 'net-weekly-2gb', 'باقة أسبوعية 2 جيجا', 500),
  yerProduct('yemen-mobile', 'net-weekly-5gb', 'باقة أسبوعية 5 جيجا', 1000),
  yerProduct('yemen-mobile', 'net-monthly-5gb', 'باقة شهرية 5 جيجا', 2000),
  yerProduct('yemen-mobile', 'net-monthly-10gb', 'باقة شهرية 10 جيجا', 3500),
  yerProduct('yemen-mobile', 'net-monthly-20gb', 'باقة شهرية 20 جيجا', 5000),
  yerProduct('yemen-mobile', 'net-monthly-unlimited', 'باقة شهرية غير محدودة', 8000),
  // Call Packages
  yerProduct('yemen-mobile', 'call-50min', 'باقة مكالمات 50 دقيقة', 200),
  yerProduct('yemen-mobile', 'call-100min', 'باقة مكالمات 100 دقيقة', 350),
  yerProduct('yemen-mobile', 'call-200min', 'باقة مكالمات 200 دقيقة', 600),
  // Combined Packages
  yerProduct('yemen-mobile', 'combo-daily', 'باقة يومية متكاملة', 300),
  yerProduct('yemen-mobile', 'combo-weekly', 'باقة أسبوعية متكاملة', 1500),
  yerProduct('yemen-mobile', 'combo-monthly', 'باقة شهرية متكاملة', 4000),
];

// ============================================================
// 27. Yo (providerId: 'yo')
// ============================================================
const yoProducts: ProductItem[] = [
  // Recharge
  yerProduct('yo', 'recharge-50', 'شحن رصيد 50 ريال', 50),
  yerProduct('yo', 'recharge-100', 'شحن رصيد 100 ريال', 100),
  yerProduct('yo', 'recharge-200', 'شحن رصيد 200 ريال', 200),
  yerProduct('yo', 'recharge-300', 'شحن رصيد 300 ريال', 300),
  yerProduct('yo', 'recharge-500', 'شحن رصيد 500 ريال', 500),
  yerProduct('yo', 'recharge-1000', 'شحن رصيد 1000 ريال', 1000),
  yerProduct('yo', 'recharge-2000', 'شحن رصيد 2000 ريال', 2000),
  yerProduct('yo', 'recharge-3000', 'شحن رصيد 3000 ريال', 3000),
  yerProduct('yo', 'recharge-5000', 'شحن رصيد 5000 ريال', 5000),
  // Internet Packages
  yerProduct('yo', 'net-daily-500mb', 'باقة يومية 500 ميجا', 100),
  yerProduct('yo', 'net-daily-1gb', 'باقة يومية 1 جيجا', 200),
  yerProduct('yo', 'net-weekly-3gb', 'باقة أسبوعية 3 جيجا', 600),
  yerProduct('yo', 'net-weekly-5gb', 'باقة أسبوعية 5 جيجا', 1000),
  yerProduct('yo', 'net-monthly-5gb', 'باقة شهرية 5 جيجا', 2000),
  yerProduct('yo', 'net-monthly-10gb', 'باقة شهرية 10 جيجا', 3500),
  yerProduct('yo', 'net-monthly-25gb', 'باقة شهرية 25 جيجا', 5500),
  yerProduct('yo', 'net-monthly-unlimited', 'باقة شهرية غير محدودة', 8000),
  // Call Packages
  yerProduct('yo', 'call-50min', 'باقة مكالمات 50 دقيقة', 200),
  yerProduct('yo', 'call-100min', 'باقة مكالمات 100 دقيقة', 350),
  yerProduct('yo', 'call-unlimited', 'باقة مكالمات غير محدودة', 1500),
  // Combined Packages
  yerProduct('yo', 'combo-daily', 'باقة يومية متكاملة', 300),
  yerProduct('yo', 'combo-weekly', 'باقة أسبوعية متكاملة', 1500),
  yerProduct('yo', 'combo-monthly', 'باقة شهرية متكاملة', 4500),
];

// ============================================================
// 28. Sabafon (providerId: 'sabafon')
// ============================================================
const sabafonProducts: ProductItem[] = [
  // Recharge
  yerProduct('sabafon', 'recharge-50', 'شحن رصيد 50 ريال', 50),
  yerProduct('sabafon', 'recharge-100', 'شحن رصيد 100 ريال', 100),
  yerProduct('sabafon', 'recharge-200', 'شحن رصيد 200 ريال', 200),
  yerProduct('sabafon', 'recharge-300', 'شحن رصيد 300 ريال', 300),
  yerProduct('sabafon', 'recharge-500', 'شحن رصيد 500 ريال', 500),
  yerProduct('sabafon', 'recharge-1000', 'شحن رصيد 1000 ريال', 1000),
  yerProduct('sabafon', 'recharge-2000', 'شحن رصيد 2000 ريال', 2000),
  yerProduct('sabafon', 'recharge-3000', 'شحن رصيد 3000 ريال', 3000),
  yerProduct('sabafon', 'recharge-5000', 'شحن رصيد 5000 ريال', 5000),
  // Internet Packages
  yerProduct('sabafon', 'net-daily-500mb', 'باقة يومية 500 ميجا', 100),
  yerProduct('sabafon', 'net-daily-1gb', 'باقة يومية 1 جيجا', 200),
  yerProduct('sabafon', 'net-weekly-2gb', 'باقة أسبوعية 2 جيجا', 500),
  yerProduct('sabafon', 'net-weekly-5gb', 'باقة أسبوعية 5 جيجا', 1000),
  yerProduct('sabafon', 'net-monthly-5gb', 'باقة شهرية 5 جيجا', 2000),
  yerProduct('sabafon', 'net-monthly-10gb', 'باقة شهرية 10 جيجا', 3500),
  yerProduct('sabafon', 'net-monthly-20gb', 'باقة شهرية 20 جيجا', 5500),
  yerProduct('sabafon', 'net-monthly-unlimited', 'باقة شهرية غير محدودة', 8500),
  // Call Packages
  yerProduct('sabafon', 'call-60min', 'باقة مكالمات 60 دقيقة', 200),
  yerProduct('sabafon', 'call-120min', 'باقة مكالمات 120 دقيقة', 400),
  yerProduct('sabafon', 'call-unlimited', 'باقة مكالمات غير محدودة', 1500),
  // Combined Packages
  yerProduct('sabafon', 'combo-daily', 'باقة يومية متكاملة', 250),
  yerProduct('sabafon', 'combo-weekly', 'باقة أسبوعية متكاملة', 1200),
  yerProduct('sabafon', 'combo-monthly', 'باقة شهرية متكاملة', 4000),
];

// ============================================================
// 29. Y Telecom (providerId: 'y')
// ============================================================
const yTelecomProducts: ProductItem[] = [
  // Recharge
  yerProduct('y', 'recharge-50', 'شحن رصيد 50 ريال', 50),
  yerProduct('y', 'recharge-100', 'شحن رصيد 100 ريال', 100),
  yerProduct('y', 'recharge-200', 'شحن رصيد 200 ريال', 200),
  yerProduct('y', 'recharge-300', 'شحن رصيد 300 ريال', 300),
  yerProduct('y', 'recharge-500', 'شحن رصيد 500 ريال', 500),
  yerProduct('y', 'recharge-1000', 'شحن رصيد 1000 ريال', 1000),
  yerProduct('y', 'recharge-2000', 'شحن رصيد 2000 ريال', 2000),
  yerProduct('y', 'recharge-3000', 'شحن رصيد 3000 ريال', 3000),
  yerProduct('y', 'recharge-5000', 'شحن رصيد 5000 ريال', 5000),
  // Internet Packages
  yerProduct('y', 'net-daily-500mb', 'باقة يومية 500 ميجا', 100),
  yerProduct('y', 'net-daily-1gb', 'باقة يومية 1 جيجا', 200),
  yerProduct('y', 'net-weekly-2gb', 'باقة أسبوعية 2 جيجا', 500),
  yerProduct('y', 'net-weekly-5gb', 'باقة أسبوعية 5 جيجا', 1000),
  yerProduct('y', 'net-monthly-5gb', 'باقة شهرية 5 جيجا', 2000),
  yerProduct('y', 'net-monthly-10gb', 'باقة شهرية 10 جيجا', 3500),
  yerProduct('y', 'net-monthly-20gb', 'باقة شهرية 20 جيجا', 5000),
  yerProduct('y', 'net-monthly-unlimited', 'باقة شهرية غير محدودة', 7500),
  // Call Packages
  yerProduct('y', 'call-50min', 'باقة مكالمات 50 دقيقة', 200),
  yerProduct('y', 'call-100min', 'باقة مكالمات 100 دقيقة', 350),
  yerProduct('y', 'call-200min', 'باقة مكالمات 200 دقيقة', 600),
  // Combined Packages
  yerProduct('y', 'combo-daily', 'باقة يومية متكاملة', 300),
  yerProduct('y', 'combo-weekly', 'باقة أسبوعية متكاملة', 1300),
  yerProduct('y', 'combo-monthly', 'باقة شهرية متكاملة', 4000),
];

// ============================================================
// 30. Yemen Net (providerId: 'yemen-net')
// ============================================================
const yemenNetProducts: ProductItem[] = [
  // ADSL Internet Packages
  yerProduct('yemen-net', 'adsl-1mb-monthly', 'ADSL 1 ميجا شهري', 3000),
  yerProduct('yemen-net', 'adsl-2mb-monthly', 'ADSL 2 ميجا شهري', 5000),
  yerProduct('yemen-net', 'adsl-4mb-monthly', 'ADSL 4 ميجا شهري', 8000),
  yerProduct('yemen-net', 'adsl-8mb-monthly', 'ADSL 8 ميجا شهري', 12000),
  // Fiber Optic Packages
  yerProduct('yemen-net', 'fiber-10mb-monthly', 'فايبر 10 ميجا شهري', 6000),
  yerProduct('yemen-net', 'fiber-20mb-monthly', 'فايبر 20 ميجا شهري', 10000),
  yerProduct('yemen-net', 'fiber-50mb-monthly', 'فايبر 50 ميجا شهري', 18000),
  // 3G/4G Internet
  yerProduct('yemen-net', '4g-daily-1gb', '4G يومي 1 جيجا', 200),
  yerProduct('yemen-net', '4g-daily-2gb', '4G يومي 2 جيجا', 350),
  yerProduct('yemen-net', '4g-weekly-5gb', '4G أسبوعي 5 جيجا', 1000),
  yerProduct('yemen-net', '4g-weekly-10gb', '4G أسبوعي 10 جيجا', 1800),
  yerProduct('yemen-net', '4g-monthly-10gb', '4G شهري 10 جيجا', 3000),
  yerProduct('yemen-net', '4g-monthly-25gb', '4G شهري 25 جيجا', 5500),
  yerProduct('yemen-net', '4g-monthly-50gb', '4G شهري 50 جيجا', 9000),
  yerProduct('yemen-net', '4g-monthly-unlimited', '4G شهري غير محدود', 15000),
  // Quarterly / Annual
  yerProduct('yemen-net', 'adsl-2mb-quarterly', 'ADSL 2 ميجا ربع سنوي', 14000),
  yerProduct('yemen-net', 'adsl-4mb-quarterly', 'ADSL 4 ميجا ربع سنوي', 22000),
  yerProduct('yemen-net', 'fiber-20mb-quarterly', 'فايبر 20 ميجا ربع سنوي', 28000),
  yerProduct('yemen-net', 'fiber-50mb-quarterly', 'فايبر 50 ميجا ربع سنوي', 50000),
  yerProduct('yemen-net', 'adsl-2mb-annual', 'ADSL 2 ميجا سنوي', 55000),
  yerProduct('yemen-net', 'adsl-4mb-annual', 'ADSL 4 ميجا سنوي', 88000),
];

// ============================================================
// 31. Electricity Sanaa (providerId: 'elec-sanaa')
// ============================================================
const elecSanaaProducts: ProductItem[] = [
  yerProduct('elec-sanaa', 'pay-500', 'دفع فاتورة كهرباء 500 ريال', 500),
  yerProduct('elec-sanaa', 'pay-1000', 'دفع فاتورة كهرباء 1000 ريال', 1000),
  yerProduct('elec-sanaa', 'pay-2000', 'دفع فاتورة كهرباء 2000 ريال', 2000),
  yerProduct('elec-sanaa', 'pay-3000', 'دفع فاتورة كهرباء 3000 ريال', 3000),
  yerProduct('elec-sanaa', 'pay-5000', 'دفع فاتورة كهرباء 5000 ريال', 5000),
  yerProduct('elec-sanaa', 'pay-10000', 'دفع فاتورة كهرباء 10000 ريال', 10000),
  yerProduct('elec-sanaa', 'pay-15000', 'دفع فاتورة كهرباء 15000 ريال', 15000),
  yerProduct('elec-sanaa', 'pay-20000', 'دفع فاتورة كهرباء 20000 ريال', 20000),
  yerProduct('elec-sanaa', 'pay-25000', 'دفع فاتورة كهرباء 25000 ريال', 25000),
  yerProduct('elec-sanaa', 'pay-30000', 'دفع فاتورة كهرباء 30000 ريال', 30000),
  yerProduct('elec-sanaa', 'meter-reading', 'قراءة عداد', 200),
  yerProduct('elec-sanaa', 'new-connection', 'ربط عداد جديد', 25000),
  yerProduct('elec-sanaa', 'reconnect', 'إعادة ربط', 5000),
  yerProduct('elec-sanaa', 'pay-40000', 'دفع فاتورة كهرباء 40000 ريال', 40000),
  yerProduct('elec-sanaa', 'pay-50000', 'دفع فاتورة كهرباء 50000 ريال', 50000),
  yerProduct('elec-sanaa', 'pay-75000', 'دفع فاتورة كهرباء 75000 ريال', 75000),
  yerProduct('elec-sanaa', 'pay-100000', 'دفع فاتورة كهرباء 100000 ريال', 100000),
  yerProduct('elec-sanaa', 'prepaid-500', 'كهرباء مسبقة الدفع 500', 500),
  yerProduct('elec-sanaa', 'prepaid-1000', 'كهرباء مسبقة الدفع 1000', 1000),
  yerProduct('elec-sanaa', 'prepaid-2000', 'كهرباء مسبقة الدفع 2000', 2000),
];

// ============================================================
// 32. Electricity Aden (providerId: 'elec-aden')
// ============================================================
const elecAdenProducts: ProductItem[] = [
  yerProduct('elec-aden', 'pay-500', 'دفع فاتورة كهرباء 500 ريال', 500),
  yerProduct('elec-aden', 'pay-1000', 'دفع فاتورة كهرباء 1000 ريال', 1000),
  yerProduct('elec-aden', 'pay-2000', 'دفع فاتورة كهرباء 2000 ريال', 2000),
  yerProduct('elec-aden', 'pay-3000', 'دفع فاتورة كهرباء 3000 ريال', 3000),
  yerProduct('elec-aden', 'pay-5000', 'دفع فاتورة كهرباء 5000 ريال', 5000),
  yerProduct('elec-aden', 'pay-10000', 'دفع فاتورة كهرباء 10000 ريال', 10000),
  yerProduct('elec-aden', 'pay-15000', 'دفع فاتورة كهرباء 15000 ريال', 15000),
  yerProduct('elec-aden', 'pay-20000', 'دفع فاتورة كهرباء 20000 ريال', 20000),
  yerProduct('elec-aden', 'pay-25000', 'دفع فاتورة كهرباء 25000 ريال', 25000),
  yerProduct('elec-aden', 'pay-30000', 'دفع فاتورة كهرباء 30000 ريال', 30000),
  yerProduct('elec-aden', 'meter-reading', 'قراءة عداد', 200),
  yerProduct('elec-aden', 'new-connection', 'ربط عداد جديد', 25000),
  yerProduct('elec-aden', 'reconnect', 'إعادة ربط', 5000),
  yerProduct('elec-aden', 'pay-40000', 'دفع فاتورة كهرباء 40000 ريال', 40000),
  yerProduct('elec-aden', 'pay-50000', 'دفع فاتورة كهرباء 50000 ريال', 50000),
  yerProduct('elec-aden', 'pay-75000', 'دفع فاتورة كهرباء 75000 ريال', 75000),
  yerProduct('elec-aden', 'pay-100000', 'دفع فاتورة كهرباء 100000 ريال', 100000),
  yerProduct('elec-aden', 'prepaid-500', 'كهرباء مسبقة الدفع 500', 500),
  yerProduct('elec-aden', 'prepaid-1000', 'كهرباء مسبقة الدفع 1000', 1000),
  yerProduct('elec-aden', 'prepaid-2000', 'كهرباء مسبقة الدفع 2000', 2000),
];

// ============================================================
// 33. Water Sanaa (providerId: 'water-sanaa')
// ============================================================
const waterSanaaProducts: ProductItem[] = [
  yerProduct('water-sanaa', 'pay-500', 'دفع فاتورة مياه 500 ريال', 500),
  yerProduct('water-sanaa', 'pay-1000', 'دفع فاتورة مياه 1000 ريال', 1000),
  yerProduct('water-sanaa', 'pay-2000', 'دفع فاتورة مياه 2000 ريال', 2000),
  yerProduct('water-sanaa', 'pay-3000', 'دفع فاتورة مياه 3000 ريال', 3000),
  yerProduct('water-sanaa', 'pay-5000', 'دفع فاتورة مياه 5000 ريال', 5000),
  yerProduct('water-sanaa', 'pay-10000', 'دفع فاتورة مياه 10000 ريال', 10000),
  yerProduct('water-sanaa', 'pay-15000', 'دفع فاتورة مياه 15000 ريال', 15000),
  yerProduct('water-sanaa', 'pay-20000', 'دفع فاتورة مياه 20000 ريال', 20000),
  yerProduct('water-sanaa', 'pay-30000', 'دفع فاتورة مياه 30000 ريال', 30000),
  yerProduct('water-sanaa', 'pay-50000', 'دفع فاتورة مياه 50000 ريال', 50000),
  yerProduct('water-sanaa', 'new-connection', 'ربط خدمة مياه جديدة', 30000),
  yerProduct('water-sanaa', 'reconnect', 'إعادة ربط خدمة المياه', 5000),
  yerProduct('water-sanaa', 'meter-reading', 'قراءة عداد مياه', 200),
  yerProduct('water-sanaa', 'maintenance', 'رسوم صيانة', 3000),
  yerProduct('water-sanaa', 'pay-75000', 'دفع فاتورة مياه 75000 ريال', 75000),
  yerProduct('water-sanaa', 'pay-100000', 'دفع فاتورة مياه 100000 ريال', 100000),
  yerProduct('water-sanaa', 'tanker-5000', 'صهريج مياه 5000 جالون', 25000),
  yerProduct('water-sanaa', 'tanker-3000', 'صهريج مياه 3000 جالون', 18000),
  yerProduct('water-sanaa', 'tanker-1000', 'صهريج مياه 1000 جالون', 8000),
  yerProduct('water-sanaa', 'sewage-fee', 'رسوم صرف صحي', 2000),
];

// ============================================================
// 34. Water Aden (providerId: 'water-aden')
// ============================================================
const waterAdenProducts: ProductItem[] = [
  yerProduct('water-aden', 'pay-500', 'دفع فاتورة مياه 500 ريال', 500),
  yerProduct('water-aden', 'pay-1000', 'دفع فاتورة مياه 1000 ريال', 1000),
  yerProduct('water-aden', 'pay-2000', 'دفع فاتورة مياه 2000 ريال', 2000),
  yerProduct('water-aden', 'pay-3000', 'دفع فاتورة مياه 3000 ريال', 3000),
  yerProduct('water-aden', 'pay-5000', 'دفع فاتورة مياه 5000 ريال', 5000),
  yerProduct('water-aden', 'pay-10000', 'دفع فاتورة مياه 10000 ريال', 10000),
  yerProduct('water-aden', 'pay-15000', 'دفع فاتورة مياه 15000 ريال', 15000),
  yerProduct('water-aden', 'pay-20000', 'دفع فاتورة مياه 20000 ريال', 20000),
  yerProduct('water-aden', 'pay-30000', 'دفع فاتورة مياه 30000 ريال', 30000),
  yerProduct('water-aden', 'pay-50000', 'دفع فاتورة مياه 50000 ريال', 50000),
  yerProduct('water-aden', 'new-connection', 'ربط خدمة مياه جديدة', 30000),
  yerProduct('water-aden', 'reconnect', 'إعادة ربط خدمة المياه', 5000),
  yerProduct('water-aden', 'meter-reading', 'قراءة عداد مياه', 200),
  yerProduct('water-aden', 'maintenance', 'رسوم صيانة', 3000),
  yerProduct('water-aden', 'pay-75000', 'دفع فاتورة مياه 75000 ريال', 75000),
  yerProduct('water-aden', 'pay-100000', 'دفع فاتورة مياه 100000 ريال', 100000),
  yerProduct('water-aden', 'tanker-5000', 'صهريج مياه 5000 جالون', 25000),
  yerProduct('water-aden', 'tanker-3000', 'صهريج مياه 3000 جالون', 18000),
  yerProduct('water-aden', 'tanker-1000', 'صهريج مياه 1000 جالون', 8000),
  yerProduct('water-aden', 'sewage-fee', 'رسوم صرف صحي', 2000),
];

// ============================================================
// 35. Civil Registry (providerId: 'civil-registry')
// ============================================================
const civilRegistryProducts: ProductItem[] = [
  yerProduct('civil-registry', 'birth-cert', 'شهادة ميلاد', 5000),
  yerProduct('civil-registry', 'death-cert', 'شهادة وفاة', 5000),
  yerProduct('civil-registry', 'marriage-cert', 'عقد زواج', 5000),
  yerProduct('civil-registry', 'divorce-cert', 'شهادة طلاق', 5000),
  yerProduct('civil-registry', 'id-card-new', 'بطاقة شخصية جديدة', 3000),
  yerProduct('civil-registry', 'id-card-renew', 'تجديد بطاقة شخصية', 2000),
  yerProduct('civil-registry', 'id-card-replace', 'بدل فاقد بطاقة شخصية', 3000),
  yerProduct('civil-registry', 'family-card', 'دفتر عائلة', 5000),
  yerProduct('civil-registry', 'family-card-replace', 'بدل فاقد دفتر عائلة', 5000),
  yerProduct('civil-registry', 'birth-cert-copy', 'نسخة شهادة ميلاد', 1000),
  yerProduct('civil-registry', 'death-cert-copy', 'نسخة شهادة وفاة', 1000),
  yerProduct('civil-registry', 'marriage-cert-copy', 'نسخة عقد زواج', 1000),
  yerProduct('civil-registry', 'name-change', 'تغيير اسم', 10000),
  yerProduct('civil-registry', 'correction', 'تصحيح بيانات', 3000),
  yerProduct('civil-registry', 'adoption-cert', 'شهادة تبني', 8000),
  yerProduct('civil-registry', 'certified-copy', 'صورة مصدقة', 2000),
  yerProduct('civil-registry', 'translation-cert', 'تصديق ترجمة', 3000),
  yerProduct('civil-registry', 'legalization', 'توثيق', 4000),
  yerProduct('civil-registry', 'id-card-urgent', 'بطاقة شخصية مستعجلة', 5000),
  yerProduct('civil-registry', 'birth-cert-urgent', 'شهادة ميلاد مستعجلة', 8000),
];

// ============================================================
// 36. Passport (providerId: 'passport')
// ============================================================
const passportProducts: ProductItem[] = [
  yerProduct('passport', 'new-passport', 'جواز سفر جديد', 15000),
  yerProduct('passport', 'renew-passport', 'تجديد جواز سفر', 12000),
  yerProduct('passport', 'replace-passport', 'بدل فاقد جواز سفر', 18000),
  yerProduct('passport', 'passport-urgent', 'جواز سفر مستعجل', 25000),
  yerProduct('passport', 'travel-doc', 'وثيقة سفر', 10000),
  yerProduct('passport', 'visa-service', 'خدمة تأشيرة', 8000),
  yerProduct('passport', 'exit-visa', 'تأشيرة خروج', 5000),
  yerProduct('passport', 'return-visa', 'تأشيرة عودة', 5000),
  yerProduct('passport', 'transit-visa', 'تأشيرة ترانزيت', 3000),
  yerProduct('passport', 'residence-permit', 'إقامة', 10000),
  yerProduct('passport', 'residence-renew', 'تجديد إقامة', 8000),
  yerProduct('passport', 'passport-pages', 'إضافة صفحات جواز', 5000),
  yerProduct('passport', 'passport-correction', 'تصحيح بيانات جواز', 5000),
  yerProduct('passport', 'passport-copy', 'صورة من جواز السفر', 1000),
  yerProduct('passport', 'embassy-cert', 'تصديق سفارة', 10000),
  yerProduct('passport', 'police-clearance', 'شهادة خلو سوابق', 3000),
  yerProduct('passport', 'dual-citizenship', 'جنسية مزدوجة', 20000),
  yerProduct('passport', 'minor-passport', 'جواز سفر قاصر', 10000),
  yerProduct('passport', 'minor-travel', 'إذن سفر قاصر', 5000),
  yerProduct('passport', 'deportation-doc', 'وثيقة ترحيل', 8000),
];

// ============================================================
// 37. Traffic (providerId: 'traffic')
// ============================================================
const trafficProducts: ProductItem[] = [
  yerProduct('traffic', 'license-new', 'رخصة قيادة جديدة', 8000),
  yerProduct('traffic', 'license-renew', 'تجديد رخصة قيادة', 5000),
  yerProduct('traffic', 'license-replace', 'بدل فاقد رخصة قيادة', 6000),
  yerProduct('traffic', 'license-international', 'رخصة قيادة دولية', 10000),
  yerProduct('traffic', 'car-register', 'تسجيل مركبة جديدة', 15000),
  yerProduct('traffic', 'car-renew', 'تجديد تسجيل مركبة', 5000),
  yerProduct('traffic', 'car-transfer', 'نقل ملكية مركبة', 10000),
  yerProduct('traffic', 'car-inspection', 'فحص مركبة', 3000),
  yerProduct('traffic', 'car-insurance', 'تأمين مركبة سنوي', 20000),
  yerProduct('traffic', 'plate-new', 'لوحات أرقام جديدة', 8000),
  yerProduct('traffic', 'plate-custom', 'لوحات أرقام مميزة', 50000),
  yerProduct('traffic', 'plate-replace', 'بدل فاقد لوحات أرقام', 5000),
  yerProduct('traffic', 'fine-pay', 'دفع مخالفة مرورية', 2000),
  yerProduct('traffic', 'fine-pay-heavy', 'دفع مخالفة مرورية كبيرة', 5000),
  yerProduct('traffic', 'accident-report', 'تقرير حادث مروري', 3000),
  yerProduct('traffic', 'permit-temp', 'تصريح مؤقت', 3000),
  yerProduct('traffic', 'license-test', 'اختبار قيادة', 2000),
  yerProduct('traffic', 'defect-repair', 'إصلاح عيب فني', 1000),
  yerProduct('traffic', 'car-export', 'تصدير مركبة', 8000),
  yerProduct('traffic', 'car-import', 'استيراد مركبة', 20000),
];

// ============================================================
// 38. Municipal (providerId: 'municipal')
// ============================================================
const municipalProducts: ProductItem[] = [
  yerProduct('municipal', 'building-permit', 'رخصة بناء', 20000),
  yerProduct('municipal', 'building-permit-renew', 'تجديد رخصة بناء', 10000),
  yerProduct('municipal', 'demolition-permit', 'رخصة هدم', 15000),
  yerProduct('municipal', 'land-survey', 'مسح أراضي', 10000),
  yerProduct('municipal', 'zoning-cert', 'شهادة تقسيم', 5000),
  yerProduct('municipal', 'property-tax', 'ضريبة عقارية', 5000),
  yerProduct('municipal', 'commercial-license', 'رخصة تجارية', 15000),
  yerProduct('municipal', 'commercial-renew', 'تجديد رخصة تجارية', 8000),
  yerProduct('municipal', 'signboard-permit', 'رخصة لوحة إعلانية', 3000),
  yerProduct('municipal', 'waste-service', 'رسوم النظافة', 2000),
  yerProduct('municipal', 'street-occupation', 'رسوم احتلال طريق', 3000),
  yerProduct('municipal', 'food-license', 'رخصة غذائية', 10000),
  yerProduct('municipal', 'food-license-renew', 'تجديد رخصة غذائية', 5000),
  yerProduct('municipal', 'health-cert', 'شهادة صحية', 3000),
  yerProduct('municipal', 'industrial-license', 'رخصة صناعية', 25000),
  yerProduct('municipal', 'industrial-renew', 'تجديد رخصة صناعية', 12000),
  yerProduct('municipal', 'parking-permit', 'تصريح وقوف', 2000),
  yerProduct('municipal', 'renovation-permit', 'رخصة ترميم', 10000),
  yerProduct('municipal', 'extension-permit', 'رخصة توسعة', 12000),
  yerProduct('municipal', 'change-of-use', 'تغيير استخدام', 8000),
];

// ============================================================
// ALL PRODUCTS COMBINED
// ============================================================
export const allProducts: ProductItem[] = [
  ...pubgProducts,
  ...freefireProducts,
  ...callOfDutyProducts,
  ...clashRoyaleProducts,
  ...clashOfClansProducts,
  ...robloxProducts,
  ...fortniteProducts,
  ...minecraftProducts,
  ...valorantProducts,
  ...leagueLegendsProducts,
  ...genshinImpactProducts,
  ...honkaiStarProducts,
  ...steamProducts,
  ...netflixProducts,
  ...spotifyProducts,
  ...youtubePremiumProducts,
  ...googlePlayProducts,
  ...itunesProducts,
  ...amazonProducts,
  ...psnProducts,
  ...xboxProducts,
  ...nintendoProducts,
  ...visaVirtualProducts,
  ...mastercardVirtualProducts,
  ...paypalProducts,
  ...yemenMobileProducts,
  ...yoProducts,
  ...sabafonProducts,
  ...yTelecomProducts,
  ...yemenNetProducts,
  ...elecSanaaProducts,
  ...elecAdenProducts,
  ...waterSanaaProducts,
  ...waterAdenProducts,
  ...civilRegistryProducts,
  ...passportProducts,
  ...trafficProducts,
  ...municipalProducts,
];
