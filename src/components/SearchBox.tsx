import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, type Post } from '../data/store';

const SECRET_PHRASE = '芝麻开门';

export default function SearchBox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 预加载文章数据
  useEffect(() => {
    async function load() {
      const posts = await getPosts();
      setAllPosts(posts);
    }
    load();
  }, []);

  // 打开时自动聚焦
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
    }
  }, [open]);

  // ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // 点击外部关闭
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const handleChange = (val: string) => {
    setQuery(val);

    // 暗号检测
    if (val.trim() === SECRET_PHRASE) {
      setOpen(false);
      navigate('/admin/login');
      return;
    }

    // 文章搜索
    if (val.trim().length < 1) {
      setResults([]);
      return;
    }
    const kw = val.toLowerCase();
    const matched = allPosts.filter(p =>
      p.title.toLowerCase().includes(kw) ||
      p.excerpt.toLowerCase().includes(kw) ||
      p.tags.some(t => t.toLowerCase().includes(kw)) ||
      p.content.toLowerCase().includes(kw)
    ).slice(0, 6);
    setResults(matched);
  };

  const goPost = (slug: string) => {
    setOpen(false);
    navigate(`/post/${slug}`);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* 触发按钮 */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
        aria-label="搜索"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">搜索</span>
      </button>

      {/* 搜索下拉框 */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl border border-zinc-200 shadow-xl overflow-hidden z-50">
          {/* 输入框 */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-zinc-100">
            <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => handleChange(e.target.value)}
              placeholder="搜索文章…"
              className="flex-1 text-sm text-zinc-900 placeholder-zinc-400 outline-none bg-transparent"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
                className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <kbd className="hidden sm:inline text-xs text-zinc-400 border border-zinc-200 rounded px-1 py-0.5">ESC</kbd>
          </div>

          {/* 搜索结果 */}
          {query.trim() && results.length > 0 && (
            <ul className="max-h-72 overflow-y-auto py-1">
              {results.map(post => (
                <li key={post.id}>
                  <button
                    onClick={() => goPost(post.slug)}
                    className="w-full text-left px-4 py-3 hover:bg-zinc-50 transition-colors cursor-pointer group"
                  >
                    <div className="text-sm font-medium text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {post.title}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{post.excerpt}</div>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {post.tags.slice(0, 3).map(t => (
                        <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500">{t}</span>
                      ))}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* 无结果 */}
          {query.trim() && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-zinc-400">
              未找到相关文章
            </div>
          )}

          {/* 提示 */}
          {!query.trim() && (
            <div className="px-4 py-4 text-xs text-zinc-400 text-center">
              输入关键词搜索文章
            </div>
          )}
        </div>
      )}
    </div>
  );
}
