/**
 * 博客数据存储
 * - 生产环境：优先从云数据库获取（腾讯云开发 CloudBase）
 * - 开发环境：使用本地 data.json
 * - 写操作会同步到云端
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

// 是否启用云端同步（仅在生产环境启用）
const USE_CLOUD = import.meta.env.PROD;

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

// ============ 数据加载 ============

interface DataFile {
  profile: SiteProfile;
  tags: string[];
  posts: Post[];
}

let cachedData: DataFile | null = null;
let cloudDataLoaded = false;

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

// 尝试从云端加载数据
async function loadCloudData(): Promise<{ posts: Post[], tags: string[], profile: SiteProfile } | null> {
  if (!USE_CLOUD) return null;

  const ready = await ensureCloudbaseReady();
  if (!ready) {
    console.warn('CloudBase not ready, falling back to local data');
    return null;
  }

  try {
    const [posts, tags, cloudProfile] = await Promise.all([
      getPostsFromCloud(),
      getTagsFromCloud(),
      getProfileFromCloud()
    ]);
    if (posts.length > 0 || cloudProfile) {
      return {
        posts,
        tags,
        profile: cloudProfile || getDefaultProfile()
      };
    }
  } catch (e) {
    console.error('Failed to load from cloud:', e);
  }
  return null;
}

async function loadData(): Promise<DataFile> {
  if (cachedData) return cachedData;

  // 优先尝试从云端加载
  if (!cloudDataLoaded) {
    const cloudData = await loadCloudData();
    if (cloudData) {
      cachedData = {
        profile: cloudData.profile,
        tags: cloudData.tags,
        posts: cloudData.posts
      };
      cloudDataLoaded = true;
      return cachedData!;
    }
    cloudDataLoaded = true;
  }

  // 降级到本地 JSON
  try {
    const res = await fetch('/my-blog/data.json');
    cachedData = await res.json();
    return cachedData!;
  } catch (e) {
    console.error('Failed to load data:', e);
    return {
      profile: getDefaultProfile(),
      tags: [],
      posts: []
    };
  }
}

// ============ 导出函数（前台使用，优先从云端获取最新数据）============

export async function getPosts(): Promise<Post[]> {
  if (USE_CLOUD) {
    try {
      await ensureCloudbaseReady();
      const posts = await getPostsFromCloud();
      if (posts.length > 0) {
        return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    } catch (e) {
      console.warn('Failed to get posts from cloud:', e);
    }
  }
  const data = await loadData();
  return data.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
  if (USE_CLOUD) {
    try {
      await ensureCloudbaseReady();
      const tags = await getTagsFromCloud();
      if (tags.length > 0) return tags;
    } catch (e) {
      console.warn('Failed to get tags from cloud:', e);
    }
  }
  const data = await loadData();
  return data.tags;
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter(p => p.tags.includes(tag));
}

export async function getProfile(): Promise<SiteProfile> {
  if (USE_CLOUD) {
    try {
      await ensureCloudbaseReady();
      const cloudProfile = await getProfileFromCloud();
      if (cloudProfile) return cloudProfile;
    } catch (e) {
      console.warn('Failed to get profile from cloud:', e);
    }
  }
  const data = await loadData();
  return data.profile;
}

// 工具函数
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============ 后台管理函数（更新 localStorage + 云端）============

const PREVIEW_POSTS_KEY = 'leo_blog_posts_preview';
const PREVIEW_TAGS_KEY = 'leo_blog_tags_preview';
const PREVIEW_PROFILE_KEY = 'leo_blog_profile_preview';

export async function getPostsForAdmin(): Promise<Post[]> {
  const preview = localStorage.getItem(PREVIEW_POSTS_KEY);
  if (preview) return JSON.parse(preview);
  return getPosts();
}

export async function getTagsForAdmin(): Promise<string[]> {
  const preview = localStorage.getItem(PREVIEW_TAGS_KEY);
  if (preview) return JSON.parse(preview);
  return getTags();
}

export function getProfileFromStorage(): SiteProfile | null {
  const stored = localStorage.getItem(PREVIEW_PROFILE_KEY);
  if (stored) return JSON.parse(stored);
  return null;
}

export async function saveProfileToStorage(profile: SiteProfile): Promise<void> {
  localStorage.setItem(PREVIEW_PROFILE_KEY, JSON.stringify(profile));
  if (USE_CLOUD) await saveProfileToCloud(profile);
}

export async function savePostsForAdmin(posts: Post[]): Promise<void> {
  localStorage.setItem(PREVIEW_POSTS_KEY, JSON.stringify(posts));
  if (USE_CLOUD) await syncPostsToCloud(posts);
}

export async function saveTagsForAdmin(tags: string[]): Promise<void> {
  localStorage.setItem(PREVIEW_TAGS_KEY, JSON.stringify(tags));
  if (USE_CLOUD) await saveTagsToCloud(tags);
}

export async function savePostToCloudRealtime(post: Post): Promise<boolean> {
  if (!USE_CLOUD) return false;
  return savePostToCloud(post as any);
}

export async function deletePostRealtime(id: string): Promise<boolean> {
  if (!USE_CLOUD) return false;
  return deletePostFromCloud(id);
}
