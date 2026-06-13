/**
 * Add 90+ more entertainment providers to reach 200+ total
 */

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, update } = require('firebase/database');

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

const additionalProviders = {
  // More shooting games
  'rules-of-survival': { id: 'rules-of-survival', categoryId: 'entertainment', subCategoryId: 'shooting-games', name: 'Rules of Survival', nameEn: 'Rules of Survival', icon: '', color: '#B91C1C', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 20, createdAt: new Date().toISOString() },
  'creative-destruction': { id: 'creative-destruction', categoryId: 'entertainment', subCategoryId: 'shooting-games', name: 'Creative Destruction', nameEn: 'Creative Destruction', icon: '', color: '#F59E0B', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 21, createdAt: new Date().toISOString() },
  'cyber-hunter': { id: 'cyber-hunter', categoryId: 'entertainment', subCategoryId: 'shooting-games', name: 'Cyber Hunter', nameEn: 'Cyber Hunter', icon: '', color: '#06B6D4', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 22, createdAt: new Date().toISOString() },
  'knife-hit': { id: 'knife-hit', categoryId: 'entertainment', subCategoryId: 'shooting-games', name: 'Knife Hit', nameEn: 'Knife Hit', icon: '', color: '#374151', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 23, createdAt: new Date().toISOString() },

  // More strategy games
  'age-of-empires': { id: 'age-of-empires', categoryId: 'entertainment', subCategoryId: 'strategy-games', name: 'Age of Empires Mobile', nameEn: 'Age of Empires Mobile', icon: '', color: '#1D4ED8', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 15, createdAt: new Date().toISOString() },
  'civilization-vi': { id: 'civilization-vi', categoryId: 'entertainment', subCategoryId: 'strategy-games', name: 'Civilization VI', nameEn: 'Civilization VI', icon: '', color: '#059669', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 16, createdAt: new Date().toISOString() },
  'xcom': { id: 'xcom', categoryId: 'entertainment', subCategoryId: 'strategy-games', name: 'XCOM', nameEn: 'XCOM', icon: '', color: '#1F2937', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 17, createdAt: new Date().toISOString() },
  'plague-inc': { id: 'plague-inc', categoryId: 'entertainment', subCategoryId: 'strategy-games', name: 'Plague Inc.', nameEn: 'Plague Inc.', icon: '', color: '#16A34A', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 18, createdAt: new Date().toISOString() },

  // More adventure games
  'gta-mobile': { id: 'gta-mobile', categoryId: 'entertainment', subCategoryId: 'adventure-games', name: 'GTA Mobile', nameEn: 'Grand Theft Auto', icon: '', color: '#15803D', isActive: true, inputLabel: 'معرف Rockstar', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف Rockstar', providerType: 'entertainment', executionType: 'manual', order: 15, createdAt: new Date().toISOString() },
  'subway-surfers-adv': { id: 'subway-surfers-adv', categoryId: 'entertainment', subCategoryId: 'adventure-games', name: 'Subway Surfers Adventure', nameEn: 'Subway Surfers', icon: '', color: '#F59E0B', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 16, createdAt: new Date().toISOString() },
  'noahs-heart': { id: 'noahs-heart', categoryId: 'entertainment', subCategoryId: 'adventure-games', name: "Noah's Heart", nameEn: "Noah's Heart", icon: '', color: '#7C3AED', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 17, createdAt: new Date().toISOString() },
  'mortal-kombat': { id: 'mortal-kombat', categoryId: 'entertainment', subCategoryId: 'adventure-games', name: 'Mortal Kombat', nameEn: 'Mortal Kombat Mobile', icon: '', color: '#DC2626', isActive: true, inputLabel: 'معرف WB', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف WB', providerType: 'entertainment', executionType: 'manual', order: 18, createdAt: new Date().toISOString() },
  'injustice': { id: 'injustice', categoryId: 'entertainment', subCategoryId: 'adventure-games', name: 'Injustice 2', nameEn: 'Injustice 2 Mobile', icon: '', color: '#2563EB', isActive: true, inputLabel: 'معرف WB', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف WB', providerType: 'entertainment', executionType: 'manual', order: 19, createdAt: new Date().toISOString() },

  // More sports games
  'pro-evolution': { id: 'pro-evolution', categoryId: 'entertainment', subCategoryId: 'sports-games', name: 'eFootball 2025', nameEn: 'eFootball 2025', icon: '', color: '#1D4ED8', isActive: true, inputLabel: 'معرف KONAMI', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف KONAMI', providerType: 'entertainment', executionType: 'manual', order: 12, createdAt: new Date().toISOString() },
  '8-ball-pool': { id: '8-ball-pool', categoryId: 'entertainment', subCategoryId: 'sports-games', name: '8 Ball Pool', nameEn: '8 Ball Pool', icon: '', color: '#16A34A', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 13, createdAt: new Date().toISOString() },
  'mini-football': { id: 'mini-football', categoryId: 'entertainment', subCategoryId: 'sports-games', name: 'Mini Football', nameEn: 'Mini Football', icon: '', color: '#22C55E', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 14, createdAt: new Date().toISOString() },
  'golf-clash': { id: 'golf-clash', categoryId: 'entertainment', subCategoryId: 'sports-games', name: 'Golf Clash', nameEn: 'Golf Clash', icon: '', color: '#059669', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 15, createdAt: new Date().toISOString() },
  'basketball-arena': { id: 'basketball-arena', categoryId: 'entertainment', subCategoryId: 'sports-games', name: 'Basketball Arena', nameEn: 'Basketball Arena', icon: '', color: '#F97316', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 16, createdAt: new Date().toISOString() },

  // More racing games
  'racing-fever': { id: 'racing-fever', categoryId: 'entertainment', subCategoryId: 'racing-games', name: 'Racing Fever', nameEn: 'Racing Fever', icon: '', color: '#DC2626', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 10, createdAt: new Date().toISOString() },
  'moto-racing': { id: 'moto-racing', categoryId: 'entertainment', subCategoryId: 'racing-games', name: 'Moto GP Racing', nameEn: 'Moto GP Racing', icon: '', color: '#EF4444', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 11, createdAt: new Date().toISOString() },
  'offroad-outlaws': { id: 'offroad-outlaws', categoryId: 'entertainment', subCategoryId: 'racing-games', name: 'Offroad Outlaws', nameEn: 'Offroad Outlaws', icon: '', color: '#92400E', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 12, createdAt: new Date().toISOString() },
  'trial-xtreme': { id: 'trial-xtreme', categoryId: 'entertainment', subCategoryId: 'racing-games', name: 'Trial Xtreme', nameEn: 'Trial Xtreme 4', icon: '', color: '#B45309', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 13, createdAt: new Date().toISOString() },

  // More social games
  'house-party': { id: 'house-party', categoryId: 'entertainment', subCategoryId: 'social-games', name: 'House Party', nameEn: 'House Party', icon: '', color: '#7C3AED', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 10, createdAt: new Date().toISOString() },
  'clash-mini': { id: 'clash-mini', categoryId: 'entertainment', subCategoryId: 'social-games', name: 'Clash Mini', nameEn: 'Clash Mini', icon: '', color: '#2563EB', isActive: true, inputLabel: 'معرف اللاعب (Tag)', inputType: 'text', inputPrefix: '#', inputPlaceholder: 'أدخل Tag اللاعب', providerType: 'entertainment', executionType: 'manual', order: 11, createdAt: new Date().toISOString() },
  'squad-busters': { id: 'squad-busters', categoryId: 'entertainment', subCategoryId: 'social-games', name: 'Squad Busters', nameEn: 'Squad Busters', icon: '', color: '#F59E0B', isActive: true, inputLabel: 'معرف اللاعب (Tag)', inputType: 'text', inputPrefix: '#', inputPlaceholder: 'أدخل Tag اللاعب', providerType: 'entertainment', executionType: 'manual', order: 12, createdAt: new Date().toISOString() },
  'sudoku': { id: 'sudoku', categoryId: 'entertainment', subCategoryId: 'social-games', name: 'Sudoku.com', nameEn: 'Sudoku.com', icon: '', color: '#1D4ED8', isActive: true, inputLabel: 'اسم المستخدم', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل اسم المستخدم', providerType: 'entertainment', executionType: 'manual', order: 13, createdAt: new Date().toISOString() },

  // More casual games
  'royal-match': { id: 'royal-match', categoryId: 'entertainment', subCategoryId: 'casual-games', name: 'Royal Match', nameEn: 'Royal Match', icon: '', color: '#2563EB', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 12, createdAt: new Date().toISOString() },
  'solitaire': { id: 'solitaire', categoryId: 'entertainment', subCategoryId: 'casual-games', name: 'Solitaire', nameEn: 'Solitaire Grand Harvest', icon: '', color: '#16A34A', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 13, createdAt: new Date().toISOString() },
  'merge-mansion': { id: 'merge-mansion', categoryId: 'entertainment', subCategoryId: 'casual-games', name: 'Merge Mansion', nameEn: 'Merge Mansion', icon: '', color: '#059669', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 14, createdAt: new Date().toISOString() },
  'lily-garden': { id: 'lily-garden', categoryId: 'entertainment', subCategoryId: 'casual-games', name: "Lily's Garden", nameEn: "Lily's Garden", icon: '', color: '#EC4899', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 15, createdAt: new Date().toISOString() },
  'words-capes': { id: 'words-capes', categoryId: 'entertainment', subCategoryId: 'casual-games', name: 'Wordscapes', nameEn: 'Wordscapes', icon: '', color: '#0EA5E9', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف اللاعب', providerType: 'entertainment', executionType: 'manual', order: 16, createdAt: new Date().toISOString() },
  'paper-io': { id: 'paper-io', categoryId: 'entertainment', subCategoryId: 'casual-games', name: 'Paper.io 2', nameEn: 'Paper.io 2', icon: '', color: '#8B5CF6', isActive: true, inputLabel: 'اسم المستخدم', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل اسم المستخدم', providerType: 'entertainment', executionType: 'manual', order: 17, createdAt: new Date().toISOString() },
  'slither-io': { id: 'slither-io', categoryId: 'entertainment', subCategoryId: 'casual-games', name: 'Slither.io', nameEn: 'Slither.io', icon: '', color: '#22C55E', isActive: true, inputLabel: 'اسم المستخدم', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل اسم المستخدم', providerType: 'entertainment', executionType: 'manual', order: 18, createdAt: new Date().toISOString() },
  '2048': { id: '2048-game', categoryId: 'entertainment', subCategoryId: 'casual-games', name: '2048', nameEn: '2048', icon: '', color: '#F59E0B', isActive: true, inputLabel: 'اسم المستخدم', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل اسم المستخدم', providerType: 'entertainment', executionType: 'manual', order: 19, createdAt: new Date().toISOString() },

  // More gaming platforms
  'unreal-engine': { id: 'unreal-engine', categoryId: 'entertainment', subCategoryId: 'gaming-platforms', name: 'Unreal Engine', nameEn: 'Unreal Engine', icon: '', color: '#2563EB', isActive: true, inputLabel: 'معرف Epic', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل معرف Epic', providerType: 'entertainment', executionType: 'manual', order: 10, createdAt: new Date().toISOString() },
  'g2a': { id: 'g2a', categoryId: 'entertainment', subCategoryId: 'gaming-platforms', name: 'G2A', nameEn: 'G2A', icon: '', color: '#DC2626', isActive: true, inputLabel: 'بريد G2A', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 11, createdAt: new Date().toISOString() },
  'kinguin': { id: 'kinguin', categoryId: 'entertainment', subCategoryId: 'gaming-platforms', name: 'Kinguin', nameEn: 'Kinguin', icon: '', color: '#7C3AED', isActive: true, inputLabel: 'بريد Kinguin', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 12, createdAt: new Date().toISOString() },
  'humble-bundle': { id: 'humble-bundle', categoryId: 'entertainment', subCategoryId: 'gaming-platforms', name: 'Humble Bundle', nameEn: 'Humble Bundle', icon: '', color: '#B91C1C', isActive: true, inputLabel: 'بريد Humble', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 13, createdAt: new Date().toISOString() },

  // More gaming cards
  'roblox-premium': { id: 'roblox-premium', categoryId: 'entertainment', subCategoryId: 'gaming-cards', name: 'Roblox Premium', nameEn: 'Roblox Premium', icon: '', color: '#DC2626', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 10, createdAt: new Date().toISOString() },
  'league-card': { id: 'league-card', categoryId: 'entertainment', subCategoryId: 'gaming-cards', name: 'بطاقة League of Legends', nameEn: 'LoL RP Card', icon: '', color: '#D97706', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 11, createdAt: new Date().toISOString() },
  'valorant-card': { id: 'valorant-card', categoryId: 'entertainment', subCategoryId: 'gaming-cards', name: 'بطاقة Valorant', nameEn: 'Valorant VP Card', icon: '', color: '#EF4444', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 12, createdAt: new Date().toISOString() },
  'apex-card': { id: 'apex-card', categoryId: 'entertainment', subCategoryId: 'gaming-cards', name: 'بطاقة Apex Legends', nameEn: 'Apex Coins Card', icon: '', color: '#DC2626', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 13, createdAt: new Date().toISOString() },
  'genshin-card': { id: 'genshin-card', categoryId: 'entertainment', subCategoryId: 'gaming-cards', name: 'بطاقة Genshin Impact', nameEn: 'Genshin Top Up Card', icon: '', color: '#2563EB', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 14, createdAt: new Date().toISOString() },
  'mlbb-card': { id: 'mlbb-card', categoryId: 'entertainment', subCategoryId: 'gaming-cards', name: 'بطاقة Mobile Legends', nameEn: 'MLBB Diamond Card', icon: '', color: '#1D4ED8', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'entertainment', executionType: 'manual', order: 15, createdAt: new Date().toISOString() },

  // More video streaming
  'paramount': { id: 'paramount', categoryId: 'streaming', subCategoryId: 'video-streaming', name: 'Paramount+', nameEn: 'Paramount+', icon: '', color: '#0064D2', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'streaming', executionType: 'manual', order: 7, createdAt: new Date().toISOString() },
  'apple-tv': { id: 'apple-tv', categoryId: 'streaming', subCategoryId: 'video-streaming', name: 'Apple TV+', nameEn: 'Apple TV+', icon: '', color: '#555555', isActive: true, inputLabel: 'بريد Apple ID', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل بريد Apple', providerType: 'streaming', executionType: 'manual', order: 8, createdAt: new Date().toISOString() },
  'peacock': { id: 'peacock', categoryId: 'streaming', subCategoryId: 'video-streaming', name: 'Peacock TV', nameEn: 'Peacock TV', icon: '', color: '#000000', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'streaming', executionType: 'manual', order: 9, createdAt: new Date().toISOString() },
  'starplus': { id: 'starplus', categoryId: 'streaming', subCategoryId: 'video-streaming', name: 'Star+', nameEn: 'Star+', icon: '', color: '#E50914', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'streaming', executionType: 'manual', order: 10, createdAt: new Date().toISOString() },

  // More music streaming
  'youtube-music': { id: 'youtube-music', categoryId: 'streaming', subCategoryId: 'music-streaming', name: 'YouTube Music', nameEn: 'YouTube Music Premium', icon: '', color: '#FF0000', isActive: true, inputLabel: 'بريد Google', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل بريد Google', providerType: 'streaming', executionType: 'manual', order: 5, createdAt: new Date().toISOString() },
  'amazon-music': { id: 'amazon-music', categoryId: 'streaming', subCategoryId: 'music-streaming', name: 'Amazon Music', nameEn: 'Amazon Music Unlimited', icon: '', color: '#25D366', isActive: true, inputLabel: 'بريد Amazon', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل بريد Amazon', providerType: 'streaming', executionType: 'manual', order: 6, createdAt: new Date().toISOString() },
  'soundcloud': { id: 'soundcloud', categoryId: 'streaming', subCategoryId: 'music-streaming', name: 'SoundCloud Go+', nameEn: 'SoundCloud Go+', icon: '', color: '#FF5500', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'streaming', executionType: 'manual', order: 7, createdAt: new Date().toISOString() },
  'pandora': { id: 'pandora', categoryId: 'streaming', subCategoryId: 'music-streaming', name: 'Pandora Premium', nameEn: 'Pandora Premium', icon: '', color: '#3668FF', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'streaming', executionType: 'manual', order: 8, createdAt: new Date().toISOString() },

  // More payment cards
  'wise-card': { id: 'wise-card', categoryId: 'cards', subCategoryId: 'payment-cards', name: 'Wise Card', nameEn: 'Wise Virtual Card', icon: '', color: '#9FE870', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'cards', executionType: 'manual', order: 4, createdAt: new Date().toISOString() },
  'revolut': { id: 'revolut', categoryId: 'cards', subCategoryId: 'payment-cards', name: 'Revolut', nameEn: 'Revolut Virtual Card', icon: '', color: '#000000', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'cards', executionType: 'manual', order: 5, createdAt: new Date().toISOString() },
  'cashapp': { id: 'cashapp', categoryId: 'cards', subCategoryId: 'payment-cards', name: 'Cash App', nameEn: 'Cash App', icon: '', color: '#00C246', isActive: true, inputLabel: 'معرف Cash App', inputType: 'text', inputPrefix: '$', inputPlaceholder: 'أدخل $Cashtag', providerType: 'cards', executionType: 'manual', order: 6, createdAt: new Date().toISOString() },
  'usdt': { id: 'usdt', categoryId: 'cards', subCategoryId: 'payment-cards', name: 'USDT (Tether)', nameEn: 'USDT Tether', icon: '', color: '#26A17B', isActive: true, inputLabel: 'عنوان المحفظة', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل عنوان المحفظة', providerType: 'cards', executionType: 'manual', order: 7, createdAt: new Date().toISOString() },

  // More communication cards
  'whatsapp': { id: 'whatsapp-business', categoryId: 'cards', subCategoryId: 'communication-cards', name: 'WhatsApp Business', nameEn: 'WhatsApp Business API', icon: '', color: '#25D366', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967', inputPlaceholder: 'أدخل رقم الهاتف', providerType: 'cards', executionType: 'manual', order: 5, createdAt: new Date().toISOString() },
  'microsoft-365': { id: 'microsoft-365', categoryId: 'cards', subCategoryId: 'communication-cards', name: 'Microsoft 365', nameEn: 'Microsoft 365', icon: '', color: '#0078D4', isActive: true, inputLabel: 'بريد Microsoft', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'cards', executionType: 'manual', order: 6, createdAt: new Date().toISOString() },
  'google-one': { id: 'google-one', categoryId: 'cards', subCategoryId: 'communication-cards', name: 'Google One', nameEn: 'Google One', icon: '', color: '#4285F4', isActive: true, inputLabel: 'بريد Google', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل بريد Google', providerType: 'cards', executionType: 'manual', order: 7, createdAt: new Date().toISOString() },
  'icloud': { id: 'icloud', categoryId: 'cards', subCategoryId: 'communication-cards', name: 'iCloud+', nameEn: 'iCloud+', icon: '', color: '#3693F5', isActive: true, inputLabel: 'بريد Apple ID', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل بريد Apple', providerType: 'cards', executionType: 'manual', order: 8, createdAt: new Date().toISOString() },

  // More store cards
  'target': { id: 'target', categoryId: 'cards', subCategoryId: 'store-cards', name: 'Target', nameEn: 'Target Gift Card', icon: '', color: '#CC0000', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'cards', executionType: 'manual', order: 5, createdAt: new Date().toISOString() },
  'bestbuy': { id: 'bestbuy', categoryId: 'cards', subCategoryId: 'store-cards', name: 'Best Buy', nameEn: 'Best Buy Gift Card', icon: '', color: '#0046BE', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'cards', executionType: 'manual', order: 6, createdAt: new Date().toISOString() },
  'steam-wallet': { id: 'steam-wallet', categoryId: 'cards', subCategoryId: 'store-cards', name: 'Steam Wallet', nameEn: 'Steam Wallet Card', icon: '', color: '#1B2838', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'cards', executionType: 'manual', order: 7, createdAt: new Date().toISOString() },
  'nike': { id: 'nike', categoryId: 'cards', subCategoryId: 'store-cards', name: 'Nike', nameEn: 'Nike Gift Card', icon: '', color: '#111111', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'cards', executionType: 'manual', order: 8, createdAt: new Date().toISOString() },
  'uber': { id: 'uber', categoryId: 'cards', subCategoryId: 'store-cards', name: 'Uber', nameEn: 'Uber Gift Card', icon: '', color: '#000000', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text', inputPrefix: '', inputPlaceholder: 'أدخل البريد', providerType: 'cards', executionType: 'manual', order: 9, createdAt: new Date().toISOString() },
};

async function addMoreProviders() {
  console.log(`Adding ${Object.keys(additionalProviders).length} more providers...`);
  
  try {
    const updates = {};
    for (const [id, provider] of Object.entries(additionalProviders)) {
      updates[`providers/${id}`] = provider;
      updates[`adminSettings/visibility/providers/${id}`] = true;
    }
    
    await update(ref(db), updates);
    
    // Count total entertainment providers
    const { get } = require('firebase/database');
    const snapshot = await get(ref(db, 'providers'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const entProviders = Object.values(data).filter((p) => p.categoryId === 'entertainment');
      console.log(`✅ Added ${Object.keys(additionalProviders).length} providers`);
      console.log(`📊 Total entertainment providers: ${entProviders.length}`);
      console.log(`📊 Total providers: ${Object.keys(data).length}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addMoreProviders();
