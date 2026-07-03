/* =========================================================
   WorldHub — supabase.js
   طبقة الاتصال بقاعدة بيانات Supabase (مصادقة + بيانات)
   ========================================================= */

// -----------------------------------------------------------------
// 1) ضع بيانات مشروعك هنا (Supabase → Project Settings → API)
// -----------------------------------------------------------------
const SUPABASE_URL = 'https://thtekvgrwnhsuhmrvzwu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_jfeWUimKLNDx_MBkaF4wMA_ZmGkq_10';

// -----------------------------------------------------------------
// 2) تهيئة العميل — إن لم تُضبط البيانات أعلاه يبقى الموقع
//    يعمل بوضع تجريبي محلي (DB.isConnected = false)
// -----------------------------------------------------------------
const sbClient = (SUPABASE_URL.startsWith('YOUR_') || SUPABASE_ANON_KEY.startsWith('YOUR_'))
  ? null
  : window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DB = (() => {

  const isConnected = !!sbClient;

  function assertConnected(){
    if(!isConnected) throw new Error('Supabase غير متصل. ضع SUPABASE_URL و SUPABASE_ANON_KEY في supabase.js');
  }

  // ---------------- Auth ----------------
  async function signUp({ email, password, firstName, lastName, worldId }){
    assertConnected();
    const handle = '@' + (firstName || 'user').toLowerCase().replace(/\s+/g,'') + Math.floor(Math.random()*1000);
    const { data, error } = await sbClient.auth.signUp({
      email, password,
      options: { data: { first_name:firstName, last_name:lastName, handle, world_id: worldId } }
    });
    if(error) throw error;
    return data;
  }

  async function signIn({ email, password }){
    assertConnected();
    const { data, error } = await sbClient.auth.signInWithPassword({ email, password });
    if(error) throw error;
    return data;
  }

  async function signOut(){
    assertConnected();
    const { error } = await sbClient.auth.signOut();
    if(error) throw error;
  }

  async function getSession(){
    if(!isConnected) return null;
    const { data } = await sbClient.auth.getSession();
    return data.session;
  }

  async function getCurrentUser(){
    if(!isConnected) return null;
    const { data } = await sbClient.auth.getUser();
    return data.user;
  }

  // ---------------- Profiles ----------------
  async function getProfile(userId){
    assertConnected();
    const { data, error } = await sbClient.from('profiles').select('*').eq('id', userId).single();
    if(error) throw error;
    return data;
  }

  async function updateProfile(userId, patch){
    assertConnected();
    const { data, error } = await sbClient.from('profiles').update(patch).eq('id', userId).select().single();
    if(error) throw error;
    return data;
  }

  async function getFollowCounts(userId){
    assertConnected();
    const [{ count: followers }, { count: following }] = await Promise.all([
      sbClient.from('followers').select('*', { count:'exact', head:true }).eq('following_id', userId),
      sbClient.from('followers').select('*', { count:'exact', head:true }).eq('follower_id', userId),
    ]);
    return { followers: followers||0, following: following||0 };
  }

  // ---------------- Posts ----------------
  // يرجع منشورات مع اسم الكاتب، عدد الإعجابات، وهل المستخدم الحالي أعجب بها
  async function listPosts({ worldId=null, limit=30 } = {}){
    assertConnected();
    let q = sbClient
      .from('posts')
      .select('id, content, image_url, world_id, created_at, author:profiles(id, first_name, last_name, handle, avatar_url), likes(user_id), comments(id, content, created_at, author:profiles(id, first_name, last_name, handle, avatar_url))')
      .order('created_at', { ascending:false })
      .limit(limit);
    if(worldId) q = q.eq('world_id', worldId);
    const { data, error } = await q;
    if(error) throw error;
    return data;
  }

  async function createPost({ content, worldId, imageUrl=null }){
    assertConnected();
    const user = await getCurrentUser();
    if(!user) throw new Error('يجب تسجيل الدخول لإنشاء منشور');
    const { data, error } = await sbClient.from('posts')
      .insert({ author_id:user.id, content, world_id:worldId, image_url:imageUrl })
      .select().single();
    if(error) throw error;
    return data;
  }

  async function deletePost(postId){
    assertConnected();
    const { error } = await sbClient.from('posts').delete().eq('id', postId);
    if(error) throw error;
  }

  // ---------------- Likes ----------------
  async function toggleLike(postId){
    assertConnected();
    const user = await getCurrentUser();
    if(!user) throw new Error('يجب تسجيل الدخول للإعجاب بمنشور');
    const { data: existing } = await sbClient.from('likes').select('*').eq('post_id', postId).eq('user_id', user.id).maybeSingle();
    if(existing){
      await sbClient.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
      return false; // أصبح غير معجب
    }else{
      await sbClient.from('likes').insert({ post_id:postId, user_id:user.id });
      return true; // أصبح معجب
    }
  }

  // ---------------- Comments ----------------
  async function addComment(postId, content){
    assertConnected();
    const user = await getCurrentUser();
    if(!user) throw new Error('يجب تسجيل الدخول للتعليق');
    const { data, error } = await sbClient.from('comments')
      .insert({ post_id:postId, author_id:user.id, content })
      .select('*, author:profiles(id, first_name, last_name, handle, avatar_url)').single();
    if(error) throw error;
    return data;
  }

  // ---------------- Follow ----------------
  async function toggleFollow(targetUserId){
    assertConnected();
    const user = await getCurrentUser();
    if(!user) throw new Error('يجب تسجيل الدخول للمتابعة');
    const { data: existing } = await sbClient.from('followers').select('*').eq('follower_id', user.id).eq('following_id', targetUserId).maybeSingle();
    if(existing){
      await sbClient.from('followers').delete().eq('follower_id', user.id).eq('following_id', targetUserId);
      return false;
    }else{
      await sbClient.from('followers').insert({ follower_id:user.id, following_id:targetUserId });
      return true;
    }
  }

  return {
    isConnected, sbClient,
    signUp, signIn, signOut, getSession, getCurrentUser,
    getProfile, updateProfile, getFollowCounts,
    listPosts, createPost, deletePost,
    toggleLike, addComment, toggleFollow,
  };
})();
