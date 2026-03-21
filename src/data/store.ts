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

// ---------- 默认示例数据 ----------
const DEFAULT_POSTS: Post[] = [
  {
    id: "1",
    title: "用 React 18 构建高性能 Web 应用",
    slug: "react-18-performance",
    date: "2026-03-15",
    tags: ["React", "前端", "性能优化"],
    readTime: 8,
    excerpt: "React 18 带来了并发特性、自动批处理、Suspense 改进等重要更新，本文深入探讨如何利用这些新特性打造流畅的用户体验。",
    content: `# 用 React 18 构建高性能 Web 应用

React 18 是 React 历史上最重要的版本之一，引入了**并发渲染（Concurrent Rendering）**这一革命性特性。

## 并发特性

并发模式允许 React 同时准备多个版本的 UI，使应用在处理大量数据时仍能保持响应。

\`\`\`tsx
import { startTransition, useTransition } from 'react';

function SearchResults() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (value: string) => {
    setQuery(value);
    startTransition(() => {
      setResults(heavySearch(value));
    });
  };

  return (
    <div>
      <input onChange={e => handleSearch(e.target.value)} />
      {isPending ? <Spinner /> : <ResultList data={results} />}
    </div>
  );
}
\`\`\`

## 自动批处理

React 18 中，所有状态更新都会自动批处理，包括在 **setTimeout**、**Promise** 和原生事件处理中。

## 总结

React 18 的并发特性为构建高性能应用提供了强大工具。`,
  },
  {
    id: "2",
    title: "TypeScript 进阶：类型体操实战",
    slug: "typescript-advanced-types",
    date: "2026-03-08",
    tags: ["TypeScript", "前端"],
    readTime: 12,
    excerpt: "深入探索 TypeScript 的高级类型系统，包括条件类型、映射类型、模板字面量类型等，用类型系统解决实际工程问题。",
    content: `# TypeScript 进阶：类型体操实战

TypeScript 的类型系统极其强大，掌握高级类型技巧可以让你写出更安全、更优雅的代码。

## 条件类型

\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false;
type A = IsArray<string[]>;  // true
\`\`\`

## 映射类型

\`\`\`typescript
type Optional<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

## 总结

类型体操虽然复杂，但它让我们能在编译时捕获更多错误，提升代码可靠性。`,
  },
  {
    id: "3",
    title: "今日感悟：保持好奇心",
    slug: "curiosity-matters",
    date: "2026-03-01",
    tags: ["随想", "成长"],
    readTime: 3,
    excerpt: "好奇心是驱动我们不断前进的燃料，无论是技术还是生活，保持探索的热情比什么都重要。",
    content: `# 今日感悟：保持好奇心

今天在读一本书的时候，突然想到一件事——我们小时候对一切事物都充满好奇，但随着年龄增长，这种好奇心似乎慢慢消退了。

## 好奇心的力量

好奇心让我们：
- 不断学习新事物
- 发现问题的不同解法
- 保持对生活的热情

## 如何保持好奇心

1. **多问"为什么"** — 不满足于表面答案
2. **涉猎不同领域** — 打破信息茧房
3. **记录想法** — 这个博客就是一种方式

## 写在最后

无论多忙，保留一点时间给好奇心，它会回报你意想不到的收获。`,
  },
];

const DEFAULT_TAGS = ["React", "前端", "TypeScript", "性能优化", "随想", "成长", "CSS", "后端", "Go"];

// ---------- 个人资料类型 ----------
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
  // 站点
  siteTitle: string;
  // 首页 Hero
  heroName: string;
  heroBio: string;
  // 关于页
  aboutName: string;
  aboutSubtitle: string;
  aboutParagraphs: string[];
  skills: SkillGroup[];
  socialLinks: SocialLink[];
  email: string;
  // 页脚
  footerText: string;
}

const DEFAULT_PROFILE: SiteProfile = {
  siteTitle: "Leo的博客",
  heroName: "你好，我是 Leo 👋",
  heroBio: "记录技术探索与思考，专注于前端开发、系统架构和开发工具。",
  aboutName: "Leo Wang",
  aboutSubtitle: "软件工程师 · 开源爱好者 · 终身学习者",
  aboutParagraphs: [
    "你好！我是 Leo，一名热爱技术的软件工程师。目前专注于前端工程化、全栈开发和系统架构设计。",
    "我相信写作是思维的延伸。这个博客是我记录技术探索、分享学习心得的地方。内容涵盖前端开发、后端架构、开发工具和一些碎碎念。",
    "工作之余，我喜欢为开源项目贡献代码、阅读计算机科学相关书籍，以及折腾各种效率工具。",
  ],
  skills: [
    { category: "前端", items: ["React", "TypeScript", "Vue", "Tailwind CSS", "Next.js"] },
    { category: "后端", items: ["Go", "Node.js", "Python", "PostgreSQL", "Redis"] },
    { category: "工具", items: ["Docker", "Git", "Linux", "CI/CD", "Kubernetes"] },
  ],
  socialLinks: [
    { label: "GitHub", href: "https://github.com", type: "github" },
    { label: "RSS", href: "#", type: "rss" },
  ],
  email: "leo@example.com",
  footerText: "用代码丈量世界 🌍",
};

// ---------- 存储 Key ----------
const POSTS_KEY = "leo_blog_posts";
const TAGS_KEY = "leo_blog_tags";
const PROFILE_KEY = "leo_blog_profile";

// ---------- 初始化 ----------
function initStorage() {
  if (!localStorage.getItem(POSTS_KEY)) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(DEFAULT_POSTS));
  }
  if (!localStorage.getItem(TAGS_KEY)) {
    localStorage.setItem(TAGS_KEY, JSON.stringify(DEFAULT_TAGS));
  }
  if (!localStorage.getItem(PROFILE_KEY)) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
  }
}

// ---------- Posts CRUD ----------
export function getPosts(): Post[] {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(POSTS_KEY) || "[]") as Post[];
  } catch {
    return [];
  }
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPosts().find(p => p.slug === slug);
}

export function getPostById(id: string): Post | undefined {
  return getPosts().find(p => p.id === id);
}

export function savePost(post: Post): void {
  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === post.id);
  if (idx >= 0) {
    posts[idx] = post;
  } else {
    posts.unshift(post);
  }
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function deletePost(id: string): void {
  const posts = getPosts().filter(p => p.id !== id);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function createPost(data: Omit<Post, "id" | "slug" | "date" | "readTime">): Post {
  const id = Date.now().toString();
  const slug = data.title
    .toLowerCase()
    .replace(/[\u4e00-\u9fa5]/g, c => c.charCodeAt(0).toString(16))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) + "-" + id.slice(-6);

  const readTime = Math.max(1, Math.round(data.content.length / 500));
  const date = new Date().toISOString().slice(0, 10);

  const post: Post = { id, slug, date, readTime, ...data };
  savePost(post);
  return post;
}

export function updatePost(id: string, data: Partial<Omit<Post, "id">>): Post | null {
  const post = getPostById(id);
  if (!post) return null;
  const readTime = data.content
    ? Math.max(1, Math.round(data.content.length / 500))
    : post.readTime;
  const updated = { ...post, ...data, id, readTime };
  savePost(updated);
  return updated;
}

// ---------- Tags CRUD ----------
export function getTags(): string[] {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(TAGS_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export function addTag(tag: string): void {
  const tags = getTags();
  const trimmed = tag.trim();
  if (!trimmed || tags.includes(trimmed)) return;
  tags.push(trimmed);
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
}

export function renameTag(oldName: string, newName: string): void {
  // 更新标签列表
  const tags = getTags().map(t => (t === oldName ? newName : t));
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  // 同步更新所有文章中的标签引用
  const posts = getPosts().map(p => ({
    ...p,
    tags: p.tags.map(t => (t === oldName ? newName : t)),
  }));
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function deleteTag(tag: string): void {
  const tags = getTags().filter(t => t !== tag);
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  // 同步从文章中移除该标签
  const posts = getPosts().map(p => ({
    ...p,
    tags: p.tags.filter(t => t !== tag),
  }));
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

// ---------- 工具函数 ----------
export function getPostsByTag(tag: string): Post[] {
  return getPosts().filter(p => p.tags.includes(tag));
}

// ---------- Profile CRUD ----------
export function getProfile(): SiteProfile {
  initStorage();
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (!stored) return DEFAULT_PROFILE;
    // 合并默认值，防止新字段缺失
    return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: SiteProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
