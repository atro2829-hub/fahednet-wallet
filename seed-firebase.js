/**
 * Seed Firebase Realtime Database with comprehensive product data
 * for محفظة الجنوب (South Wallet)
 * 
 * This script pushes data to:
 * - ownerSettings/sections/  (categories)
 * - providers/               (service providers) 
 * - packages/                (product packages)
 * - adminSettings/visibility/ (visibility toggles)
 * - walletServices/          (wallet-specific services)
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
//  SECTIONS (Categories) - 16 categories
// ═══════════════════════════════════════════════════════════
const sections = [
  { name: 'الاتصالات', iconKey: 'phone', order: 0, isVisible: true, categoryId: 'telecom' },
  { name: 'الإنترنت', iconKey: 'wifi', order: 1, isVisible: true, categoryId: 'internet' },
  { name: 'خدمات ترفيهية', iconKey: 'gamepad', order: 2, isVisible: true, categoryId: 'entertainment' },
  { name: 'بطاقات رقمية', iconKey: 'credit-card', order: 3, isVisible: true, categoryId: 'cards' },
  { name: 'خدمات المحفظة', iconKey: 'digital-wallet', order: 4, isVisible: true, categoryId: 'wallet-services' },
  { name: 'الكهرباء والماء', iconKey: 'zap', order: 5, isVisible: true, categoryId: 'electricity' },
  { name: 'خدمات حكومية', iconKey: 'landmark', order: 6, isVisible: true, categoryId: 'government' },
  { name: 'الكريبتو', iconKey: 'bitcoin', order: 7, isVisible: true, categoryId: 'crypto' },
  { name: 'استثمار الكريبتو', iconKey: 'trending-up', order: 8, isVisible: true, categoryId: 'investment' },
  { name: 'التسوق', iconKey: 'shopping-cart', order: 9, isVisible: true, categoryId: 'shopping' },
  { name: 'التعليم', iconKey: 'education', order: 10, isVisible: true, categoryId: 'education' },
  { name: 'الصحة', iconKey: 'health', order: 11, isVisible: true, categoryId: 'health' },
  { name: 'السفر والسياحة', iconKey: 'airplane', order: 12, isVisible: true, categoryId: 'travel' },
  { name: 'الطعام والتوصيل', iconKey: 'food-delivery', order: 13, isVisible: true, categoryId: 'food' },
  { name: 'خدمات API', iconKey: 'server', order: 14, isVisible: true, categoryId: 'api-services' },
];

// ═══════════════════════════════════════════════════════════
//  PROVIDERS (Service Providers) - 70+ providers
// ═══════════════════════════════════════════════════════════
const providers = [
  // الاتصالات
  { id: 'yemen-mobile', categoryId: 'telecom', name: 'يمن موبايل', color: '#C41E3A', icon: '', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },
  { id: 'yo', categoryId: 'telecom', name: 'يو', color: '#FF6B00', icon: '', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },
  { id: 'sabafon', categoryId: 'telecom', name: 'سبأفون', color: '#2563EB', icon: '', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },
  { id: 'y', categoryId: 'telecom', name: 'واي', color: '#059669', icon: '', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },

  // الإنترنت
  { id: 'yemen-net', categoryId: 'internet', name: 'يمن نت', color: '#8B5CF6', icon: '', isActive: true, inputLabel: 'رقم الحساب', inputType: 'text' },
  { id: 'y-net-internet', categoryId: 'internet', name: 'واي نت', color: '#059669', icon: '', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },
  { id: 'sabafon-internet', categoryId: 'internet', name: 'سبأفون نت', color: '#2563EB', icon: '', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone', inputPrefix: '+967' },

  // خدمات ترفيهية (ألعاب)
  { id: 'pubg', categoryId: 'entertainment', name: 'ببجي موبايل', color: '#F59E0B', icon: '', isActive: true, inputLabel: 'Player ID', inputType: 'text' },
  { id: 'freefire', categoryId: 'entertainment', name: 'فري فاير', color: '#EC4899', icon: '', isActive: true, inputLabel: 'Player ID', inputType: 'text' },
  { id: 'call-of-duty', categoryId: 'entertainment', name: 'كال اوف ديوتي', color: '#1a1a1a', icon: '', isActive: true, inputLabel: 'Player ID', inputType: 'text' },
  { id: 'clash-royale', categoryId: 'entertainment', name: 'كلاش رويال', color: '#3B82F6', icon: '', isActive: true, inputLabel: 'Player Tag', inputType: 'text' },
  { id: 'clash-of-clans', categoryId: 'entertainment', name: 'كلاش اوف كلانس', color: '#F59E0B', icon: '', isActive: true, inputLabel: 'Player Tag', inputType: 'text' },
  { id: 'roblox', categoryId: 'entertainment', name: 'روبلوكس', color: '#E60000', icon: '', isActive: true, inputLabel: 'Username', inputType: 'text' },
  { id: 'fortnite', categoryId: 'entertainment', name: 'فورتنايت', color: '#6D28D9', icon: '', isActive: true, inputLabel: 'Epic ID', inputType: 'text' },
  { id: 'minecraft', categoryId: 'entertainment', name: 'ماينكرافت', color: '#4ADE80', icon: '', isActive: true, inputLabel: 'Username', inputType: 'text' },
  { id: 'valorant', categoryId: 'entertainment', name: 'فالورانت', color: '#FF4655', icon: '', isActive: true, inputLabel: 'Riot ID', inputType: 'text' },
  { id: 'league-legends', categoryId: 'entertainment', name: 'ليق اوف ليجندز', color: '#C8AA6E', icon: '', isActive: true, inputLabel: 'Riot ID', inputType: 'text' },
  { id: 'apex-legends', categoryId: 'entertainment', name: 'ابيكس ليجندز', color: '#DA292A', icon: '', isActive: true, inputLabel: 'EA Account', inputType: 'text' },
  { id: 'genshin-impact', categoryId: 'entertainment', name: 'جينشين امباكت', color: '#FFD700', icon: '', isActive: true, inputLabel: 'UID', inputType: 'text' },
  { id: 'honkai-star', categoryId: 'entertainment', name: 'هنكاي ستار ريل', color: '#7C3AED', icon: '', isActive: true, inputLabel: 'UID', inputType: 'text' },
  { id: 'ea-fc', categoryId: 'entertainment', name: 'EA FC 25', color: '#22C55E', icon: '', isActive: true, inputLabel: 'EA Account', inputType: 'text' },
  { id: 'steam', categoryId: 'entertainment', name: 'ستيم', color: '#1B2838', icon: '', isActive: true, inputLabel: 'Steam ID', inputType: 'text' },

  // خدمات ترفيهية (بث)
  { id: 'netflix', categoryId: 'entertainment', name: 'نتفلكس', color: '#E50914', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'spotify', categoryId: 'entertainment', name: 'سبوتيفاي', color: '#1DB954', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'youtube-premium', categoryId: 'entertainment', name: 'يوتيوب بريميوم', color: '#FF0000', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'shahid', categoryId: 'entertainment', name: 'شاهد VIP', color: '#FFD700', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'disney-plus', categoryId: 'entertainment', name: 'ديزني بلس', color: '#113CCF', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'crunchyroll', categoryId: 'entertainment', name: 'كرانشي رول', color: '#F47521', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },

  // بطاقات رقمية
  { id: 'google-play', categoryId: 'cards', name: 'بطاقة جوجل بلاي', color: '#34A853', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'apple-itunes', categoryId: 'cards', name: 'بطاقة آيتونز', color: '#007AFF', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'amazon-gift', categoryId: 'cards', name: 'بطاقة امازون', color: '#FF9900', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'psn-card', categoryId: 'cards', name: 'بطاقة بلايستيشن', color: '#00439C', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'xbox-card', categoryId: 'cards', name: 'بطاقة اكسبوكس', color: '#107C10', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'nintendo-card', categoryId: 'cards', name: 'بطاقة نينتندو', color: '#E60012', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'visa-virtual', categoryId: 'cards', name: 'بطاقة فيزا افتراضية', color: '#1A1F71', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'mastercard-virtual', categoryId: 'cards', name: 'بطاقة ماستركارد افتراضية', color: '#EB001B', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'paypal', categoryId: 'cards', name: 'شحن بايبال', color: '#003087', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },

  // خدمات المحفظة - أساسية
  { id: 'wallet-transfer-svc', categoryId: 'wallet-services', name: 'تحويل رصيد', color: '#3B82F6', icon: '', isActive: true, inputLabel: 'رقم المستلم', inputType: 'phone', inputPrefix: '+967' },
  { id: 'wallet-withdraw', categoryId: 'wallet-services', name: 'سحب نقدي', color: '#EF4444', icon: '', isActive: true, inputLabel: 'مبلغ السحب', inputType: 'text' },
  { id: 'wallet-deposit-svc', categoryId: 'wallet-services', name: 'إيداع رصيد', color: '#10B981', icon: '', isActive: true, inputLabel: 'مبلغ الإيداع', inputType: 'text' },
  { id: 'wallet-bill-pay', categoryId: 'wallet-services', name: 'دفع فواتير', color: '#F59E0B', icon: '', isActive: true, inputLabel: 'رقم الفاتورة', inputType: 'text' },
  { id: 'wallet-exchange-svc', categoryId: 'wallet-services', name: 'صرف عملات', color: '#14B8A6', icon: '', isActive: true, inputLabel: 'العملة', inputType: 'text' },

  // خدمات المحفظة - ألعاب وترفيه (مزامنة مع خدمات ترفيهية)
  { id: 'pubg-wallet', categoryId: 'wallet-services', name: 'ببجي موبايل', color: '#F59E0B', icon: '', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text' },
  { id: 'freefire-wallet', categoryId: 'wallet-services', name: 'فري فاير', color: '#FF6B00', icon: '', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text' },
  { id: 'cod-wallet', categoryId: 'wallet-services', name: 'كال اوف ديوتي', color: '#1a1a1a', icon: '', isActive: true, inputLabel: 'معرف اللاعب', inputType: 'text' },
  { id: 'netflix-wallet', categoryId: 'wallet-services', name: 'نتفلكس', color: '#E50914', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },
  { id: 'spotify-wallet', categoryId: 'wallet-services', name: 'سبوتيفاي', color: '#1DB954', icon: '', isActive: true, inputLabel: 'البريد الإلكتروني', inputType: 'text' },

  // خدمات المحفظة - إضافية
  { id: 'wallet-statement-svc', categoryId: 'wallet-services', name: 'كشف حساب', color: '#8B5CF6', icon: '', isActive: true, inputLabel: 'الفترة', inputType: 'text' },
  { id: 'wallet-card-issue', categoryId: 'wallet-services', name: 'إصدار بطاقة', color: '#EC4899', icon: '', isActive: true, inputLabel: 'نوع البطاقة', inputType: 'text' },
  { id: 'wallet-intl-transfer', categoryId: 'wallet-services', name: 'تحويل دولي', color: '#06B6D4', icon: '', isActive: true, inputLabel: 'IBAN المستلم', inputType: 'text' },
  { id: 'wallet-qr-pay', categoryId: 'wallet-services', name: 'دفع بالباركود', color: '#6366F1', icon: '', isActive: true, inputLabel: 'رمز الباركود', inputType: 'text' },
  { id: 'wallet-savings-svc', categoryId: 'wallet-services', name: 'توفير ومدخرات', color: '#059669', icon: '', isActive: true, inputLabel: 'مبلغ التوفير', inputType: 'text' },

  // الكهرباء والماء
  { id: 'elec-sanaa', categoryId: 'electricity', name: 'كهرباء صنعاء', color: '#F59E0B', icon: '', isActive: true, inputLabel: 'رقم العداد', inputType: 'text' },
  { id: 'elec-aden', categoryId: 'electricity', name: 'كهرباء عدن', color: '#3B82F6', icon: '', isActive: true, inputLabel: 'رقم العداد', inputType: 'text' },
  { id: 'water-sanaa', categoryId: 'electricity', name: 'مياه صنعاء', color: '#06B6D4', icon: '', isActive: true, inputLabel: 'رقم الاشتراك', inputType: 'text' },
  { id: 'water-aden', categoryId: 'electricity', name: 'مياه عدن', color: '#0EA5E9', icon: '', isActive: true, inputLabel: 'رقم الاشتراك', inputType: 'text' },

  // خدمات حكومية
  { id: 'civil-registry', categoryId: 'government', name: 'السجل المدني', color: '#6B7280', icon: '', isActive: true, inputLabel: 'رقم الهوية', inputType: 'text' },
  { id: 'passport', categoryId: 'government', name: 'جواز السفر', color: '#1E40AF', icon: '', isActive: true, inputLabel: 'رقم الجواز', inputType: 'text' },
  { id: 'traffic', categoryId: 'government', name: 'المرور', color: '#DC2626', icon: '', isActive: true, inputLabel: 'رقم اللوحة', inputType: 'text' },
  { id: 'municipal', categoryId: 'government', name: 'البلدية', color: '#059669', icon: '', isActive: true, inputLabel: 'رقم الرخصة', inputType: 'text' },

  // الكريبتو
  { id: 'bitcoin', categoryId: 'crypto', name: 'بيتكوين BTC', color: '#F7931A', icon: '', isActive: true, inputLabel: 'محفظة البيتكوين', inputType: 'text' },
  { id: 'ethereum', categoryId: 'crypto', name: 'إيثريوم ETH', color: '#627EEA', icon: '', isActive: true, inputLabel: 'محفظة الإيثريوم', inputType: 'text' },
  { id: 'usdt', categoryId: 'crypto', name: 'تيثر USDT', color: '#26A17B', icon: '', isActive: true, inputLabel: 'محفظة USDT', inputType: 'text' },
  { id: 'bnb', categoryId: 'crypto', name: 'بينانس BNB', color: '#F3BA2F', icon: '', isActive: true, inputLabel: 'محفظة بينانس', inputType: 'text' },
  { id: 'solana', categoryId: 'crypto', name: 'سولانا SOL', color: '#9945FF', icon: '', isActive: true, inputLabel: 'محفظة سولانا', inputType: 'text' },
  { id: 'tron', categoryId: 'crypto', name: 'ترون TRX', color: '#FF0013', icon: '', isActive: true, inputLabel: 'محفظة ترون', inputType: 'text' },

  // استثمار الكريبتو
  { id: 'usdt-daily', categoryId: 'investment', name: 'USDT يومي', color: '#26A17B', icon: '', isActive: true, inputLabel: 'مبلغ الاستثمار', inputType: 'text' },
  { id: 'usdt-weekly', categoryId: 'investment', name: 'USDT أسبوعي', color: '#26A17B', icon: '', isActive: true, inputLabel: 'مبلغ الاستثمار', inputType: 'text' },
  { id: 'usdt-monthly', categoryId: 'investment', name: 'USDT شهري', color: '#26A17B', icon: '', isActive: true, inputLabel: 'مبلغ الاستثمار', inputType: 'text' },
  { id: 'usdt-quarterly', categoryId: 'investment', name: 'USDT ربع سنوي', color: '#26A17B', icon: '', isActive: true, inputLabel: 'مبلغ الاستثمار', inputType: 'text' },

  // التسوق
  { id: 'aliexpress', categoryId: 'shopping', name: 'علي إكسبرس', color: '#E60000', icon: '', isActive: true, inputLabel: 'رابط المنتج', inputType: 'text' },
  { id: 'shein', categoryId: 'shopping', name: 'شي إن', color: '#1a1a1a', icon: '', isActive: true, inputLabel: 'رابط المنتج', inputType: 'text' },
  { id: 'noon', categoryId: 'shopping', name: 'نون', color: '#F59E0B', icon: '', isActive: true, inputLabel: 'رابط المنتج', inputType: 'text' },
  { id: 'amazon-sa', categoryId: 'shopping', name: 'أمازون السعودية', color: '#FF9900', icon: '', isActive: true, inputLabel: 'رابط المنتج', inputType: 'text' },

  // التعليم
  { id: 'coursera', categoryId: 'education', name: 'كورسيرا', color: '#0056D2', icon: '', isActive: true, inputLabel: 'رابط الدورة', inputType: 'text' },
  { id: 'udemy', categoryId: 'education', name: 'يوديمي', color: '#A435F0', icon: '', isActive: true, inputLabel: 'رابط الدورة', inputType: 'text' },
  { id: 'edraak', categoryId: 'education', name: 'إدراك', color: '#1B998B', icon: '', isActive: true, inputLabel: 'رابط الدورة', inputType: 'text' },
  { id: 'rawaq', categoryId: 'education', name: 'رواق', color: '#2563EB', icon: '', isActive: true, inputLabel: 'رابط الدورة', inputType: 'text' },

  // الصحة
  { id: 'medical-appointment', categoryId: 'health', name: 'حجز موعد طبي', color: '#EF4444', icon: '', isActive: true, inputLabel: 'رقم الملف الطبي', inputType: 'text' },
  { id: 'nahdi-pharmacy', categoryId: 'health', name: 'صيدلية النهدي', color: '#059669', icon: '', isActive: true, inputLabel: 'رقم الوصفة', inputType: 'text' },
  { id: 'ambulance-svc', categoryId: 'health', name: 'خدمة إسعاف', color: '#DC2626', icon: '', isActive: true, inputLabel: 'الموقع', inputType: 'text' },

  // السفر والسياحة
  { id: 'flight-booking', categoryId: 'travel', name: 'حجز طيران', color: '#3B82F6', icon: '', isActive: true, inputLabel: 'محطة القيام', inputType: 'text' },
  { id: 'hotel-booking', categoryId: 'travel', name: 'حجز فنادق', color: '#8B5CF6', icon: '', isActive: true, inputLabel: 'المدينة', inputType: 'text' },
  { id: 'travel-visa', categoryId: 'travel', name: 'فيزا سفر', color: '#F59E0B', icon: '', isActive: true, inputLabel: 'الدولة', inputType: 'text' },

  // الطعام والتوصيل
  { id: 'talabat', categoryId: 'food', name: 'طلبات', color: '#FF6B00', icon: '', isActive: true, inputLabel: 'رقم الطلب', inputType: 'text' },
  { id: 'jahez', categoryId: 'food', name: 'جاهز', color: '#EF4444', icon: '', isActive: true, inputLabel: 'رقم الطلب', inputType: 'text' },
  { id: 'marsol', categoryId: 'food', name: 'مرسول', color: '#3B82F6', icon: '', isActive: true, inputLabel: 'رقم الطلب', inputType: 'text' },

  // خدمات API (واجهات برمجة تطبيق تجريبية)
  { id: 'api-codashop', categoryId: 'api-services', name: 'Codashop API', color: '#FF6B35', icon: '', isActive: true, inputLabel: 'معرف المنتج', inputType: 'text' },
  { id: 'api-seagm', categoryId: 'api-services', name: 'SEAGM API', color: '#0066CC', icon: '', isActive: true, inputLabel: 'معرف المنتج', inputType: 'text' },
  { id: 'api-jollymax', categoryId: 'api-services', name: 'Jollymax API', color: '#FF0066', icon: '', isActive: true, inputLabel: 'معرف المنتج', inputType: 'text' },
  { id: 'api-ding', categoryId: 'api-services', name: 'Ding API', color: '#00B4D8', icon: '', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone' },
  { id: 'api-reloadly', categoryId: 'api-services', name: 'Reloadly API', color: '#7C3AED', icon: '', isActive: true, inputLabel: 'رقم الهاتف', inputType: 'phone' },
  { id: 'api-payermax', categoryId: 'api-services', name: 'PayerMax API', color: '#1DB954', icon: '', isActive: true, inputLabel: 'معرف الطلب', inputType: 'text' },
];

// ═══════════════════════════════════════════════════════════
//  PACKAGES (Product Packages) - 300+ products
// ═══════════════════════════════════════════════════════════
const packages = [
  // ═══ TELECOM - Yemen Mobile (يمن موبايل) ═══
  { providerId: 'yemen-mobile', providerName: 'يمن موبايل', name: 'شحنة 100 ر.ي', price: 100, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yemen-mobile', providerName: 'يمن موبايل', name: 'شحنة 200 ر.ي', price: 200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yemen-mobile', providerName: 'يمن موبايل', name: 'شحنة 500 ر.ي', price: 500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yemen-mobile', providerName: 'يمن موبايل', name: 'شحنة 1000 ر.ي', price: 1000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yemen-mobile', providerName: 'يمن موبايل', name: 'شحنة 2000 ر.ي', price: 2000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yemen-mobile', providerName: 'يمن موبايل', name: 'شحنة 5000 ر.ي', price: 5000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yemen-mobile', providerName: 'يمن موبايل', name: 'باقة فورجي 1 جيجا', price: 200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yemen-mobile', providerName: 'يمن موبايل', name: 'باقة فورجي 4 جيجا', price: 500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yemen-mobile', providerName: 'يمن موبايل', name: 'باقة فورجي 10 جيجا', price: 1000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yemen-mobile', providerName: 'يمن موبايل', name: 'باقة فورجي 20 جيجا', price: 2000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yemen-mobile', providerName: 'يمن موبايل', name: 'باقة فورجي غير محدودة', price: 3000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ TELECOM - Yo (يو) ═══
  { providerId: 'yo', providerName: 'يو', name: 'شحنة 100 ر.ي', price: 100, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yo', providerName: 'يو', name: 'شحنة 200 ر.ي', price: 200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yo', providerName: 'يو', name: 'شحنة 500 ر.ي', price: 500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yo', providerName: 'يو', name: 'شحنة 1000 ر.ي', price: 1000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yo', providerName: 'يو', name: 'شحنة 2000 ر.ي', price: 2000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yo', providerName: 'يو', name: 'باقة إنترنت 2 جيجا', price: 300, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yo', providerName: 'يو', name: 'باقة إنترنت 5 جيجا', price: 600, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yo', providerName: 'يو', name: 'باقة إنترنت 10 جيجا', price: 1100, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ TELECOM - Sabafon (سبأفون) ═══
  { providerId: 'sabafon', providerName: 'سبأفون', name: 'شحنة 100 ر.ي', price: 100, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'sabafon', providerName: 'سبأفون', name: 'شحنة 200 ر.ي', price: 200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'sabafon', providerName: 'سبأفون', name: 'شحنة 500 ر.ي', price: 500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'sabafon', providerName: 'سبأفون', name: 'شحنة 1000 ر.ي', price: 1000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'sabafon', providerName: 'سبأفون', name: 'باقة إنترنت 3 جيجا', price: 400, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'sabafon', providerName: 'سبأفون', name: 'باقة إنترنت 7 جيجا', price: 800, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'sabafon', providerName: 'سبأفون', name: 'باقة إنترنت 15 جيجا', price: 1500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ TELECOM - WA (واي) ═══
  { providerId: 'y', providerName: 'واي', name: 'شحنة 100 ر.ي', price: 100, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'y', providerName: 'واي', name: 'شحنة 200 ر.ي', price: 200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'y', providerName: 'واي', name: 'شحنة 500 ر.ي', price: 500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'y', providerName: 'واي', name: 'شحنة 1000 ر.ي', price: 1000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'y', providerName: 'واي', name: 'باقة إنترنت 2 جيجا', price: 250, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'y', providerName: 'واي', name: 'باقة إنترنت 5 جيجا', price: 550, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ INTERNET ═══
  { providerId: 'yemen-net', providerName: 'يمن نت', name: 'باقة 1 جيجا - يوم', price: 150, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yemen-net', providerName: 'يمن نت', name: 'باقة 5 جيجا - أسبوع', price: 500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yemen-net', providerName: 'يمن نت', name: 'باقة 10 جيجا - شهر', price: 1000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yemen-net', providerName: 'يمن نت', name: 'باقة 20 جيجا - شهر', price: 1800, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'yemen-net', providerName: 'يمن نت', name: 'باقة غير محدودة - شهر', price: 3500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'y-net-internet', providerName: 'واي نت', name: 'باقة 3 جيجا - أسبوع', price: 400, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'y-net-internet', providerName: 'واي نت', name: 'باقة 8 جيجا - شهر', price: 900, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'y-net-internet', providerName: 'واي نت', name: 'باقة 15 جيجا - شهر', price: 1500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'sabafon-internet', providerName: 'سبأفون نت', name: 'باقة 3 جيجا - أسبوع', price: 400, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'sabafon-internet', providerName: 'سبأفون نت', name: 'باقة 10 جيجا - شهر', price: 1000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GAMING - PUBG Mobile ═══
  { providerId: 'pubg', providerName: 'ببجي موبايل', name: '60 شدة ببجي', price: 1200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'pubg', providerName: 'ببجي موبايل', name: '325 شدة ببجي', price: 5500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'pubg', providerName: 'ببجي موبايل', name: '660 شدة ببجي', price: 10500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'pubg', providerName: 'ببجي موبايل', name: '1800 شدة ببجي', price: 28000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'pubg', providerName: 'ببجي موبايل', name: '3850 شدة ببجي', price: 58000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'pubg', providerName: 'ببجي موبايل', name: '8100 شدة ببجي', price: 120000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'pubg', providerName: 'ببجي موبايل', name: 'عضوية رويال باس شهري', price: 3000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'pubg', providerName: 'ببجي موبايل', name: 'عضوية رويال باس أسبوعي', price: 1000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GAMING - Free Fire ═══
  { providerId: 'freefire', providerName: 'فري فاير', name: '100 جوهرة فري فاير', price: 800, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'freefire', providerName: 'فري فاير', name: '310 جوهرة فري فاير', price: 2200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'freefire', providerName: 'فري فاير', name: '520 جوهرة فري فاير', price: 3500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'freefire', providerName: 'فري فاير', name: '1060 جوهرة فري فاير', price: 6500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'freefire', providerName: 'فري فاير', name: '2180 جوهرة فري فاير', price: 13000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'freefire', providerName: 'فري فاير', name: '5600 جوهرة فري فاير', price: 32000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'freefire', providerName: 'فري فاير', name: 'عضوية ماموث أسبوعية', price: 1200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'freefire', providerName: 'فري فاير', name: 'عضوية ماموث شهرية', price: 4000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GAMING - Call of Duty Mobile ═══
  { providerId: 'call-of-duty', providerName: 'كال اوف ديوتي', name: '80 CP كود', price: 1500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'call-of-duty', providerName: 'كال اوف ديوتي', name: '400 CP كود', price: 5500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'call-of-duty', providerName: 'كال اوف ديوتي', name: '800 CP كود', price: 10500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'call-of-duty', providerName: 'كال اوف ديوتي', name: '2000 CP كود', price: 25000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'call-of-duty', providerName: 'كال اوف ديوتي', name: '4000 CP كود', price: 48000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'call-of-duty', providerName: 'كال اوف ديوتي', name: 'بطاقة قتال الموسم', price: 3500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GAMING - Fortnite ═══
  { providerId: 'fortnite', providerName: 'فورتنايت', name: '1000 V-Bucks', price: 2000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'fortnite', providerName: 'فورتنايت', name: '2800 V-Bucks', price: 5200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'fortnite', providerName: 'فورتنايت', name: '5000 V-Bucks', price: 9000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'fortnite', providerName: 'فورتنايت', name: '13500 V-Bucks', price: 22000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'fortnite', providerName: 'فورتنايت', name: 'بطاقة قتال الموسم', price: 2500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GAMING - Valorant ═══
  { providerId: 'valorant', providerName: 'فالورانت', name: '125 VP فالورانت', price: 1800, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'valorant', providerName: 'فالورانت', name: '420 VP فالورانت', price: 5500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'valorant', providerName: 'فالورانت', name: '700 VP فالورانت', price: 9000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'valorant', providerName: 'فالورانت', name: '1375 VP فالورانت', price: 17000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'valorant', providerName: 'فالورانت', name: '2400 VP فالورانت', price: 29000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'valorant', providerName: 'فالورانت', name: '4000 VP فالورانت', price: 48000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GAMING - Apex Legends ═══
  { providerId: 'apex-legends', providerName: 'ابيكس ليجندز', name: '1000 عملة ابكس', price: 1500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'apex-legends', providerName: 'ابيكس ليجندز', name: '2150 عملة ابكس', price: 3000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'apex-legends', providerName: 'ابيكس ليجندز', name: '4350 عملة ابكس', price: 5800, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'apex-legends', providerName: 'ابيكس ليجندز', name: '6700 عملة ابكس', price: 8800, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GAMING - Clash Royale ═══
  { providerId: 'clash-royale', providerName: 'كلاش رويال', name: '80 جوهرة', price: 1000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'clash-royale', providerName: 'كلاش رويال', name: '500 جوهرة', price: 5500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'clash-royale', providerName: 'كلاش رويال', name: '1200 جوهرة', price: 12000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'clash-royale', providerName: 'كلاش رويال', name: '2500 جوهرة', price: 23000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'clash-royale', providerName: 'كلاش رويال', name: 'ممر البطولة', price: 3000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GAMING - Clash of Clans ═══
  { providerId: 'clash-of-clans', providerName: 'كلاش اوف كلانس', name: '80 جوهرة', price: 1000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'clash-of-clans', providerName: 'كلاش اوف كلانس', name: '500 جوهرة', price: 5500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'clash-of-clans', providerName: 'كلاش اوف كلانس', name: '1200 جوهرة', price: 12000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'clash-of-clans', providerName: 'كلاش اوف كلانس', name: '2500 جوهرة', price: 23000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'clash-of-clans', providerName: 'كلاش اوف كلانس', name: 'ممر الذهب', price: 3000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GAMING - League of Legends ═══
  { providerId: 'league-legends', providerName: 'ليق اوف ليجندز', name: '650 RIOT نقاط', price: 2000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'league-legends', providerName: 'ليق اوف ليجندز', name: '1380 RIOT نقاط', price: 4000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'league-legends', providerName: 'ليق اوف ليجندز', name: '2800 RIOT نقاط', price: 7500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'league-legends', providerName: 'ليق اوف ليجندز', name: '5000 RIOT نقاط', price: 13000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GAMING - Roblox ═══
  { providerId: 'roblox', providerName: 'روبلوكس', name: '400 Robux', price: 900, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'roblox', providerName: 'روبلوكس', name: '800 Robux', price: 1700, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'roblox', providerName: 'روبلوكس', name: '1700 Robux', price: 3500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'roblox', providerName: 'روبلوكس', name: '4500 Robux', price: 9000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'roblox', providerName: 'روبلوكس', name: '10000 Robux', price: 19000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'roblox', providerName: 'روبلوكس', name: 'عضوية بريميوم 450', price: 1200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GAMING - Minecraft ═══
  { providerId: 'minecraft', providerName: 'ماينكرافت', name: '660 جوهرة', price: 2500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'minecraft', providerName: 'ماينكرافت', name: '1720 جوهرة', price: 6000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'minecraft', providerName: 'ماينكرافت', name: '3240 جوهرة', price: 11000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'minecraft', providerName: 'ماينكرافت', name: 'رخصة Java Edition', price: 35000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GAMING - Genshin Impact ═══
  { providerId: 'genshin-impact', providerName: 'جينشين امباكت', name: '60 كريستال', price: 1500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'genshin-impact', providerName: 'جينشين امباكت', name: '330 كريستال', price: 7500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'genshin-impact', providerName: 'جينشين امباكت', name: '1090 كريستال', price: 23000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'genshin-impact', providerName: 'جينشين امباكت', name: '2240 كريستال', price: 45000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'genshin-impact', providerName: 'جينشين امباكت', name: '3880 كريستال', price: 78000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'genshin-impact', providerName: 'جينشين امباكت', name: 'بطاقة القمر المبارك', price: 4000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GAMING - Honkai Star Rail ═══
  { providerId: 'honkai-star', providerName: 'هنكاي ستار ريل', name: '60 كريستال', price: 1500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'honkai-star', providerName: 'هنكاي ستار ريل', name: '330 كريستال', price: 7500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'honkai-star', providerName: 'هنكاي ستار ريل', name: '1090 كريستال', price: 23000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'honkai-star', providerName: 'هنكاي ستار ريل', name: '2240 كريستال', price: 45000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'honkai-star', providerName: 'هنكاي ستار ريل', name: 'تذكرة السفر السري', price: 4000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GAMING - Steam ═══
  { providerId: 'steam', providerName: 'ستيم', name: 'بطاقة ستيم 5$', price: 5000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'steam', providerName: 'ستيم', name: 'بطاقة ستيم 10$', price: 10000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'steam', providerName: 'ستيم', name: 'بطاقة ستيم 25$', price: 24000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'steam', providerName: 'ستيم', name: 'بطاقة ستيم 50$', price: 47000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'steam', providerName: 'ستيم', name: 'بطاقة ستيم 100$', price: 92000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GAMING - EA FC 25 ═══
  { providerId: 'ea-fc', providerName: 'EA FC 25', name: '500 FC Points', price: 3000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'ea-fc', providerName: 'EA FC 25', name: '1050 FC Points', price: 6000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'ea-fc', providerName: 'EA FC 25', name: '2200 FC Points', price: 12000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'ea-fc', providerName: 'EA FC 25', name: '4600 FC Points', price: 24000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'ea-fc', providerName: 'EA FC 25', name: '12000 FC Points', price: 58000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ STREAMING - Netflix ═══
  { providerId: 'netflix', providerName: 'نتفلكس', name: 'اشتراك شهري - أساسي', price: 3500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'netflix', providerName: 'نتفلكس', name: 'اشتراك شهري - قياسي', price: 6000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'netflix', providerName: 'نتفلكس', name: 'اشتراك شهري - مميز', price: 9000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'netflix', providerName: 'نتفلكس', name: 'اشتراك سنوي - أساسي', price: 38000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ STREAMING - Spotify ═══
  { providerId: 'spotify', providerName: 'سبوتيفاي', name: 'اشتراك فردي شهر', price: 2500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'spotify', providerName: 'سبوتيفاي', name: 'اشتراك عائلي شهر', price: 4000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'spotify', providerName: 'سبوتيفاي', name: 'اشتراك سنوي', price: 25000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ STREAMING - YouTube Premium ═══
  { providerId: 'youtube-premium', providerName: 'يوتيوب بريميوم', name: 'اشتراك فردي شهر', price: 2000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'youtube-premium', providerName: 'يوتيوب بريميوم', name: 'اشتراك عائلي شهر', price: 3500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'youtube-premium', providerName: 'يوتيوب بريميوم', name: 'اشتراك سنوي', price: 20000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ STREAMING - Shahid VIP ═══
  { providerId: 'shahid', providerName: 'شاهد VIP', name: 'اشتراك شهري', price: 2000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'shahid', providerName: 'شاهد VIP', name: 'اشتراك سنوي', price: 18000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ STREAMING - Disney+ ═══
  { providerId: 'disney-plus', providerName: 'ديزني بلس', name: 'اشتراك شهري', price: 3000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'disney-plus', providerName: 'ديزني بلس', name: 'اشتراك سنوي', price: 28000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ STREAMING - Crunchyroll ═══
  { providerId: 'crunchyroll', providerName: 'كرانشي رول', name: 'اشتراك شهري', price: 2500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'crunchyroll', providerName: 'كرانشي رول', name: 'اشتراك سنوي', price: 22000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ CARDS ═══
  { providerId: 'google-play', providerName: 'بطاقة جوجل بلاي', name: 'بطاقة 5$', price: 5000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'google-play', providerName: 'بطاقة جوجل بلاي', name: 'بطاقة 10$', price: 10000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'google-play', providerName: 'بطاقة جوجل بلاي', name: 'بطاقة 25$', price: 24000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'google-play', providerName: 'بطاقة جوجل بلاي', name: 'بطاقة 50$', price: 47000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'apple-itunes', providerName: 'بطاقة آيتونز', name: 'بطاقة 5$', price: 5000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'apple-itunes', providerName: 'بطاقة آيتونز', name: 'بطاقة 10$', price: 10000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'apple-itunes', providerName: 'بطاقة آيتونز', name: 'بطاقة 25$', price: 24000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'apple-itunes', providerName: 'بطاقة آيتونز', name: 'بطاقة 50$', price: 47000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'amazon-gift', providerName: 'بطاقة امازون', name: 'بطاقة 10$', price: 10000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'amazon-gift', providerName: 'بطاقة امازون', name: 'بطاقة 25$', price: 24000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'amazon-gift', providerName: 'بطاقة امازون', name: 'بطاقة 50$', price: 47000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'amazon-gift', providerName: 'بطاقة امازون', name: 'بطاقة 100$', price: 92000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'psn-card', providerName: 'بطاقة بلايستيشن', name: 'بطاقة 10$', price: 10000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'psn-card', providerName: 'بطاقة بلايستيشن', name: 'بطاقة 25$', price: 24000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'psn-card', providerName: 'بطاقة بلايستيشن', name: 'بطاقة 50$', price: 47000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'xbox-card', providerName: 'بطاقة اكسبوكس', name: 'بطاقة 10$', price: 10000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'xbox-card', providerName: 'بطاقة اكسبوكس', name: 'بطاقة 25$', price: 24000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'xbox-card', providerName: 'بطاقة اكسبوكس', name: 'بطاقة 50$', price: 47000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'nintendo-card', providerName: 'بطاقة نينتندو', name: 'بطاقة 10$', price: 10000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'nintendo-card', providerName: 'بطاقة نينتندو', name: 'بطاقة 25$', price: 24000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'nintendo-card', providerName: 'بطاقة نينتندو', name: 'بطاقة 50$', price: 47000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'visa-virtual', providerName: 'بطاقة فيزا افتراضية', name: 'بطاقة 5$', price: 5500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'visa-virtual', providerName: 'بطاقة فيزا افتراضية', name: 'بطاقة 10$', price: 10500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'visa-virtual', providerName: 'بطاقة فيزا افتراضية', name: 'بطاقة 25$', price: 25000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'visa-virtual', providerName: 'بطاقة فيزا افتراضية', name: 'بطاقة 50$', price: 48000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'mastercard-virtual', providerName: 'بطاقة ماستركارد افتراضية', name: 'بطاقة 5$', price: 5500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'mastercard-virtual', providerName: 'بطاقة ماستركارد افتراضية', name: 'بطاقة 10$', price: 10500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'mastercard-virtual', providerName: 'بطاقة ماستركارد افتراضية', name: 'بطاقة 25$', price: 25000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'mastercard-virtual', providerName: 'بطاقة ماستركارد افتراضية', name: 'بطاقة 50$', price: 48000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'paypal', providerName: 'شحن بايبال', name: 'شحن 5$', price: 5500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'paypal', providerName: 'شحن بايبال', name: 'شحن 10$', price: 10500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'paypal', providerName: 'شحن بايبال', name: 'شحن 25$', price: 25000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'paypal', providerName: 'شحن بايبال', name: 'شحن 50$', price: 48000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'paypal', providerName: 'شحن بايبال', name: 'شحن 100$', price: 93000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ WALLET SERVICES ═══
  { providerId: 'wallet-transfer-svc', providerName: 'تحويل رصيد', name: 'تحويل 1,000 ر.ي', price: 1000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 5 },
  { providerId: 'wallet-transfer-svc', providerName: 'تحويل رصيد', name: 'تحويل 5,000 ر.ي', price: 5000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 15 },
  { providerId: 'wallet-transfer-svc', providerName: 'تحويل رصيد', name: 'تحويل 10,000 ر.ي', price: 10000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 25 },
  { providerId: 'wallet-transfer-svc', providerName: 'تحويل رصيد', name: 'تحويل 50,000 ر.ي', price: 50000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 100 },
  { providerId: 'wallet-transfer-svc', providerName: 'تحويل رصيد', name: 'تحويل 100,000 ر.ي', price: 100000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 200 },
  { providerId: 'wallet-withdraw', providerName: 'سحب نقدي', name: 'سحب 1,000 ر.ي', price: 1000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 10 },
  { providerId: 'wallet-withdraw', providerName: 'سحب نقدي', name: 'سحب 5,000 ر.ي', price: 5000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 30 },
  { providerId: 'wallet-withdraw', providerName: 'سحب نقدي', name: 'سحب 10,000 ر.ي', price: 10000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 50 },
  { providerId: 'wallet-withdraw', providerName: 'سحب نقدي', name: 'سحب 50,000 ر.ي', price: 50000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 200 },
  { providerId: 'wallet-deposit-svc', providerName: 'إيداع رصيد', name: 'إيداع 1,000 ر.ي', price: 1000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-deposit-svc', providerName: 'إيداع رصيد', name: 'إيداع 5,000 ر.ي', price: 5000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-deposit-svc', providerName: 'إيداع رصيد', name: 'إيداع 10,000 ر.ي', price: 10000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-deposit-svc', providerName: 'إيداع رصيد', name: 'إيداع 50,000 ر.ي', price: 50000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-bill-pay', providerName: 'دفع فواتير', name: 'دفع فاتورة كهرباء', price: 0, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 50 },
  { providerId: 'wallet-bill-pay', providerName: 'دفع فواتير', name: 'دفع فاتورة مياه', price: 0, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 50 },
  { providerId: 'wallet-bill-pay', providerName: 'دفع فواتير', name: 'دفع فاتورة إنترنت', price: 0, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 30 },
  { providerId: 'wallet-statement-svc', providerName: 'كشف حساب', name: 'كشف حساب شهر', price: 500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-statement-svc', providerName: 'كشف حساب', name: 'كشف حساب 3 أشهر', price: 1200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-statement-svc', providerName: 'كشف حساب', name: 'كشف حساب سنوي', price: 4000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-card-issue', providerName: 'إصدار بطاقة', name: 'بطاقة افتراضية', price: 2500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-card-issue', providerName: 'إصدار بطاقة', name: 'بطاقة فيزيائية', price: 5000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-card-issue', providerName: 'إصدار بطاقة', name: 'بطاقة بريميوم', price: 10000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-intl-transfer', providerName: 'تحويل دولي', name: 'تحويل 100$', price: 10000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 500 },
  { providerId: 'wallet-intl-transfer', providerName: 'تحويل دولي', name: 'تحويل 500$', price: 50000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 2000 },
  { providerId: 'wallet-intl-transfer', providerName: 'تحويل دولي', name: 'تحويل 1000$', price: 100000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 3500 },
  { providerId: 'wallet-exchange-svc', providerName: 'صرف عملات', name: 'صرف دولار إلى ريال', price: 0, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 100 },
  { providerId: 'wallet-exchange-svc', providerName: 'صرف عملات', name: 'صرف ريال إلى دولار', price: 0, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 100 },
  { providerId: 'wallet-qr-pay', providerName: 'دفع بالباركود', name: 'دفع عبر QR', price: 0, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 5 },
  { providerId: 'wallet-savings-svc', providerName: 'توفير ومدخرات', name: 'توفير شهر - 5% عائد', price: 10000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-savings-svc', providerName: 'توفير ومدخرات', name: 'توفير 3 أشهر - 8% عائد', price: 50000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-savings-svc', providerName: 'توفير ومدخرات', name: 'توفير سنة - 12% عائد', price: 100000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ ELECTRICITY & WATER ═══
  { providerId: 'elec-sanaa', providerName: 'كهرباء صنعاء', name: 'فاتورة كهرباء صنعاء', price: 0, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'elec-aden', providerName: 'كهرباء عدن', name: 'فاتورة كهرباء عدن', price: 0, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'water-sanaa', providerName: 'مياه صنعاء', name: 'فاتورة مياه صنعاء', price: 0, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'water-aden', providerName: 'مياه عدن', name: 'فاتورة مياه عدن', price: 0, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ GOVERNMENT ═══
  { providerId: 'civil-registry', providerName: 'السجل المدني', name: 'خدمة السجل المدني', price: 0, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'passport', providerName: 'جواز السفر', name: 'خدمة جواز السفر', price: 0, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'traffic', providerName: 'المرور', name: 'خدمة المرور', price: 0, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'municipal', providerName: 'البلدية', name: 'خدمة البلدية', price: 0, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ CRYPTO ═══
  { providerId: 'bitcoin', providerName: 'بيتكوين BTC', name: 'شراء 0.001 BTC', price: 150000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'bitcoin', providerName: 'بيتكوين BTC', name: 'شراء 0.01 BTC', price: 1500000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'ethereum', providerName: 'إيثريوم ETH', name: 'شراء 0.01 ETH', price: 40000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'ethereum', providerName: 'إيثريوم ETH', name: 'شراء 0.1 ETH', price: 380000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'usdt', providerName: 'تيثر USDT', name: 'شراء 10 USDT', price: 15500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'usdt', providerName: 'تيثر USDT', name: 'شراء 50 USDT', price: 77500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'bnb', providerName: 'بينانس BNB', name: 'شراء 0.1 BNB', price: 4000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'solana', providerName: 'سولانا SOL', name: 'شراء 1 SOL', price: 2000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'tron', providerName: 'ترون TRX', name: 'شراء 100 TRX', price: 1500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ INVESTMENT ═══
  { providerId: 'usdt-daily', providerName: 'USDT يومي', name: 'استثمار 10 USDT - يومي 0.5%', price: 15500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'usdt-daily', providerName: 'USDT يومي', name: 'استثمار 50 USDT - يومي 0.5%', price: 77500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'usdt-weekly', providerName: 'USDT أسبوعي', name: 'استثمار 50 USDT - أسبوعي 2%', price: 77500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'usdt-weekly', providerName: 'USDT أسبوعي', name: 'استثمار 100 USDT - أسبوعي 2%', price: 155000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'usdt-monthly', providerName: 'USDT شهري', name: 'استثمار 100 USDT - شهري 5%', price: 155000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'usdt-monthly', providerName: 'USDT شهري', name: 'استثمار 500 USDT - شهري 5%', price: 775000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'usdt-quarterly', providerName: 'USDT ربع سنوي', name: 'استثمار 500 USDT - ربعي 12%', price: 775000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'usdt-quarterly', providerName: 'USDT ربع سنوي', name: 'استثمار 1000 USDT - ربعي 12%', price: 1550000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ SHOPPING ═══
  { providerId: 'aliexpress', providerName: 'علي إكسبرس', name: 'شراء منتج 10$', price: 10500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 500 },
  { providerId: 'aliexpress', providerName: 'علي إكسبرس', name: 'شراء منتج 25$', price: 24000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 1200 },
  { providerId: 'aliexpress', providerName: 'علي إكسبرس', name: 'شراء منتج 50$', price: 47000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 2400 },
  { providerId: 'aliexpress', providerName: 'علي إكسبرس', name: 'شراء منتج 100$', price: 92000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 4600 },
  { providerId: 'shein', providerName: 'شي إن', name: 'شراء منتج 10$', price: 10500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 500 },
  { providerId: 'shein', providerName: 'شي إن', name: 'شراء منتج 25$', price: 24000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 1200 },
  { providerId: 'shein', providerName: 'شي إن', name: 'شراء منتج 50$', price: 47000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 2400 },
  { providerId: 'noon', providerName: 'نون', name: 'شراء منتج 10$', price: 10500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 500 },
  { providerId: 'noon', providerName: 'نون', name: 'شراء منتج 25$', price: 24000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 1200 },
  { providerId: 'noon', providerName: 'نون', name: 'شراء منتج 50$', price: 47000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 2400 },
  { providerId: 'amazon-sa', providerName: 'أمازون السعودية', name: 'شراء منتج 10$', price: 10500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 500 },
  { providerId: 'amazon-sa', providerName: 'أمازون السعودية', name: 'شراء منتج 25$', price: 24000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 1200 },
  { providerId: 'amazon-sa', providerName: 'أمازون السعودية', name: 'شراء منتج 50$', price: 47000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 2400 },

  // ═══ EDUCATION ═══
  { providerId: 'coursera', providerName: 'كورسيرا', name: 'دورة شهادة مهنية', price: 8000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'coursera', providerName: 'كورسيرا', name: 'دورة تخصصية', price: 15000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'coursera', providerName: 'كورسيرا', name: 'اشتراك Coursera Plus سنوي', price: 45000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'udemy', providerName: 'يوديمي', name: 'دورة يوديمي - أساسية', price: 3000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'udemy', providerName: 'يوديمي', name: 'دورة يوديمي - متقدمة', price: 8000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'udemy', providerName: 'يوديمي', name: 'اشتراك يوديمي Pro شهري', price: 12000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'edraak', providerName: 'إدراك', name: 'دورة إدراك مجانية', price: 500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'edraak', providerName: 'إدراك', name: 'شهادة إدراك احترافية', price: 5000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'rawaq', providerName: 'رواق', name: 'دورة رواق تعليمية', price: 2000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'rawaq', providerName: 'رواق', name: 'شهادة رواق معتمدة', price: 7000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ HEALTH ═══
  { providerId: 'medical-appointment', providerName: 'حجز موعد طبي', name: 'كشف طبي عام', price: 5000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'medical-appointment', providerName: 'حجز موعد طبي', name: 'كشف تخصص', price: 8000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'medical-appointment', providerName: 'حجز موعد طبي', name: 'استشارة عن بعد', price: 3000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'nahdi-pharmacy', providerName: 'صيدلية النهدي', name: 'طلب أدوية - توصيل', price: 1000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'nahdi-pharmacy', providerName: 'صيدلية النهدي', name: 'طلب مستلزمات طبية', price: 1500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'ambulance-svc', providerName: 'خدمة إسعاف', name: 'إسعاف عادي', price: 5000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'ambulance-svc', providerName: 'خدمة إسعاف', name: 'إسعاف طوارئ', price: 10000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ TRAVEL ═══
  { providerId: 'flight-booking', providerName: 'حجز طيران', name: 'تذكرة داخلية - اقتصادي', price: 35000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'flight-booking', providerName: 'حجز طيران', name: 'تذكرة داخلية - درجة أعلى', price: 60000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'flight-booking', providerName: 'حجز طيران', name: 'تذكرة دولية - اقتصادي', price: 150000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'flight-booking', providerName: 'حجز طيران', name: 'تذكرة دولية - رجال أعمال', price: 350000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'hotel-booking', providerName: 'حجز فنادق', name: 'حجز فندق 3 نجوم - ليلة', price: 15000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'hotel-booking', providerName: 'حجز فنادق', name: 'حجز فندق 4 نجوم - ليلة', price: 30000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'hotel-booking', providerName: 'حجز فنادق', name: 'حجز فندق 5 نجوم - ليلة', price: 60000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'travel-visa', providerName: 'فيزا سفر', name: 'فيزا سياحة - دول عربية', price: 25000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'travel-visa', providerName: 'فيزا سفر', name: 'فيزا سياحة - أوروبا شنغن', price: 80000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'travel-visa', providerName: 'فيزا سفر', name: 'فيزا عمل', price: 50000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ FOOD & DELIVERY ═══
  { providerId: 'talabat', providerName: 'طلبات', name: 'طلب طعام - عادي', price: 3000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 200 },
  { providerId: 'talabat', providerName: 'طلبات', name: 'طلب طعام - عائلي', price: 6000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 350 },
  { providerId: 'talabat', providerName: 'طلبات', name: 'طلب بقالة', price: 5000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 300 },
  { providerId: 'jahez', providerName: 'جاهز', name: 'طلب طعام - عادي', price: 3000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 200 },
  { providerId: 'jahez', providerName: 'جاهز', name: 'طلب طعام - عائلي', price: 6000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 350 },
  { providerId: 'marsol', providerName: 'مرسول', name: 'توصيل طرد - ذاتي', price: 2000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 200 },
  { providerId: 'marsol', providerName: 'مرسول', name: 'توصيل طرد - دراجة', price: 1500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 150 },
  { providerId: 'marsol', providerName: 'مرسول', name: 'توصيل طرد - سيارة', price: 3000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false, commission: 300 },

  // ═══ WALLET SERVICES - Core ═══
  { providerId: 'wallet-transfer-svc', providerName: 'تحويل رصيد', name: 'تحويل 1,000 ر.ي', price: 1000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-transfer-svc', providerName: 'تحويل رصيد', name: 'تحويل 5,000 ر.ي', price: 5000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-transfer-svc', providerName: 'تحويل رصيد', name: 'تحويل 10,000 ر.ي', price: 10000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-withdraw', providerName: 'سحب نقدي', name: 'سحب 5,000 ر.ي', price: 5000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-withdraw', providerName: 'سحب نقدي', name: 'سحب 10,000 ر.ي', price: 10000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-withdraw', providerName: 'سحب نقدي', name: 'سحب 50,000 ر.ي', price: 50000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-deposit-svc', providerName: 'إيداع رصيد', name: 'إيداع 1,000 ر.ي', price: 1000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-deposit-svc', providerName: 'إيداع رصيد', name: 'إيداع 5,000 ر.ي', price: 5000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-deposit-svc', providerName: 'إيداع رصيد', name: 'إيداع 10,000 ر.ي', price: 10000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-bill-pay', providerName: 'دفع فواتير', name: 'فاتورة كهرباء صنعاء', price: 500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-bill-pay', providerName: 'دفع فواتير', name: 'فاتورة كهرباء عدن', price: 500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-exchange-svc', providerName: 'صرف عملات', name: 'صرف 10$ إلى ر.ي', price: 15500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-exchange-svc', providerName: 'صرف عملات', name: 'صرف 50$ إلى ر.ي', price: 77500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ WALLET SERVICES - Gaming & Entertainment ═══
  { providerId: 'pubg-wallet', providerName: 'ببجي موبايل', name: '60 شدة', price: 1200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'pubg-wallet', providerName: 'ببجي موبايل', name: '325 شدة', price: 5200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'pubg-wallet', providerName: 'ببجي موبايل', name: '660 شدة', price: 9800, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'pubg-wallet', providerName: 'ببجي موبايل', name: '1800 شدة', price: 25000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'freefire-wallet', providerName: 'فري فاير', name: '100 جوهرة', price: 800, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'freefire-wallet', providerName: 'فري فاير', name: '310 جوهرة', price: 2200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'freefire-wallet', providerName: 'فري فاير', name: '520 جوهرة', price: 3500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'freefire-wallet', providerName: 'فري فاير', name: '1060 جوهرة', price: 6800, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'cod-wallet', providerName: 'كال اوف ديوتي', name: '80 CP', price: 1500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'cod-wallet', providerName: 'كال اوف ديوتي', name: '400 CP', price: 5200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'cod-wallet', providerName: 'كال اوف ديوتي', name: '800 CP', price: 9800, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'netflix-wallet', providerName: 'نتفلكس', name: 'اشتراك شهري - أساسي', price: 3500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'netflix-wallet', providerName: 'نتفلكس', name: 'اشتراك شهري - قياسي', price: 5500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'netflix-wallet', providerName: 'نتفلكس', name: 'اشتراك سنوي', price: 35000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'spotify-wallet', providerName: 'سبوتيفاي', name: 'اشتراك شهري', price: 2500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'spotify-wallet', providerName: 'سبوتيفاي', name: 'اشتراك سنوي', price: 25000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ WALLET SERVICES - Extra ═══
  { providerId: 'wallet-statement-svc', providerName: 'كشف حساب', name: 'كشف حساب مصغر', price: 50, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-statement-svc', providerName: 'كشف حساب', name: 'كشف حساب كامل', price: 500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-card-issue', providerName: 'إصدار بطاقة', name: 'بطاقة افتراضية - فيزا', price: 5000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-card-issue', providerName: 'إصدار بطاقة', name: 'بطاقة افتراضية - ماستركارد', price: 5000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-intl-transfer', providerName: 'تحويل دولي', name: 'تحويل دولي 100$', price: 155000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-intl-transfer', providerName: 'تحويل دولي', name: 'تحويل دولي 500$', price: 775000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-qr-pay', providerName: 'دفع بالباركود', name: 'دفع QR - مشتريات', price: 500, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-savings-svc', providerName: 'توفير ومدخرات', name: 'خطة توفير 10,000 ر.ي', price: 10000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'wallet-savings-svc', providerName: 'توفير ومدخرات', name: 'خطة توفير 50,000 ر.ي', price: 50000, currency: 'YER', executionType: 'manual', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },

  // ═══ API SERVICES ═══
  { providerId: 'api-codashop', providerName: 'Codashop API', name: 'ببجي 60 UC - تجريبي', price: 1200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'api-codashop', providerName: 'Codashop API', name: 'فري فاير 100 جوهرة - تجريبي', price: 800, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'api-codashop', providerName: 'Codashop API', name: 'نتفلكس شهري - تجريبي', price: 3500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'api-seagm', providerName: 'SEAGM API', name: 'ببجي 325 UC - تجريبي', price: 5200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'api-seagm', providerName: 'SEAGM API', name: 'فري فاير 520 جوهرة - تجريبي', price: 3500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'api-jollymax', providerName: 'Jollymax API', name: 'ببجي 660 UC - تجريبي', price: 9800, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'api-jollymax', providerName: 'Jollymax API', name: 'كال اوف ديوتي 400 CP - تجريبي', price: 5200, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'api-ding', providerName: 'Ding API', name: 'شحن يمن موبايل 500 ر.ي - تجريبي', price: 500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'api-ding', providerName: 'Ding API', name: 'شحن سبأفون 1000 ر.ي - تجريبي', price: 1000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'api-reloadly', providerName: 'Reloadly API', name: 'شحن يو 500 ر.ي - تجريبي', price: 500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'api-reloadly', providerName: 'Reloadly API', name: 'شحن واي 1000 ر.ي - تجريبي', price: 1000, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'api-payermax', providerName: 'PayerMax API', name: 'بطاقة جوجل بلاي 10$ - تجريبي', price: 10500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
  { providerId: 'api-payermax', providerName: 'PayerMax API', name: 'بطاقة آيتونز 10$ - تجريبي', price: 10500, currency: 'YER', executionType: 'auto', isActive: true, available: -1, sold: 0, autoDisableAtZero: false },
];

// ═══════════════════════════════════════════════════════════
//  WALLET SERVICES (خصائص المحفظة التجريبية)
// ═══════════════════════════════════════════════════════════
const walletServices = [
  { id: 'balance-inquiry', name: 'استعلام رصيد', description: 'التحقق من رصيد المحفظة', fee: 0, isActive: true, iconKey: 'digital-wallet' },
  { id: 'mini-statement', name: 'كشف حساب مصغر', description: 'آخر 5 معاملات', fee: 50, isActive: true, iconKey: 'wallet-statement' },
  { id: 'full-statement', name: 'كشف حساب كامل', description: 'كشف حساب مفصل لجميع المعاملات', fee: 500, isActive: true, iconKey: 'wallet-statement' },
  { id: 'change-pin', name: 'تغيير الرقم السري', description: 'تغيير الرقم السري للمحفظة', fee: 0, isActive: true, iconKey: 'wallet-card' },
  { id: 'block-card', name: 'حظر البطاقة', description: 'حظر بطاقة المحفظة في حالة الفقدان', fee: 0, isActive: true, iconKey: 'wallet-card' },
  { id: 'request-money', name: 'طلب أموال', description: 'طلب تحويل أموال من مستخدم آخر', fee: 0, isActive: true, iconKey: 'wallet-transfer' },
  { id: 'scheduled-transfer', name: 'تحويل مجدول', description: 'جدولة تحويلات دورية', fee: 100, isActive: true, iconKey: 'wallet-international' },
  { id: 'cashback-check', name: 'التحقق من الكاشباك', description: 'عرض مكافآت الاسترداد النقدي', fee: 0, isActive: true, iconKey: 'offers' },
  { id: 'loyalty-points', name: 'نقاط الولاء', description: 'عرض وإدارة نقاط الولاء', fee: 0, isActive: true, iconKey: 'savings' },
  { id: 'beneficiaries', name: 'إدارة المستفيدين', description: 'إضافة وإدارة المستفيدين للتحويل', fee: 0, isActive: true, iconKey: 'transfer-account' },
];

// ═══════════════════════════════════════════════════════════
//  TRIAL APIs (واجهات برمجة تجريبية)
// ═══════════════════════════════════════════════════════════
const trialApis = [
  { id: 'api-yemen-mobile-topup', name: 'يمن موبايل - شحن تجريبي', providerId: 'yemen-mobile', endpoint: 'https://api.south-wallet.test/v1/topup/yemen-mobile', method: 'POST', isActive: true, description: 'API تجريبي لشحن رصيد يمن موبايل', testMode: true },
  { id: 'api-yo-topup', name: 'يو - شحن تجريبي', providerId: 'yo', endpoint: 'https://api.south-wallet.test/v1/topup/yo', method: 'POST', isActive: true, description: 'API تجريبي لشحن رصيد يو', testMode: true },
  { id: 'api-sabafon-topup', name: 'سبأفون - شحن تجريبي', providerId: 'sabafon', endpoint: 'https://api.south-wallet.test/v1/topup/sabafon', method: 'POST', isActive: true, description: 'API تجريبي لشحن رصيد سبأفون', testMode: true },
  { id: 'api-pubg-redeem', name: 'ببجي - شحن شدات تجريبي', providerId: 'pubg', endpoint: 'https://api.south-wallet.test/v1/gaming/pubg', method: 'POST', isActive: true, description: 'API تجريبي لشحن شدات ببجي', testMode: true },
  { id: 'api-freefire-redeem', name: 'فري فاير - جواهر تجريبي', providerId: 'freefire', endpoint: 'https://api.south-wallet.test/v1/gaming/freefire', method: 'POST', isActive: true, description: 'API تجريبي لشحن جواهر فري فاير', testMode: true },
  { id: 'api-netflix-subscribe', name: 'نتفلكس - اشتراك تجريبي', providerId: 'netflix', endpoint: 'https://api.south-wallet.test/v1/streaming/netflix', method: 'POST', isActive: true, description: 'API تجريبي لاشتراك نتفلكس', testMode: true },
  { id: 'api-spotify-subscribe', name: 'سبوتيفاي - اشتراك تجريبي', providerId: 'spotify', endpoint: 'https://api.south-wallet.test/v1/streaming/spotify', method: 'POST', isActive: true, description: 'API تجريبي لاشتراك سبوتيفاي', testMode: true },
  { id: 'api-youtube-subscribe', name: 'يوتيوب بريميوم - اشتراك تجريبي', providerId: 'youtube-premium', endpoint: 'https://api.south-wallet.test/v1/streaming/youtube', method: 'POST', isActive: true, description: 'API تجريبي لاشتراك يوتيوب بريميوم', testMode: true },
  { id: 'api-google-play-card', name: 'جوجل بلاي - بطاقة تجريبية', providerId: 'google-play', endpoint: 'https://api.south-wallet.test/v1/cards/google-play', method: 'POST', isActive: true, description: 'API تجريبي لشراء بطاقة جوجل بلاي', testMode: true },
  { id: 'api-itunes-card', name: 'آيتونز - بطاقة تجريبية', providerId: 'apple-itunes', endpoint: 'https://api.south-wallet.test/v1/cards/itunes', method: 'POST', isActive: true, description: 'API تجريبي لشراء بطاقة آيتونز', testMode: true },
  { id: 'api-visa-virtual', name: 'فيزا افتراضية - إصدار تجريبي', providerId: 'visa-virtual', endpoint: 'https://api.south-wallet.test/v1/cards/visa', method: 'POST', isActive: true, description: 'API تجريبي لإصدار بطاقة فيزا افتراضية', testMode: true },
  { id: 'api-paypal-fund', name: 'بايبال - شحن تجريبي', providerId: 'paypal', endpoint: 'https://api.south-wallet.test/v1/wallets/paypal', method: 'POST', isActive: true, description: 'API تجريبي لشحن حساب بايبال', testMode: true },
  { id: 'api-btc-buy', name: 'بيتكوين - شراء تجريبي', providerId: 'bitcoin', endpoint: 'https://api.south-wallet.test/v1/crypto/btc', method: 'POST', isActive: true, description: 'API تجريبي لشراء بيتكوين', testMode: true },
  { id: 'api-usdt-buy', name: 'USDT - شراء تجريبي', providerId: 'usdt', endpoint: 'https://api.south-wallet.test/v1/crypto/usdt', method: 'POST', isActive: true, description: 'API تجريبي لشراء USDT', testMode: true },
  { id: 'api-wallet-transfer', name: 'تحويل محفظة - تجريبي', providerId: 'wallet-transfer-svc', endpoint: 'https://api.south-wallet.test/v1/wallet/transfer', method: 'POST', isActive: true, description: 'API تجريبي لتحويل رصيد بين المحافظ', testMode: true },
  { id: 'api-wallet-withdraw', name: 'سحب نقدي - تجريبي', providerId: 'wallet-withdraw', endpoint: 'https://api.south-wallet.test/v1/wallet/withdraw', method: 'POST', isActive: true, description: 'API تجريبي للسحب النقدي', testMode: true },
  { id: 'api-bill-pay', name: 'دفع فواتير - تجريبي', providerId: 'wallet-bill-pay', endpoint: 'https://api.south-wallet.test/v1/bills/pay', method: 'POST', isActive: true, description: 'API تجريبي لدفع الفواتير', testMode: true },
  { id: 'api-shopping-order', name: 'طلب تسوق - تجريبي', providerId: 'aliexpress', endpoint: 'https://api.south-wallet.test/v1/shopping/order', method: 'POST', isActive: true, description: 'API تجريبي لطلب منتجات', testMode: true },
  { id: 'api-flight-book', name: 'حجز طيران - تجريبي', providerId: 'flight-booking', endpoint: 'https://api.south-wallet.test/v1/travel/flight', method: 'POST', isActive: true, description: 'API تجريبي لحجز تذاكر طيران', testMode: true },
  { id: 'api-food-order', name: 'طلب طعام - تجريبي', providerId: 'talabat', endpoint: 'https://api.south-wallet.test/v1/food/order', method: 'POST', isActive: true, description: 'API تجريبي لطلب طعام', testMode: true },
];

// ═══════════════════════════════════════════════════════════
//  MAIN: Push all data to Firebase
// ═══════════════════════════════════════════════════════════
async function seedDatabase() {
  try {
    console.log('🚀 Starting Firebase database seeding...\n');

    const updates = {};
    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

    // 1. SEED SECTIONS
    console.log(`📋 Seeding ${sections.length} sections...`);
    sections.forEach((sec, i) => {
      const key = `section_${i}`;
      updates[`ownerSettings/sections/${key}`] = { ...sec, order: i };
      updates[`adminSettings/visibility/sections/${sec.categoryId}`] = sec.isVisible !== false;
    });

    // 2. SEED PROVIDERS
    console.log(`🏢 Seeding ${providers.length} providers...`);
    providers.forEach((prov) => {
      const firebaseKey = prov.id.replace(/[^a-zA-Z0-9_-]/g, '_');
      updates[`providers/${firebaseKey}`] = { ...prov, id: firebaseKey };
      updates[`adminSettings/visibility/providers/${firebaseKey}`] = prov.isActive !== false;
    });

    // 3. SEED PACKAGES
    console.log(`📦 Seeding ${packages.length} packages...`);
    packages.forEach((pkg) => {
      const newKey = db.ref().push().key;
      // Use the providerId as-is to ensure it matches the provider's Firebase key
      const providerKey = pkg.providerId.replace(/[^a-zA-Z0-9_-]/g, '_');
      updates[`packages/${newKey}`] = { ...pkg, id: newKey, providerId: providerKey };
    });

    // 4. SEED WALLET SERVICES
    console.log(`💳 Seeding ${walletServices.length} wallet services...`);
    walletServices.forEach((svc) => {
      updates[`walletServices/${svc.id}`] = svc;
    });

    // 5. SEED TRIAL APIs
    console.log(`🔌 Seeding ${trialApis.length} trial APIs...`);
    trialApis.forEach((api) => {
      updates[`trialApis/${api.id}`] = api;
    });

    // 6. SEED FEATURES VISIBILITY
    console.log(`⚙️ Seeding features visibility...`);
    const featureDefaults = {
      transfer: true,
      exchange: true,
      deposit: true,
      withdraw: true,
      kyc: true,
      support: true,
      giftCodes: true,
      promoCodes: true,
      savings: true,
      investments: true,
    };
    Object.entries(featureDefaults).forEach(([key, val]) => {
      updates[`adminSettings/visibility/features/${key}`] = val;
    });

    // 7. SEED NETWORK PREFIXES (كشف الشبكة التلقائي)
    console.log(`📱 Seeding network prefixes...`);
    const networkPrefixes = [
      { id: 'prefix_77', prefix: '77', networkId: 'yemen-mobile', networkName: 'يمن موبايل', color: '#C41E3A', icon: '', isActive: true, order: 0 },
      { id: 'prefix_78', prefix: '78', networkId: 'yemen-mobile', networkName: 'يمن موبايل', color: '#C41E3A', icon: '', isActive: true, order: 1 },
      { id: 'prefix_73', prefix: '73', networkId: 'yemen-mobile', networkName: 'يمن موبايل', color: '#C41E3A', icon: '', isActive: true, order: 2 },
      { id: 'prefix_70', prefix: '70', networkId: 'yemen-mobile', networkName: 'يمن موبايل', color: '#C41E3A', icon: '', isActive: true, order: 3 },
      { id: 'prefix_71', prefix: '71', networkId: 'yo', networkName: 'يو', color: '#FF6B00', icon: '', isActive: true, order: 4 },
      { id: 'prefix_75', prefix: '75', networkId: 'yo', networkName: 'يو', color: '#FF6B00', icon: '', isActive: true, order: 5 },
      { id: 'prefix_74', prefix: '74', networkId: 'sabafon', networkName: 'سبأفون', color: '#2563EB', icon: '', isActive: true, order: 6 },
      { id: 'prefix_76', prefix: '76', networkId: 'sabafon', networkName: 'سبأفون', color: '#2563EB', icon: '', isActive: true, order: 7 },
      { id: 'prefix_72', prefix: '72', networkId: 'y', networkName: 'واي', color: '#059669', icon: '', isActive: true, order: 8 },
      { id: 'prefix_79', prefix: '79', networkId: 'y', networkName: 'واي', color: '#059669', icon: '', isActive: true, order: 9 },
    ];
    networkPrefixes.forEach((np) => {
      updates[`adminSettings/networkPrefixes/${np.id}`] = np;
      updates[`adminSettings/visibility/networkPrefixes/${np.id}`] = np.isActive;
    });

    // 8. SEED BOTS (التبوتات)
    console.log(`🤖 Seeding bots...`);
    const bots = [
      { id: 'bot_ym_balance', name: 'يمن موبايل رصيد', description: 'الاستعلام عن رصيد يمن موبايل', type: 'balance', networkId: 'yemen-mobile', networkName: 'يمن موبايل', icon: '', color: '#C41E3A', apiUrl: '', apiKey: '', apiMethod: 'POST', headersTemplate: '{}', bodyTemplate: '{}', responseParser: '', isActive: true, order: 0, requiresPhone: true, requiresAmount: false, prefixPattern: '77,78,73,70', successMessage: 'رصيدك: {{balance}} ر.ي', errorMessage: 'فشل الاستعلام. تأكد من الرقم' },
      { id: 'bot_yo_balance', name: 'يو رصيد', description: 'الاستعلام عن رصيد يو', type: 'balance', networkId: 'yo', networkName: 'يو', icon: '', color: '#FF6B00', apiUrl: '', apiKey: '', apiMethod: 'POST', headersTemplate: '{}', bodyTemplate: '{}', responseParser: '', isActive: true, order: 1, requiresPhone: true, requiresAmount: false, prefixPattern: '71,75', successMessage: 'رصيدك: {{balance}} ر.ي', errorMessage: 'فشل الاستعلام. تأكد من الرقم' },
      { id: 'bot_sabafon_balance', name: 'سبأفون رصيد', description: 'الاستعلام عن رصيد سبأفون', type: 'balance', networkId: 'sabafon', networkName: 'سبأفون', icon: '', color: '#2563EB', apiUrl: '', apiKey: '', apiMethod: 'POST', headersTemplate: '{}', bodyTemplate: '{}', responseParser: '', isActive: true, order: 2, requiresPhone: true, requiresAmount: false, prefixPattern: '74,76', successMessage: 'رصيدك: {{balance}} ر.ي', errorMessage: 'فشل الاستعلام. تأكد من الرقم' },
      { id: 'bot_y_balance', name: 'واي رصيد', description: 'الاستعلام عن رصيد واي', type: 'balance', networkId: 'y', networkName: 'واي', icon: '', color: '#059669', apiUrl: '', apiKey: '', apiMethod: 'POST', headersTemplate: '{}', bodyTemplate: '{}', responseParser: '', isActive: true, order: 3, requiresPhone: true, requiresAmount: false, prefixPattern: '72,79', successMessage: 'رصيدك: {{balance}} ر.ي', errorMessage: 'فشل الاستعلام. تأكد من الرقم' },
      { id: 'bot_ym_recharge', name: 'يمن موبايل شحن', description: 'شحن رصيد يمن موبايل', type: 'recharge', networkId: 'yemen-mobile', networkName: 'يمن موبايل', icon: '', color: '#C41E3A', apiUrl: '', apiKey: '', apiMethod: 'POST', headersTemplate: '{}', bodyTemplate: '{"phone":"{{phone}}","amount":"{{amount}}"}', responseParser: '', isActive: true, order: 4, requiresPhone: true, requiresAmount: true, prefixPattern: '77,78,73,70', successMessage: 'تم الشحن بنجاح! الرصيد الجديد: {{newBalance}} ر.ي', errorMessage: 'فشل الشحن. يرجى المحاولة لاحقاً' },
      { id: 'bot_yo_recharge', name: 'يو شحن', description: 'شحن رصيد يو', type: 'recharge', networkId: 'yo', networkName: 'يو', icon: '', color: '#FF6B00', apiUrl: '', apiKey: '', apiMethod: 'POST', headersTemplate: '{}', bodyTemplate: '{"phone":"{{phone}}","amount":"{{amount}}"}', responseParser: '', isActive: true, order: 5, requiresPhone: true, requiresAmount: true, prefixPattern: '71,75', successMessage: 'تم الشحن بنجاح! الرصيد الجديد: {{newBalance}} ر.ي', errorMessage: 'فشل الشحن. يرجى المحاولة لاحقاً' },
      { id: 'bot_sabafon_recharge', name: 'سبأفون شحن', description: 'شحن رصيد سبأفون', type: 'recharge', networkId: 'sabafon', networkName: 'سبأفون', icon: '', color: '#2563EB', apiUrl: '', apiKey: '', apiMethod: 'POST', headersTemplate: '{}', bodyTemplate: '{"phone":"{{phone}}","amount":"{{amount}}"}', responseParser: '', isActive: true, order: 6, requiresPhone: true, requiresAmount: true, prefixPattern: '74,76', successMessage: 'تم الشحن بنجاح! الرصيد الجديد: {{newBalance}} ر.ي', errorMessage: 'فشل الشحن. يرجى المحاولة لاحقاً' },
      { id: 'bot_y_recharge', name: 'واي شحن', description: 'شحن رصيد واي', type: 'recharge', networkId: 'y', networkName: 'واي', icon: '', color: '#059669', apiUrl: '', apiKey: '', apiMethod: 'POST', headersTemplate: '{}', bodyTemplate: '{"phone":"{{phone}}","amount":"{{amount}}"}', responseParser: '', isActive: true, order: 7, requiresPhone: true, requiresAmount: true, prefixPattern: '72,79', successMessage: 'تم الشحن بنجاح! الرصيد الجديد: {{newBalance}} ر.ي', errorMessage: 'فشل الشحن. يرجى المحاولة لاحقاً' },
    ];
    bots.forEach((bot) => {
      updates[`adminSettings/bots/${bot.id}`] = bot;
    });

    // Execute the update
    console.log('\n⏳ Writing to Firebase Realtime Database...');
    await db.ref().update(updates);

    console.log('\n✅ Database seeded successfully!');
    console.log(`   - ${sections.length} sections/categories`);
    console.log(`   - ${providers.length} service providers`);
    console.log(`   - ${packages.length} product packages`);
    console.log(`   - ${walletServices.length} wallet services`);
    console.log(`   - ${trialApis.length} trial APIs`);
    console.log(`   - ${networkPrefixes.length} network prefixes`);
    console.log(`   - ${bots.length} bots`);
    console.log(`   - Total Firebase paths updated: ${Object.keys(updates).length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
