import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, getTags, getProfile, type Post, type SiteProfile } from '../data/store';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string>('全部');
  const [profile, setProfile] = useState<SiteProfile>(getProfile());

  useEffect(() => {
    setPosts(getPosts());
    setAllTags(getTags());
    setProfile(getProfile());
  }, []);

  const displayTags = ['全部', ...allTags];
  const filteredPosts = activeTag === '全部'
    ? posts
    : posts.filter(post => post.tags.includes(activeTag));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">{profile.heroName}</h1>
        <p className="text-zinc-500 text-base leading-relaxed">{profile.heroBio}</p>
      </div>

      {/* Tag Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {displayTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer border ${
                activeTag === tag
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Post List */}
      <div>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 text-zinc-400">
            <p>该标签下暂无文章</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Stats */}
      <div className="mt-10 pt-8 border-t border-zinc-100 flex items-center gap-6 text-sm text-zinc-400">
        <span>共 {filteredPosts.length} 篇文章</span>
        <span>·</span>
        <Link to="/tags" className="hover:text-zinc-600 transition-colors cursor-pointer">
          浏览所有标签
        </Link>
      </div>
    </div>
  );
}
