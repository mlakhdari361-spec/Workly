/* =========================================================
   auth-guard.js
   حارس المصادقة — يُستخدم في الصفحات المحمية (index.html وغيرها)
   وفي صفحة تسجيل الدخول (login.html) لمنع دخول المسجّلين إليها.

   يجب تحميله بعد supabase.js مباشرة، وقبل app.js:
   <script src="supabase.js"></script>
   <script src="auth-guard.js"></script>
   <script src="app.js"></script>
   ========================================================= */

(function () {
  const PROTECTED_REDIRECT = 'login.html';
  const LOGGED_IN_REDIRECT  = 'index.html';
  // صفحات "عامة" لا يجب حماية الوصول إليها: تسجيل الدخول وإنشاء الحساب.
  // إن كان المستخدم مسجّلاً دخوله بالفعل، نعيد توجيهه بعيداً عنها.
  const isPublicAuthPage = document.body.dataset.page === 'login'
    || document.body.dataset.page === 'signup'
    || location.pathname.endsWith('login.html')
    || location.pathname.endsWith('signup.html');
  const isLoginPage = isPublicAuthPage;

  // إن لم يكن هناك اتصال حقيقي بـ Supabase (وضع تجريبي محلي)، لا تطبّق أي حماية.
  // هذا يحافظ على عمل الديمو المحلي كما هو دون كسر شيء.
  if (typeof DB === 'undefined' || !DB.isConnected || typeof DB.sbClient === 'undefined' || !DB.sbClient) {
    document.documentElement.style.visibility = 'visible';
    return;
  }

  // العميل الفعلي معرّف في supabase.js باسم DB.sbClient (وليس supabaseClient)
  const supabaseClient = DB.sbClient;

  // أخفِ المحتوى فوراً ريثما يتم التحقق من الجلسة، لمنع "وميض" الصفحة قبل التوجيه
  document.documentElement.style.visibility = 'hidden';

  async function hasValidSession() {
    // الخطوة 1: getSession() تقرأ من localStorage لكنها تتحقق من صلاحية
    // الـ JWT (تاريخ الانتهاء) وتُجدّده تلقائياً عبر refresh token عند الحاجة.
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError || !session) return false;

    // الخطوة 2: getUser() تُجري طلباً فعلياً لخادم Supabase للتحقق من أن
    // التوكن لا يزال معترفاً به فعلياً (وليس مجرد قراءة محلية قديمة).
    // هذا يمنع اعتبار المستخدم مسجلاً بناءً على بيانات قديمة/ملغاة في localStorage.
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) return false;

    return true;
  }

  async function enforce() {
    const valid = await hasValidSession();

    if (!valid && !isLoginPage) {
      // لا جلسة صالحة + صفحة محمية => أعد التوجيه فوراً لتسجيل الدخول
      window.location.replace(PROTECTED_REDIRECT);
      return;
    }

    if (valid && isLoginPage) {
      // جلسة صالحة + صفحة تسجيل الدخول => لا داعي لإظهارها، أعد التوجيه للرئيسية
      window.location.replace(LOGGED_IN_REDIRECT);
      return;
    }

    // الحالة سليمة: اعرض الصفحة
    document.documentElement.style.visibility = 'visible';
  }

  enforce();

  // ابقَ متزامناً مع أي تغيّر لاحق في حالة الجلسة (تسجيل خروج من تبويب آخر،
  // انتهاء صلاحية التوكن، تسجيل دخول جديد...)
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
      if (!isLoginPage) window.location.replace(PROTECTED_REDIRECT);
    } else if (event === 'SIGNED_IN' && isLoginPage) {
      window.location.replace(LOGGED_IN_REDIRECT);
    }
  });
})();
