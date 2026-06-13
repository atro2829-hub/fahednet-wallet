const { initializeApp } = require('firebase/app');
const { getDatabase, ref, update, get } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyBY9UTcryFEoq8VA1zD7OVnku-fjLxw-p4",
  authDomain: "southern-portfolio.firebaseapp.com",
  databaseURL: "https://southern-portfolio-default-rtdb.firebaseio.com",
  projectId: "southern-portfolio",
  storageBucket: "southern-portfolio.firebasestorage.app",
  messagingSenderId: "501045825605",
  appId: "1:501045825605:android:a0b11c5db57c9831d3932c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const now = new Date().toISOString();
const extra = {
  // More shooting games (5)
  'scarfall': { id: 'scarfall', categoryId: 'entertainment', subCategoryId: 'shooting-games', name: 'ScarFall', nameEn: 'ScarFall', icon: '', color: '#7C3AED', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 24, createdAt: now },
  'bullet-echo': { id: 'bullet-echo', categoryId: 'entertainment', subCategoryId: 'shooting-games', name: 'Bullet Echo', nameEn: 'Bullet Echo', icon: '', color: '#D97706', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 25, createdAt: now },
  'war-robot': { id: 'war-robot', categoryId: 'entertainment', subCategoryId: 'shooting-games', name: 'War Robots', nameEn: 'War Robots', icon: '', color: '#475569', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 26, createdAt: now },
  'sniper-3d': { id: 'sniper-3d', categoryId: 'entertainment', subCategoryId: 'shooting-games', name: 'Sniper 3D', nameEn: 'Sniper 3D Assassin', icon: '', color: '#1F2937', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 27, createdAt: now },
  'cover-fire': { id: 'cover-fire', categoryId: 'entertainment', subCategoryId: 'shooting-games', name: 'Cover Fire', nameEn: 'Cover Fire', icon: '', color: '#B91C1C', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 28, createdAt: now },

  // More strategy (5)
  'war-and-order': { id: 'war-and-order', categoryId: 'entertainment', subCategoryId: 'strategy-games', name: 'War and Order', nameEn: 'War and Order', icon: '', color: '#DC2626', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 19, createdAt: now },
  'clash-mini-strat': { id: 'clash-mini-strat', categoryId: 'entertainment', subCategoryId: 'strategy-games', name: 'Clash Quest', nameEn: 'Clash Quest', icon: '', color: '#F59E0B', isActive: true, inputLabel: 'معرف اللاعب (Tag)', inputType: 'text', inputPrefix: '#', inputPlaceholder: 'أدخل Tag', providerType: 'entertainment', executionType: 'manual', order: 20, createdAt: now },
  'march-of-empires': { id: 'march-of-empires', categoryId: 'entertainment', subCategoryId: 'strategy-games', name: 'March of Empires', nameEn: 'March of Empires', icon: '', color: '#7C3AED', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 21, createdAt: now },
  'gods-unchained': { id: 'gods-unchained', categoryId: 'entertainment', subCategoryId: 'strategy-games', name: 'Gods Unchained', nameEn: 'Gods Unchained', icon: '', color: '#D97706', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 22, createdAt: now },
  'dice-dreams': { id: 'dice-dreams', categoryId: 'entertainment', subCategoryId: 'strategy-games', name: 'Dice Dreams', nameEn: 'Dice Dreams', icon: '', color: '#EC4899', isActive: true, inputLabel: 'رابط الدعوة', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل رابط الدعوة', providerType: 'entertainment', executionType: 'manual', order: 23, createdAt: now },

  // More adventure (5)
  'marvel-contest': { id: 'marvel-contest', categoryId: 'entertainment', subCategoryId: 'adventure-games', name: 'Marvel Contest', nameEn: 'Marvel Contest of Champions', icon: '', color: '#DC2626', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 20, createdAt: now },
  'dc-legends': { id: 'dc-legends', categoryId: 'entertainment', subCategoryId: 'adventure-games', name: 'DC Legends', nameEn: 'DC Legends: Fight Superheroes', icon: '', color: '#2563EB', isActive: true, inputLabel: 'معرف WB', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف WB', providerType: 'entertainment', executionType: 'manual', order: 21, createdAt: now },
  'dragon-ball-legends': { id: 'dragon-ball-legends', categoryId: 'entertainment', subCategoryId: 'adventure-games', name: 'Dragon Ball Legends', nameEn: 'Dragon Ball Legends', icon: '', color: '#F59E0B', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 22, createdAt: now },
  'one-piece-bounty': { id: 'one-piece-bounty', categoryId: 'entertainment', subCategoryId: 'adventure-games', name: 'One Piece Bounty Rush', nameEn: 'One Piece Bounty Rush', icon: '', color: '#DC2626', isActive: true, inputLabel: 'معرف Bandai', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف Bandai', providerType: 'entertainment', executionType: 'manual', order: 23, createdAt: now },
  'naruto-x-boruto': { id: 'naruto-x-boruto', categoryId: 'entertainment', subCategoryId: 'adventure-games', name: 'Naruto X Boruto', nameEn: 'NARUTO X BORUTO NINJA VOLTAGE', icon: '', color: '#F97316', isActive: true, inputLabel: 'معرف Bandai', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف Bandai', providerType: 'entertainment', executionType: 'manual', order: 24, createdAt: now },

  // More sports (5)
  'fifa-mobile-new': { id: 'fifa-mobile-25', categoryId: 'entertainment', subCategoryId: 'sports-games', name: 'FC Mobile 25', nameEn: 'EA SPORTS FC Mobile 25', icon: '', color: '#16A34A', isActive: true, inputLabel: 'معرف EA', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف EA', providerType: 'entertainment', executionType: 'manual', order: 17, createdAt: now },
  'pes-2025': { id: 'pes-2025', categoryId: 'entertainment', subCategoryId: 'sports-games', name: 'eFootball 2025', nameEn: 'eFootball 2025', icon: '', color: '#1D4ED8', isActive: true, inputLabel: 'معرف KONAMI ID', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل KONAMI ID', providerType: 'entertainment', executionType: 'manual', order: 18, createdAt: now },
  'carx-street': { id: 'carx-street', categoryId: 'entertainment', subCategoryId: 'sports-games', name: 'CarX Street', nameEn: 'CarX Street', icon: '', color: '#EF4444', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 19, createdAt: now },
  'top-eleven': { id: 'top-eleven', categoryId: 'entertainment', subCategoryId: 'sports-games', name: 'Top Eleven', nameEn: 'Top Eleven 2025', icon: '', color: '#059669', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 20, createdAt: now },
  'wwe-supercard': { id: 'wwe-supercard', categoryId: 'entertainment', subCategoryId: 'sports-games', name: 'WWE SuperCard', nameEn: 'WWE SuperCard', icon: '', color: '#B91C1C', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 21, createdAt: now },

  // More racing (5)
  'dirt-rally': { id: 'dirt-rally', categoryId: 'entertainment', subCategoryId: 'racing-games', name: 'Dirt Rally', nameEn: 'DiRT Rally', icon: '', color: '#92400E', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 14, createdAt: now },
  'grid-autosport': { id: 'grid-autosport', categoryId: 'entertainment', subCategoryId: 'racing-games', name: 'GRID Autosport', nameEn: 'GRID Autosport', icon: '', color: '#475569', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 15, createdAt: now },
  'racing-master': { id: 'racing-master', categoryId: 'entertainment', subCategoryId: 'racing-games', name: 'Racing Master', nameEn: 'Racing Master', icon: '', color: '#1D4ED8', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 16, createdAt: now },
  'torque-drift': { id: 'torque-drift', categoryId: 'entertainment', subCategoryId: 'racing-games', name: 'Torque Drift', nameEn: 'Torque Drift', icon: '', color: '#F97316', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 17, createdAt: now },
  'fr-legends': { id: 'fr-legends', categoryId: 'entertainment', subCategoryId: 'racing-games', name: 'FR Legends', nameEn: 'FR Legends', icon: '', color: '#DC2626', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 18, createdAt: now },

  // More casual (5)
  'merge-dragons': { id: 'merge-dragons', categoryId: 'entertainment', subCategoryId: 'casual-games', name: 'Merge Dragons!', nameEn: 'Merge Dragons!', icon: '', color: '#22C55E', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 20, createdAt: now },
  'cooking-fever': { id: 'cooking-fever', categoryId: 'entertainment', subCategoryId: 'casual-games', name: 'Cooking Fever', nameEn: 'Cooking Fever', icon: '', color: '#DC2626', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 21, createdAt: now },
  'design-home': { id: 'design-home', categoryId: 'entertainment', subCategoryId: 'casual-games', name: 'Design Home', nameEn: 'Design Home', icon: '', color: '#8B5CF6', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 22, createdAt: now },
  'empires-puzzles-rpg': { id: 'empires-puzzles-rpg', categoryId: 'entertainment', subCategoryId: 'casual-games', name: 'Empires & Puzzles RPG', nameEn: 'Empires & Puzzles RPG', icon: '', color: '#1D4ED8', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 23, createdAt: now },
  'wordle': { id: 'wordle', categoryId: 'entertainment', subCategoryId: 'casual-games', name: 'Wordle', nameEn: 'Wordle', icon: '', color: '#16A34A', isActive: true, inputLabel: 'اسم المستخدم', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل اسم المستخدم', providerType: 'entertainment', executionType: 'manual', order: 24, createdAt: now },

  // More social (5)
  'pirate-kings': { id: 'pirate-kings', categoryId: 'entertainment', subCategoryId: 'social-games', name: 'Pirate Kings', nameEn: 'Pirate Kings', icon: '', color: '#F59E0B', isActive: true, inputLabel: 'رابط الدعوة', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل رابط الدعوة', providerType: 'entertainment', executionType: 'manual', order: 14, createdAt: now },
  'board-kings': { id: 'board-kings', categoryId: 'entertainment', subCategoryId: 'social-games', name: 'Board Kings', nameEn: 'Board Kings', icon: '', color: '#2563EB', isActive: true, inputLabel: 'رابط الدعوة', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل رابط الدعوة', providerType: 'entertainment', executionType: 'manual', order: 15, createdAt: now },
  'bingo-blitz-social': { id: 'bingo-blitz-social', categoryId: 'entertainment', subCategoryId: 'social-games', name: 'Bingo Blitz', nameEn: 'Bingo Blitz', icon: '', color: '#0EA5E9', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 16, createdAt: now },
  'pets-game': { id: 'pets-game', categoryId: 'entertainment', subCategoryId: 'social-games', name: 'Pet Master', nameEn: 'Pet Master', icon: '', color: '#D97706', isActive: true, inputLabel: 'رابط الدعوة', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل رابط الدعوة', providerType: 'entertainment', executionType: 'manual', order: 17, createdAt: now },
  'coin-master-2': { id: 'coin-master-village', categoryId: 'entertainment', subCategoryId: 'social-games', name: 'Coin Master Village', nameEn: 'Coin Master Village', icon: '', color: '#7C3AED', isActive: true, inputLabel: 'رابط الحساب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل رابط الحساب', providerType: 'entertainment', executionType: 'manual', order: 18, createdAt: now },

  // More platforms (5)
  'gamivo': { id: 'gamivo', categoryId: 'entertainment', subCategoryId: 'gaming-platforms', name: 'GAMIVO', nameEn: 'GAMIVO', icon: '', color: '#2563EB', isActive: true, inputLabel: 'بريد GAMIVO', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 14, createdAt: now },
  'eneba': { id: 'eneba', categoryId: 'entertainment', subCategoryId: 'gaming-platforms', name: 'Eneba', nameEn: 'Eneba', icon: '', color: '#16A34A', isActive: true, inputLabel: 'بريد Eneba', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 15, createdAt: now },
  'cdkeys': { id: 'cdkeys', categoryId: 'entertainment', subCategoryId: 'gaming-platforms', name: 'CDKeys', nameEn: 'CDKeys', icon: '', color: '#1D4ED8', isActive: true, inputLabel: 'بريد CDKeys', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 16, createdAt: now },
  'green-man-gaming': { id: 'green-man-gaming', categoryId: 'entertainment', subCategoryId: 'gaming-platforms', name: 'Green Man Gaming', nameEn: 'Green Man Gaming', icon: '', color: '#059669', isActive: true, inputLabel: 'بريد GMG', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 17, createdAt: now },
  'indiegala': { id: 'indiegala', categoryId: 'entertainment', subCategoryId: 'gaming-platforms', name: 'IndieGala', nameEn: 'IndieGala', icon: '', color: '#7C3AED', isActive: true, inputLabel: 'بريد IndieGala', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 18, createdAt: now },

  // More gaming cards (5)
  'fortnite-vbucks': { id: 'fortnite-vbucks', categoryId: 'entertainment', subCategoryId: 'gaming-cards', name: 'Fortnite V-Bucks', nameEn: 'Fortnite V-Bucks Card', icon: '', color: '#3B82F6', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 16, createdAt: now },
  'robux-premium': { id: 'robux-premium', categoryId: 'entertainment', subCategoryId: 'gaming-cards', name: 'Roblox Robux Premium', nameEn: 'Roblox Robux Premium', icon: '', color: '#DC2626', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 17, createdAt: now },
  'cod-points': { id: 'cod-points', categoryId: 'entertainment', subCategoryId: 'gaming-cards', name: 'Call of Duty Points', nameEn: 'COD Points Card', icon: '', color: '#22C55E', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 18, createdAt: now },
  'apex-coins': { id: 'apex-coins', categoryId: 'entertainment', subCategoryId: 'gaming-cards', name: 'Apex Coins', nameEn: 'Apex Coins Card', icon: '', color: '#DC2626', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 19, createdAt: now },
  'freefire-diamonds': { id: 'freefire-diamonds', categoryId: 'entertainment', subCategoryId: 'gaming-cards', name: 'Free Fire Diamonds', nameEn: 'Free Fire Diamonds Card', icon: '', color: '#FF6B00', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 20, createdAt: now },
};

async function addProviders() {
  console.log(`Adding ${Object.keys(extra).length} more entertainment providers...`);
  try {
    const updates = {};
    for (const [id, provider] of Object.entries(extra)) {
      updates[`providers/${id}`] = provider;
      updates[`adminSettings/visibility/providers/${id}`] = true;
    }
    await update(ref(db), updates);
    
    const snapshot = await get(ref(db, 'providers'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const entProviders = Object.values(data).filter((p) => p.categoryId === 'entertainment');
      console.log(`✅ Added ${Object.keys(extra).length} providers`);
      console.log(`📊 Total entertainment providers: ${entProviders.length}`);
      console.log(`📊 Total providers: ${Object.keys(data).length}`);
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addProviders();
