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

export const posts: Post[] = [
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

React 18 中，所有状态更新都会自动批处理，包括在 **setTimeout**、**Promise** 和原生事件处理中：

\`\`\`tsx
// React 18 之前：这会触发两次渲染
// React 18：只触发一次渲染
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);
\`\`\`

## Suspense 改进

\`\`\`tsx
<Suspense fallback={<Loading />}>
  <ProfilePage />
  <ProfileTimeline />
</Suspense>
\`\`\`

## useDeferredValue

\`useDeferredValue\` 可以推迟更新非关键 UI 部分：

\`\`\`tsx
const deferredQuery = useDeferredValue(query);
\`\`\`

## 总结

React 18 的并发特性为构建高性能应用提供了强大工具。合理使用 \`useTransition\`、\`useDeferredValue\` 和 \`Suspense\`，可以显著改善用户体验。`,
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

条件类型允许根据类型关系进行类型推断：

\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false;

type A = IsArray<string[]>;  // true
type B = IsArray<number>;    // false
\`\`\`

## 映射类型

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

## 模板字面量类型

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;

type ClickEvent = EventName<'click'>;  // 'onClick'
type InputEvent = EventName<'input'>;  // 'onInput'
\`\`\`

## infer 关键字

\`\`\`typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
\`\`\`

## 实战：路由类型安全

\`\`\`typescript
type Routes = '/home' | '/about' | '/blog/:id';
type ExtractParams<T extends string> =
  T extends \`\${string}:\${infer Param}/\${infer Rest}\`
    ? Param | ExtractParams<\`/\${Rest}\`>
    : T extends \`\${string}:\${infer Param}\`
    ? Param
    : never;

type BlogParams = ExtractParams<'/blog/:id'>;  // 'id'
\`\`\`

## 总结

类型体操虽然复杂，但它让我们能在编译时捕获更多错误，提升代码可靠性。`,
  },
  {
    id: "3",
    title: "Tailwind CSS 4.0 新特性全解析",
    slug: "tailwindcss-v4",
    date: "2026-02-28",
    tags: ["CSS", "Tailwind", "前端"],
    readTime: 6,
    excerpt: "Tailwind CSS 4.0 带来了全新的引擎、CSS-first 配置方式和众多性能提升，本文全面介绍这些新特性及迁移指南。",
    content: `# Tailwind CSS 4.0 新特性全解析

Tailwind CSS 4.0 是一次重大重写，带来了显著的性能提升和开发体验改进。

## 全新引擎

Tailwind v4 使用 Rust 重写了核心引擎，构建速度提升高达 **10 倍**。

## CSS-first 配置

不再需要 \`tailwind.config.js\`，直接在 CSS 中配置：

\`\`\`css
@import "tailwindcss";

@theme {
  --color-primary: #2563eb;
  --font-display: "Inter", sans-serif;
  --spacing-xs: 0.25rem;
}
\`\`\`

## 原生 CSS 变量

所有设计 token 现在都暴露为 CSS 变量：

\`\`\`css
.my-component {
  color: var(--color-primary);
  padding: var(--spacing-4);
}
\`\`\`

## 容器查询支持

\`\`\`html
<div class="@container">
  <div class="@lg:grid-cols-3 @sm:grid-cols-2 grid-cols-1">
    <!-- 响应式内容 -->
  </div>
</div>
\`\`\`

## 总结

Tailwind v4 大幅简化了配置，提升了构建速度，是前端开发者的重要升级。`,
  },
  {
    id: "4",
    title: "用 Go 构建高并发 REST API",
    slug: "go-rest-api",
    date: "2026-02-15",
    tags: ["Go", "后端", "API"],
    readTime: 10,
    excerpt: "Go 语言天生为并发而生，本文介绍如何使用 Gin 框架、GORM ORM 和 Redis 构建一个生产级别的高并发 REST API。",
    content: `# 用 Go 构建高并发 REST API

Go 是构建高性能后端服务的理想选择，本文将带你从零构建一个完整的 REST API。

## 项目结构

\`\`\`
.
├── cmd/server/main.go
├── internal/
│   ├── handler/
│   ├── service/
│   ├── repository/
│   └── model/
├── pkg/
│   ├── middleware/
│   └── response/
└── config/
\`\`\`

## 初始化项目

\`\`\`bash
go mod init github.com/leo/blog-api
go get github.com/gin-gonic/gin
go get gorm.io/gorm
go get github.com/redis/go-redis/v9
\`\`\`

## 定义模型

\`\`\`go
type Post struct {
    gorm.Model
    Title   string \`json:"title" gorm:"not null"\`
    Content string \`json:"content"\`
    Tags    []Tag  \`json:"tags" gorm:"many2many:post_tags"\`
}
\`\`\`

## 路由设置

\`\`\`go
func SetupRouter(db *gorm.DB) *gin.Engine {
    r := gin.Default()
    
    api := r.Group("/api/v1")
    {
        posts := api.Group("/posts")
        posts.GET("", handler.ListPosts)
        posts.GET("/:id", handler.GetPost)
        posts.POST("", middleware.Auth(), handler.CreatePost)
    }
    
    return r
}
\`\`\`

## 中间件

\`\`\`go
func RateLimit() gin.HandlerFunc {
    limiter := rate.NewLimiter(100, 200)
    return func(c *gin.Context) {
        if !limiter.Allow() {
            c.AbortWithStatus(429)
            return
        }
        c.Next()
    }
}
\`\`\`

## 总结

Go 的并发模型和标准库使构建高性能 API 变得简单高效。`,
  },
  {
    id: "5",
    title: "现代 CSS 布局：Grid vs Flexbox",
    slug: "css-grid-vs-flexbox",
    date: "2026-01-20",
    tags: ["CSS", "前端"],
    readTime: 7,
    excerpt: "Grid 和 Flexbox 是现代 CSS 布局的两大支柱，本文通过实际案例讲解何时选择哪种布局方式，以及如何组合使用它们。",
    content: `# 现代 CSS 布局：Grid vs Flexbox

理解 Grid 和 Flexbox 的区别是成为优秀前端开发者的关键。

## Flexbox：一维布局

Flexbox 适合处理**一个方向**上的布局：

\`\`\`css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
\`\`\`

## Grid：二维布局

Grid 适合处理**行和列**的二维布局：

\`\`\`css
.blog-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-rows: auto 1fr auto;
  gap: 2rem;
}
\`\`\`

## 何时用哪个？

| 场景 | 推荐 |
|------|------|
| 导航栏 | Flexbox |
| 卡片网格 | Grid |
| 表单布局 | Grid |
| 按钮组 | Flexbox |
| 页面整体布局 | Grid |

## 组合使用

\`\`\`css
/* 外层用 Grid 定义页面结构 */
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}

/* 内层用 Flexbox 处理组件内部 */
.card-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
\`\`\`

## 总结

Grid 和 Flexbox 相辅相成，合理组合使用才能写出最优雅的布局代码。`,
  },
  {
    id: "6",
    title: "Docker 容器化最佳实践",
    slug: "docker-best-practices",
    date: "2026-01-05",
    tags: ["Docker", "DevOps", "后端"],
    readTime: 9,
    excerpt: "分享在生产环境中使用 Docker 的最佳实践，包括镜像优化、多阶段构建、安全加固和容器编排策略。",
    content: `# Docker 容器化最佳实践

Docker 已成为现代应用部署的标准，掌握最佳实践能让你的容器更安全、更高效。

## 多阶段构建

\`\`\`dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

## 最小化镜像

- 使用 Alpine 基础镜像
- 合并 RUN 指令减少层数
- 使用 .dockerignore

\`\`\`
node_modules
.git
*.md
.env.local
dist
\`\`\`

## 健康检查

\`\`\`dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \\
  CMD wget -qO- http://localhost:3000/health || exit 1
\`\`\`

## 非 root 用户

\`\`\`dockerfile
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
\`\`\`

## Docker Compose

\`\`\`yaml
services:
  app:
    build: .
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    depends_on:
      db:
        condition: service_healthy
    
  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD", "pg_isready"]
\`\`\`

## 总结

遵循这些最佳实践，你的 Docker 部署将更安全、更高效、更易于维护。`,
  },
];

export const getAllTags = (): string[] => {
  const tagSet = new Set<string>();
  posts.forEach(post => post.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
};

export const getPostsByTag = (tag: string): Post[] => {
  return posts.filter(post => post.tags.includes(tag));
};

export const getPostBySlug = (slug: string): Post | undefined => {
  return posts.find(post => post.slug === slug);
};
