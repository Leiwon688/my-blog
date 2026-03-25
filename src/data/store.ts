/**
 * 博客数据存储
 * - 所有读写均走 CloudBase 云数据库
 * - 云端失败时降级到本地 data.json（仅作兜底，posts 为空）
 */

// ============ 云数据库配置 ============
import {
  getPostsFromCloud,
  savePostToCloud,
  deletePostFromCloud,
  getTagsFromCloud,
  saveTagsToCloud,
  syncPostsToCloud,
  getProfileFromCloud,
  saveProfileToCloud,
  ensureCloudbaseReady
} from '../lib/cloudbase';

// ============ 类型定义 ============

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  readTime: number;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface SocialLink {
  label: string;
  href: string;
  type: 'github' | 'weibo' | 'twitter' | 'rss' | 'custom';
}

export interface SiteProfile {
  siteTitle: string;
  heroName: string;
  heroBio: string;
  aboutName: string;
  aboutSubtitle: string;
  aboutParagraphs: string[];
  skills: SkillGroup[];
  socialLinks: SocialLink[];
  email: string;
  footerText: string;
}

// ============ 默认值 ============

function getDefaultProfile(): SiteProfile {
  return {
    siteTitle: "Leo的博客",
    heroName: "你好，我是 Leo 👋",
    heroBio: "记录技术探索与思考，专注于前端开发、系统架构和开发工具。",
    aboutName: "Leo Wang",
    aboutSubtitle: "软件工程师 · 开源爱好者 · 终身学习者",
    aboutParagraphs: ["你好！我是 Leo。"],
    skills: [],
    socialLinks: [],
    email: "",
    footerText: "用代码丈量世界 🌍"
  };
}

// ============ 通用云端初始化 ============

async function withCloud<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const ready = await ensureCloudbaseReady();
    if (!ready) {
      console.warn('[Store] CloudBase 未就绪，使用降级数据');
      return fallback;
    }
    return await fn();
  } catch (e) {
    console.error('[Store] 云端请求失败:', e);
    return fallback;
  }
}

// ============ 前台读取函数 ============

export async function getPosts(): Promise<Post[]> {
  return withCloud(async () => {
    const posts = await getPostsFromCloud();
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find(p => p.slug === slug);
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find(p => p.id === id);
}

export async function getTags(): Promise<string[]> {
  return withCloud(() => getTagsFromCloud(), []);
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter(p => p.tags.includes(tag));
}

export async function getProfile(): Promise<SiteProfile> {
  return withCloud(async () => {
    const profile = await getProfileFromCloud();
    return profile || getDefaultProfile();
  }, getDefaultProfile());
}

// ============ 工具函数 ============

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============ 后台管理函数 ============

export async function getPostsForAdmin(): Promise<Post[]> {
  return withCloud(async () => {
    const posts = await getPostsFromCloud();
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);
}

export async function getTagsForAdmin(): Promise<string[]> {
  return withCloud(() => getTagsFromCloud(), []);
}

export async function getProfileFromStorage(): Promise<SiteProfile | null> {
  return withCloud(async () => {
    const profile = await getProfileFromCloud();
    return profile;
  }, null);
}

export async function saveProfileToStorage(profile: SiteProfile): Promise<void> {
  await withCloud(() => saveProfileToCloud(profile), false);
}

export async function savePostsForAdmin(posts: Post[]): Promise<void> {
  await withCloud(() => syncPostsToCloud(posts), false);
}

export async function saveTagsForAdmin(tags: string[]): Promise<void> {
  await withCloud(() => saveTagsToCloud(tags), false);
}

export async function savePostToCloudRealtime(post: Post): Promise<boolean> {
  return withCloud(() => savePostToCloud(post as any), false);
}

export async function deletePostRealtime(id: string): Promise<boolean> {
  return withCloud(() => deletePostFromCloud(id), false);
}
