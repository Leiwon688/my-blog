import { useState, useEffect } from 'react';
import { getProfile, getProfileFromStorage, saveProfileToStorage, type SiteProfile } from '../../data/store';

export default function ProfileAdmin() {
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'about' | 'skills' | 'social'>('basic');

  useEffect(() => {
    async function load() {
      // 优先从 localStorage 读取
      const stored = getProfileFromStorage();
      if (stored) {
        setProfile(stored);
      } else {
        const p = await getProfile();
        setProfile(p);
      }
    }
    load();
  }, []);

  const set = <K extends keyof SiteProfile>(key: K, value: SiteProfile[K]) => {
    if (!profile) return;
    setProfile(p => p ? { ...p, [key]: value } : null);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    await saveProfileToStorage(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
        <p className="text-zinc-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">站点设置</h1>
        <button
          onClick={handleSave}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-zinc-900 hover:bg-zinc-700 text-white'
          }`}
        >
          {saved ? '已保存 ✓' : '保存设置'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-zinc-200 overflow-x-auto">
        {(['basic', 'about', 'skills', 'social'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === tab
                ? 'text-blue-600 border-blue-600'
                : 'text-zinc-500 border-transparent hover:text-zinc-700'
            }`}
          >
            {tab === 'basic' && '基本信息'}
            {tab === 'about' && '关于我'}
            {tab === 'skills' && '技能栈'}
            {tab === 'social' && '社交链接'}
          </button>
        ))}
      </div>

      {/* Basic Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">站点标题</label>
            <input
              type="text"
              value={profile.siteTitle}
              onChange={e => set('siteTitle', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">首页问候语</label>
            <input
              type="text"
              value={profile.heroName}
              onChange={e => set('heroName', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">首页简介</label>
            <textarea
              value={profile.heroBio}
              onChange={e => set('heroBio', e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">页脚文字</label>
            <input
              type="text"
              value={profile.footerText}
              onChange={e => set('footerText', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">显示名称</label>
            <input
              type="text"
              value={profile.aboutName}
              onChange={e => set('aboutName', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">一句话介绍</label>
            <input
              type="text"
              value={profile.aboutSubtitle}
              onChange={e => set('aboutSubtitle', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">邮箱</label>
            <input
              type="email"
              value={profile.email}
              onChange={e => set('email', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">个人简介段落</label>
            {profile.aboutParagraphs.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <textarea
                  value={p}
                  onChange={e => {
                    const arr = [...profile.aboutParagraphs];
                    arr[i] = e.target.value;
                    set('aboutParagraphs', arr);
                  }}
                  rows={2}
                  className="flex-1 px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  onClick={() => {
                    const arr = profile.aboutParagraphs.filter((_, idx) => idx !== i);
                    set('aboutParagraphs', arr);
                  }}
                  className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => set('aboutParagraphs', [...profile.aboutParagraphs, ''])}
              className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              + 添加段落
            </button>
          </div>
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          {profile.skills.map((group, gi) => (
            <div key={gi} className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={group.category}
                  onChange={e => {
                    const arr = [...profile.skills];
                    arr[gi].category = e.target.value;
                    set('skills', arr);
                  }}
                  placeholder="分类名称"
                  className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => set('skills', profile.skills.filter((_, i) => i !== gi))}
                  className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                value={group.items.join(', ')}
                onChange={e => {
                  const arr = [...profile.skills];
                  arr[gi].items = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  set('skills', arr);
                }}
                placeholder="技能项，用逗号分隔"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <button
            onClick={() => set('skills', [...profile.skills, { category: '', items: [] }])}
            className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            + 添加技能分组
          </button>
        </div>
      )}

      {/* Social Tab */}
      {activeTab === 'social' && (
        <div className="space-y-4">
          {profile.socialLinks.map((link, li) => (
            <div key={li} className="flex gap-2 items-start p-4 bg-zinc-50 rounded-lg border border-zinc-200">
              <select
                value={link.type}
                onChange={e => {
                  const arr = [...profile.socialLinks];
                  arr[li].type = e.target.value as any;
                  set('socialLinks', arr);
                }}
                className="px-2 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="github">GitHub</option>
                <option value="twitter">Twitter</option>
                <option value="weibo">微博</option>
                <option value="rss">RSS</option>
                <option value="custom">自定义</option>
              </select>
              <input
                type="text"
                value={link.label}
                onChange={e => {
                  const arr = [...profile.socialLinks];
                  arr[li].label = e.target.value;
                  set('socialLinks', arr);
                }}
                placeholder="显示名称"
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                value={link.href}
                onChange={e => {
                  const arr = [...profile.socialLinks];
                  arr[li].href = e.target.value;
                  set('socialLinks', arr);
                }}
                placeholder="链接地址"
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => set('socialLinks', profile.socialLinks.filter((_, i) => i !== li))}
                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={() => set('socialLinks', [...profile.socialLinks, { label: '', href: '', type: 'custom' }])}
            className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            + 添加社交链接
          </button>
        </div>
      )}

  <p className="mt-6 text-xs text-zinc-400">
    * 修改将保存在浏览器本地存储中，预览时生效。如需永久保存，请导出 data.json 文件。
  </p>
    </div>
  );
}
