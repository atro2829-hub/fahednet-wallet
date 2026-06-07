'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, HelpCircle, Shield, Info, ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { LOGO_BASE64 } from '@/lib/logo';

type LegalTab = 'faq' | 'privacy' | 'about';

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: 'كيف أسجل حساب جديد في محفظة الجنوب؟',
    answer: 'يمكنك تسجيل حساب جديد بسهولة من خلال فتح التطبيق والضغط على زر "تسجيل جديد". ستحتاج إلى إدخال اسمك الكامل المكون من أربعة أجزاء (الاسم الأول، الاسم الثاني، الاسم الثالث، واسم العائلة)، بالإضافة إلى رقم البطاقة الشخصية والبريد الإلكتروني وكلمة المرور. بعد ذلك ستتمكن من إضافة رقم هاتفك اختيارياً. سيتم إرسال رمز تحقق إلى بريدك الإلكتروني لتفعيل الحساب.',
  },
  {
    question: 'كيف أوثق حسابي؟',
    answer: 'لتوثيق حسابك، انتقل إلى قسم التحقق من الهوية من خلال الإعدادات أو من الرابط الذي يظهر في الصفحة الرئيسية. ستحتاج إلى رفع صورة واضحة لبطاقتك الشخصية من الأمام والخلف، بالإضافة إلى صورة شخصية حديثة. سيتم مراجعة طلبك خلال 24 إلى 48 ساعة عمل. بعد الموافقة، ستحصل على شارة التوثيق ويمكنك استخدام جميع مميزات التطبيق بحرية.',
  },
  {
    question: 'كيف أشحن رصيدي في المحفظة؟',
    answer: 'يمكنك شحن رصيدك بعدة طرق: الأولى هي التحويل البنكي حيث تقوم بتحويل المبلغ إلى الحساب البنكي المخصص ورفع إيصال التحويل في قسم الإيداع. الطريقة الثانية هي من خلال نقاط البيع المعتمدة المنتشرة في المحافظات الجنوبية. الطريقة الثالثة هي التحويل من مستخدم آخر في المحفظة. يتم اعتماد الإيداع خلال دقائق معدودة بعد التحقق من صحة العملية.',
  },
  {
    question: 'كيف أحول أموالاً إلى شخص آخر؟',
    answer: 'يمكنك تحويل الأموال بسهولة من خلال الضغط على زر التحويل في الصفحة الرئيسية. أدخل رقم حساب المستلم (رقم الحساب المكون من 6 أرقام) أو رقم هاتفه المسجل في المحفظة. ثم حدد المبلغ والعملة المراد تحويلها (ريال يمني، ريال سعودي، أو دولار أمريكي). قم بتأكيد العملية وسيتم التحويل فوراً. يجب أن يكون حسابك موثقاً لاستخدام خاصية التحويل.',
  },
  {
    question: 'ما هي العملات المدعومة في المحفظة؟',
    answer: 'تدعم محفظة الجنوب ثلاث عملات رئيسية: الريال اليمني (YER) وهو العملة المحلية الأساسية، الريال السعودي (SAR) لسهولة التعامل مع السوق السعودي، والدولار الأمريكي (USD) للمعاملات الدولية والاستثمار. يمكنك الاحتفاظ بأرصدة منفصلة لكل عملة، وكذلك التبديل بين العملات من خلال خدمة تبادل العملات المدمجة في التطبيق بأسعار صرف تنافسية ومحدّثة يومياً.',
  },
  {
    question: 'كيف أشتري منتجات الألعاب؟',
    answer: 'يمكنك شراء منتجات الألعاب من خلال قسم الخدمات الترفيهية. اختر اللعبة المطلوبة مثل ببجي موبايل أو فري فاير أو فالورانت وغيرها. أدخل معرف اللاعب الخاص بك (Player ID) ثم اختر الحزمة المناسبة من القائمة المتاحة. قم بتأكيد الشراء وسيتم خصم المبلغ من رصيدك وتنفيذ الطلب. يتوفر شحن فوري لبعض الخدمات وشحن يدوي يتم خلال دقائق للخدمات الأخرى.',
  },
  {
    question: 'كيف أبدل العملات في المحفظة؟',
    answer: 'يمكنك تبادل العملات من خلال خدمة تبادل العملات المدمجة. انتقل إلى قسم التبادل من القائمة الرئيسية، اختر العملة المصدر والعملة الهدف، ثم حدد المبلغ المراد تبادله. سيظهر لك سعر الصرف الحالي والمبلغ الذي ستحصل عليه. قم بتأكيد العملية وسيتم التبادل فوراً. أسعار الصرف محدّثة يومياً وتعكس الأسعار الحقيقية في السوق اليمني.',
  },
  {
    question: 'كيف أستثمر في USDT؟',
    answer: 'توفر محفظة الجنوب خدمة استثمار USDT (تيثر) بخطط متنوعة تناسب جميع المستثمرين. يمكنك الاختيار بين خطة يومية وأسبوعية وشهريه وربع سنوية. كل خطة يختلف معدل العائد فيها. للبدء، انتقل إلى قسم استثمار الكريبتو، اختر الخطة المناسبة، وحدد مبلغ الاستثمار. يجب أن يكون حسابك موثقاً للاستثمار. يمكنك متابعة أرباحك وسحبها في أي وقت حسب شروط الخطة المختارة.',
  },
  {
    question: 'هل أموالي آمنة في محفظة الجنوب؟',
    answer: 'نعم، نحرص على تأمين أموالك بأعلى معايير الأمان. نستخدم تقنية التشفير المتقدمة لحماية بياناتك ومعاملاتك. كما نطبق نظام التحقق الثنائي (KYC) لضمان هوية المستخدمين. جميع المعاملات المالية تتم من خلال بوابات دفع آمنة ومعتمدة. كما نوفر خاصية رمز PIN لحماية الدخول إلى التطبيق. فريق الدعم متاح على مدار الساعة للتعامل مع أي مشكلة أمنية.',
  },
  {
    question: 'كيف أتواصل مع الدعم الفني؟',
    answer: 'يمكنك التواصل مع فريق الدعم الفني بعدة طرق: من خلال قسم الدعم والمساعدة داخل التطبيق حيث يمكنك فتح تذكرة دعم جديدة والرد عليها مباشرة. أيضاً يمكنك التواصل عبر البريد الإلكتروني المخصص للدعم. فريق الدعم متاح للاستجابة لاستفساراتك وحل مشاكلك في أسرع وقت ممكن، عادةً خلال ساعات قليلة. نحرص على تقديم خدمة عملاء متميزة على مدار الساعة.',
  },
];

const privacySections = [
  {
    title: 'جمع البيانات',
    content: 'تجمع محفظة الجنوب البيانات الضرورية لتقديم خدماتها بشكل فعال وآمن. تشمل البيانات التي نجمعها: الاسم الكامل (الأول، الثاني، الثالث، والعائلة)، رقم البطاقة الشخصية، رقم الهاتف، البريد الإلكتروني، صورة البطاقة الشخصية للتوثيق، الصورة الشخصية، المحافظة، وبيانات المعاملات المالية (التحويلات، الإيداعات، المشتريات). كما نجمع بيانات استخدام التطبيق مثل سجل الدخول والعمليات لتحسين تجربة المستخدم وضمان الأمان. لا نجمع أي بيانات من جهات خارجية دون موافقتك الصريحة.',
  },
  {
    title: 'استخدام البيانات',
    content: 'نستخدم بياناتك لأغراض محددة وواضحة تشمل: تقديم خدمات المحفظة الرقمية بما في ذلك التحويلات والمدفوعات والاستثمار، التحقق من هويتك وحماية حسابك من الاحتيال، التواصل معك بخصوص حسابك ومعاملاتك، تحسين خدماتنا وتطوير ميزات جديدة، الامتثال للمتطلبات القانونية والتنظيمية، ومنع غسل الأموال وتمويل الإرهاب وفقاً للتشريعات اليمنية. لا نبيع بياناتك الشخصية لأي جهة خارجية تحت أي ظرف.',
  },
  {
    title: 'حماية البيانات',
    content: 'نتخذ إجراءات أمنية صارمة لحماية بياناتك الشخصية والمالية. تشمل هذه الإجراءات: تشفير جميع البيانات أثناء النقل والتخزين باستخدام بروتوكولات تشفير متقدمة (SSL/TLS)، تخزين البيانات على خوادم آمنة ومحمية بجدران حماية متقدمة، تقييد وصول الموظفين إلى البيانات الشخصية وفقاً لمبدأ الحد الأدنى من الصلاحيات، مراقبة الأنشطة المشبوهة والوصول غير المصرح به على مدار الساعة، إجراء عمليات تدقيق أمني دورية لضمان سلامة الأنظمة، والنسخ الاحتياطي المنتظم للبيانات في مواقع آمنة متعددة.',
  },
  {
    title: 'مشاركة البيانات مع أطراف ثالثة',
    content: 'لا نشارك بياناتك الشخصية مع أطراف ثالثة إلا في الحالات التالية: عند موافقتك الصريحة على المشاركة، مع مزودي خدمات الدفع المعتمدين لتنفيذ المعاملات المالية، مع الجهات الحكومية المختصة عند الطلب القانوني الرسمي، مع شركات التدقيق المالي والقانوني عند الحاجة للامتثال التنظيمي. في جميع الحالات، نضمن أن أي طرف ثالث يلتزم بمعايير حماية البيانات نفسها التي نطبقها. نحن لا نبيع أو نتاجر ببياناتك الشخصية تحت أي ظرف.',
  },
  {
    title: 'حقوق المستخدم',
    content: 'يحق لك كمستخدم لمحفظة الجنوب: الوصول إلى بياناتك الشخصية المخزنة لدينا في أي وقت، طلب تعديل أو تصحيح أي بيانات غير دقيقة، طلب حذف حسابك وبياناتك الشخصية وفقاً للإجراءات المحددة، الاعتراض على معالجة بياناتك لأغراض تسويقية، سحب موافقتك على معالجة البيانات في أي وقت، تقديم شكوى إلى الجهات المختصة في حال انتهاك خصوصيتك. لتمارس أي من هذه الحقوق، يمكنك التواصل مع فريق الدعم من داخل التطبيق أو عبر البريد الإلكتروني الرسمي.',
  },
  {
    title: 'سياسة ملفات تعريف الارتباط (الكوكيز)',
    content: 'تستخدم محفظة الجنوب ملفات تعريف الارتباط والتقنيات المماثلة لتحسين تجربة المستخدم. تشمل هذه الملفات: ملفات تعريف الارتباط الأساسية الضرورية لعمل التطبيق مثل بيانات الجلسة وتفضيلات اللغة، ملفات تعريف الارتباط الوظيفية التي تساعد في تذكر إعداداتك وتفضيلاتك، ملفات تعريف الارتباط التحليلية التي تساعدنا في فهم كيفية استخدام التطبيق لتحسينه. يمكنك التحكم في تفضيلات ملفات تعريف الارتباط من إعدادات التطبيق. لا تستخدم ملفات تعريف الارتباط لجمع بيانات شخصية حساسة.',
  },
];

const aboutFeatures = [
  'محفظة رقمية متعددة العملات (ريال يمني، ريال سعودي، دولار أمريكي)',
  'تحويل أموال فوري وسريع بين المستخدمين',
  'شراء خدمات الألعاب والترفيه (ببجي، فري فاير، فالورانت وغيرها)',
  'شحن رصيد الهاتف والإنترنت لجميع شبكات اليمن',
  'تبادل العملات بأسعار صرف تنافسية',
  'استثمار في العملات الرقمية (USDT) بخطط متنوعة',
  'دفع فواتير الكهرباء والماء والخدمات الحكومية',
  'بطاقات رقمية (جوجل بلاي، آيتونز، بلايستيشن وغيرها)',
  'نظام توثيق هوية آمن وموثوق',
  'دعم فني على مدار الساعة',
];

export default function LegalScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { setActiveScreen } = useAppStore();
  const [activeTab, setActiveTab] = useState<LegalTab>('faq');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedPrivacy, setExpandedPrivacy] = useState<number | null>(null);

  const tabs: { id: LegalTab; label: string; icon: typeof HelpCircle; color: string }[] = [
    { id: 'faq', label: 'الأسئلة الشائعة', icon: HelpCircle, color: '#F59E0B' },
    { id: 'privacy', label: 'سياسة الخصوصية', icon: Shield, color: '#8B5CF6' },
    { id: 'about', label: 'لمحة عن التطبيق', icon: Info, color: '#10B981' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: isDark ? '#0F0F0F' : '#F5F5F5' }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-4 pb-3"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const prev = useAppStore.getState().previousScreen;
              useAppStore.getState().setActiveScreen(prev || '');
            }}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
          >
            <ArrowRight size={20} strokeWidth={1.5} color={isDark ? '#FFF' : '#666'} />
          </button>
          <h1 className="text-xl font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
            المعلومات القانونية
          </h1>
        </div>
      </motion.div>

      {/* Tab Buttons */}
      <div className="px-4 mb-4">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl transition-all"
                style={{
                  background: isActive ? `${tab.color}15` : (isDark ? '#1A1A1A' : '#FFFFFF'),
                  border: isActive ? `1px solid ${tab.color}30` : `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                <TabIcon size={16} strokeWidth={1.5} color={isActive ? tab.color : (isDark ? '#666' : '#AAA')} />
                <span
                  className="text-[11px] font-bold whitespace-nowrap"
                  style={{ color: isActive ? tab.color : (isDark ? '#666' : '#AAA') }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-4 pb-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * index }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: isDark ? '#1A1A1A' : '#FFFFFF',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-right"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: '#F59E0B12' }}
                    >
                      <HelpCircle size={16} strokeWidth={1.5} color="#F59E0B" />
                    </div>
                    <span
                      className="flex-1 text-sm font-bold"
                      style={{ color: isDark ? '#FFF' : '#1a1a1a' }}
                    >
                      {item.question}
                    </span>
                    {expandedFaq === index ? (
                      <ChevronUp size={16} strokeWidth={1.5} color={isDark ? '#555' : '#AAA'} />
                    ) : (
                      <ChevronDown size={16} strokeWidth={1.5} color={isDark ? '#555' : '#AAA'} />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-4 pb-4 pt-0"
                          style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}` }}
                        >
                          <p
                            className="text-xs leading-relaxed pt-3"
                            style={{ color: isDark ? '#AAA' : '#666' }}
                          >
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Privacy Policy Tab */}
          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(139,92,246,0.08)',
                  border: '1px solid rgba(139,92,246,0.15)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={18} strokeWidth={1.5} color="#8B5CF6" />
                  <span className="text-sm font-bold" style={{ color: '#8B5CF6' }}>سياسة الخصوصية</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: isDark ? '#AAA' : '#666' }}>
                  نحن في محفظة الجنوب نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك عند استخدامك لتطبيقنا. يرجى قراءتها بعناية.
                </p>
              </motion.div>

              {privacySections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * index }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: isDark ? '#1A1A1A' : '#FFFFFF',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  <button
                    onClick={() => setExpandedPrivacy(expandedPrivacy === index ? null : index)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-right"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: '#8B5CF612' }}
                    >
                      <span className="text-[10px] font-bold" style={{ color: '#8B5CF6' }}>{index + 1}</span>
                    </div>
                    <span
                      className="flex-1 text-sm font-bold"
                      style={{ color: isDark ? '#FFF' : '#1a1a1a' }}
                    >
                      {section.title}
                    </span>
                    {expandedPrivacy === index ? (
                      <ChevronUp size={16} strokeWidth={1.5} color={isDark ? '#555' : '#AAA'} />
                    ) : (
                      <ChevronDown size={16} strokeWidth={1.5} color={isDark ? '#555' : '#AAA'} />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedPrivacy === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-4 pb-4 pt-0"
                          style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}` }}
                        >
                          <p
                            className="text-xs leading-relaxed pt-3"
                            style={{ color: isDark ? '#AAA' : '#666' }}
                          >
                            {section.content}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Last updated */}
              <p className="text-[10px] text-center mt-4" style={{ color: isDark ? '#444' : '#CCC' }}>
                آخر تحديث: يناير 2026
              </p>
            </motion.div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* App Logo and Info */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-6 flex flex-col items-center"
                style={{
                  background: isDark ? '#1A1A1A' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                <div
                  className="w-20 h-20 rounded-2xl overflow-hidden mb-4"
                  style={{ boxShadow: '0 8px 24px rgba(230,0,0,0.25)' }}
                >
                  <img src={LOGO_BASE64} alt="الجنوب" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-xl font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                  محفظة الجنوب
                </h2>
                <p className="text-sm mt-1" style={{ color: isDark ? '#888' : '#AAA' }} dir="ltr">Alganob</p>
                <div
                  className="mt-3 px-4 py-1.5 rounded-lg"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}
                >
                  <span className="text-xs font-bold" style={{ color: '#10B981' }} dir="ltr">v1.0.0</span>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-2xl p-5"
                style={{
                  background: isDark ? '#1A1A1A' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                <h3 className="text-sm font-bold mb-3" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                  عن التطبيق
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: isDark ? '#AAA' : '#666' }}>
                  محفظة الجنوب هي محفظة رقمية يمنية متكاملة تهدف إلى تسهيل المعاملات المالية الرقمية للمواطنين في المحافظات الجنوبية. توفر المحفظة مجموعة شاملة من الخدمات المالية والرقمية تشمل التحويلات بين المستخدمين، شراء المنتجات الرقمية والترفيهية، شحن رصيد الهاتف والإنترنت، تبادل العملات، والاستثمار في العملات الرقمية. تم تصميم التطبيق خصيصاً ليناسب احتياجات السوق اليمني مع دعم كامل للغة العربية والعملات المحلية.
                </p>
              </motion.div>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: isDark ? '#1A1A1A' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                <div className="px-5 pt-4 pb-2">
                  <h3 className="text-sm font-bold" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                    المميزات
                  </h3>
                </div>
                {aboutFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-5 py-3"
                    style={{
                      borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: '#10B98112' }}
                    >
                      <span className="text-[9px] font-bold" style={{ color: '#10B981' }}>{index + 1}</span>
                    </div>
                    <span className="text-xs" style={{ color: isDark ? '#CCC' : '#444' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl p-5"
                style={{
                  background: isDark ? '#1A1A1A' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                <h3 className="text-sm font-bold mb-3" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                  معلومات التواصل
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium" style={{ color: isDark ? '#888' : '#AAA' }}>البريد الإلكتروني:</span>
                    <span className="text-xs" style={{ color: '#E60000' }} dir="ltr">support@alganob.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium" style={{ color: isDark ? '#888' : '#AAA' }}>الموقع الإلكتروني:</span>
                    <span className="text-xs" style={{ color: '#E60000' }} dir="ltr">www.alganob.com</span>
                  </div>
                </div>
              </motion.div>

              {/* License Info */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl p-5"
                style={{
                  background: isDark ? '#1A1A1A' : '#FFFFFF',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                <h3 className="text-sm font-bold mb-3" style={{ color: isDark ? '#FFF' : '#1a1a1a' }}>
                  معلومات الترخيص
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: isDark ? '#AAA' : '#666' }}>
                  محفظة الجنوب (Alganob) - الإصدار 1.0.0. جميع الحقوق محفوظة. هذا التطبيق مرخص للاستخدام الشخصي وغير التجاري فقط. يحظر نسخ أو تعديل أو توزيع أي جزء من التطبيق دون إذن كتابي مسبق من مطور التطبيق. التطبيق محمي بموجب قوانين حقوق الملكية الفكرية المعمول بها في الجمهورية اليمنية.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
