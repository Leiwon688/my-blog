import { Link } from 'react-router-dom';
import type { Post } from '../data/posts';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group py-6 border-b border-zinc-100 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.tags.map(tag => (
              <Link
                key={tag}
                to={`/tags/${encodeURIComponent(tag)}`}
                className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                onClick={e => e.stopPropagation()}
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Title */}
          <Link to={`/post/${post.slug}`} className="block group cursor-pointer">
            <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
              {post.title}
            </h2>
            {/* Excerpt */}
            <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>
          </Link>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mt-3 text-xs text-zinc-400">
        <span>{post.date}</span>
        <span>·</span>
        <span>约 {post.readTime} 分钟阅读</span>
        <span className="ml-auto">
          <Link
            to={`/post/${post.slug}`}
            className="text-blue-500 hover:text-blue-700 font-medium transition-colors cursor-pointer"
          >
            阅读全文 →
          </Link>
        </span>
      </div>
    </article>
  );
}
