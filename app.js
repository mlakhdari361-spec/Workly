/* =========================================================
   WorldHub — app.js
   بيانات تجريبية + منطق الواجهة (بدون خادم — localStorage)
   ========================================================= */
 
const WH = (() => {
 
  const ICONS = {
    home:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></svg>`,
    reels:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 3v18M16 3v18M3 8h5M3 16h5M16 8h5M16 16h5"/></svg>`,
    messages:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    bell:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    plus:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`,
    dashboard:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/></svg>`,
    user:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>`,
    users:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"/><circle cx="17.5" cy="8.5" r="2.8"/><path d="M17 13.2c2.6.4 4.5 2.7 4.5 5.3"/></svg>`,
    bookmark:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>`,
    more:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/></svg>`,
    globe:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/></svg>`,
    briefcase:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="7" width="19" height="13" rx="2.5"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M2.5 12.5h19"/></svg>`,
    cart:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2.5l2.7 12.5A2 2 0 0 0 9.1 17h8.4a2 2 0 0 0 1.9-1.4L21.5 8H6"/></svg>`,
    calendar:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 3v3M16 3v3"/></svg>`,
    trophy:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4"/><path d="M12 14v3M9 21h6M9 21c0-1.6.7-2.6 1.5-3M15 21c0-1.6-.7-2.6-1.5-3"/></svg>`,
    search:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`,
    settings:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.5-2-3.4-2.3.9a7.6 7.6 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.5a7.6 7.6 0 0 0-2.6 1.5l-2.3-.9-2 3.4 2 1.5a7.6 7.6 0 0 0 0 3l-2 1.5 2 3.4 2.3-.9c.8.7 1.6 1.2 2.6 1.5l.5 2.6h4l.5-2.6c1-.3 1.8-.8 2.6-1.5l2.3.9 2-3.4-2-1.5z"/></svg>`,
    heart:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7.5-4.6-10-9.3C.5 8 2.3 4.5 6 4a5.6 5.6 0 0 1 6 3 5.6 5.6 0 0 1 6-3c3.7.5 5.5 4 4 7.7C19.5 16.4 12 21 12 21z"/></svg>`,
    comment:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5z"/></svg>`,
    share:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14"/></svg>`,
    image:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m21 16-5-5-9 9"/></svg>`,
    video:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="14" height="13" rx="2.5"/><path d="m21.5 8-5 3 5 3z"/></svg>`,
    poll:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>`,
  };
 
  const WORLDS = [
    { id:'programming', name:'البرمجة',        icon:'💻', color:'#22c55e', members:12500, posts:4500, jobs:120, desc:'كل ما يخص البرمجة، اللغات، والأطر.' },
    { id:'ai',           name:'الذكاء الاصطناعي', icon:'🤖', color:'#8b5cf6', members:8700,  posts:3100, jobs:64,  desc:'نماذج اللغة، التعلم الآلي، والأتمتة.' },
    { id:'design',       name:'التصميم',        icon:'🎨', color:'#f97316', members:6100,  posts:2600, jobs:58,  desc:'UI/UX، الهوية البصرية، وتجربة المستخدم.' },
    { id:'business',     name:'ريادة الأعمال',   icon:'💼', color:'#eab308', members:5300,  posts:1900, jobs:41,  desc:'الشركات الناشئة، التمويل، والنمو.' },
    { id:'medicine',     name:'الطب',           icon:'🩺', color:'#ef4444', members:4200,  posts:1400, jobs:25,  desc:'المستجدات الطبية والرعاية الصحية.' },
    { id:'education',    name:'التعليم',        icon:'🎓', color:'#3b82f6', members:3800,  posts:1200, jobs:19,  desc:'التعلم، الدورات، والمهارات.' },
    { id:'photo',        name:'التصوير',        icon:'📷', color:'#ec4899', members:2900,  posts:980,  jobs:12,  desc:'التصوير الفوتوغرافي والفيديو.' },
    { id:'gaming',       name:'الألعاب',        icon:'🎮', color:'#a855f7', members:2700,  posts:1500, jobs:15,  desc:'تطوير الألعاب ومجتمع اللاعبين.' },
    { id:'finance',      name:'المالية',        icon:'📈', color:'#14b8a6', members:2400,  posts:870,  jobs:22,  desc:'الاستثمار، الأسواق، والتخطيط المالي.' },
    { id:'relations',    name:'العلاقات',       icon:'❤️', color:'#f43f5e', members:1800,  posts:640,  jobs:0,   desc:'نقاشات حول العلاقات والحياة الاجتماعية.' },
  ];
 
  const PEOPLE = [
    { id:'sarah',  name:'Sarah Parker', handle:'@sarah.parker', verified:true,  avatar:'S', color:'#ec4899', bio:'مهندسة برمجيات · تكتب عن جافاسكربت والويب الحديث', points:8700, followers:4210, following:180 },
    { id:'alex',   name:'Alex Dev',     handle:'@alex.dev',     verified:true,  avatar:'A', color:'#8b5cf6', bio:'باحث ذكاء اصطناعي · بناء المستقبل خوارزمية تلو الأخرى', points:12400, followers:9800, following:120 },
    { id:'john',   name:'John Smith',   handle:'@john.smith',   verified:false, avatar:'J', color:'#3b82f6', bio:'مصمم منتجات · UI/UX', points:6300, followers:2100, following:340 },
    { id:'lina',   name:'Lina Haddad',  handle:'@lina.haddad',  verified:true,  avatar:'ل', color:'#f97316', bio:'رائدة أعمال · مؤسسة مشتركة لمنصة تعليمية', points:5100, followers:3400, following:210 },
    { id:'you',    name:'أنت',          handle:'@me',            verified:false, avatar:'ن', color:'#14b8a6', bio:'عضو في WorldHub', points:340, followers:56, following:112 },
  ];
 
  const POSTS = [
    {
      id:'p1', author:'sarah', world:'programming', time:'قبل ساعتين',
      text:'إليكم بعض النصائح لتحسين مهاراتكم في جافاسكربت خلال 2026 🔥',
      code:{ badge:'JS', color:'#facc15', lang:`const developer = {\n  passion: 'JavaScript',\n  focus: 'Web Development',\n  keepLearning: true,\n};`},
      likes:128, comments:32, shares:15,
    },
    {
      id:'p2', author:'alex', world:'ai', time:'قبل 5 ساعات',
      text:'مستقبل الذكاء الاصطناعي بين أيدينا. لنواصل البناء 🚀',
      image:'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop',
      likes:246, comments:56, shares:23,
    },
    {
      id:'p3', author:'lina', world:'business', time:'أمس',
      text:'أطلقنا اليوم أول نسخة تجريبية من منصتنا التعليمية! شكراً لكل من دعمنا في هذه الرحلة. الطريق طويل لكن البداية كانت أقوى مما توقعنا 💜',
      likes:412, comments:88, shares:41,
    },
    {
      id:'p4', author:'john', world:'design', time:'قبل يومين',
      text:'قاعدة ذهبية في تصميم الواجهات: المساحة الفارغة ليست فراغاً، بل عنصر تصميم بحد ذاته.',
      image:'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop',
      likes:189, comments:24, shares:9,
    },
  ];
 
  const COMMENTS_SEED = {
    p1: [
      { author:'alex', text:'نصائح رائعة! أضفت TypeScript إلى قائمتي هذا العام 👌' },
      { author:'john', text:'الثبات على التعلم هو الأهم فعلاً.' },
    ],
    p2: [ { author:'sarah', text:'الصورة توضح الفكرة تماماً 😍' } ],
  };
 
  const EVENTS = [
    { id:'e1', title:'Flutter World Conference', date:{m:'JUN', d:15}, place:'أونلاين', people:'1.2k مشارك' },
    { id:'e2', title:'AI & ML Summit 2026',       date:{m:'JUN', d:22}, place:'باريس، فرنسا', people:'850 مشارك' },
    { id:'e3', title:'ملتقى التصميم العربي',       date:{m:'JUL', d:9},  place:'دبي، الإمارات', people:'640 مشارك' },
  ];
 
  const TRENDS = ['#JavaScript', '#Flutter', '#AI', '#Startups', '#WebDevelopment', '#Design'];
 
  const KEY = 'worldhub_state_v1';
 
  function load(){
    try{
      const raw = localStorage.getItem(KEY);
      if(raw) return JSON.parse(raw);
    }catch(e){}
    return {
      posts: POSTS.map(p=>({...p})),
      comments: JSON.parse(JSON.stringify(COMMENTS_SEED)),
      liked:{}, saved:{}, joined:{}, following:{},
      currentUser: null,
    };
  }
  let state = load();
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} }
 
  function person(id){ return PEOPLE.find(p=>p.id===id); }
  function world(id){ return WORLDS.find(w=>w.id===id); }
 
  function timeAgo(){ return 'الآن'; }
 
  function fmt(n){
    if(n>=1000000) return (n/1000000).toFixed(1).replace('.0','')+'M';
    if(n>=1000) return (n/1000).toFixed(1).replace('.0','')+'k';
    return n;
  }
 
  function toast(msg){
    let stack = document.querySelector('.toast-stack');
    if(!stack){ stack = document.createElement('div'); stack.className='toast-stack'; document.body.appendChild(stack); }
    const el = document.createElement('div');
    el.className = 'toast success';
    el.textContent = msg;
    stack.appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity .25s'; setTimeout(()=>el.remove(),250); }, 2200);
  }
 
  function avatarHTML(p, size=44){
    return `<div class="avatar" style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;background:${p.color};color:#fff;font-weight:800;font-size:${size*0.4}px;">${p.avatar}</div>`;
  }
 
  function postCardHTML(post){
    const a = person(post.author);
    const w = world(post.world);
    const liked = !!state.liked[post.id];
    const saved = !!state.saved[post.id];
    const likeCount = post.likes + (liked?1:0);
    return `
    <article class="post" data-post="${post.id}">
      <div class="post__head">
        ${avatarHTML(a)}
        <div class="post__author">
          <div class="post__author-line">${a.name} ${a.verified?`<svg class="verified" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 2.1 3.1-.6 1 3 3 1-.6 3.1L23 12l-2.1 2.4.6 3.1-3 1-1 3-3.1-.6L12 23l-2.4-2.1-3.1.6-1-3-3-1 .6-3.1L1 12l2.1-2.4-.6-3.1 3-1 1-3 3.1.6z"/><path d="M8.5 12.3l2.3 2.3 4.7-4.9" stroke="#0a0a10" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`:''}</div>
          <div class="post__meta"><span>${a.handle}</span><span>·</span><span>${post.time}</span><span>·</span><span class="world-chip">${w.icon} ${w.name}</span></div>
        </div>
        <button class="post__menu">${ICONS.more}</button>
      </div>
      <div class="post__body">${post.text}</div>
      ${post.image?`<div class="post__media"><img src="${post.image}" alt=""></div>`:''}
      ${post.code?`<div class="post__code"><div class="post__code-badge" style="background:${post.code.color};color:#111">${post.code.badge}</div><pre>${post.code.lang}</pre></div>`:''}
      <div class="post__actions">
        <button class="post__action like ${liked?'liked':''}">${ICONS.heart}<span>${fmt(likeCount)}</span></button>
        <button class="post__action comment-toggle">${ICONS.comment}<span>${fmt((state.comments[post.id]||[]).length || post.comments)}</span></button>
        <button class="post__action">${ICONS.share}<span>${fmt(post.shares)}</span></button>
        <button class="post__action post__save ${saved?'saved':''}">${ICONS.bookmark}</button>
      </div>
      <div class="comments" hidden>
        ${(state.comments[post.id]||[]).map(c=>{
          const cp = person(c.author);
          return `<div class="comment">${avatarHTML(cp,32)}<div class="comment__bubble"><div class="comment__name">${cp.name}</div><div class="comment__text">${c.text}</div><div class="comment__actions"><span>إعجاب</span><span>رد</span></div></div></div>`;
        }).join('')}
        <form class="comment-form">
          ${avatarHTML(person('you'),32)}
          <input type="text" placeholder="اكتب تعليقاً..." required>
        </form>
      </div>
    </article>`;
  }
 
  function bindPostEvents(root){
    root.querySelectorAll('.post').forEach(el=>{
      const id = el.dataset.post;
      el.querySelector('.like')?.addEventListener('click', ()=>{
        state.liked[id] = !state.liked[id]; save(); renderFeedIfPresent();
      });
      el.querySelector('.post__save')?.addEventListener('click', (e)=>{
        state.saved[id] = !state.saved[id]; save();
        e.currentTarget.classList.toggle('saved');
        toast(state.saved[id] ? 'تم الحفظ في المحفوظات' : 'تمت إزالته من المحفوظات');
      });
      el.querySelector('.comment-toggle')?.addEventListener('click', ()=>{
        el.querySelector('.comments').hidden = !el.querySelector('.comments').hidden;
      });
      el.querySelector('.comment-form')?.addEventListener('submit', (e)=>{
        e.preventDefault();
        const input = e.target.querySelector('input');
        if(!input.value.trim()) return;
        if(!state.comments[id]) state.comments[id] = [];
        state.comments[id].push({ author:'you', text: input.value.trim() });
        save(); renderFeedIfPresent();
      });
    });
  }
 
  let feedRootEl = null, feedFilter = 'foryou';
  function renderFeedIfPresent(){
    if(feedRootEl) renderFeed(feedRootEl, feedFilter);
  }
 
  function isLive(){ return typeof DB !== 'undefined' && DB.isConnected; }
 
  function renderFeed(root, filter='foryou'){
    feedRootEl = root; feedFilter = filter;
    if(isLive()){ renderFeedLive(root); return; }
    let posts = state.posts;
    if(filter==='following') posts = posts.filter(p=>state.following[p.author]);
    if(filter==='worlds') posts = posts.filter(p=>state.joined[p.world]);
    if(filter==='recent') posts = [...posts].reverse();
    root.innerHTML = posts.length ? posts.map(postCardHTML).join('') :
      `<div class="empty-state"><div class="icon">🌌</div><div class="fw-800">لا توجد منشورات هنا بعد</div><div class="text-dim mt-8">جرّب متابعة المزيد من الأشخاص أو الانضمام إلى عوالم جديدة.</div></div>`;
    bindPostEvents(root);
  }
 
  function addPost({text, world:worldId}){
    if(isLive()){
      DB.createPost({ content:text, worldId: worldId || 'programming' })
        .then(()=>renderFeedIfPresent())
        .catch(err=>toast('تعذر النشر: ' + err.message));
      return;
    }
    const id = 'p' + Date.now();
    state.posts.unshift({ id, author:'you', world: worldId || 'programming', time:'الآن', text, likes:0, comments:0, shares:0 });
    save();
  }
 
  // ===================== وضع الاتصال الحقيقي (Supabase) =====================
 
  function displayName(profile){
    const n = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
    return n || (profile.handle || 'مستخدم');
  }
  function initialsAvatar(profile, size=44){
    const letter = (profile.first_name || profile.handle || '؟').trim().charAt(0).toUpperCase();
    const palette = ['#8b5cf6','#3b82f6','#22c55e','#f97316','#ec4899','#14b8a6','#eab308'];
    const color = palette[(profile.id||'').split('').reduce((s,c)=>s+c.charCodeAt(0),0) % palette.length];
    if(profile.avatar_url) return `<img class="avatar" style="width:${size}px;height:${size}px;object-fit:cover" src="${profile.avatar_url}">`;
    return `<div class="avatar" style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;background:${color};color:#fff;font-weight:800;font-size:${size*0.4}px;">${letter}</div>`;
  }
  function timeSince(iso){
    const s = Math.floor((Date.now() - new Date(iso).getTime())/1000);
    if(s<60) return 'الآن';
    if(s<3600) return `قبل ${Math.floor(s/60)} د`;
    if(s<86400) return `قبل ${Math.floor(s/3600)} س`;
    return `قبل ${Math.floor(s/86400)} يوم`;
  }
 
  function livePostCardHTML(post, currentUserId){
    const a = post.author || {};
    const w = world(post.world_id) || { icon:'🌍', name:post.world_id };
    const likeCount = (post.likes||[]).length;
    const liked = currentUserId ? (post.likes||[]).some(l=>l.user_id===currentUserId) : false;
    const commentList = post.comments || [];
    return `
    <article class="post" data-post="${post.id}" data-live="1">
      <div class="post__head">
        ${initialsAvatar(a)}
        <div class="post__author">
          <div class="post__author-line">${displayName(a)}</div>
          <div class="post__meta"><span>${a.handle||''}</span><span>·</span><span>${timeSince(post.created_at)}</span><span>·</span><span class="world-chip">${w.icon} ${w.name}</span></div>
        </div>
        <button class="post__menu">${ICONS.more}</button>
      </div>
      <div class="post__body">${post.content}</div>
      ${post.image_url?`<div class="post__media"><img src="${post.image_url}" alt=""></div>`:''}
      <div class="post__actions">
        <button class="post__action like ${liked?'liked':''}">${ICONS.heart}<span>${fmt(likeCount)}</span></button>
        <button class="post__action comment-toggle">${ICONS.comment}<span>${fmt(commentList.length)}</span></button>
        <button class="post__action">${ICONS.share}<span>0</span></button>
      </div>
      <div class="comments" hidden>
        ${commentList.map(c=>`<div class="comment">${initialsAvatar(c.author,32)}<div class="comment__bubble"><div class="comment__name">${displayName(c.author||{})}</div><div class="comment__text">${c.content}</div></div></div>`).join('')}
        <form class="comment-form">
          ${currentUserId? initialsAvatar({id:currentUserId, first_name:'أ'},32) : ''}
          <input type="text" placeholder="اكتب تعليقاً..." required>
        </form>
      </div>
    </article>`;
  }
 
  async function renderFeedLive(root){
    root.innerHTML = `<div class="empty-state"><div class="icon">⏳</div>جارٍ تحميل المنشورات من قاعدة البيانات...</div>`;
    try{
      const [posts, user] = await Promise.all([ DB.listPosts({ limit:30 }), DB.getCurrentUser() ]);
      const currentUserId = user ? user.id : null;
      root.innerHTML = posts.length ? posts.map(p=>livePostCardHTML(p, currentUserId)).join('') :
        `<div class="empty-state"><div class="icon">🌌</div><div class="fw-800">لا توجد منشورات بعد</div><div class="text-dim mt-8">كن أول من ينشر في WorldHub!</div></div>`;
      bindLivePostEvents(root);
    }catch(err){
      root.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div>تعذر تحميل المنشورات: ${err.message}</div>`;
    }
  }
 
  function bindLivePostEvents(root){
    root.querySelectorAll('.post[data-live="1"]').forEach(el=>{
      const id = el.dataset.post;
      el.querySelector('.like')?.addEventListener('click', async (e)=>{
        try{ await DB.toggleLike(id); renderFeedIfPresent(); }
        catch(err){ toast(err.message); }
      });
      el.querySelector('.comment-toggle')?.addEventListener('click', ()=>{
        el.querySelector('.comments').hidden = !el.querySelector('.comments').hidden;
      });
      el.querySelector('.comment-form')?.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const input = e.target.querySelector('input');
        if(!input.value.trim()) return;
        try{ await DB.addComment(id, input.value.trim()); renderFeedIfPresent(); }
        catch(err){ toast(err.message); }
      });
    });
  }
 
  function highlightActiveNav(){
    const page = document.body.dataset.page;
    document.querySelectorAll('.nav__link[data-page]').forEach(a=>{
      a.classList.toggle('active', a.dataset.page === page);
    });
  }
 
  function initModal(id){
    const overlay = document.getElementById(id);
    if(!overlay) return { open(){}, close(){} };
    overlay.addEventListener('click', (e)=>{ if(e.target === overlay) close(); });
    overlay.querySelectorAll('[data-close-modal]').forEach(b=>b.addEventListener('click', close));
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
    function open(){ overlay.classList.add('open'); }
    function close(){ overlay.classList.remove('open'); }
    return { open, close };
  }
 
  return { ICONS, WORLDS, PEOPLE, POSTS, EVENTS, TRENDS, state, save, person, world, fmt, toast,
           avatarHTML, postCardHTML, renderFeed, addPost, highlightActiveNav, initModal, bindPostEvents,
           isLive, displayName, initialsAvatar };
})();
 
document.addEventListener('DOMContentLoaded', ()=>{
  WH.highlightActiveNav();
  if(typeof DB !== 'undefined' && !DB.isConnected){
    const bar = document.createElement('div');
    bar.style.cssText = 'position:sticky;top:68px;z-index:39;background:linear-gradient(90deg,#3b2a5e,#241a3d);border-bottom:1px solid var(--border);color:#d9d0ff;font-size:12.5px;font-weight:700;padding:8px 20px;text-align:center;';
    bar.textContent = '⚠️ الموقع يعمل بوضع تجريبي محلي — لم يتم ربطه بـ Supabase بعد. عدّل SUPABASE_URL و SUPABASE_ANON_KEY في ملف supabase.js';
    const topbar = document.querySelector('.topbar');
    if(topbar) topbar.insertAdjacentElement('afterend', bar);
  }
});
