/**
 * Fix Firebase Database - Organize service categories & providers
 * 
 * Problems fixed:
 * 1. Providers have wrong categoryId: 'entertainment'/'cards' → should be 'wallet-services'
 * 2. adminSettings/categories path is empty (app reads from here but nothing writes there)
 * 3. adminSettings/visibility needs proper section/provider visibility flags
 * 4. Provider icon field is empty - app falls through to lookup, but for reliability we add iconKey
 * 
 * This script DOES NOT delete any existing data - it only UPDATES the paths the app reads from.
 */

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const serviceAccount = require('./upload/southern-portfolio-firebase-adminsdk-fbsvc-46f601a3ba.json');

// Initialize Firebase Admin
const app = getApps().length === 0
  ? initializeApp({
      credential: cert(serviceAccount),
      databaseURL: 'https://southern-portfolio-default-rtdb.firebaseio.com'
    })
  : getApps()[0];

const db = getDatabase(app);

// ═══════════════════════════════════════════════════════════
//  CATEGORIES - written to adminSettings/categories
//  This is the path that use-firebase-sync.ts reads from
// ═══════════════════════════════════════════════════════════
const categories = [
  { id: 'service-providers', name: 'مزودين الخدمات', type: 'providers', icon: 'providers' },
  { id: 'wallet-services', name: 'خدمات المحفظة الخاصة بنا', type: 'wallet-services', icon: 'wallet-services' },
  { id: 'telecom', name: 'الاتصالات', type: 'telecom', icon: 'telecom' },
  { id: 'internet', name: 'الإنترنت', type: 'internet', icon: 'internet' },
  { id: 'electricity', name: 'الكهرباء والماء', type: 'electricity', icon: 'electricity' },
  { id: 'government', name: 'خدمات حكومية', type: 'government', icon: 'government' },
  { id: 'crypto', name: 'الكريبتو', type: 'crypto', icon: 'crypto' },
  { id: 'crypto-invest', name: 'استثمار الكريبتو', type: 'crypto', icon: 'crypto-invest' },
];

// ═══════════════════════════════════════════════════════════
//  PROVIDERS - Fixed categoryId values
//  ALL entertainment + cards services → 'wallet-services'
//  This matches what services-screen.tsx expects
// ═══════════════════════════════════════════════════════════
const providers = [
  // الاتصالات
  { id: 'yemen-mobile', categoryId: 'telecom', name: 'يمن موبايل', color: '#C41E3A', icon: '', iconKey: 'yemen-mobile', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },
  { id: 'yo', categoryId: 'telecom', name: 'يو', color: '#FF6B00', icon: '', iconKey: 'yo', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },
  { id: 'sabafon', categoryId: 'telecom', name: 'سبأفون', color: '#2563EB', icon: '', iconKey: 'sabafon', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },
  { id: 'y', categoryId: 'telecom', name: 'واي', color: '#059669', icon: '', iconKey: 'y', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },

  // الإنترنت
  { id: 'yemen-net', categoryId: 'internet', name: 'يمن نت', color: '#8B5CF6', icon: '', iconKey: 'yemen-net', isActive: true, inputLabel: 'رقم الحساب', inputType: 'text' },
  { id: 'y-net-internet', categoryId: 'internet', name: 'واي نت', color: '#059669', icon: '', iconKey: 'y-net-internet', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },
  { id: 'sabafon-internet', categoryId: 'internet', name: 'سبأفون نت', color: '#2563EB', icon: '', iconKey: 'sabafon-internet', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },

  // خدمات المحفظة - ألعاب (was 'entertainment', now 'wallet-services')
  { id: 'pubg', categoryId: 'wallet-services', name: 'ببجي موبايل', color: '#F59E0B', icon: '', iconKey: 'pubg', isActive: true, inputLabel: 'Player ID', inputType: 'text' },
  { id: 'freefire', categoryId: 'wallet-services', name: 'فري فاير', color: '#EC4899', icon: '', iconKey: 'freefire', isActive: true, inputLabel: 'Player ID', inputType: 'text' },
  { id: 'call-of-duty', categoryId: 'wallet-services', name: 'كال اوف ديوتي', color: '#1a1a1a', icon: '', iconKey: 'call-of-duty', isActive: true, inputLabel: 'Player ID', inputType: 'text' },
  { id: 'clash-royale', categoryId: 'wallet-services', name: 'كلاش رويال', color: '#3B82F6', icon: '', iconKey: 'clash-royale', isActive: true, inputLabel: 'Player Tag', inputType: 'text' },
  { id: 'clash-of-clans', categoryId: 'wallet-services', name: 'كلاش اوف كلانس', color: '#F59E0B', icon: '', iconKey: 'clash-of-clans', isActive: true, inputLabel: 'Player Tag', inputType: 'text' },
  { id: 'roblox', categoryId: 'wallet-services', name: 'روبلوكس', color: '#8B1E3A', icon: '', iconKey: 'roblox', isActive: true, inputLabel: 'Username', inputType: 'text' },
  { id: 'fortnite', categoryId: 'wallet-services', name: 'فورتنايت', color: '#6D28D9', icon: '', iconKey: 'fortnite', isActive: true, inputLabel: 'Epic ID', inputType: 'text' },
  { id: 'minecraft', categoryId: 'wallet-services', name: 'ماينكرافت', color: '#4ADE80', icon: '', iconKey: 'minecraft', isActive: true, inputLabel: 'Username', inputType: 'text' },
  { id: 'valorant', categoryId: 'wallet-services', name: 'فالورانت', color: '#FF4655', icon: '', iconKey: 'valorant', isActive: true, inputLabel: 'Riot ID', inputType: 'text' },
  { id: 'league-legends', categoryId: 'wallet-services', name: 'ليق اوف ليجندز', color: '#C8AA6E', icon: '', iconKey: 'league-legends', isActive: true, inputLabel: 'Riot ID', inputType: 'text' },
  { id: 'apex-legends', categoryId: 'wallet-services', name: 'ابيكس ليجندز', color: '#DA292A', icon: '', iconKey: 'apex-legends', isActive: true, inputLabel: 'EA Account', inputType: 'text' },
  { id: 'genshin-impact', categoryId: 'wallet-services', name: 'جينشين امباكت', color: '#FFD700', icon: '', iconKey: 'genshin-impact', isActive: true, inputLabel: 'UID', inputType: 'text' },
  { id: 'honkai-star', categoryId: 'wallet-services', name: 'هنكاي ستار ريل', color: '#7C3AED', icon: '', iconKey: 'honkai-star', isActive: true, inputLabel: 'UID', inputType: 'text' },
  { id: 'ea-fc', categoryId: 'wallet-services', name: 'EA FC 25', color: '#22C55E', icon: '', iconKey: 'ea-fc', isActive: true, inputLabel: 'EA Account', inputType: 'text' },
  { id: 'steam', categoryId: 'wallet-services', name: 'ستيم', color: '#1B2838', icon: '', iconKey: 'steam', isActive: true, inputLabel: 'Steam ID', inputType: 'text' },

  // خدمات المحفظة - بث (was 'entertainment', now 'wallet-services')
  { id: 'netflix', categoryId: 'wallet-services', name: 'نتفلكس', color: '#E50914', icon: '', iconKey: 'netflix', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'spotify', categoryId: 'wallet-services', name: 'سبوتيفاي', color: '#1DB954', icon: '', iconKey: 'spotify', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'youtube-premium', categoryId: 'wallet-services', name: 'يوتيوب بريميوم', color: '#FF0000', icon: '', iconKey: 'youtube-premium', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },

  // خدمات المحفظة - بطاقات رقمية (was 'cards', now 'wallet-services')
  { id: 'google-play', categoryId: 'wallet-services', name: 'بطاقة جوجل بلاي', color: '#34A853', icon: '', iconKey: 'google-play', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'apple-itunes', categoryId: 'wallet-services', name: 'بطاقة آيتونز', color: '#007AFF', icon: '', iconKey: 'apple-itunes', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'amazon-gift', categoryId: 'wallet-services', name: 'بطاقة امازون', color: '#FF9900', icon: '', iconKey: 'amazon-gift', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'psn-card', categoryId: 'wallet-services', name: 'بطاقة بلايستيشن', color: '#00439C', icon: '', iconKey: 'psn-card', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'xbox-card', categoryId: 'wallet-services', name: 'بطاقة اكسبوكس', color: '#107C10', icon: '', iconKey: 'xbox-card', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'nintendo-card', categoryId: 'wallet-services', name: 'بطاقة نينتندو', color: '#E60012', icon: '', iconKey: 'nintendo-card', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'visa-virtual', categoryId: 'wallet-services', name: 'بطاقة فيزا افتراضية', color: '#1A1F71', icon: '', iconKey: 'visa-virtual', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'mastercard-virtual', categoryId: 'wallet-services', name: 'بطاقة ماستركارد افتراضية', color: '#EB001B', icon: '', iconKey: 'mastercard-virtual', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'paypal', categoryId: 'wallet-services', name: 'شحن بايبال', color: '#003087', icon: '', iconKey: 'paypal', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },

  // مزودين الخدمات (placeholder)
  { id: 'api-provider-placeholder', categoryId: 'service-providers', name: 'مزود خدمات (قريباً)', color: '#6B7280', icon: '', iconKey: 'providers', isActive: false, inputLabel: 'رقم العميل', inputType: 'text' },

  // الكهرباء والماء
  { id: 'elec-sanaa', categoryId: 'electricity', name: 'كهرباء صنعاء', color: '#F59E0B', icon: '', iconKey: 'electricity', isActive: true, inputLabel: 'رقم العداد', inputType: 'text' },
  { id: 'elec-aden', categoryId: 'electricity', name: 'كهرباء عدن', color: '#3B82F6', icon: '', iconKey: 'electricity', isActive: true, inputLabel: 'رقم العداد', inputType: 'text' },
  { id: 'water-sanaa', categoryId: 'electricity', name: 'مياه صنعاء', color: '#06B6D4', icon: '', iconKey: 'water', isActive: true, inputLabel: 'رقم الاشتراك', inputType: 'text' },
  { id: 'water-aden', categoryId: 'electricity', name: 'مياه عدن', color: '#0EA5E9', icon: '', iconKey: 'water', isActive: true, inputLabel: 'رقم الاشتراك', inputType: 'text' },

  // خدمات حكومية
  { id: 'civil-registry', categoryId: 'government', name: 'السجل المدني', color: '#6B7280', icon: '', iconKey: 'civil-registry', isActive: true, inputLabel: 'رقم الهوية', inputType: 'text' },
  { id: 'passport', categoryId: 'government', name: 'جواز السفر', color: '#1E40AF', icon: '', iconKey: 'passport', isActive: true, inputLabel: 'رقم الجواز', inputType: 'text' },
  { id: 'traffic', categoryId: 'government', name: 'المرور', color: '#DC2626', icon: '', iconKey: 'traffic', isActive: true, inputLabel: 'رقم اللوحة', inputType: 'text' },
  { id: 'municipal', categoryId: 'government', name: 'البلدية', color: '#059669', icon: '', iconKey: 'municipal', isActive: true, inputLabel: 'رقم الرخصة', inputType: 'text' },

  // الكريبتو
  { id: 'bitcoin', categoryId: 'crypto', name: 'بيتكوين BTC', color: '#F7931A', icon: '', iconKey: 'bitcoin', isActive: true, inputLabel: 'محفظة البيتكوين', inputType: 'text' },
  { id: 'ethereum', categoryId: 'crypto', name: 'إيثريوم ETH', color: '#627EEA', icon: '', iconKey: 'ethereum', isActive: true, inputLabel: 'محفظة الإيثريوم', inputType: 'text' },
  { id: 'usdt', categoryId: 'crypto', name: 'تيثر USDT', color: '#26A17B', icon: '', iconKey: 'usdt', isActive: true, inputLabel: 'محفظة USDT', inputType: 'text' },
  { id: 'bnb', categoryId: 'crypto', name: 'بينانس BNB', color: '#F3BA2F', icon: '', iconKey: 'bnb', isActive: true, inputLabel: 'محفظة بينانس', inputType: 'text' },
  { id: 'solana', categoryId: 'crypto', name: 'سولانا SOL', color: '#9945FF', icon: '', iconKey: 'solana', isActive: true, inputLabel: 'محفظة سولانا', inputType: 'text' },
  { id: 'tron', categoryId: 'crypto', name: 'ترون TRX', color: '#FF0013', icon: '', iconKey: 'tron', isActive: true, inputLabel: 'محفظة ترون', inputType: 'text' },

  // استثمار الكريبتو
  { id: 'usdt-daily', categoryId: 'crypto-invest', name: 'USDT يومي', color: '#26A17B', icon: '', iconKey: 'usdt', isActive: true, inputLabel: 'مبلغ الاستثمار', inputType: 'text' },
  { id: 'usdt-weekly', categoryId: 'crypto-invest', name: 'USDT أسبوعي', color: '#26A17B', icon: '', iconKey: 'usdt', isActive: true, inputLabel: 'مبلغ الاستثمار', inputType: 'text' },
  { id: 'usdt-monthly', categoryId: 'crypto-invest', name: 'USDT شهري', color: '#26A17B', icon: '', iconKey: 'usdt', isActive: true, inputLabel: 'مبلغ الاستثمار', inputType: 'text' },
  { id: 'usdt-quarterly', categoryId: 'crypto-invest', name: 'USDT ربع سنوي', color: '#26A17B', icon: '', iconKey: 'usdt', isActive: true, inputLabel: 'مبلغ الاستثمار', inputType: 'text' },
];

// ═══════════════════════════════════════════════════════════
//  MAIN: Fix Firebase data
// ═══════════════════════════════════════════════════════════
async function fixFirebaseData() {
  try {
    console.log('🔧 Fixing Firebase database structure...\n');

    const updates = {};

    // 1. Write categories to adminSettings/categories (the path the app reads from)
    console.log(`📋 Writing ${categories.length} categories to adminSettings/categories...`);
    categories.forEach((cat, i) => {
      updates[`adminSettings/categories/cat_${i}`] = cat;
    });

    // 2. Write providers with CORRECT categoryId values
    console.log(`🏢 Writing ${providers.length} providers with fixed categoryId...`);
    providers.forEach((prov) => {
      const firebaseKey = prov.id.replace(/[^a-zA-Z0-9_-]/g, '_');
      updates[`providers/${firebaseKey}`] = prov;
    });

    // 3. Write visibility settings for sections and providers
    console.log(`👁️ Writing visibility settings...`);
    
    // Section visibility - all visible by default
    categories.forEach(cat => {
      updates[`adminSettings/visibility/sections/${cat.id}`] = true;
    });
    // Also add entertainment section visibility (merged section in UI)
    updates[`adminSettings/visibility/sections/entertainment`] = true;
    updates[`adminSettings/visibility/sections/wallet-services`] = true;
    
    // Provider visibility - match isActive
    providers.forEach(prov => {
      const firebaseKey = prov.id.replace(/[^a-zA-Z0-9_-]/g, '_');
      updates[`adminSettings/visibility/providers/${firebaseKey}`] = prov.isActive;
    });

    // 4. Write legacy sectionVisibility for backward compatibility
    console.log(`📱 Writing legacy sectionVisibility...`);
    categories.forEach(cat => {
      updates[`adminSettings/sectionVisibility/${cat.id}`] = true;
    });

    // 5. Write ownerSettings/sections with proper data (for admin/owner panels)
    console.log(`⚙️ Writing ownerSettings/sections...`);
    const ownerSections = [
      { name: 'خدمات المحفظة', iconKey: 'wallet-services', order: 0, isVisible: true, categoryId: 'wallet-services' },
      { name: 'الاتصالات', iconKey: 'telecom', order: 1, isVisible: true, categoryId: 'telecom' },
      { name: 'الإنترنت', iconKey: 'internet', order: 2, isVisible: true, categoryId: 'internet' },
      { name: 'الكهرباء والماء', iconKey: 'electricity', order: 3, isVisible: true, categoryId: 'electricity' },
      { name: 'خدمات حكومية', iconKey: 'government', order: 4, isVisible: true, categoryId: 'government' },
      { name: 'الكريبتو', iconKey: 'crypto', order: 5, isVisible: true, categoryId: 'crypto' },
      { name: 'استثمار الكريبتو', iconKey: 'crypto-invest', order: 6, isVisible: true, categoryId: 'crypto-invest' },
    ];
    ownerSections.forEach((sec, i) => {
      updates[`ownerSettings/sections/section_${i}`] = sec;
    });

    // Execute the update
    console.log(`\n📝 Applying ${Object.keys(updates).length} updates to Firebase...`);
    await db.ref().update(updates);
    
    console.log('\n✅ Firebase database fixed successfully!');
    console.log('\nSummary of changes:');
    console.log(`  - ${categories.length} categories written to adminSettings/categories`);
    console.log(`  - ${providers.length} providers written with correct categoryId`);
    console.log(`  - Visibility settings written for all sections & providers`);
    console.log(`  - Owner sections updated to match app structure`);
    console.log('\nKey fixes:');
    console.log('  - entertainment → wallet-services (for all gaming/streaming providers)');
    console.log('  - cards → wallet-services (for all digital card providers)');
    console.log('  - investment → crypto-invest (for crypto investment providers)');
    console.log('  - Added iconKey field for provider icon lookup');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing Firebase data:', error);
    process.exit(1);
  }
}

fixFirebaseData();
