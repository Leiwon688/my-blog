import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostsForAdmin, getPostById, getTagsForAdmin, savePostsForAdmin, type Post, slugify } from '../../data/store';
import MarkdownEditor from '../../components/MarkdownEditor';

// =============================================
// 文章列表
// =============================================
export function PostList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = async () => {
    const data = await getPostsForAdmin();
    setPosts(data);
  };
  useEffect(() => { refresh(); }, []);

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    savePostsForAdmin(updated);
    refresh();
    setDeleteId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">文章管理</h1>
        <button
          onClick={() => navigate('/admin/posts/new')}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          + 新建文章
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="搜索文章..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">标题</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase hidden md:table-cell">标签</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase hidden sm:table-cell">日期</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-zinc-400">
                  暂无文章
                </td>
              </tr>
            ) : filtered.map(post => (
              <tr key={post.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors group">
                <td className="px-4 py-3">
                  <div className="font-medium text-zinc-900">{post.title}</div>
                  <div className="text-xs text-zinc-400 md:hidden">{post.tags.join(', ')}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">{t}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-zinc-400 hidden sm:table-cell">{post.date}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/post/${post.slug}`)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors cursor-pointer"
                      title="预览"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors cursor-pointer"
                      title="编辑"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteId(post.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="删除"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">确认删除</h3>
            <p className="text-zinc-500 text-sm mb-6">此操作不可恢复，确定要删除这篇文章吗？</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
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
// 文章编辑器
// =============================================
interface FormState {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  readTime: number;
}

export function PostEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState<FormState>({
    title: '',
    slug: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    excerpt: '',
    content: '',
    readTime: 1,
  });
  const [tagInput, setTagInput] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // 加载数据
  useEffect(() => {
    async function load() {
      const [, tags] = await Promise.all([getPostsForAdmin(), getTagsForAdmin()]);
      setAllTags(tags);

      if (isEdit && id) {
        const post = await getPostById(id);
        if (post) {
          setForm({
            title: post.title,
            slug: post.slug,
            date: post.date,
            tags: post.tags,
            excerpt: post.excerpt,
            content: post.content,
            readTime: post.readTime,
          });
        }
      }
    }
    load();
  }, [id, isEdit]);

  const handleTitleChange = (val: string) => {
    setForm(f => ({ ...f, title: val, slug: slugify(val) }));
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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = '标题不能为空';
    if (!form.content.trim()) e.content = '内容不能为空';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    const posts = await getPostsForAdmin();
    
    if (isEdit && id) {
      // 更新
      const updated = posts.map(p => p.id === id ? { ...p, ...form } : p);
      savePostsForAdmin(updated);
    } else {
      // 新建
      const newPost: Post = {
        ...form,
        id: Date.now().toString(),
      };
      savePostsForAdmin([newPost, ...posts]);
    }

    setSaving(false);
    navigate('/admin/posts');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">
          {isEdit ? '编辑文章' : '新建文章'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin/posts')}
            className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-700 disabled:bg-zinc-400 text-white rounded-lg transition-colors cursor-pointer"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* 标题 */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">标题 *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="文章标题"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-300' : 'border-zinc-200'
            }`}
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>

        {/* Slug & 日期 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              placeholder="article-slug"
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">发布日期</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 标签 */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">标签</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.tags.map(t => (
              <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-sm">
                {t}
                <button onClick={() => removeTag(t)} className="hover:text-red-500 cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
              placeholder="添加标签，回车确认"
              list="tag-suggestions"
              className="flex-1 px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="tag-suggestions">
              {allTags.filter(t => !form.tags.includes(t)).map(t => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>
        </div>

        {/* 摘要 */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">摘要</label>
          <textarea
            value={form.excerpt}
            onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
            placeholder="文章摘要（可选）"
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* 正文 */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">正文 *</label>
          {errors.content && <p className="mb-2 text-xs text-red-500">{errors.content}</p>}
          <MarkdownEditor
            value={form.content}
            onChange={(val: string) => setForm(f => ({ ...f, content: val }))}
            minHeight={420}
          />
        </div>
      </div>
    </div>
  );
}
