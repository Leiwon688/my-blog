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

/**
 * CloudBase 匿名登录
 * persistence: 'local' — 登录态存 localStorage，同一浏览器复用同一身份
 *
 * ⚠️ 数据库安全规则需设置为允许所有人读：
 *   {
 *     "read": true,
 *     "write": true
 *   }
 */
let initialized = false;
let initPromise: Promise<boolean> | null = null;

export async function ensureCloudbaseReady(): Promise<boolean> {
  if (initialized) return true;
  if (!initPromise) {
    initPromise = (async () => {
      try {
        const auth = app.auth({ persistence: 'local' });
        // 已有登录态则直接复用，否则重新匿名登录
        const loginState = await auth.getLoginState();
        if (!loginState) {
          await auth.anonymousAuthProvider().signIn();
        }
        initialized = true;
        return true;
      } catch (e) {
        console.error('[CloudBase] 登录失败:', e);
        initPromise = null;
        return false;
      }
    })();
  }
  return initPromise;
}

// 集合名称（本地开发用 _dev 后缀，线上用正式名称）
const isDev = !import.meta.env.PROD;
const POSTS_COLLECTION = isDev ? 'posts_dev' : 'posts';
const PROFILE_COLLECTION = isDev ? 'profile_dev' : 'profile';
const TAGS_COLLECTION = isDev ? 'tags_dev' : 'tags';

// 线上唯一文档 ID（固定，防止重复新增）
// profile 文档: f0df711e69bf9da40121095764b3efb9
// tags   文档: 93abbbd769c291ba016bd9e14f1e5236
const PROFILE_DOC_ID = 'f0df711e69bf9da40121095764b3efb9';
const TAGS_DOC_ID = '93abbbd769c291ba016bd9e14f1e5236';

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
    // 不用 orderBy，避免索引问题；拿到数据后在内存排序
    const res = await db.collection(POSTS_COLLECTION).get();
    console.log('[CloudBase] 读取文章:', POSTS_COLLECTION, '数量:', res.data?.length || 0);
    // 按日期降序排序
    const sorted = (res.data || []).sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return sorted;
  } catch (e) {
    console.error('[CloudBase] 读取文章失败:', e);
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
    // 获取云端现有文章
    const existing = await db.collection(POSTS_COLLECTION).get();
    const targetIds = posts.map(p => p.id);
    
    // 找出需要删除的文章（云端有，但目标列表没有的）
    const toDelete = existing.data.filter(p => !targetIds.includes(p.id));
    
    // 对每篇文章使用 upsert 逻辑（存在则更新，不存在则新增）
    for (const post of posts) {
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
    }
    
    // 删除多余的文章
    for (const doc of toDelete) {
      await db.collection(POSTS_COLLECTION).doc(doc._id).remove();
    }
    
    return true;
  } catch (e) {
    console.error('Failed to sync posts to cloud:', e);
    return false;
  }
}

// ============ 标签操作 ============

export async function getTagsFromCloud(): Promise<string[]> {
  try {
    let raw: any = null;
    if (isDev) {
      const res = await db.collection(TAGS_COLLECTION).limit(1).get();
      raw = res.data?.[0];
    } else {
      const res = await db.collection(TAGS_COLLECTION).doc(TAGS_DOC_ID).get();
      raw = Array.isArray(res.data) ? res.data[0] : res.data;
    }
    return raw?.tags || [];
  } catch (e) {
    console.error('Failed to fetch tags from cloud:', e);
    return [];
  }
}

export async function saveTagsToCloud(tags: string[]): Promise<boolean> {
  try {
    if (isDev) {
      // 开发环境：走动态查询
      const exist = await db.collection(TAGS_COLLECTION).limit(1).get();
      if (exist.data && exist.data.length > 0) {
        await db.collection(TAGS_COLLECTION).doc(exist.data[0]._id).update({ tags, updatedAt: Date.now() });
      } else {
        await db.collection(TAGS_COLLECTION).add({ tags, createdAt: Date.now(), updatedAt: Date.now() });
      }
    } else {
      // 线上环境：直接更新固定文档，永远不会新增
      await db.collection(TAGS_COLLECTION).doc(TAGS_DOC_ID).update({
        tags,
        updatedAt: Date.now(),
      });
    }
    return true;
  } catch (e) {
    console.error('Failed to save tags to cloud:', e);
    return false;
  }
}

// ============ 个人资料操作 ============

export async function getProfileFromCloud(): Promise<SiteProfile | null> {
  try {
    let raw: any = null;
    if (isDev) {
      const res = await db.collection(PROFILE_COLLECTION).limit(1).get();
      raw = res.data?.[0];
    } else {
      const res = await db.collection(PROFILE_COLLECTION).doc(PROFILE_DOC_ID).get();
      raw = Array.isArray(res.data) ? res.data[0] : res.data;
    }
    if (!raw) return null;
    const { _id, _openid, createdAt, updatedAt, ...profile } = raw;
    return {
      ...profile,
      aboutParagraphs: profile.aboutParagraphs || [],
      skills: profile.skills || [],
      socialLinks: profile.socialLinks || [],
    } as SiteProfile;
  } catch (e) {
    console.error('Failed to fetch profile from cloud:', e);
    return null;
  }
}

export async function saveProfileToCloud(profile: SiteProfile): Promise<boolean> {
  try {
    const { _id, _openid, createdAt, updatedAt, ...cleanProfile } = profile as any;

    if (isDev) {
      // 开发环境：走动态查询
      const exist = await db.collection(PROFILE_COLLECTION).limit(1).get();
      if (exist.data && exist.data.length > 0) {
        await db.collection(PROFILE_COLLECTION).doc(exist.data[0]._id).update({ ...cleanProfile, updatedAt: Date.now() });
      } else {
        await db.collection(PROFILE_COLLECTION).add({ ...cleanProfile, createdAt: Date.now(), updatedAt: Date.now() });
      }
    } else {
      // 线上环境：直接更新固定文档，永远不会新增
      await db.collection(PROFILE_COLLECTION).doc(PROFILE_DOC_ID).update({
        ...cleanProfile,
        updatedAt: Date.now(),
      });
    }
    return true;
  } catch (e) {
    console.error('Failed to save profile to cloud:', e);
    return false;
  }
}
