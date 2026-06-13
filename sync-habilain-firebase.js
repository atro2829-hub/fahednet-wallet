/**
 * ====================================================================
 *  سكريبت مطابقة ترتيب فايربيز للحبيلين اونلاين مع محفظة الجنوب
 *  sync-habilain-firebase.js
 * 
 *  يقوم بـ:
 *  1. تصحيح categoryId للمزودين (entertainment→wallet-services, cards→wallet-services, investment→crypto-invest)
 *  2. إنشاء الأقسام الصحيحة في ownerSettings/sections (مطابقة لمحفظة الجنوب)
 *  3. إعداد إعدادات الظهور (visibility)
 *  4. إعداد الأقسام الفرعية الترفيهية
 *  5. إعداد Feature Flags
 *  6. إعداد الفئات في adminSettings/categories
 * ====================================================================
 */

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getDatabase, ServerValue } = require('firebase-admin/database');

// ═══════════════════════════════════════════════════════════
//  إعدادات قاعدة بيانات الحبيلين اونلاين
// ═══════════════════════════════════════════════════════════

const habilainDB = {
  name: 'الحبيلين اونلاين (Al-Habilayn)',
  serviceAccountPath: './alhabilain/firebase-adminsdk.json',
  databaseURL: 'https://fahed-net-default-rtdb.firebaseio.com',
};

// ═══════════════════════════════════════════════════════════
//  تعريف الأقسام - مطابق لمحفظة الجنوب
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
//  الأقسام الفرعية الترفيهية - مطابقة لمحفظة الجنوب
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
//  Feature Flags الافتراضية - مطابقة لمحفظة الجنوب
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

async function syncHabilainDatabase(dbConfig) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  🗄️  مطابقة ترتيب قاعدة بيانات: ${dbConfig.name}`);
  console.log(`  📍  الرابط: ${dbConfig.databaseURL}`);
  console.log(`${'═'.repeat(60)}\n`);

  // Initialize Firebase Admin
  let app;
  const appName = 'habilainSync';
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
  //  الخطوة 1: قراءة المزودين الحاليين وتصحيح categoryId
  // ─────────────────────────────────────────────────────
  console.log('📥 الخطوة 1: قراءة المزودين الحاليين وتصحيح categoryId...');
  
  let providersSnapshot;
  try {
    providersSnapshot = await db.ref('providers').once('value');
  } catch (err) {
    console.error('❌ فشل قراءة المزودين:', err.message);
    await app.delete();
    return;
  }

  if (!providersSnapshot.exists()) {
    console.log('⚠️  لا يوجد مزودين حالياً. سيتم إنشاؤهم من البيانات الافتراضية...');
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
  console.log('\n📥 الخطوة 2: تحديث الأقسام في ownerSettings/sections...');
  
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
    let oldCategoryProviders = 0;

    for (const [providerId, provider] of Object.entries(finalProviders)) {
      const cat = provider.categoryId || 'غير محدد';
      if (!categoryCounts[cat]) categoryCounts[cat] = 0;
      categoryCounts[cat]++;
      totalProviders++;
      if (cat === 'wallet-services') walletServicesProviders++;
      if (cat === 'entertainment' || cat === 'cards' || cat === 'investment') {
        oldCategoryProviders++;
      }
    }

    console.log('\n📊 ملخص المزودين حسب الفئة:');
    for (const [cat, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${cat}: ${count} مزود`);
    }
    console.log(`\n  📋 إجمالي المزودين: ${totalProviders}`);
    console.log(`  🎮 مزودين الخدمات الترفيهية (wallet-services): ${walletServicesProviders}`);
    if (oldCategoryProviders > 0) {
      console.log(`  ⚠️  مزودين بفئات قديمة: ${oldCategoryProviders}`);
    } else {
      console.log(`  ✅ لا يوجد مزودين بفئات قديمة`);
    }
  }

  const finalSectionsSnapshot = await db.ref('ownerSettings/sections').once('value');
  if (finalSectionsSnapshot.exists()) {
    const sections = finalSectionsSnapshot.val();
    console.log(`\n📂 عدد الأقسام: ${Object.keys(sections).length}`);
    const sortedSections = Object.entries(sections).sort((a, b) => a[1].order - b[1].order);
    for (const [id, section] of sortedSections) {
      console.log(`  ${id}: ${section.name} (ترتيب: ${section.order})`);
    }
  }

  const finalCategoriesSnapshot = await db.ref('adminSettings/categories').once('value');
  if (finalCategoriesSnapshot.exists()) {
    const categories = finalCategoriesSnapshot.val();
    console.log(`\n📁 عدد الفئات في adminSettings/categories: ${Object.keys(categories).length}`);
  }

  // تنظيف
  await app.delete();
  console.log(`\n✅ تم مطابقة ترتيب قاعدة بيانات ${dbConfig.name} مع محفظة الجنوب بنجاح!\n`);
}

// ═══════════════════════════════════════════════════════════
//  تشغيل السكريبت
// ═══════════════════════════════════════════════════════════

async function main() {
  console.log('\n🚀 بدء مطابقة ترتيب فايربيز الحبيلين اونلاين مع محفظة الجنوب...\n');

  try {
    await syncHabilainDatabase(habilainDB);
  } catch (err) {
    console.error(`❌ خطأ في ${habilainDB.name}:`, err.message);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('  ✅ تم الانتهاء من مطابقة الترتيب!');
  console.log('═'.repeat(60) + '\n');
}

main().catch(console.error);
