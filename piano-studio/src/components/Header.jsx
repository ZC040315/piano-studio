import { NavLink } from 'react-router-dom'
import { loadProgress } from '../lib/progress.js'
import { lessons } from '../data/lessons.js'

export default function Header() {
  const progress = loadProgress()
  const doneCount = Object.keys(progress.completed).filter((id) => /^lesson-\d+$/.test(id)).length
  const canStore = (() => {
    try {
      const k = '__piano_probe__'
      globalThis.localStorage?.setItem(k, '1')
      globalThis.localStorage?.removeItem(k)
      return true
    } catch {
      return false
    }
  })()
  return (
    <header className="site-header">
      <NavLink to="/" className="logo">
        <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="7" fill="#8B6B52" />
          <rect x="4" y="10" width="24" height="15" rx="2" fill="#FAF6EF" />
          <rect x="7" y="18" width="3" height="7" fill="#3D3A36" />
          <rect x="12" y="18" width="3" height="7" fill="#3D3A36" />
          <rect x="17" y="18" width="3" height="7" fill="#3D3A36" />
          <rect x="22" y="18" width="3" height="7" fill="#3D3A36" />
        </svg>
        <span>Piano Studio</span>
      </NavLink>
      <nav className="site-nav">
        <NavLink to="/">首页</NavLink>
        <NavLink to="/lessons">课程</NavLink>
        <NavLink to="/scores">曲谱库</NavLink>
        <NavLink to="/guide">学习指南</NavLink>
      </nav>
      <span className="header-progress">已完成 {doneCount}/{lessons.length}</span>
      {!canStore && <p className="storage-hint">当前浏览器无法保存进度，刷新后进度会丢失。</p>}
    </header>
  )
}
