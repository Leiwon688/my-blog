import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPosts, getPostById, createPost, updatePost, deletePost, getTags } from '../../data/store';
import type { Post } from '../../data/store';
import MarkdownEditor from '../../components/MarkdownEditor';

// =============================================
// 文章列表
// =============================================
export function PostList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = () => setPosts(getPosts());
  useEffect(refresh, []);

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    deletePost(id);
    refresh();
    setDeleteId(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">文章管理</h1>
          <p className="text-sm text-zinc-400 mt-0.5">共 {posts.length} 篇文章</p>
        </div>
        <button
          onClick={() => navigate('/admin/posts/new')}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建文章
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜索标题或标签..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* List */}
      <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 text-sm">暂无文章</div>
        ) : (
          filtered.map(post => (
            <div key={post.id} className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-50 transition-colors group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-medium text-zinc-800 truncate">{post.title}</span>
                  {post.tags.map(t => (
                    <span key={t} className="text-xs px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded">{t}</span>
                  ))}
                </div>
                <div className="text-xs text-zinc-400">{post.date} · 约 {post.readTime} 分钟</div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => navigate(`/post/${post.slug}`)}
                  title="预览"
                  className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                  title="编辑"
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteId(post.id)}
                  title="删除"
                  className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">确认删除</h3>
                <p className="text-sm text-zinc-500">此操作不可恢复</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 text-sm font-medium border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================
// 文章编辑器（新建 / 编辑）
// =============================================
interface FormState {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export function PostEditor() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<FormState>({
    title: '',
    excerpt: '',
    content: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setAllTags(getTags());
    if (isEdit && id) {
      const post = getPostById(id);
      if (post) {
        setForm({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          tags: post.tags,
        });
      }
    }
  }, [id, isEdit]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = '标题不能为空';
    if (!form.content.trim()) e.content = '内容不能为空';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const excerpt = form.excerpt.trim() || form.content.replace(/[#*`>]/g, '').slice(0, 100).trim() + '...';
      if (isEdit && id) {
        updatePost(id, { ...form, excerpt });
      } else {
        createPost({ ...form, excerpt });
      }
      navigate('/admin/posts');
    } finally {
      setSaving(false);
    }
  };

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/admin/posts')}
          className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-zinc-900">{isEdit ? '编辑文章' : '新建文章'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            标题 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="文章标题"
            className={`w-full px-4 py-2.5 text-base border rounded-xl outline-none transition-all ${
              errors.title
                ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-zinc-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
            }`}
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{String(errors.title)}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">标签</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-blue-400 hover:text-blue-700 cursor-pointer ml-0.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); }
              }}
              placeholder="输入标签，回车添加"
              className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button
              type="button"
              onClick={() => addTag(tagInput)}
              className="px-3 py-2 text-sm bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              添加
            </button>
          </div>
          {/* 已有标签快速选择 */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {allTags.filter(t => !form.tags.includes(t)).map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="text-xs px-2 py-0.5 border border-dashed border-zinc-300 text-zinc-500 rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors cursor-pointer"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            摘要 <span className="text-zinc-400 font-normal text-xs">（留空则自动从内容生成）</span>
          </label>
          <textarea
            value={form.excerpt}
            onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
            placeholder="一两句话描述这篇文章..."
            rows={2}
            className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            正文 <span className="text-red-400">*</span>
          </label>
          <MarkdownEditor
            value={form.content}
            onChange={(val: string) => setForm(f => ({ ...f, content: val }))}
            minHeight={420}
          />
          {errors.content && <p className="mt-1 text-xs text-red-500">{String(errors.content)}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
            className="px-5 py-2.5 text-sm font-medium border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 text-sm font-medium bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {saving ? '保存中...' : isEdit ? '保存修改' : '发布文章'}
          </button>
        </div>
      </form>
    </div>
  );
}
