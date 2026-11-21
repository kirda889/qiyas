/* q3: نسخة النموذج المعتمد (w01 النهائي) بتعديلات يوسف 2026-11-20 — مأخوذة من q2.js
   المحتوى حرفياً من «سكريبت محتوى الرئيسية 2026-11-19». لا تعدّل نصاً هنا بلا مصدر.
   يُحمَّل في <head> بلا defer. الصفحة تستدعي Q.html.*() لتوليد الأقسام، ثم Q.init() مرة واحدة في آخر <body>.
   الأرقام قيمتها اليوم (19/11): البناء الحقيقي يولّدها من البيانات (البند 8 في السكريبت). */
(function () {
  const H = document.documentElement, q = new URLSearchParams(location.search), shot = !!q.get('shot');
  const saved = (() => { try { return localStorage.getItem('qx-theme') } catch (e) { return null } })();
  const dark = q.get('theme') ? q.get('theme') === 'dark' : saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  H.classList.toggle('dark', dark); if (shot) H.classList.add('shot');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const E = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const QH = window.QX_HOME || {};
  const BASE = QH.base || 'https://yousefalshamrani.com/qiyas/';
  const PAY_ONLINE = false; // /v1/proof → pay=false يوم 2026-11-19
  const UPD = QH.upd ? 'آخر تحديث للمحتوى: ' + QH.upd : 'آخر تحديث للمحتوى: 19 نوفمبر 2026';

  const NAV = [['الاختبارات', '#ex'], ['كيف تذاكر', '#how'], ['الأسعار', '#prices'], ['الأسئلة الشائعة', '#faq']];
  const HERO = {
    eyebrow: 'قياس',
    h1: 'تدرب بذكاء، من اختبارات الأعوام الماضية',
    h1Parts: ['تدرب بذكاء،', 'من اختبارات الأعوام الماضية'],
    sub: 'دروس وأسئلة تفاعلية تساعدك على مراجعة المفاهيم، وفهم أخطائك، والتدرّب على طريقة الحل. اختر اختبارك وجرّب المحتوى مجانًا.',
    cta: 'اختر اختبارك', alt: '\u0623\u0648 جرّب سؤالاً الآن',
    guarantee: 'ضمان 3 أيام بعد التفعيل: ما ناسبك؟ يرجع لك المبلغ كاملاً.',
    rating: { score: '5.0', count: 46 }
  };

  // البطاقات: الترتيب والنصوص من السكريبت 【2】. free: من similarFree (STEP بلا similarFree اليوم ← بلا سطر).
  const EXAMS = [
    { k: 'tarbawi', href: 'tarbawi/', name: 'الاختبار التربوي العام', ic: ['التربوي', 'العام'], c: '#1E5A86', tint: '#E6F1FA',
      who: 'للمعلمين والمعلمات: اختبار الرخصة المهنية، الجزء التربوي.', line: 'مبنية على المعايير المهنية المعلنة وأوزانها.',
      past: '+600', st: [['16', 'درساً'], ['+1,500', 'سؤال'], ['3', 'محاكيات']], btn: 'ابدأ مذاكرة التربوي', free: 20,
      price: [['كامل الأسئلة', '89 ريال'], ['أهم 120 سؤالاً', '59 ريال']],
      get: [['دروس تفاعلية', ' بالخرائط والشروح على كل معيار'], ['88 سؤالاً', ' في كل اختبار محاكٍ، تعطيك مستواك المتوقع'], ['ملزمة أهم 120 سؤالاً', ' (PDF) مرتبة على المعايير'], ['ملزمتا الشرح', ' المختصرة والمفصّلة، تُقرأ في الموقع'], ['بطاقات المصطلحات', ' وخلاصة الفخاخ (60 فخاً)'], ['مراجعة أخطائك', ' تلقائياً حتى تتقنها']] },
    { k: 'english2', href: 'english2/', name: 'الاختبار التخصصي English 2', nameAr: 'الاختبار التخصصي', nameEn: 'English 2', ic: ['التخصصي', 'EN2'], c: '#16707A', tint: '#E3F4F5',
      who: 'لمعلمي ومعلمات اللغة الإنجليزية: اختبار الرخصة المهنية، الجزء التخصصي.', line: 'مبنية على المعايير المهنية المعلنة وأوزانها.',
      past: '+700', st: [['22', 'درساً'], ['+1,100', 'سؤال'], ['3', 'محاكيات']], btn: 'ابدأ مذاكرة English 2', free: 20,
      price: [['كامل الأسئلة', '89 ريال'], ['أهم 120 سؤالاً', '59 ريال']],
      get: [['دروس', ' بالخرائط والشروح على كل معيار'], ['829 مصطلحاً', ' بالإنجليزي كما ترد في الاختبار، و 83 فيديو شرح'], ['88 سؤالاً', ' في كل اختبار محاكٍ، تعطيك مستواك المتوقع'], ['ملزمة أهم 120 سؤالاً', ' (PDF) مرتبة على المعايير'], ['ملزمتا الشرح', ' المختصرة والمفصّلة، تُقرأ في الموقع'], ['بطاقات المصطلحات', ' وخلاصة الفخاخ (60 فخاً)']] },
    { k: 'qudurat', href: 'qudurat/', name: 'قدرات الجامعيين', ic: ['قدرات', 'الجامعيين'], c: '#2B4FA8', tint: '#E8EEFB',
      who: 'للجامعيين: اللفظي والكمي والناقد والمنطق والأشكال.', line: 'مبنية على أقسام اختبار القدرات وأسلوب أسئلتها.',
      past: '+600', st: [['51', 'درساً'], ['+2,000', 'سؤال'], ['3', 'محاكيات']], btn: 'ابدأ مذاكرة القدرات', free: 20,
      price: [['قدرات الجامعيين كاملاً', '89 ريال'], ['أهم 120 سؤالاً', '59 ريال']],
      get: [['دروس تفاعلية', ' بالشرائح والشروح في اللفظي والكمي والناقد والمنطق والأشكال'], ['120 سؤالاً', ' في كل اختبار محاكٍ، في ساعتين وخمس دقائق'], ['المعادلات بالعربي', ' من اليمين، مثل كتيّب الاختبار'], ['القطعة فوق السؤال', '، والرسوم والجداول كما في الاختبار'], ['اختبار تشخيصي', ' يبيّن لك أين تحتاج المذاكرة'], ['مراجعة أخطائك', ' تلقائياً حتى تتقنها']] },
    { k: 'step', href: 'step2/', name: 'STEP', badge: 'الجديد', ic: ['اختبار', 'STEP'], c: '#0F6FB0', tint: '#E2F1FB',
      who: 'لكل من يحتاج درجة STEP في الإنجليزي.', line: 'القراءة والقواعد والاستماع والكتابة.',
      past: '+1,100', st: [['12', 'درساً'], ['1,172', 'سؤالاً'], ['3', 'محاكيات']], btn: 'ابدأ مذاكرة STEP', free: null,
      price: [['دليل STEP كاملاً', '29 ريال']],
      get: [['القواعد', ' بشرح عربي وأمثلة وفيديو'], ['723 سؤالاً في القراءة', ' على 208 قطع مترجمة'], ['60 سؤالاً في الاستماع', ' على 26 مقطعاً بأصواتها'], ['محاكيات', ' بنسب الاختبار الحقيقي'], ['34 فيديو شرح', ' للقواعد والمهارات'], ['خلاصة الأخطاء الشائعة', ': 60 خطأً بتصحيحه وسببه']] },
    { k: 'gat', href: 'gat/', name: 'القدرات العامة', ic: ['القدرات', 'العامة'], c: '#2A6FB5', tint: '#E5F0FA',
      who: 'لطلاب وطالبات الثانوي: الكمي واللفظي.', line: '',
      past: '+700', pastText: 'سؤال من الخمس سنوات الماضية', st: [['41', 'درساً'], ['+900', 'سؤال تدريبي'], ['4', 'محاكيات']], btn: 'ابدأ مذاكرة القدرات العامة', free: 20,
      promo: 'خصم الطالب 35% داخل صفحة الاشتراك',
      price: [['كامل الأسئلة', '89 ريال'], ['أهم 120 سؤالاً', '59 ريال']],
      get: [['+700 سؤال', ' من الخمس سنوات الماضية (مع التصحيح)'], ['41 درساً', ' في الكمي واللفظي (كاملة)'], ['+900 سؤال تدريبي', ' بعد كل قسم'], ['4 اختبارات محاكية', ' للاختبار الحقيقي (مع التصحيح)']] },
    /* القدرة المعرفية (إطلاق 2026-11-21، يوسف عبر مدير قياس): نفس شكل بطاقة العامة. الأرقام هنا احتياط، والبناء يكتبها من cog_data.js (QH.ex.cog) */
    { k: 'cog', href: 'cog/', name: 'القدرة المعرفية', ic: ['القدرة', 'المعرفية'], c: '#4A5BA8', tint: '#ECEEF9',
      who: 'أقسامه: اللفظي والكمي والاستدلال والمكاني.', line: '',
      past: '+650', pastText: 'سؤالاً من اختبارات الأعوام الماضية', st: [['34', 'درساً'], ['100', 'سؤال في كل محاكٍ'], ['4', 'محاكيات']], btn: 'ابدأ مذاكرة القدرة المعرفية', free: 20,
      price: [['كامل الأسئلة', '89 ريال'], ['أهم 120 سؤالاً', '59 ريال']],
      get: [['+650 سؤالاً', ' من اختبارات الأعوام الماضية (بالتصحيح)'], ['34 درساً', ' في القدرات الأربع (كاملة)'], ['170 سؤالاً', ' في اختبارات الدروس'], ['4 اختبارات محاكية', ' بتوزيع الاختبار الرسمي، في ساعتين وخمس دقائق']] }
  ];
  // أرقام البناء الحقيقية (build.py → home6) تغلب القيم المكتوبة هنا، وبطاقة القدرات العامة لا تظهر قبل إطلاقها
  if (QH.ex) EXAMS.forEach(x => { const o = QH.ex[x.k]; if (!o) return; if (o.past) x.past = o.past; if (o.q) x.st[1][0] = o.q; if (o.lessons) x.st[0][0] = String(o.lessons); if (o.mocks) x.st[2][0] = String(o.mocks); if (o.get) x.get = o.get; });
  if (QH.gat === false) { const gi = EXAMS.findIndex(x => x.k === 'gat'); if (gi > -1) EXAMS.splice(gi, 1); }
  if (!QH.cog) { const ci = EXAMS.findIndex(x => x.k === 'cog'); if (ci > -1) EXAMS.splice(ci, 1); }
  const SOON = QH.cog ? '' : 'القدرة المعرفية · قريباً';
  const EX_HEAD = { h: 'اختر اختبارك', p: 'لكل اختبار دروسه وأسئلته واختباراته المحاكية.' };

  // 【3】 سؤال واحد لكل اختبار: أول سؤال من العشرين المجانية في الموقع الحي (قُرئ 2026-11-19، نص البنك كما هو)
  const QUIZ = {
    h: 'جرّب سؤالاً من الاختبارات الماضية', p: 'اختر اختبارك، وجاوب، وشف التصحيح التفاعلي وسببه.',
    items: [
      { k: 'gat', tab: 'القدرات العامة', tag: 'اللفظي · التناظر اللفظي',
        q: 'شاعر : قصيدة', o: ['قارئ : مكتبة', 'نحات : تمثال', 'ناقد : نص', 'مشاهد : فيلم'], a: 1,
        why: [null, 'الشاعر يصنع القصيدة، والنحات يصنع التمثال. بقية الخيارات علاقتها استخدام أو مكان أو تحليل، وليست صناعة.', null, null] },
      { k: 'tarbawi', tab: 'التربوي', tag: 'القيم والمسؤوليات المهنية · المعيار 3',
        q: 'أراد معلم مخاطبة مدير المدرسة بطلب تجهيز معمل العلوم. الصيغة الأنسب:',
        o: ['حديث شفهي في الممر', 'رسالة ودية', 'رسالة نصية عبر الجوال', 'خطاب إداري رسمي'], a: 3,
        why: ['الحديث العابر في الممر لا يترك أثراً مكتوباً، وطلب تجهيز المعمل يحتاج توثيقاً رسمياً حتى تتابعه الإدارة وترد عليه.',
          'الرسالة الودية تناسب التواصل الشخصي بين الزملاء، أما طلب تجهيز المعمل فطلب رسمي يحتاج خطاباً يُوثق وتتابعه الإدارة.',
          'الرسالة النصية وسيلة سريعة للتنبيه غير الرسمي، ولا تحمل عناصر الخطاب الإداري التي تجعل طلب تجهيز المعمل موثقاً قابلاً للمتابعة.',
          'مخاطبة الإدارة والجهات الرسمية تكون بخطاب إداري بعناصره الرسمية ليُوثق ويُتابع.'] },
      { k: 'english2', tab: 'English 2', tag: 'المعرفة النظرية وتطبيقها · المعيار 8', en: true,
        q: "Chomsky's generative grammar belongs to which view of language acquisition?",
        o: ['Behaviorism', 'Connectionism', 'Social constructivism', 'Innatism (nativism)'], a: 3,
        why: [null, null, null, "Chomsky's generative grammar rests on an innate language capacity, which is the innatist (nativist) view.\nالقواعد التوليدية (generative grammar) عند تشومسكي تقوم على قدرة لغوية فطرية يولد بها الإنسان، وهذا هو الاتجاه الفطري (nativism)."] },
      { k: 'qudurat', tab: 'قدرات الجامعيين', tag: 'اللفظي',
        q: 'جنين : ولادة', o: ['عصا : ضرب', 'مسدس : قتل', 'سهم : رمي', 'رجم : حجر'], a: 2,
        why: [null, null, 'الجنين يخرج من مستقره بالولادة، والسهم يخرج من مستقره بالرمي: شيء ثم الفعل الذي يُخرجه.', null] },
      { k: 'step', tab: 'STEP', tag: 'القواعد والتحليل الكتابي', en: true,
        q: 'I ...... biryani for the first time when I was in India last month.', o: ['have eaten', 'had eaten', 'eat', 'ate'], a: 3,
        why: [null, null, null, 'last month = وقت ماضي محدد ← الماضي البسيط: ate.'] }
    ]
  };
  { const ord = ['gat', 'qudurat', 'tarbawi', 'english2', 'step']; QUIZ.items.sort((x, y) => ord.indexOf(x.k) - ord.indexOf(y.k)); }
  if (QH.gat === false) QUIZ.items = QUIZ.items.filter(x => x.k !== 'gat');

  const STEPS = { h: 'الطريقة سهلة', p: 'أربع خطوات، وكل خطوة تعطيك شيء تحتاجه يوم الاختبار', items: [
    ['ذاكر الدرس القصير', 'تمسك الفكرة وفخاخها في شاشة وحدة، بدل ما تقرأ صفحات.', 'scr-lesson'],
    ['حلّ أسئلة من الاختبارات الماضية', 'تعرف وش ينسأل وكيف ينسأل. والتصحيح يطلع لك فوراً مع سببه، وإذا أخطأت يوضح لك وين الفخ.', 'scr-ipad'],
    ['ادخل اختباراً محاكياً', 'بطول الاختبار الحقيقي، فتتعوّد على الوقت، وتشوف نتيجتك وأخطاءك بعده.', 'scr-iphone-live'],
    ['أخطاؤك ترجع لك', 'كل سؤال غلطت فيه يرجع لك في مراجعة الأخطاء، فتذاكر اللي تحتاجه بس.', 'scr-ipad']] };
  const DEVICES = { h: 'ادخل بأي جهاز معك', p: 'الدروس والأسئلة تنفتح من المتصفح على الجوال والآيباد واللابتوب، بلا تطبيق تحمّله.' };
  const TRUST = {
    h: 'محتوى يُراجع ويتحدّث', by: 'إعداد الأستاذ يوسف الشمراني',
    facts: ['كل مفتاح إجابة يُراجع من المراجع العلمية قبل ما يدخل الأسئلة.', 'نتابع كل جديد عن الاختبارات ونرتّبه، فتوصلك التحديثات أول بأول.', 'ضمان 3 أيام بعد التفعيل، والمبلغ يرجع كاملاً حتى لو استخدمت المحتوى.'],
    seller: 'بيانات البائع ←',
    rvLine: 'تعليقات مشتركين كما كتبوها.', counterLabel: 'زائر للمنصة',
    feat: { text: 'عمل جبار وجميل شكرًا لجهودك ولهذا العمل الإحترافي والمميز أسئلة محاكية وتغذية راجعة جميلة', name: 'أبو فيصل', exam: 'التربوي' },
    list: [['الموقع جدا جميل ومرتب ويحتوي على معلومات كبيره ومرتبه ومنسقه بشكل بسيط وسهل بارك الله في جهودكم', 'Rehab', 'التربوي'],
      ['ما شاء الله تصميم شامل ومتنوع وسهل الاستخدام', 'Abdullah Alzahrani', 'English 2'],
      ['والله أستفدت كثير ، فيه أشياء أول مرة أعرفها', 'عائشه البلوي', 'التربوي'],
      ['روعة ماقصرت ، منظم', 'مجتهد', 'English 2'],
      ['مجهود جميل وجبار', 'عريشي', 'التربوي'],
      ['والله كفو يشيخ', 'ابو احمد', 'English 2']]
  };
  const PRICES = {
    h: 'خياران لكل اختبار، والسعر نهائي', p: 'كل الأسعار بالريال السعودي، وهي المبلغ النهائي بلا رسوم إضافية.',
    rows: [['أهم 120 سؤالاً', '59 ريال', 'مختارة من الاختبارات الماضية، مع الدروس والاختبارات المحاكية.', ''],
      ['كامل الأسئلة', '89 ريال', 'كل أسئلة الاختبار في الموقع، مع الدروس والاختبارات المحاكية.', 'الأكثر شمولاً'],
      ['الترقية', '30 ريال', 'بديت بأهم 120 وتبي الكامل؟ تدفع الفرق فقط.', '']],
    step: 'STEP: دليل كامل بسعر واحد، 29 ريال.',
    pay: PAY_ONLINE ? 'الدفع: مدى، آبل باي، فيزا وماستركارد، أو التحويل.' : 'الدفع بالتحويل، ويوصلك الكود بعد مراجعة الإيصال.',
    guarantee: 'ضمان 3 أيام: فعّلت الكود وما ناسبك المحتوى؟ يرجع لك المبلغ كاملاً، حتى لو استخدمته. ولا نسألك عن السبب.',
    refund: 'سياسة الاسترجاع', more: 'تفاصيل كل منتج في صفحة الأسعار ←'
  };
  const FAQ = { h: 'الأسئلة الشائعة', items: [
    ['وش الفرق بين أهم 120 وكامل الأسئلة؟', 'الاثنان فيهم الدروس والاختبارات المحاكية. الفرق في عدد الأسئلة: أهم 120 سؤالاً مختارة من الاختبارات الماضية، والكامل فيه كل أسئلة الاختبار في الموقع.'],
    ['أقدر أشوف المحتوى قبل ما أدفع؟', 'نعم، فيه دروس مفتوحة، وفي كل اختبار 20 سؤالاً مجاناً مع التصحيح التفاعلي.'],
    ['كيف أدفع، ومتى يوصلني الاشتراك؟', 'تضغط «اشترك» على الخيار اللي يناسبك. في التحويل يوصلك الكود. تكتبه مرة وحدة، ويبقى محفوظاً في جهازك.'],
    ['ضاع الكود أو ما عرفت أسجّل الدخول؟', 'احنا راح نهتم فيك ونعالج المشكلة مباشرة. نرشدك خطوة بخطوة حتى نسهّل عليك، ونعطيك كوداً بديلاً إذا ضاع اللي معك.'],
    ['كم مدة الاشتراك؟', 'تبدأ المدة من أول دخول بالكود، ويظهر لك تاريخ انتهائها قبل الدفع. التفاصيل في <a href="' + BASE + 'terms/">شروط الاستخدام</a>.'],
    ['لو ما ناسبني؟', 'عندك 7 أيام من الشراء ترجّع فيها المبلغ كاملاً إذا ما فعّلت الكود، وضمان 3 أيام بعد التفعيل حتى لو استخدمت المحتوى. <a href="' + BASE + 'refund/">سياسة الاسترجاع</a>'],
    ['هل الاشتراك يضمن لي النجاح؟', 'لا. يرتّب مذاكرتك ويوريك مستواك وأخطاءك، والنتيجة من مذاكرتك أنت.']] };
  // ملاحظة: جواب السؤال 3 يقول «في كل اختبار 20» والسكريبت يستثني اختباراً بلا similarFree من الجملة؛ STEP اليوم بلا similarFree، فالبناء الحقيقي يصيغها لكل اختبار برقمه.
  const CLOSE = { h: 'اختر اختبارك وابدأ المذاكرة', cta: 'اختر اختبارك' };
  const FOOT = [['الأسعار والمنتجات', 'pricing/'], ['سياسة الاسترجاع', 'refund/'], ['شروط الاستخدام', 'terms/'], ['سياسة الخصوصية', 'privacy/'], ['سياسة التعليقات', 'comments-policy/'], ['حقوق الملكية والإبلاغ عن انتهاك', 'copyright/']];
  const EMAIL = 'contact@yousefalshamrani.com';

  // ── الأجهزة: إطارات واقعية بشاشات مثقوبة، والشاشات لقطات حقيقية من المنتج
  const FR = { phone: { w: 1520, h: 2688, l: 12.75, t: 4.8, wd: 74.5, ht: 90.6, rx: 9.29, ry: 4.32 },
    tablet: { w: 1744, h: 2336, l: 8.314, t: 5.908, wd: 83.314, ht: 87.8, rx: 2.62, ry: 1.85 },
    laptop: { w: 2688, h: 1520, l: 11.756, t: 6.513, wd: 76.563, ht: 79.868, rx: 0.49, ry: 0.82 } };
  const SCR = { phone: ['scr-iphone-live.webp', 'scr-iphone-dark.webp'], tablet: ['scr-ipad.webp', 'scr-ipad-dark.webp'], laptop: ['scr-lesson.webp', 'scr-lesson-dark.webp'] };
  function device(kind, cls) {
    const hero = /\bph\b/.test(cls || ''), f = FR[kind], s = hero ? SCR[kind].map(x => x.replace('.webp', '-h.webp')) : SCR[kind], lazy = hero ? ' fetchpriority="low"' : ' loading="lazy"', fr = hero ? 'frame-phone-h.webp' : `frame-${kind}.webp`;   // جوال البطل بنسخ صغيرة (عرضه ≤132px)   // جوال البطل فوراً، والباقي عند الاقتراب
    return `<div class="dv dv-${kind} ${cls || ''}" style="aspect-ratio:${f.w}/${f.h}"><div class="sc" style="left:${f.l}%;top:${f.t}%;width:${f.wd}%;height:${f.ht}%;border-radius:${f.rx}% / ${f.ry}%"><img class="lt" src="home/img/${s[0]}" alt="" decoding="async"${lazy}><img class="dk" src="home/img/${s[1]}" alt="" decoding="async" loading="lazy"></div><img class="fr" src="home/img/${fr}" alt="" decoding="async"${lazy}></div>`;
  }
  const person = (cls) => `<img class="q-person ${cls || ''}" src="home/img/person-ipad-560.webp" srcset="home/img/person-ipad-560.webp 560w, home/img/person-ipad-640.webp 640w, home/img/person-ipad-820.webp 820w, home/img/person-ipad.webp 1129w" sizes="(max-width:860px) 355px, 46vw" alt="معلم يذاكر من الآيباد" width="1129" height="1400" fetchpriority="high">`;
  const ICON_BOOK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2zm0 0a2 2 0 0 1 2-2h13"/></svg>';
  const ICON_THEME = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>';
  const STAR = '★';

  // ── مولّدات HTML: كل قسم بأسماء صفوف ثابتة (q-*) والاتجاه يلبسها بـCSS خاصته. الوسيط opts للاختلافات البسيطة.
  const html = {
    nav(o = {}) {
      return `<header class="q-nav"><div class="q-wrap q-nav__in">
        <a class="q-logo" href="#top" aria-label="الرئيسية">${ICON_BOOK}</a>
        <nav class="q-nav__links" aria-label="الأقسام">${NAV.map(([t, h]) => `<a href="${h}">${E(t)}</a>`).join('')}</nav>
        <span class="q-nav__end"><a class="q-nav__back" href="#ex">عندك اشتراك؟ افتح اختبارك</a>
        <button class="q-theme" type="button" data-theme-toggle aria-label="الوضع الليلي">${ICON_THEME}</button>
        <a class="q-btn q-btn--pri q-nav__cta" href="#ex">${E(HERO.cta)}</a></span></div></header>`;
    },
    eyebrow: () => `<p class="q-eyebrow">${E(HERO.eyebrow)}</p>`,
    h1: (o = {}) => o.split ? `<h1 class="q-h1"><span class="q-h1__a">${E(HERO.h1Parts[0])}</span> <span class="q-h1__b">${E(HERO.h1Parts[1])}</span></h1>` : `<h1 class="q-h1">${E(HERO.h1)}</h1>`,
    sub: () => `<p class="q-sub">${E(HERO.sub)}</p>`,
    ctas: () => `<div class="q-ctas"><a class="q-btn q-btn--pri" href="#ex">${E(HERO.cta)}</a><a class="q-link" href="#try">${E(HERO.alt)}</a></div>`,
    guarantee: () => `<p class="q-guar">${E(HERO.guarantee)}</p>`,
    rating: () => `<p class="q-rating"><span class="q-r1"><span class="q-stars" aria-hidden="true">${STAR}</span> <b>${HERO.rating.score}</b></span> <small>من ${HERO.rating.count} تقييماً</small></p>`,
    heroText(o = {}) { return `${this.eyebrow()}${this.h1(o)}${this.sub()}${this.ctas()}${this.guarantee()}${this.rating()}` },
    card(x, i) {
      const icon = `<span class="q-ic" style="--c:${x.c}"><small>${E(x.ic[0])}</small><b>${E(x.ic[1])}</b></span>`;
      const name = x.nameEn ? `${E(x.nameAr)} <span dir="ltr">${E(x.nameEn)}</span>` : E(x.name);
      const price = x.price.map(([a, b]) => `${E(a)}: <b>${E(b)}</b>`).join(' · ');
      return `<article class="q-card lc" data-k="${({ tarbawi: 't', english2: 'e', qudurat: 'u', step: 's2', gat: 'g' })[x.k] || x.k}" style="--c:${x.c};--tint:${x.tint};--i:${i}">
        <div class="q-card__head">${icon}<div><h3 class="q-card__name">${name}${x.badge ? ` <span class="q-badge">${E(x.badge)}</span>` : ''}</h3><p class="q-card__who">${E(x.who)}</p></div></div>
        ${x.line ? `<p class="q-card__line">${E(x.line)}</p>` : ''}
        <p class="q-card__past"><b>${x.past}</b> ${x.pastText || 'سؤال من الاختبارات الماضية'}</p>
        <div class="q-card__stats">${x.st.map(([a, b]) => `<div><b>${a}</b><span>${E(b)}</span></div>`).join('')}</div>
        <a class="q-btn q-card__go go" href="${BASE}${x.href}#questions">${E(x.btn)}</a>
        ${x.free ? `<a class="q-card__free" href="${BASE}${x.href}#bank">جرّب ${x.free} سؤالاً مجاناً مع التصحيح التفاعلي ←</a>` : ''}
        ${x.promo ? `<p class="q-card__promo">${E(x.promo)}</p>` : ''}<a class="q-card__price" href="${BASE}${x.href}" data-paywall>${price} ←</a>
        <details class="q-card__get"><summary>ماذا ستجد عند بدء المذاكرة <span aria-hidden="true">+</span></summary><ul>${x.get.map(([a, b]) => `<li><b>${E(a)}</b>${E(b)}</li>`).join('')}</ul></details>
        <p class="q-card__upd">${E(UPD)}</p></article>`;
    },
    cards() { return `<div class="q-cards">${EXAMS.map((x, i) => this.card(x, i)).join('')}</div>${SOON ? `<p class="q-soon">${E(SOON)}</p>` : ''}` },
    exHead: () => `<h2 class="q-h2">${E(EX_HEAD.h)}</h2><p class="q-lead">${E(EX_HEAD.p)}</p>`,
    quiz() {
      const tabs = QUIZ.items.map((it, i) => `<button class="q-tab" type="button" role="tab" aria-selected="${i === 0}" data-i="${i}">${E(it.tab)}</button>`).join('');
      const panes = QUIZ.items.map((it, i) => {
        const ex = EXAMS.find(e => e.k === it.k);
        const more = ex.free ? `<a class="q-btn q-btn--pri q-quiz__more" href="${BASE}${ex.href}#bank">كمّل ${ex.free} سؤالاً مجاناً مع التصحيح التفاعلي ←</a>` : `<a class="q-btn q-btn--pri q-quiz__more" href="${BASE}${ex.href}#questions">${E(ex.btn)}</a>`;
        const L = it.en ? ['A', 'B', 'C', 'D'] : ['أ', 'ب', 'ج', 'د'];
        return `<div class="q-quiz__pane" role="tabpanel" data-i="${i}" ${i ? 'hidden' : ''} data-a="${it.a}">
          <p class="q-quiz__tag">${E(it.tag)} · من الاختبارات الماضية</p>
          <p class="q-quiz__q" ${it.en ? 'dir="ltr"' : ''}>${E(it.q)}</p>
          <div class="q-quiz__opts" ${it.en ? 'dir="ltr"' : ''}>${it.o.map((o, j) => `<button class="q-opt" type="button" data-j="${j}"><span class="q-opt__l">${L[j]}</span><span class="q-opt__t">${E(o)}</span></button>`).join('')}</div>
          <div class="q-quiz__fb" hidden aria-live="polite"></div><div class="q-quiz__next" hidden>${more}</div></div>`;
      }).join('');
      return `<div class="q-quiz"><div class="q-tabs" role="tablist">${tabs}</div><div class="q-quiz__box">${panes}</div></div>`;
    },
    quizHead: () => `<h2 class="q-h2">${E(QUIZ.h).replace('(مماثلة)', '<small class="q-sim">(مماثلة)</small>')}</h2><p class="q-lead">${E(QUIZ.p)}</p>`,
    steps(o = {}) {
      return `<ol class="q-steps">${STEPS.items.map(([t, d, s], i) => `<li class="q-step" style="--i:${i}"><span class="q-step__n">${i + 1}</span><div class="q-step__body"><h3>${E(t).replace('(مماثلة)', '<small>(مماثلة)</small>')}</h3><p>${E(d)}</p></div>${o.shots ? `<span class="q-step__shot"><img src="home/img/${s}.webp" alt="" loading="lazy" decoding="async"></span>` : ''}</li>`).join('')}</ol>`;
    },
    stepsHead: () => `<h2 class="q-h2">${E(STEPS.h)}</h2><p class="q-lead">${E(STEPS.p)}</p>`,
    devicesHead: () => `<h2 class="q-h2">${E(DEVICES.h)}</h2><p class="q-lead">${E(DEVICES.p)}</p>`,
    devices: (cls) => `<div class="q-devices ${cls || ''}">${device('tablet', 'q-dv-t')}${device('laptop', 'q-dv-l')}${device('phone', 'q-dv-p')}</div>`,
    trustHead: () => `<h2 class="q-h2">${E(TRUST.h)}</h2><p class="q-by">${E(TRUST.by)}</p>`,
    facts: () => `<ul class="q-facts">${TRUST.facts.map(f => `<li>${E(f)}</li>`).join('')}</ul>`,
    counter: () => `<div class="q-counter"><span class="vn">24,598</span><small>${E(TRUST.counterLabel)} <i class="q-live" aria-hidden="true"></i></small></div>`,
    featured: () => `<figure class="q-feat"><blockquote>«${E(TRUST.feat.text)}»</blockquote><figcaption>${E(TRUST.feat.name)} · مشترك في ${E(TRUST.feat.exam)}</figcaption></figure>`,
    rvLine: () => `<p class="q-lead q-rvline">${E(TRUST.rvLine)}</p>`,
    reviews: () => `<div class="q-rail" aria-roledescription="شريط تعليقات">${TRUST.list.map(([t, n, e]) => `<article class="q-rv"><p class="q-rv__stars" aria-label="5 نجوم">${STAR.repeat(5)}</p><p class="q-rv__t">${E(t)}</p><p class="q-rv__who"><span class="q-rv__av">${E(n[0])}</span><b>${E(n)}</b> · ${E(e)}</p></article>`).join('')}</div><div class="q-dots"></div>`,
    pricesHead: () => `<h2 class="q-h2">${E(PRICES.h)}</h2><p class="q-lead">${E(PRICES.p)}</p>`,
    prices: () => `<div class="q-prices">${PRICES.rows.map(([n, p, d, b]) => `<div class="q-price${b ? ' q-price--hi' : ''}">${b ? `<span class="q-price__badge">${E(b)}</span>` : ''}<p class="q-price__amt">${E(p)}</p><h3 class="q-price__name">${E(n)}</h3><p class="q-price__d">${E(d).replace('(مماثلة)', '<small>(مماثلة)</small>')}</p></div>`).join('')}</div>
      <p class="q-price__step">${E(PRICES.step)}</p><p class="q-price__pay">${E(PRICES.pay)}</p>
      <div class="q-guarbox"><p>${E(PRICES.guarantee)}</p><a href="${BASE}refund/">${E(PRICES.refund)}</a></div>
      <a class="q-price__more" href="${BASE}pricing/">${E(PRICES.more)}</a>`,
    faqHead: () => `<h2 class="q-h2">${E(FAQ.h)}</h2>`,
    faq: () => `<div class="q-faq">${FAQ.items.map(([qq, a]) => `<details class="q-faq__i"><summary>${E(qq)}<span class="q-faq__x" aria-hidden="true"></span></summary><div class="q-faq__a"><p>${a.replace('(مماثلة)', '<small>(مماثلة)</small>')}</p></div></details>`).join('')}</div>`,
    close: () => `<h2 class="q-h2 q-close__h">${E(CLOSE.h)}</h2><a class="q-btn q-btn--pri" href="#ex">${E(CLOSE.cta)}</a>`,
    footer: () => `<footer class="q-foot"><div class="q-wrap q-foot__in"><nav aria-label="روابط قانونية">${FOOT.map(([t, h]) => `<a href="${BASE}${h}">${E(t)}</a>`).join('')}</nav><a class="q-foot__mail" href="mailto:${EMAIL}">${EMAIL}</a></div></footer>`
  };

  // ── عدّاد الزوار الحي: زوار كل اختبار + مشتركو القناة. آخر قراءة ناجحة 24,598 (2026-11-17)
  const AB = 'https://abacus.jasoncameron.dev/get/yousefalshamrani-com/', VK = { tarbawi: 354, english2: 416, step: 0, step2: 0 }, CH = 359;
  let shown = 24598, seen = false, vns = [];
  const fmt = n => Math.round(n).toLocaleString('en-US');
  function countTo(to, from, ms) {
    if (shot || reduced) { vns.forEach(e => e.textContent = fmt(to)); shown = to; return }
    const t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3), v = from + (to - from) * e; vns.forEach(x => x.textContent = fmt(v)); if (k < 1) requestAnimationFrame(f); else shown = to })(t0);
  }
  function pull() {
    return Promise.all(Object.keys(VK).map(k => fetch(AB + k).then(r => r.json()).then(d => (typeof d.value === 'number' ? d.value : 0) + VK[k]).catch(() => null)))
      .then(a => { if (a.some(v => v === null)) return; const tot = a.reduce((x, y) => x + y, 0) + CH; if (tot > shown) { if (seen) countTo(tot, shown, 1600); else { shown = tot; vns.forEach(e => e.textContent = fmt(tot)) } } }).catch(() => { });
  }

  // ── الحركة: كل شيء transform/opacity فقط (مركّب على كرت الشاشة = 60 إطاراً)
  //  [data-p]  → يأخذ --p من 0 إلى 1 حسب مروره في الشاشة (قصير: يكتمل قبل ما يوصل منتصف الشاشة) — لا تثبيت طويل
  //  [data-in] → يأخذ صنف .in مرة واحدة أول ما يظهر (للدخول المتتابع داخل قسم، لا لكل قسم)
  let els = [], ticking = false;
  function tick() {
    ticking = false; const vh = innerHeight;
    for (const el of els) {
      if (shot) { el.style.setProperty('--p', el.dataset.shotp || '1'); continue }
      const r = el.getBoundingClientRect(), span = el.dataset.span ? +el.dataset.span : .75;
      let p = (vh - r.top) / (vh * span); p = p < 0 ? 0 : p > 1 ? 1 : p;
      const v = Math.round(p * 1000) / 1000; if (el._v !== v) { el._v = v; el.style.setProperty('--p', v) }
    }
  }
  function initQuiz(root) {
    root.querySelectorAll('.q-quiz').forEach(qz => {
      const tabs = [...qz.querySelectorAll('.q-tab')], panes = [...qz.querySelectorAll('.q-quiz__pane')];
      tabs.forEach(t => t.addEventListener('click', () => { const i = +t.dataset.i; tabs.forEach(x => x.setAttribute('aria-selected', x === t)); panes.forEach(p => p.hidden = +p.dataset.i !== i) }));
      panes.forEach(p => {
        const it = QUIZ.items[+p.dataset.i], fb = p.querySelector('.q-quiz__fb'), nx = p.querySelector('.q-quiz__next');
        p.querySelectorAll('.q-opt').forEach(b => b.addEventListener('click', () => {
          if (p.classList.contains('done')) return; p.classList.add('done');
          const j = +b.dataset.j, ok = j === it.a, L = it.en ? ['A', 'B', 'C', 'D'] : ['أ', 'ب', 'ج', 'د'];
          p.querySelectorAll('.q-opt').forEach((x, k) => { x.classList.toggle('is-right', k === it.a); x.classList.toggle('is-wrong', k === j && !ok); x.disabled = true });
          const wrongWhy = !ok && it.why[j] ? `<p class="q-fb__wrong"><b>اخترت ${L[j]}:</b> ${E(it.why[j])}</p>` : '';
          fb.innerHTML = `<p class="q-fb__head ${ok ? 'ok' : 'no'}">${ok ? 'إجابة صحيحة' : 'إجابة خاطئة'}</p>${wrongWhy}<p class="q-fb__right"><b>الإجابة الصحيحة: ${L[it.a]}</b><br>${E(it.why[it.a]).replace(/\n/g, '<br>')}</p>`;
          fb.hidden = false; nx.hidden = false;
        }));
      });
    });
  }
  function initRail(root) {
    root.querySelectorAll('.q-rail').forEach(rail => {
      const cs = [...rail.children], dots = rail.nextElementSibling; if (!cs.length) return; let cur = 0, timer;
      if (dots && dots.classList.contains('q-dots')) cs.forEach((_, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'تعليق ' + (i + 1)); b.onclick = () => { go(i); loop() }; dots.appendChild(b) });
      function go(i) { cur = (i + cs.length) % cs.length; cs.forEach((c, j) => { let k = j - cur; if (k > cs.length / 2) k -= cs.length; if (k < -cs.length / 2) k += cs.length; c.style.setProperty('--k', k); c.style.setProperty('--ak', Math.abs(k)); c.classList.toggle('on', k === 0) }); if (dots) [...dots.children].forEach((d, j) => d.classList.toggle('on', j === cur)) }
      function loop() { clearInterval(timer); if (!shot && !reduced) timer = setInterval(() => { if (!document.hidden) go(cur + 1) }, 4000) }
      cs.forEach((c, j) => c.addEventListener('click', () => { go(j); loop() })); rail.addEventListener('pointerenter', () => clearInterval(timer)); rail.addEventListener('pointerleave', loop);
      go(cur); loop();
    });
  }
  function init() {
    document.querySelectorAll('[data-device]').forEach(e => { e.outerHTML = device(e.dataset.device, e.className) });
    if (window.QX_PRERENDER) return;   // البناء يرسم الصفحة مسبقاً ثم يحفظها HTML (tools/home6_prerender.mjs)
    document.querySelectorAll('[data-theme-toggle]').forEach(b => b.addEventListener('click', () => { const d = !H.classList.contains('dark'); H.classList.toggle('dark', d); try { localStorage.setItem('qx-theme', d ? 'dark' : 'light') } catch (e) { } }));
    els = [...document.querySelectorAll('[data-p]')];
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(tick) } }, { passive: true }); addEventListener('resize', tick); tick();
    const ins = [...document.querySelectorAll('[data-in]')];
    if (shot || reduced || !('IntersectionObserver' in window)) ins.forEach(e => e.classList.add('in'));
    else { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -12% 0px', threshold: .08 }); ins.forEach(e => io.observe(e)) }
    initQuiz(document); initRail(document);
    addEventListener('scroll', () => document.body.classList.toggle('scrolled', scrollY > 12), { passive: true });
    vns = [...document.querySelectorAll('.vn')]; vns.forEach(e => e.textContent = fmt(shown));
    if (vns.length) {
      const io2 = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting) && !seen) { seen = true; io2.disconnect(); countTo(shown, Math.floor(shown * .96), 2000) } }, { threshold: .4 });
      vns.forEach(e => io2.observe(e)); if (!shot) { pull(); setInterval(() => { if (!document.hidden) pull() }, 90000) }
    }
    const go = () => requestAnimationFrame(() => requestAnimationFrame(() => H.classList.add('ready')));   // الحركة بعد اكتمال التحميل (أكبر عنصر أولاً)
    if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true });
  }
  window.Q = { HERO, EXAMS, QUIZ, STEPS, DEVICES, TRUST, PRICES, FAQ, CLOSE, NAV, UPD, html, device, person, E, shot, reduced, init, refresh() { els = [...document.querySelectorAll('[data-p]')]; tick() } };
})();
