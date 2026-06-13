/**
 * ====================================================================
 *  سكريبت ترتيب قاعدة بيانات Firebase للتطبيقين
 *  organize-firebase-db.js
 * 
 *  يقوم بـ:
 *  1. تصحيح categoryId للمزودين ليتطابق مع الكود البرمجي
 *  2. إنشاء الأقسام الصحيحة في ownerSettings/sections
 *  3. إعداد إعدادات الظهور (visibility)
 *  4. إعداد الأقسام الفرعية الترفيهية
 *  5. إعداد Feature Flags
 *  6. تطبيق كل هذا على قاعدتي البيانات (محفظة الجنوب + الحبيلين)
 * ====================================================================
 */

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getDatabase, ServerValue } = require('firebase-admin/database');

// ═══════════════════════════════════════════════════════════
//  إعدادات قواعد البيانات
// ═══════════════════════════════════════════════════════════

const databases = [
  {
    name: 'محفظة الجنوب (South Wallet)',
    serviceAccountPath: './upload/southern-portfolio-firebase-adminsdk-fbsvc-46f601a3ba.json',
    databaseURL: 'https://southern-portfolio-default-rtdb.firebaseio.com',
  },
  {
    name: 'الحبيلين اونلاين (Al-Habilayn)',
    serviceAccountPath: './alhabilain/firebase-adminsdk.json',
    databaseURL: 'https://fahed-net-default-rtdb.firebaseio.com',
  },
];

// ═══════════════════════════════════════════════════════════
//  تعريف الأقسام - مطابق لما يتوقعه الكود البرمجي
// ═══════════════════════════════════════════════════════════

const correctSections = [
  { id: 'wallet-services', name: 'خدمات المحفظة الخاصة بنا', iconKey: 'gamepad', order: 0, isVisible: true, categoryId: 'wallet-services', type: 'wallet-services' },
  { id: 'service-providers', name: 'مزودين الخدمات', iconKey: 'server', order: 1, isVisible: true, categoryId: 'service-providers', type: 'providers' },
  { id: 'telecom', name: 'الاتصالات', iconKey: 'phone', order: 2, isVisible: true, categoryId: 'telecom', type: 'telecom' },
  { id: 'internet', name: 'الإنترنت', iconKey: 'wifi', order: 3, isVisible: true, categoryId: 'internet', type: 'internet' },
  { id: 'electricity', name: 'الكهرباء والماء', iconKey: 'zap', order: 4, isVisible: true, categoryId: 'electricity', type: 'electricity' },
  { id: 'government', name: 'خدمات حكومية', iconKey: 'landmark', order: 5, isVisible: true, categoryId: 'government', type: 'government' },
  { id: 'crypto', name: 'الكريبتو', iconKey: 'bitcoin', order: 6, isVisible: true, categoryId: 'crypto', type: 'crypto' },
  { id: 'crypto-invest', name: 'استثمار الكريبتو', iconKey: 'trending-up', order: 7, isVisible: true, categoryId: 'crypto-invest', type: 'crypto' },
];

// ═══════════════════════════════════════════════════════════
//  تصحيح categoryId للمزودين
//  الخريطة: القيمة الخاطئة ← القيمة الصحيحة
// ═══════════════════════════════════════════════════════════

const categoryIdFixMap = {
  'entertainment': 'wallet-services',   // الألعاب + البث يجب أن تكون wallet-services
  'cards': 'wallet-services',            // البطاقات الرقمية يجب أن تكون wallet-services
  'games': 'wallet-services',            // الألعاب يجب أن تكون wallet-services
  'streaming': 'wallet-services',        // البث يجب أن يكون wallet-services
  'investment': 'crypto-invest',         // الاستثمار يجب أن يكون crypto-invest
};

// ═══════════════════════════════════════════════════════════
//  الأقسام الفرعية الترفيهية
//  مطابقة لـ walletPrivateServicesSubSections في services-screen.tsx
// ═══════════════════════════════════════════════════════════

const entertainmentSubSections = [
  {
    id: 'sub-shooting',
    name: 'ألعاب إطلاق النار',
    nameEn: 'Shooting Games',
    providerIds: ['pubg', 'freefire', 'call-of-duty', 'fortnite', 'apex-legends', 'valorant'],
    categoryIds: ['wallet-services'],
    icon: 'crosshair',
    order: 0,
    isActive: true,
  },
  {
    id: 'sub-strategy',
    name: 'ألعاب الاستراتيجية',
    nameEn: 'Strategy Games',
    providerIds: ['clash-royale', 'clash-of-clans', 'league-legends'],
    categoryIds: ['wallet-services'],
    icon: 'crown',
    order: 1,
    isActive: true,
  },
  {
    id: 'sub-adventure',
    name: 'ألعاب المغامرات',
    nameEn: 'Adventure Games',
    providerIds: ['roblox', 'minecraft', 'genshin-impact', 'honkai-star'],
    categoryIds: ['wallet-services'],
    icon: 'compass',
    order: 2,
    isActive: true,
  },
  {
    id: 'sub-platforms',
    name: 'منصات الألعاب',
    nameEn: 'Gaming Platforms',
    providerIds: ['steam', 'ea-fc'],
    categoryIds: ['wallet-services'],
    icon: 'monitor',
    order: 3,
    isActive: true,
  },
  {
    id: 'sub-streaming',
    name: 'خدمات البث',
    nameEn: 'Streaming Services',
    providerIds: ['netflix', 'spotify', 'youtube-premium'],
    categoryIds: ['wallet-services'],
    icon: 'play-circle',
    order: 4,
    isActive: true,
  },
  {
    id: 'sub-store-cards',
    name: 'بطاقات المتاجر',
    nameEn: 'Store Cards',
    providerIds: ['google-play', 'apple-itunes', 'amazon-gift'],
    categoryIds: ['wallet-services'],
    icon: 'shopping-bag',
    order: 5,
    isActive: true,
  },
  {
    id: 'sub-gaming-cards',
    name: 'بطاقات الألعاب',
    nameEn: 'Gaming Cards',
    providerIds: ['psn-card', 'xbox-card', 'nintendo-card'],
    categoryIds: ['wallet-services'],
    icon: 'gamepad',
    order: 6,
    isActive: true,
  },
  {
    id: 'sub-payment-cards',
    name: 'بطاقات الدفع',
    nameEn: 'Payment Cards',
    providerIds: ['visa-virtual', 'mastercard-virtual', 'paypal'],
    categoryIds: ['wallet-services'],
    icon: 'credit-card',
    order: 7,
    isActive: true,
  },
];

// ═══════════════════════════════════════════════════════════
//  Feature Flags الافتراضية
// ═══════════════════════════════════════════════════════════

const defaultFeatureFlags = {
  transfersEnabled: true,
  depositsEnabled: true,
  withdrawalsEnabled: true,
  exchangeEnabled: true,
  servicesEnabled: true,
  rechargeEnabled: true,
  billsEnabled: true,
  investmentEnabled: true,
  cryptoEnabled: true,
  giftCodesEnabled: true,
  qrPaymentsEnabled: true,
  referralEnabled: true,
  notificationsEnabled: true,
  biometricEnabled: true,
  pinEnabled: true,
  darkModeEnabled: true,
  maintenanceMode: false,
  maintenanceMessage: '',
  registrationEnabled: true,
};

// ═══════════════════════════════════════════════════════════
//  الدالة الرئيسية
// ═══════════════════════════════════════════════════════════

async function organizeDatabase(dbConfig) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  🗄️  ترتيب قاعدة بيانات: ${dbConfig.name}`);
  console.log(`  📍  الرابط: ${dbConfig.databaseURL}`);
  console.log(`${'═'.repeat(60)}\n`);

  // Initialize Firebase Admin
  let app;
  const appName = dbConfig.name.replace(/[^a-zA-Z]/g, '');
  try {
    const serviceAccount = require(dbConfig.serviceAccountPath);
    app = initializeApp({
      credential: cert(serviceAccount),
      databaseURL: dbConfig.databaseURL,
    }, appName);
  } catch (err) {
    console.error(`❌ فشل الاتصال بقاعدة البيانات ${dbConfig.name}:`, err.message);
    return;
  }

  const db = getDatabase(app);

  // ─────────────────────────────────────────────────────
  //  الخطوة 1: قراءة المزودين الحاليين
  // ─────────────────────────────────────────────────────
  console.log('📥 الخطوة 1: قراءة المزودين الحاليين...');
  
  let providersSnapshot;
  try {
    providersSnapshot = await db.ref('providers').once('value');
  } catch (err) {
    console.error('❌ فشل قراءة المزودين:', err.message);
    return;
  }

  if (!providersSnapshot.exists()) {
    console.log('⚠️  لا يوجد مزودين حالياً. سيتم إنشاؤهم من البيانات الافتراضية...');
    await seedDefaultProviders(db);
  } else {
    const providers = providersSnapshot.val();
    let fixedCount = 0;
    const updates = {};

    for (const [providerId, provider] of Object.entries(providers)) {
      const currentCategoryId = provider.categoryId;
      const correctCategoryId = categoryIdFixMap[currentCategoryId];

      if (correctCategoryId) {
        console.log(`  🔧 تصحيح ${providerId}: ${currentCategoryId} → ${correctCategoryId}`);
        updates[`providers/${providerId}/categoryId`] = correctCategoryId;
        fixedCount++;
      }
    }

    if (fixedCount > 0) {
      console.log(`\n✅ سيتم تصحيح ${fixedCount} مزود...`);
      await db.ref('/').update(updates);
      console.log('✅ تم تصحيح categoryId للمزودين بنجاح!');
    } else {
      console.log('✅ جميع المزودين لديهم categoryId صحيح!');
    }
  }

  // ─────────────────────────────────────────────────────
  //  الخطوة 2: تحديث الأقسام في ownerSettings/sections
  // ─────────────────────────────────────────────────────
  console.log('\n📥 الخطوة 2: تحديث الأقسام...');
  
  const sectionsUpdate = {};
  for (const section of correctSections) {
    sectionsUpdate[section.id] = {
      name: section.name,
      iconKey: section.iconKey,
      order: section.order,
      isVisible: section.isVisible,
      categoryId: section.categoryId,
      type: section.type,
    };
  }

  await db.ref('ownerSettings/sections').set(sectionsUpdate);
  console.log('✅ تم تحديث الأقسام في ownerSettings/sections');

  // ─────────────────────────────────────────────────────
  //  الخطوة 3: إعداد إعدادات الظهور (visibility)
  // ─────────────────────────────────────────────────────
  console.log('\n📥 الخطوة 3: إعداد إعدادات الظهور...');
  
  const visibilitySections = {};
  const visibilityProviders = {};

  // جميع الأقسام مرئية
  for (const section of correctSections) {
    visibilitySections[section.categoryId] = true;
  }

  // قراءة المزودين المحدثين
  const updatedProvidersSnapshot = await db.ref('providers').once('value');
  if (updatedProvidersSnapshot.exists()) {
    const updatedProviders = updatedProvidersSnapshot.val();
    for (const [providerId, provider] of Object.entries(updatedProviders)) {
      // جميع المزودين النشطين مرئيين
      if (provider.isActive !== false) {
        visibilityProviders[providerId] = true;
      }
    }
  }

  await db.ref('adminSettings/visibility').set({
    sections: visibilitySections,
    providers: visibilityProviders,
  });
  console.log('✅ تم إعداد إعدادات الظهور');

  // ─────────────────────────────────────────────────────
  //  الخطوة 4: إعداد الأقسام الفرعية الترفيهية
  // ─────────────────────────────────────────────────────
  console.log('\n📥 الخطوة 4: إعداد الأقسام الفرعية الترفيهية...');
  
  const subSectionsUpdate = {};
  for (const sub of entertainmentSubSections) {
    subSectionsUpdate[sub.id] = {
      name: sub.name,
      nameEn: sub.nameEn,
      providerIds: sub.providerIds,
      categoryIds: sub.categoryIds,
      icon: sub.icon,
      order: sub.order,
      isActive: sub.isActive,
    };
  }

  await db.ref('adminSettings/entertainmentSubSections').set(subSectionsUpdate);
  console.log('✅ تم إعداد الأقسام الفرعية الترفيهية');

  // ─────────────────────────────────────────────────────
  //  الخطوة 5: إعداد Feature Flags
  // ─────────────────────────────────────────────────────
  console.log('\n📥 الخطوة 5: إعداد Feature Flags...');
  
  // قراءة القيم الحالية أولاً
  const existingFeaturesSnapshot = await db.ref('adminSettings/features').once('value');
  let existingFeatures = {};
  if (existingFeaturesSnapshot.exists()) {
    existingFeatures = existingFeaturesSnapshot.val();
  }

  // دمج القيم الحالية مع الافتراضية (الافتراضية فقط للقيم المفقودة)
  const mergedFeatures = { ...defaultFeatureFlags, ...existingFeatures };
  await db.ref('adminSettings/features').set(mergedFeatures);
  console.log('✅ تم إعداد Feature Flags');

  // ─────────────────────────────────────────────────────
  //  الخطوة 6: إعداد الفئات في adminSettings/categories
  // ─────────────────────────────────────────────────────
  console.log('\n📥 الخطوة 6: إعداد الفئات في adminSettings/categories...');
  
  const categoriesUpdate = {};
  for (const section of correctSections) {
    categoriesUpdate[section.id] = {
      id: section.id,
      name: section.name,
      type: section.type,
      icon: section.iconKey,
    };
  }

  await db.ref('adminSettings/categories').set(categoriesUpdate);
  console.log('✅ تم إعداد الفئات في adminSettings/categories');

  // ─────────────────────────────────────────────────────
  //  الخطوة 7: التحقق النهائي
  // ─────────────────────────────────────────────────────
  console.log('\n📥 الخطوة 7: التحقق النهائي...');
  
  const finalProvidersSnapshot = await db.ref('providers').once('value');
  if (finalProvidersSnapshot.exists()) {
    const finalProviders = finalProvidersSnapshot.val();
    const categoryCounts = {};
    let totalProviders = 0;
    let walletServicesProviders = 0;

    for (const [providerId, provider] of Object.entries(finalProviders)) {
      const cat = provider.categoryId || 'غير محدد';
      if (!categoryCounts[cat]) categoryCounts[cat] = 0;
      categoryCounts[cat]++;
      totalProviders++;
      if (cat === 'wallet-services') walletServicesProviders++;
    }

    console.log('\n📊 ملخص المزودين حسب الفئة:');
    for (const [cat, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${cat}: ${count} مزود`);
    }
    console.log(`\n  📋 إجمالي المزودين: ${totalProviders}`);
    console.log(`  🎮 مزودين الخدمات الترفيهية (wallet-services): ${walletServicesProviders}`);
  }

  const finalSectionsSnapshot = await db.ref('ownerSettings/sections').once('value');
  if (finalSectionsSnapshot.exists()) {
    const sections = finalSectionsSnapshot.val();
    console.log(`\n📂 عدد الأقسام: ${Object.keys(sections).length}`);
    for (const [id, section] of Object.entries(sections)) {
      console.log(`  ${id}: ${section.name} (ترتيب: ${section.order})`);
    }
  }

  // تنظيف
  await app.delete();
  console.log(`\n✅ تم ترتيب قاعدة بيانات ${dbConfig.name} بنجاح!\n`);
}

// ═══════════════════════════════════════════════════════════
//  إنشاء المزودين الافتراضيين إذا لم يوجد أي مزود
// ═══════════════════════════════════════════════════════════

async function seedDefaultProviders(db) {
  console.log('🌱 إنشاء المزودين الافتراضيين...');
  
  const defaultProviders = {
    // الاتصالات
    'yemen-mobile': { id: 'yemen-mobile', categoryId: 'telecom', name: 'يمن موبايل', color: '#C41E3A', icon: '', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },
    'yo': { id: 'yo', categoryId: 'telecom', name: 'يو', color: '#FF6B00', icon: '', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },
    'sabafon': { id: 'sabafon', categoryId: 'telecom', name: 'سبأفون', color: '#2563EB', icon: '', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },
    'y': { id: 'y', categoryId: 'telecom', name: 'واي', color: '#059669', icon: '', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },

    // الإنترنت
    'yemen-net': { id: 'yemen-net', categoryId: 'internet', name: 'يمن نت', color: '#8B5CF6', icon: '', isActive: true, inputLabel: 'رقم الحساب', inputType: 'text' },
    'y-net-internet': { id: 'y-net-internet', categoryId: 'internet', name: 'واي نت', color: '#059669', icon: '', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },
    'sabafon-internet': { id: 'sabafon-internet', categoryId: 'internet', name: 'سبأفون نت', color: '#2563EB', icon: '', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },

    // خدمات المحفظة - ألعاب إطلاق النار
    'pubg': { id: 'pubg', categoryId: 'wallet-services', name: 'ببجي موبايل', color: '#F59E0B', icon: '', isActive: true, inputLabel: 'Player ID', inputType: 'text' },
    'freefire': { id: 'freefire', categoryId: 'wallet-services', name: 'فري فاير', color: '#EC4899', icon: '', isActive: true, inputLabel: 'Player ID', inputType: 'text' },
    'call-of-duty': { id: 'call-of-duty', categoryId: 'wallet-services', name: 'كال اوف ديوتي', color: '#1a1a1a', icon: '', isActive: true, inputLabel: 'Player ID', inputType: 'text' },
    'fortnite': { id: 'fortnite', categoryId: 'wallet-services', name: 'فورتنايت', color: '#6D28D9', icon: '', isActive: true, inputLabel: 'Epic ID', inputType: 'text' },
    'apex-legends': { id: 'apex-legends', categoryId: 'wallet-services', name: 'ابيكس ليجندز', color: '#DA292A', icon: '', isActive: true, inputLabel: 'EA Account', inputType: 'text' },
    'valorant': { id: 'valorant', categoryId: 'wallet-services', name: 'فالورانت', color: '#FF4655', icon: '', isActive: true, inputLabel: 'Riot ID', inputType: 'text' },

    // خدمات المحفظة - ألعاب الاستراتيجية
    'clash-royale': { id: 'clash-royale', categoryId: 'wallet-services', name: 'كلاش رويال', color: '#3B82F6', icon: '', isActive: true, inputLabel: 'Player Tag', inputType: 'text' },
    'clash-of-clans': { id: 'clash-of-clans', categoryId: 'wallet-services', name: 'كلاش اوف كلانس', color: '#F59E0B', icon: '', isActive: true, inputLabel: 'Player Tag', inputType: 'text' },
    'league-legends': { id: 'league-legends', categoryId: 'wallet-services', name: 'ليق اوف ليجندز', color: '#C8AA6E', icon: '', isActive: true, inputLabel: 'Riot ID', inputType: 'text' },

    // خدمات المحفظة - ألعاب المغامرات
    'roblox': { id: 'roblox', categoryId: 'wallet-services', name: 'روبلوكس', color: '#8B1E3A', icon: '', isActive: true, inputLabel: 'Username', inputType: 'text' },
    'minecraft': { id: 'minecraft', categoryId: 'wallet-services', name: 'ماينكرافت', color: '#4ADE80', icon: '', isActive: true, inputLabel: 'Username', inputType: 'text' },
    'genshin-impact': { id: 'genshin-impact', categoryId: 'wallet-services', name: 'جينشين امباكت', color: '#FFD700', icon: '', isActive: true, inputLabel: 'UID', inputType: 'text' },
    'honkai-star': { id: 'honkai-star', categoryId: 'wallet-services', name: 'هنكاي ستار ريل', color: '#7C3AED', icon: '', isActive: true, inputLabel: 'UID', inputType: 'text' },

    // خدمات المحفظة - منصات الألعاب
    'steam': { id: 'steam', categoryId: 'wallet-services', name: 'ستيم', color: '#1B2838', icon: '', isActive: true, inputLabel: 'Steam ID', inputType: 'text' },
    'ea-fc': { id: 'ea-fc', categoryId: 'wallet-services', name: 'EA FC 25', color: '#22C55E', icon: '', isActive: true, inputLabel: 'EA Account', inputType: 'text' },

    // خدمات المحفظة - خدمات البث
    'netflix': { id: 'netflix', categoryId: 'wallet-services', name: 'نتفلكس', color: '#E50914', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
    'spotify': { id: 'spotify', categoryId: 'wallet-services', name: 'سبوتيفاي', color: '#1DB954', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
    'youtube-premium': { id: 'youtube-premium', categoryId: 'wallet-services', name: 'يوتيوب بريميوم', color: '#FF0000', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },

    // خدمات المحفظة - بطاقات المتاجر
    'google-play': { id: 'google-play', categoryId: 'wallet-services', name: 'بطاقة جوجل بلاي', color: '#34A853', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
    'apple-itunes': { id: 'apple-itunes', categoryId: 'wallet-services', name: 'بطاقة آيتونز', color: '#007AFF', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
    'amazon-gift': { id: 'amazon-gift', categoryId: 'wallet-services', name: 'بطاقة امازون', color: '#FF9900', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },

    // خدمات المحفظة - بطاقات الألعاب
    'psn-card': { id: 'psn-card', categoryId: 'wallet-services', name: 'بطاقة بلايستيشن', color: '#00439C', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
    'xbox-card': { id: 'xbox-card', categoryId: 'wallet-services', name: 'بطاقة اكسبوكس', color: '#107C10', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
    'nintendo-card': { id: 'nintendo-card', categoryId: 'wallet-services', name: 'بطاقة نينتندو', color: '#E60012', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },

    // خدمات المحفظة - بطاقات الدفع
    'visa-virtual': { id: 'visa-virtual', categoryId: 'wallet-services', name: 'بطاقة فيزا افتراضية', color: '#1A1F71', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
    'mastercard-virtual': { id: 'mastercard-virtual', categoryId: 'wallet-services', name: 'بطاقة ماستركارد افتراضية', color: '#EB001B', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
    'paypal': { id: 'paypal', categoryId: 'wallet-services', name: 'شحن بايبال', color: '#003087', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },

    // الكهرباء والماء
    'elec-sanaa': { id: 'elec-sanaa', categoryId: 'electricity', name: 'كهرباء صنعاء', color: '#F59E0B', icon: '', isActive: true, inputLabel: 'رقم العداد', inputType: 'text' },
    'elec-aden': { id: 'elec-aden', categoryId: 'electricity', name: 'كهرباء عدن', color: '#3B82F6', icon: '', isActive: true, inputLabel: 'رقم العداد', inputType: 'text' },
    'water-sanaa': { id: 'water-sanaa', categoryId: 'electricity', name: 'مياه صنعاء', color: '#06B6D4', icon: '', isActive: true, inputLabel: 'رقم الاشتراك', inputType: 'text' },
    'water-aden': { id: 'water-aden', categoryId: 'electricity', name: 'مياه عدن', color: '#0EA5E9', icon: '', isActive: true, inputLabel: 'رقم الاشتراك', inputType: 'text' },

    // خدمات حكومية
    'civil-registry': { id: 'civil-registry', categoryId: 'government', name: 'السجل المدني', color: '#6B7280', icon: '', isActive: true, inputLabel: 'رقم الهوية', inputType: 'text' },
    'passport': { id: 'passport', categoryId: 'government', name: 'جواز السفر', color: '#1E40AF', icon: '', isActive: true, inputLabel: 'رقم الجواز', inputType: 'text' },
    'traffic': { id: 'traffic', categoryId: 'government', name: 'المرور', color: '#DC2626', icon: '', isActive: true, inputLabel: 'رقم اللوحة', inputType: 'text' },
    'municipal': { id: 'municipal', categoryId: 'government', name: 'البلدية', color: '#059669', icon: '', isActive: true, inputLabel: 'رقم الرخصة', inputType: 'text' },

    // الكريبتو
    'bitcoin': { id: 'bitcoin', categoryId: 'crypto', name: 'بيتكوين BTC', color: '#F7931A', icon: '', isActive: true, inputLabel: 'محفظة البيتكوين', inputType: 'text' },
    'ethereum': { id: 'ethereum', categoryId: 'crypto', name: 'إيثريوم ETH', color: '#627EEA', icon: '', isActive: true, inputLabel: 'محفظة الإيثريوم', inputType: 'text' },
    'usdt': { id: 'usdt', categoryId: 'crypto', name: 'تيثر USDT', color: '#26A17B', icon: '', isActive: true, inputLabel: 'محفظة USDT', inputType: 'text' },
    'bnb': { id: 'bnb', categoryId: 'crypto', name: 'بينانس BNB', color: '#F3BA2F', icon: '', isActive: true, inputLabel: 'محفظة بينانس', inputType: 'text' },
    'solana': { id: 'solana', categoryId: 'crypto', name: 'سولانا SOL', color: '#9945FF', icon: '', isActive: true, inputLabel: 'محفظة سولانا', inputType: 'text' },
    'tron': { id: 'tron', categoryId: 'crypto', name: 'ترون TRX', color: '#FF0013', icon: '', isActive: true, inputLabel: 'محفظة ترون', inputType: 'text' },

    // استثمار الكريبتو
    'usdt-daily': { id: 'usdt-daily', categoryId: 'crypto-invest', name: 'USDT يومي', color: '#26A17B', icon: '', isActive: true, inputLabel: 'مبلغ الاستثمار', inputType: 'text' },
    'usdt-weekly': { id: 'usdt-weekly', categoryId: 'crypto-invest', name: 'USDT أسبوعي', color: '#26A17B', icon: '', isActive: true, inputLabel: 'مبلغ الاستثمار', inputType: 'text' },
    'usdt-monthly': { id: 'usdt-monthly', categoryId: 'crypto-invest', name: 'USDT شهري', color: '#26A17B', icon: '', isActive: true, inputLabel: 'مبلغ الاستثمار', inputType: 'text' },
    'usdt-quarterly': { id: 'usdt-quarterly', categoryId: 'crypto-invest', name: 'USDT ربع سنوي', color: '#26A17B', icon: '', isActive: true, inputLabel: 'مبلغ الاستثمار', inputType: 'text' },
  };

  await db.ref('providers').set(defaultProviders);
  console.log(`✅ تم إنشاء ${Object.keys(defaultProviders).length} مزود افتراضي`);
}

// ═══════════════════════════════════════════════════════════
//  تشغيل السكريبت
// ═══════════════════════════════════════════════════════════

async function main() {
  console.log('\n🚀 بدء ترتيب قواعد البيانات...\n');

  for (const dbConfig of databases) {
    try {
      await organizeDatabase(dbConfig);
    } catch (err) {
      console.error(`❌ خطأ في ${dbConfig.name}:`, err.message);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('  ✅ تم الانتهاء من ترتيب جميع قواعد البيانات!');
  console.log('═'.repeat(60) + '\n');
}

main().catch(console.error);
