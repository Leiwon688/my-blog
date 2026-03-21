import { useState, useEffect } from 'react';
import { getTags, addTag, renameTag, deleteTag, getPostsByTag } from '../../data/store';

export default function TagAdmin() {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [error, setError] = useState('');

  const refresh = () => setTags(getTags());
  useEffect(refresh, []);

  const handleAdd = () => {
    const t = newTag.trim();
    if (!t) return;
    if (tags.includes(t)) { setError('标签已存在'); return; }
    addTag(t);
    setNewTag('');
    setError('');
    refresh();
  };

  const handleRename = (old: string) => {
    const t = editValue.trim();
    if (!t) return;
    if (t !== old && tags.includes(t)) { setError('标签名已存在'); return; }
    renameTag(old, t);
    setEditingTag(null);
    setEditValue('');
    setError('');
    refresh();
  };

  const handleDelete = (tag: string) => {
    deleteTag(tag);
    setDeleteTarget(null);
    refresh();
  };

  const startEdit = (tag: string) => {
    setEditingTag(tag);
    setEditValue(tag);
    setError('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-900">标签管理</h1>
        <p className="text-sm text-zinc-400 mt-0.5">共 {tags.length} 个标签</p>
      </div>

      {/* Add Tag */}
      <div className="mb-8 p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
        <h2 className="text-sm font-semibold text-zinc-700 mb-3">新建标签</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={e => { setNewTag(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="输入标签名称..."
            className={`flex-1 px-3 py-2 text-sm border rounded-lg outline-none transition-all ${
              error ? 'border-red-300 focus:border-red-400' : 'border-zinc-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
            }`}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            添加
          </button>
        </div>
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>

      {/* Tag List */}
      <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-xl overflow-hidden">
        {tags.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-sm">暂无标签</div>
        ) : (
          tags.map(tag => {
            const postCount = getPostsByTag(tag).length;
            const isEditing = editingTag === tag;

            return (
              <div key={tag} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors group">
                {isEditing ? (
                  <>
                    <input
                      autoFocus
                      type="text"
                      value={editValue}
                      onChange={e => { setEditValue(e.target.value); setError(''); }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleRename(tag);
                        if (e.key === 'Escape') { setEditingTag(null); setError(''); }
                      }}
                      className="flex-1 px-3 py-1.5 text-sm border border-blue-400 rounded-lg outline-none ring-2 ring-blue-100"
                    />
                    <button
                      onClick={() => handleRename(tag)}
                      className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => { setEditingTag(null); setError(''); }}
                      className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                      取消
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
                      </svg>
                      <span className="text-sm font-medium text-zinc-800">{tag}</span>
                      <span className="text-xs text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-full">{postCount} 篇</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(tag)}
                        title="重命名"
                        className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(tag)}
                        title="删除"
                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
      {error && editingTag && <p className="mt-2 text-xs text-red-500 px-1">{error}</p>}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 mx-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">删除标签「{deleteTarget}」</h3>
                <p className="text-sm text-zinc-500 mt-0.5">
                  该标签将从 {getPostsByTag(deleteTarget).length} 篇文章中移除，此操作不可恢复。
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 text-sm font-medium border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
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
