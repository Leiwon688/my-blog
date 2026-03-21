import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProfile } from '../data/store';
import { logout, isAuthed } from '../auth/useAuth';
import SearchBox from './SearchBox';

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/tags', label: '标签' },
  { to: '/about', label: '关于' },
];

const adminLinks = [
  { to: '/admin/posts', label: '文章' },
  { to: '/admin/tags', label: '标签' },
  { to: '/admin/profile', label: '站点设置' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [siteTitle, setSiteTitle] = useState('Leo的博客');
  const isAdmin = pathname.startsWith('/admin');
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    setSiteTitle(getProfile().siteTitle);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-zinc-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="font-bold text-lg text-zinc-900 tracking-tight hover:text-blue-600 transition-colors shrink-0">
            {siteTitle}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {!isLogin && (isAdmin ? adminLinks : navLinks).map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to))
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* 前台：搜索框 */}
            {!isAdmin && !isLogin && <SearchBox />}

            {/* 后台：前台按钮 + 退出 */}
            {isAdmin && !isLogin && (
              <>
                <Link
                  to="/"
                  className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  前台
                </Link>
                {isAuthed() && (
                  <button
                    onClick={handleLogout}
                    className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    退出
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Mobile right: search + burger */}
          <div className="flex items-center gap-1 sm:hidden">
            {!isAdmin && !isLogin && <SearchBox />}
            <button
              className="p-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="sm:hidden pb-3 flex flex-col gap-1">
            {!isLogin && (isAdmin ? adminLinks : navLinks).map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  pathname === link.to
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && !isLogin && (
              <>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer mt-1"
                >
                  ← 前台
                </Link>
                {isAuthed() && (
                  <button
                    onClick={handleLogout}
                    className="text-left px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    退出登录
                  </button>
                )}
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
