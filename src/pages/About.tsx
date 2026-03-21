import { useEffect, useState } from 'react';
import { getProfile, type SiteProfile, type SocialLink } from '../data/store';

// 社交图标映射
function SocialIcon({ type }: { type: SocialLink['type'] }) {
  if (type === 'github') return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
  if (type === 'twitter') return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
  if (type === 'rss') return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.18 15.64a2.18 2.18 0 012.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 012.18-2.18M4 4.44A15.56 15.56 0 0119.56 20h-2.83A12.73 12.73 0 004 7.27V4.44m0 5.66a9.9 9.9 0 019.9 9.9h-2.83A7.07 7.07 0 004 12.93V10.1z" />
    </svg>
  );
  if (type === 'weibo') return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.194 13.655c-.146-.394-.532-.602-.981-.476-.449.126-.607.518-.461.912.156.419.092.893-.289 1.154-.47.33-.88.06-1.178-.234 1.071-1.654 1.424-3.635.741-5.481-1.234-3.34-5.339-4.814-9.168-3.298C5.03 7.747 3.003 11.218 4.237 14.558c1.234 3.34 5.339 4.814 9.168 3.298.643-.238 1.24-.545 1.776-.914.583.491 1.252.855 1.998.855 1.766 0 3.098-1.553 2.835-3.088l-.82-.054zM9.671 16.67c-2.408.892-5.009-.06-5.806-2.124-.796-2.065.496-4.37 2.904-5.261 2.407-.892 5.009.06 5.806 2.124.797 2.065-.497 4.37-2.904 5.261z" />
    </svg>
  );
  // custom
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

export default function About() {
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const p = await getProfile();
      setProfile(p);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-center">
        <p className="text-zinc-400">加载中...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Profile */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shrink-0 select-none">
          {profile.aboutName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">{profile.aboutName}</h1>
          <p className="text-zinc-500 text-sm mb-3">{profile.aboutSubtitle}</p>
          {profile.socialLinks.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              {profile.socialLinks.filter(l => l.label && l.href).map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                >
                  <SocialIcon type={link.type} />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* About */}
      {profile.aboutParagraphs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">关于我</h2>
          <div className="space-y-3 text-zinc-600 text-sm leading-relaxed">
            {profile.aboutParagraphs.filter(Boolean).map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {profile.skills.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">技术栈</h2>
          <div className="space-y-4">
            {profile.skills.map(({ category, items }) => (
              <div key={category} className="flex flex-wrap items-start gap-y-2 gap-x-3">
                <span className="text-xs font-medium text-zinc-400 w-12 pt-1 shrink-0">{category}</span>
                <div className="flex flex-wrap gap-2">
                  {items.map(item => (
                    <span key={item} className="text-xs px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {profile.email && (
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">联系我</h2>
          <p className="text-zinc-600 text-sm leading-relaxed mb-3">
            如果你有任何问题、合作意向，或者只是想打个招呼，都欢迎通过以下方式联系我：
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {profile.email}
          </a>
        </section>
      )}
    </div>
  );
}
