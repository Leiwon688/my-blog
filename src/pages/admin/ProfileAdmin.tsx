import { useState, useEffect } from 'react';
import { getProfile, saveProfile, type SiteProfile, type SkillGroup, type SocialLink } from '../../data/store';

export default function ProfileAdmin() {
  const [profile, setProfile] = useState<SiteProfile>(getProfile());
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'about' | 'skills' | 'social'>('basic');

  useEffect(() => { setProfile(getProfile()); }, []);

  const set = <K extends keyof SiteProfile>(key: K, value: SiteProfile[K]) => {
    setProfile(p => ({ ...p, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // ---- 技能组操作 ----
  const updateSkillGroup = (idx: number, sg: SkillGroup) => {
    const skills = [...profile.skills];
    skills[idx] = sg;
    set('skills', skills);
  };
  const addSkillGroup = () => {
    set('skills', [...profile.skills, { category: '新分类', items: [] }]);
  };
  const removeSkillGroup = (idx: number) => {
    set('skills', profile.skills.filter((_, i) => i !== idx));
  };

  // ---- 社交链接操作 ----
  const updateLink = (idx: number, link: SocialLink) => {
    const links = [...profile.socialLinks];
    links[idx] = link;
    set('socialLinks', links);
  };
  const addLink = () => {
    set('socialLinks', [...profile.socialLinks, { label: '', href: '', type: 'custom' }]);
  };
  const removeLink = (idx: number) => {
    set('socialLinks', profile.socialLinks.filter((_, i) => i !== idx));
  };

  // ---- 简介段落操作 ----
  const updateParagraph = (idx: number, val: string) => {
    const ps = [...profile.aboutParagraphs];
    ps[idx] = val;
    set('aboutParagraphs', ps);
  };
  const addParagraph = () => set('aboutParagraphs', [...profile.aboutParagraphs, '']);
  const removeParagraph = (idx: number) => {
    set('aboutParagraphs', profile.aboutParagraphs.filter((_, i) => i !== idx));
  };

  const tabs = [
    { id: 'basic' as const, label: '基本信息' },
    { id: 'about' as const, label: '关于我' },
    { id: 'skills' as const, label: '技能栈' },
    { id: 'social' as const, label: '社交链接' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">站点设置</h1>
          <p className="text-sm text-zinc-400 mt-0.5">配置个人资料与页面内容</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-zinc-900 text-white hover:bg-zinc-700'
          }`}
        >
          {saved ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              已保存
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              保存设置
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-zinc-100 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-5">

        {/* ========== 基本信息 ========== */}
        {activeTab === 'basic' && (
          <>
            <Field label="站点标题" hint="显示在浏览器标签和导航栏 Logo">
              <Input value={profile.siteTitle} onChange={v => set('siteTitle', v)} />
            </Field>
            <Field label="首页问候语" hint="首页大标题，如「你好，我是 Leo 👋」">
              <Input value={profile.heroName} onChange={v => set('heroName', v)} />
            </Field>
            <Field label="首页简介" hint="首页问候语下方的一句话介绍">
              <Textarea value={profile.heroBio} onChange={v => set('heroBio', v)} rows={2} />
            </Field>
            <Field label="页脚文字">
              <Input value={profile.footerText} onChange={v => set('footerText', v)} />
            </Field>
          </>
        )}

        {/* ========== 关于我 ========== */}
        {activeTab === 'about' && (
          <>
            <Field label="显示名称" hint="关于页面的大名">
              <Input value={profile.aboutName} onChange={v => set('aboutName', v)} />
            </Field>
            <Field label="一句话介绍" hint="名称下方的职位 / 身份描述">
              <Input value={profile.aboutSubtitle} onChange={v => set('aboutSubtitle', v)} />
            </Field>
            <Field label="联系邮箱">
              <Input value={profile.email} onChange={v => set('email', v)} placeholder="your@email.com" />
            </Field>
            <Field label="个人简介段落" hint="每个输入框对应一段话">
              <div className="space-y-2">
                {profile.aboutParagraphs.map((p, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Textarea
                      value={p}
                      onChange={v => updateParagraph(idx, v)}
                      rows={2}
                      className="flex-1"
                    />
                    <button
                      onClick={() => removeParagraph(idx)}
                      className="mt-0.5 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={addParagraph}
                  className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 px-2 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  添加段落
                </button>
              </div>
            </Field>
          </>
        )}

        {/* ========== 技能栈 ========== */}
        {activeTab === 'skills' && (
          <Field label="技能分组" hint="每组一个分类，多个技能用逗号分隔">
            <div className="space-y-3">
              {profile.skills.map((sg, idx) => (
                <div key={idx} className="flex gap-2 items-start p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={sg.category}
                      onChange={e => updateSkillGroup(idx, { ...sg, category: e.target.value })}
                      placeholder="分类名（如：前端）"
                      className="w-full px-3 py-1.5 text-sm font-medium border border-zinc-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                    />
                    <input
                      type="text"
                      value={sg.items.join(', ')}
                      onChange={e => updateSkillGroup(idx, {
                        ...sg,
                        items: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="技能列表（逗号分隔，如：React, TypeScript, Vue）"
                      className="w-full px-3 py-1.5 text-sm border border-zinc-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {sg.items.map(item => (
                        <span key={item} className="text-xs px-2 py-0.5 bg-white border border-zinc-200 rounded-md text-zinc-600">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => removeSkillGroup(idx)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={addSkillGroup}
                className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 px-2 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                添加分组
              </button>
            </div>
          </Field>
        )}

        {/* ========== 社交链接 ========== */}
        {activeTab === 'social' && (
          <Field label="社交链接" hint="显示在关于页面头像旁边">
            <div className="space-y-2">
              {profile.socialLinks.map((link, idx) => (
                <div key={idx} className="flex gap-2 items-center p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={e => updateLink(idx, { ...link, label: e.target.value })}
                      placeholder="显示文字（如：GitHub）"
                      className="px-3 py-1.5 text-sm border border-zinc-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                    />
                    <select
                      value={link.type}
                      onChange={e => updateLink(idx, { ...link, type: e.target.value as SocialLink['type'] })}
                      className="px-3 py-1.5 text-sm border border-zinc-200 rounded-lg outline-none focus:border-blue-400 bg-white cursor-pointer"
                    >
                      <option value="github">GitHub</option>
                      <option value="twitter">Twitter / X</option>
                      <option value="weibo">微博</option>
                      <option value="rss">RSS</option>
                      <option value="custom">自定义</option>
                    </select>
                    <input
                      type="text"
                      value={link.href}
                      onChange={e => updateLink(idx, { ...link, href: e.target.value })}
                      placeholder="链接地址（https://...）"
                      className="col-span-2 px-3 py-1.5 text-sm border border-zinc-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                    />
                  </div>
                  <button
                    onClick={() => removeLink(idx)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={addLink}
                className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 px-2 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                添加链接
              </button>
            </div>
          </Field>
        )}
      </div>
    </div>
  );
}

// ---- 通用子组件 ----
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5">
        <label className="text-sm font-medium text-zinc-700">{label}</label>
        {hint && <span className="ml-2 text-xs text-zinc-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Input({
  value, onChange, placeholder, className = '',
}: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all ${className}`}
    />
  );
}

function Textarea({
  value, onChange, rows = 3, placeholder, className = '',
}: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string; className?: string }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none ${className}`}
    />
  );
}
