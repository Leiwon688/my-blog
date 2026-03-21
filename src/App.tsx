import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Tags from './pages/Tags';
import About from './pages/About';
import Login from './pages/Login';
import { PostList, PostEditor } from './pages/admin/PostAdmin';
import TagAdmin from './pages/admin/TagAdmin';
import ProfileAdmin from './pages/admin/ProfileAdmin';
import { getProfile } from './data/store';
import { isAuthed } from './auth/useAuth';

// ---------- 路由守卫：未登录跳转到登录页 ----------
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (!isAuthed()) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

// ---------- 页脚 ----------
function Footer() {
  const [footerText, setFooterText] = useState('用代码丈量世界 🌍');
  const [siteTitle, setSiteTitle] = useState("Leo's Blog");

  useEffect(() => {
    const p = getProfile();
    setFooterText(p.footerText);
    setSiteTitle(p.siteTitle);
  }, []);

  return (
    <footer className="border-t border-zinc-100 mt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400">
        <span>© {new Date().getFullYear()} {siteTitle}. Built with React + TypeScript.</span>
        <span>{footerText}</span>
      </div>
    </footer>
  );
}

// ---------- App ----------
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Routes>
            {/* 前台 */}
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<PostDetail />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/tags/:tag" element={<Tags />} />
            <Route path="/about" element={<About />} />

            {/* 登录 */}
            <Route path="/admin/login" element={<Login />} />

            {/* 后台管理（需要登录） */}
            <Route path="/admin/posts" element={<PrivateRoute><PostList /></PrivateRoute>} />
            <Route path="/admin/posts/new" element={<PrivateRoute><PostEditor /></PrivateRoute>} />
            <Route path="/admin/posts/edit/:id" element={<PrivateRoute><PostEditor /></PrivateRoute>} />
            <Route path="/admin/tags" element={<PrivateRoute><TagAdmin /></PrivateRoute>} />
            <Route path="/admin/profile" element={<PrivateRoute><ProfileAdmin /></PrivateRoute>} />
            {/* /admin 根路径重定向 */}
            <Route path="/admin" element={<Navigate to="/admin/posts" replace />} />

            {/* 404 */}
            <Route path="*" element={
              <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold text-zinc-900 mb-4">404</h2>
                <p className="text-zinc-500 mb-6">页面不存在</p>
                <a href="/" className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                  ← 返回首页
                </a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
