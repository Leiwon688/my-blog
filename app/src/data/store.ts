/**
 * 博客数据存储
 * - 数据从 /data.json 加载（静态文件方式部署到 GitHub Pages）
 * - 所有浏览器访问同一份数据，换浏览器不会丢失
 */

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

async function loadData(): Promise<DataFile> {
  if (cachedData) return cachedData;
  
  try {
    const res = await fetch('/data.json');
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

// ============ 导出函数（只读，发布到 GitHub 后手动编辑 data.json）============

// 文章（只读）
export async function getPosts(): Promise<Post[]> {
  const data = await loadData();
  return data.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const data = await loadData();
  return data.posts.find(p => p.slug === slug);
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const data = await loadData();
  return data.posts.find(p => p.id === id);
}

// 标签（只读）
export async function getTags(): Promise<string[]> {
  const data = await loadData();
  return data.tags;
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const data = await loadData();
  return data.posts.filter(p => p.tags.includes(tag));
}

// 个人资料（只读）
export async function getProfile(): Promise<SiteProfile> {
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

// ============ 后台管理函数（更新 localStorage，用于预览）============

// localStorage 键
const PREVIEW_POSTS_KEY = 'leo_blog_posts_preview';
const PREVIEW_TAGS_KEY = 'leo_blog_tags_preview';
const PREVIEW_PROFILE_KEY = 'leo_blog_profile_preview';

// 获取预览数据（优先使用 localStorage，否则用 JSON）
export async function getPostsForAdmin(): Promise<Post[]> {
  const preview = localStorage.getItem(PREVIEW_POSTS_KEY);
  if (preview) {
    return JSON.parse(preview);
  }
  return getPosts();
}

export async function getTagsForAdmin(): Promise<string[]> {
  const preview = localStorage.getItem(PREVIEW_TAGS_KEY);
  if (preview) {
    return JSON.parse(preview);
  }
  return getTags();
}

export function getProfileFromStorage(): SiteProfile | null {
  const stored = localStorage.getItem(PREVIEW_PROFILE_KEY);
  if (stored) return JSON.parse(stored);
  return null;
}

export function saveProfileToStorage(profile: SiteProfile) {
  localStorage.setItem(PREVIEW_PROFILE_KEY, JSON.stringify(profile));
}

// 保存到 localStorage 预览
export function savePostsForAdmin(posts: Post[]): void {
  localStorage.setItem(PREVIEW_POSTS_KEY, JSON.stringify(posts));
}

export function saveTagsForAdmin(tags: string[]): void {
  localStorage.setItem(PREVIEW_TAGS_KEY, JSON.stringify(tags));
}
