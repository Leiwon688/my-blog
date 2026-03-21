import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTags, getPosts, type Post } from '../data/store';
import PostCard from '../components/PostCard';

export default function Tags() {
  const { tag } = useParams<{ tag?: string }>();
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    setAllTags(getTags());
    setAllPosts(getPosts());
  }, [tag]);

  // 如果有 tag 参数，显示该标签的文章列表
  if (tag) {
    const decodedTag = decodeURIComponent(tag);
    const tagPosts = allPosts.filter(p => p.tags.includes(decodedTag));

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <Link to="/tags" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer">
            ← 所有标签
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white rounded-full text-sm font-medium">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
              </svg>
              {decodedTag}
            </span>
            <span className="text-sm text-zinc-400">{tagPosts.length} 篇文章</span>
          </div>
        </div>
        <div>
          {tagPosts.length === 0 ? (
            <p className="text-center py-16 text-zinc-400 text-sm">该标签下暂无文章</p>
          ) : (
            tagPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    );
  }

  // 标签总览页
  const tagStats = allTags.map(t => ({
    name: t,
    count: allPosts.filter(p => p.tags.includes(t)).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">标签分类</h1>
        <p className="text-zinc-500 text-sm">共 {allTags.length} 个标签，{allPosts.length} 篇文章</p>
      </div>

      {/* Tag Cloud */}
      <div className="flex flex-wrap gap-3 mb-12">
        {tagStats.map(({ name, count }) => (
          <Link
            key={name}
            to={`/tags/${encodeURIComponent(name)}`}
            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
            </svg>
            <span className="text-sm font-medium text-zinc-700 group-hover:text-blue-700 transition-colors">{name}</span>
            <span className="text-xs text-zinc-400 bg-zinc-100 group-hover:bg-blue-100 group-hover:text-blue-600 px-1.5 py-0.5 rounded-full transition-colors">{count}</span>
          </Link>
        ))}
      </div>

      {/* All Tags with posts */}
      <div className="space-y-8">
        {tagStats.map(({ name }) => {
          const tagPosts = allPosts.filter(p => p.tags.includes(name)).slice(0, 3);
          return (
            <div key={name}>
              <div className="flex items-center justify-between mb-3">
                <Link to={`/tags/${encodeURIComponent(name)}`} className="text-base font-semibold text-zinc-800 hover:text-blue-600 transition-colors cursor-pointer">
                  {name}
                </Link>
                <Link to={`/tags/${encodeURIComponent(name)}`} className="text-xs text-zinc-400 hover:text-blue-500 transition-colors cursor-pointer">查看全部 →</Link>
              </div>
              <div className="space-y-2">
                {tagPosts.map(post => (
                  <Link key={post.id} to={`/post/${post.slug}`}
                    className="flex items-center justify-between group py-2 px-3 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm text-zinc-700 group-hover:text-blue-600 transition-colors">{post.title}</span>
                    <span className="text-xs text-zinc-400 shrink-0 ml-4">{post.date}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
