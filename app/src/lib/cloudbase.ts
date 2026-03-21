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

// 集合名称
const POSTS_COLLECTION = 'posts';
const PROFILE_COLLECTION = 'profile';
const TAGS_COLLECTION = 'tags';

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
    const existing = await db.collection(POSTS_COLLECTION).get();
    for (const doc of existing.data) {
      await db.collection(POSTS_COLLECTION).doc(doc._id).remove();
    }
    for (const post of posts) {
      await db.collection(POSTS_COLLECTION).add({
        ...post,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
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
    if (exist.data && exist.data.length > 0) {
      await db.collection(TAGS_COLLECTION).where({ _id: exist.data[0]._id }).update({
        tags,
        updatedAt: Date.now(),
      });
    } else {
      await db.collection(TAGS_COLLECTION).add({
        tags,
        createdAt: Date.now(),
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
