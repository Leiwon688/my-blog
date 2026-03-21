/**
 * 简单的认证模块
 * - 账号/密码硬编码（前端博客无需后端）
 * - 登录状态存 sessionStorage（关闭浏览器自动退出）
 */

const AUTH_KEY = 'leo_blog_authed';
const CREDENTIALS = { username: 'Leo6487', password: 'AI26926451' };

export function login(username: string, password: string): boolean {
  if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
    sessionStorage.setItem(AUTH_KEY, '1');
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY);
}

export function isAuthed(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}
