/**
 * 腾讯云开发 CloudBase 服务
 * 用于博客文章的云端存储和同步
 */

import cloudbase from '@cloudbase/js-sdk';
import type { SiteProfile } from '../data/store';

// 你的环境 ID
const ENV_ID = 'leo-4gf1rgdic903e5ea';

const app = cloudbase.init({
  env: ENV_ID,
});

const db = app.database();

// 匿名登录
export async function initCloudbase(): Promise<boolean> {
  try {
    await app.auth({ persistence: 'local' }).anonymousAuthProvider().signIn();
    return true;
  } catch (e) {
    try {
      const authState = await (app.auth() as any).getAuthState();
      if (authState) return true;
    } catch {}
    console.error('CloudBase auth failed:', e);
    return false;
  }
}

let initialized = false;
export async function ensureCloudbaseReady(): Promise<boolean> {
  if (initialized) return true;
  initialized = await initCloudbase();
  return initialized;
}

// 集合名称（本地开发用 _dev 后缀，线上用正式名称）
const isDev = !import.meta.env.PROD;
const POSTS_COLLECTION = isDev ? 'posts_dev' : 'posts';
const PROFILE_COLLECTION = isDev ? 'profile_dev' : 'profile';
const TAGS_COLLECTION = isDev ? 'tags_dev' : 'tags';

// ============ 文章操作 ============

export interface CloudPost {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  readTime: number;
  createdAt?: number;
  updatedAt?: number;
}

export async function getPostsFromCloud(): Promise<CloudPost[]> {
  try {
    const res = await db.collection(POSTS_COLLECTION).orderBy('date', 'desc').get();
    return res.data;
  } catch (e) {
    console.error('Failed to fetch posts from cloud:', e);
    return [];
  }
}

export async function savePostToCloud(post: CloudPost): Promise<boolean> {
  try {
    const exist = await db.collection(POSTS_COLLECTION).where({ id: post.id }).get();
    if (exist.data && exist.data.length > 0) {
      await db.collection(POSTS_COLLECTION).where({ id: post.id }).update({
        ...post,
        updatedAt: Date.now(),
      });
    } else {
      await db.collection(POSTS_COLLECTION).add({
        ...post,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    return true;
  } catch (e) {
    console.error('Failed to save post to cloud:', e);
    return false;
  }
}

export async function deletePostFromCloud(id: string): Promise<boolean> {
  try {
    await db.collection(POSTS_COLLECTION).where({ id }).remove();
    return true;
  } catch (e) {
    console.error('Failed to delete post from cloud:', e);
    return false;
  }
}

export async function syncPostsToCloud(posts: CloudPost[]): Promise<boolean> {
  try {
    console.log('[CloudBase sync] 开始同步', posts.length, '篇文章');
    
    // 获取云端现有文章
    const existing = await db.collection(POSTS_COLLECTION).get();
    console.log('[CloudBase sync] 云端现有文章:', existing.data.length, '篇');
    console.log('[CloudBase sync] 云端文章ID列表:', existing.data.map(p => p.id));
    
    // 对每篇文章使用 upsert 逻辑（存在则更新，不存在则新增）
    for (const post of posts) {
      const exist = await db.collection(POSTS_COLLECTION).where({ id: post.id }).get();
      console.log('[CloudBase sync] 查询文章', post.id, '存在?:', exist.data?.length > 0);
      
      if (exist.data && exist.data.length > 0) {
        console.log('[CloudBase sync] 更新文章:', post.id, post.title);
        await db.collection(POSTS_COLLECTION).where({ id: post.id }).update({
          ...post,
          updatedAt: Date.now(),
        });
      } else {
        console.log('[CloudBase sync] 新增文章:', post.id, post.title);
        await db.collection(POSTS_COLLECTION).add({
          ...post,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    }
    
    // 验证结果
    await new Promise(resolve => setTimeout(resolve, 500));
    const verify = await db.collection(POSTS_COLLECTION).get();
    console.log('[CloudBase sync] 验证云端文章数:', verify.data.length);
    
    return true;
  } catch (e: any) {
    console.error('[CloudBase sync] 失败:', e?.message || e);
    return false;
  }
}

// ============ 标签操作 ============

export async function getTagsFromCloud(): Promise<string[]> {
  try {
    const res = await db.collection(TAGS_COLLECTION).get();
    if (res.data && res.data.length > 0) {
      return res.data[0].tags || [];
    }
    return [];
  } catch (e) {
    console.error('Failed to fetch tags from cloud:', e);
    return [];
  }
}

export async function saveTagsToCloud(tags: string[]): Promise<boolean> {
  try {
    const exist = await db.collection(TAGS_COLLECTION).get();
    console.log('[CloudBase] 标签集合存在检查:', exist.data?.length, '条记录');
    
    if (exist.data && exist.data.length > 0) {
      console.log('[CloudBase] 更新标签文档, _id:', exist.data[0]._id);
      const updateResult = await db.collection(TAGS_COLLECTION).where({ _id: exist.data[0]._id }).update({
        tags,
        updatedAt: Date.now(),
      });
      console.log('[CloudBase] 更新结果:', JSON.stringify(updateResult));
    } else {
      console.log('[CloudBase] 创建新标签文档');
      const addResult = await db.collection(TAGS_COLLECTION).add({
        tags,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      console.log('[CloudBase] 新增结果:', JSON.stringify(addResult));
    }
    return true;
  } catch (e: any) {
    console.error('[CloudBase] 保存标签失败:', e?.message || e);
    return false;
  }
}

// ============ 个人资料操作 ============

export async function getProfileFromCloud(): Promise<SiteProfile | null> {
  try {
    const res = await db.collection(PROFILE_COLLECTION).get();
    if (res.code === 'DATABASE_COLLECTION_NOT_EXIST') {
      return null;
    }
    if (res.data && res.data.length > 0) {
      const { _id, _openid, ...profile } = res.data[0];
      const safeProfile: SiteProfile = {
        ...profile,
        aboutParagraphs: profile.aboutParagraphs || [],
        skills: profile.skills || [],
        socialLinks: profile.socialLinks || [],
      } as SiteProfile;
      return safeProfile;
    }
    return null;
  } catch (e) {
    console.error('Failed to fetch profile from cloud:', e);
    return null;
  }
}

export async function saveProfileToCloud(profile: SiteProfile): Promise<boolean> {
  try {
    const exist = await db.collection(PROFILE_COLLECTION).get();
    if (exist.data && exist.data.length > 0) {
      await db.collection(PROFILE_COLLECTION).where({ _id: exist.data[0]._id }).update({
        ...profile,
        updatedAt: Date.now(),
      });
    } else {
      await db.collection(PROFILE_COLLECTION).add({
        ...profile,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    return true;
  } catch (e) {
    console.error('Failed to save profile to cloud:', e);
    return false;
  }
}
