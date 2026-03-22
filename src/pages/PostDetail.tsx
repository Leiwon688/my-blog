import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getPosts, type Post } from '../data/store';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [posts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [all, p] = await Promise.all([getPosts(), getPostBySlug(slug || '')]);
      setAllPosts(all);
      setPost(p);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-zinc-400">加载中...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-4">文章不存在</h2>
        <p className="text-zinc-500 mb-6">抱歉，找不到这篇文章。</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
          ← 返回首页
        </Link>
      </div>
    );
  }

  const currentIndex = posts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 mb-8 transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回
      </button>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map(tag => (
            <Link
              key={tag}
              to={`/tags/${encodeURIComponent(tag)}`}
              className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              {tag}
            </Link>
          ))}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 leading-snug mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <span>{post.date}</span>
          <span>·</span>
          <span>约 {post.readTime} 分钟阅读</span>
        </div>
      </header>

      {/* Markdown Content */}
      <div className="prose prose-zinc prose-sm sm:prose-base max-w-none
        prose-headings:font-bold prose-headings:text-zinc-900
        prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
        prose-h3:text-lg prose-h3:mt-6
        prose-p:text-zinc-700 prose-p:leading-relaxed
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-zinc-900
        prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-pre:rounded-xl prose-pre:p-5 prose-pre:overflow-x-auto
        prose-pre:code:bg-transparent prose-pre:code:text-zinc-100 prose-pre:code:p-0 prose-pre:code:text-sm
        prose-blockquote:border-l-blue-400 prose-blockquote:text-zinc-500 prose-blockquote:italic
        prose-ul:text-zinc-700 prose-ol:text-zinc-700
        prose-li:my-1
        prose-table:text-sm prose-th:bg-zinc-50 prose-th:font-semibold
        prose-hr:border-zinc-200
        prose-img:rounded-lg
      ">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Prev/Next Navigation */}
      <div className="mt-12 pt-8 border-t border-zinc-100 grid grid-cols-2 gap-4">
        {prevPost ? (
          <Link
            to={`/post/${prevPost.slug}`}
            className="group p-4 rounded-xl border border-zinc-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer"
          >
            <div className="text-xs text-zinc-400 mb-1">← 上一篇</div>
            <div className="text-sm font-medium text-zinc-700 group-hover:text-blue-600 transition-colors line-clamp-2">
              {prevPost.title}
            </div>
          </Link>
        ) : <div />}

        {nextPost ? (
          <Link
            to={`/post/${nextPost.slug}`}
            className="group p-4 rounded-xl border border-zinc-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer text-right"
          >
            <div className="text-xs text-zinc-400 mb-1">下一篇 →</div>
            <div className="text-sm font-medium text-zinc-700 group-hover:text-blue-600 transition-colors line-clamp-2">
              {nextPost.title}
            </div>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
