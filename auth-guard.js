/* =========================================================
   auth-guard.js
   حارس المصادقة — يمنع عرض الصفحات المحمية لغير المسجّلين،
   ويمنع عرض صفحتَي الدخول/التسجيل لمن لديه جلسة صالحة أصلاً.

   يجب تحميله بعد supabase.js مباشرة، وقبل app.js:
     <script src="supabase.js"></script>
     <script src="auth-guard.js"></script>
     <script src="app.js"></script>

   يعتمد على الكائن DB المُصدَّر من supabase.js (DB.isConnected,
   DB.getSession, DB.getCurrentUser, DB.sbClient).
   ========================================================= */

(function () {
  const LOGIN_PAGE   = 'login.html';
  const HOME_PAGE     = 'index.html';
  const AUTH_PAGES    = ['login', 'signup']; // صفحات لا تحتاج جلسة، بل العكس

  const currentPage = document.body ? document.body.dataset.page : null;
  const isAuthPage  = AUTH_PAGES.includes(currentPage);

  // إن لم يكن هناك اتصال حقيقي بـ Supabase (وضع تجريبي محلي بلا مفاتيح
  // صحيحة)، لا تُطبَّق أي حماية — يبقى الديمو المحلي يعمل كما هو.
  if (typeof DB === 'undefined' || !DB.isConnected) {
    document.documentElement.style.visibility = 'visible';
    return;
  }

  // أخفِ الصفحة فوراً ريثما يتم التحقق من الجلسة الفعلية، لمنع "وميض"
  // المحتوى المحمي قبل إعادة التوجيه.
  document.documentElement.style.visibility = 'hidden';

  async function hasValidSession() {
    // الخطوة 1: getSession() — تتحقق من صلاحية الـ JWT محلياً (تاريخ
    // الانتهاء) وتُجدّده تلقائياً عبر refresh token عند الحاجة. لا تكفي
    // وحدها لأنها لا تتصل بالخادم.
    const session = await DB.getSession();
    if (!session) return false;

    // الخطوة 2: getUser() — تُجري طلباً فعلياً لخادم Supabase Auth
    // للتأكد أن المستخدم/التوكن لا يزالان معترفاً بهما فعلياً (وليس
    // مجرد قراءة قديمة من localStorage قد تكون منتهية أو ملغاة يدوياً
    // من لوحة Supabase).
    const user = await DB.getCurrentUser();
    if (!user) return false;

    return true;
  }

  async function enforce() {
    let valid = false;
    try {
      valid = await hasValidSession();
    } catch (e) {
      // أي خطأ أثناء التحقق (شبكة، توكن تالف...) يُعامل كـ "غير مسجّل"
      valid = false;
    }

    if (!valid && !isAuthPage) {
      // لا جلسة صالحة + صفحة محمية => التوجيه الفوري لتسجيل الدخول
      window.location.replace(LOGIN_PAGE);
      return;
    }

    if (valid && isAuthPage) {
      // جلسة صالحة + صفحة دخول/تسجيل => لا داعي لعرضها
      window.location.replace(HOME_PAGE);
      return;
    }

    // الحالة سليمة: اعرض الصفحة
    document.documentElement.style.visibility = 'visible';
  }

  enforce();

  // ابقَ متزامناً مع أي تغيّر لاحق في حالة الجلسة: تسجيل خروج من تبويب
  // آخر، انتهاء صلاحية التوكن أثناء التصفح، تسجيل دخول جديد...
  if (DB.sbClient) {
    DB.sbClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        if (!isAuthPage) window.location.replace(LOGIN_PAGE);
      } else if (event === 'SIGNED_IN' && isAuthPage) {
        window.location.replace(HOME_PAGE);
      }
    });
  }
})();
