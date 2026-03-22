import { useState, useEffect } from 'react';
import { getTagsForAdmin, getPostsForAdmin, saveTagsForAdmin, savePostsForAdmin } from '../../data/store';

export default function TagAdmin() {
  const [tags, setTags] = useState<string[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [newTag, setNewTag] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [error, setError] = useState('');

  const refresh = async () => {
    const [t, p] = await Promise.all([getTagsForAdmin(), getPostsForAdmin()]);
    setTags(t);
    setPosts(p);
  };
  useEffect(() => { refresh(); }, []);

  const handleAdd = async () => {
    const t = newTag.trim();
    if (!t) return;
    if (tags.includes(t)) { setError('标签已存在'); return; }
    const updated = [...tags, t];
    await saveTagsForAdmin(updated);
    setNewTag('');
    setError('');
    refresh();
  };

  const handleRename = async (old: string) => {
    const t = editValue.trim();
    if (!t) return;
    if (t !== old && tags.includes(t)) { setError('标签名已存在'); return; }

    // 更新标签
    const updatedTags = tags.map(tag => tag === old ? t : tag);
    await saveTagsForAdmin(updatedTags);

    // 更新所有文章的标签
    const updatedPosts = posts.map(post => ({
      ...post,
      tags: post.tags.map((tag: string) => tag === old ? t : tag)
    }));
    await savePostsForAdmin(updatedPosts);

    setEditingTag(null);
    refresh();
  };

  const handleDelete = async (tag: string) => {
    // 从标签列表中移除
    const updatedTags = tags.filter(t => t !== tag);
    await saveTagsForAdmin(updatedTags);

    // 从所有文章中移除该标签
    const updatedPosts = posts.map(post => ({
      ...post,
      tags: post.tags.filter((t: string) => t !== tag)
    }));
    await savePostsForAdmin(updatedPosts);

    setDeleteTarget(null);
    refresh();
  };

  const getTagCount = (tag: string) => {
    return posts.filter(p => p.tags.includes(tag)).length;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">标签管理</h1>

      {/* Add */}
      <div className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={e => { setNewTag(e.target.value); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="新标签名称"
            className="flex-1 px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            添加
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      {/* Tag List */}
      <div className="space-y-2">
        {tags.length === 0 ? (
          <p className="text-center py-8 text-zinc-400">暂无标签</p>
        ) : (
          tags.map(tag => (
            <div
              key={tag}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors"
            >
              {editingTag === tag ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleRename(tag); if (e.key === 'Escape') setEditingTag(null); }}
                    onBlur={() => handleRename(tag)}
                    autoFocus
                    className="flex-1 px-2 py-1 border border-zinc-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </>
              ) : (
                <>
                  <span className="flex-1 font-medium text-zinc-700">{tag}</span>
                  <span className="text-xs text-zinc-400">{getTagCount(tag)} 篇文章</span>
                  <button
                    onClick={() => { setEditingTag(tag); setEditValue(tag); }}
                    className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(tag)}
                    className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">确认删除</h3>
            <p className="text-zinc-500 text-sm mb-6">
              确定要删除标签「{deleteTarget}」吗？该标签将从所有文章中移除。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
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
