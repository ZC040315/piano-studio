import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LessonsPage from './pages/LessonsPage.jsx'
import LessonPage from './pages/LessonPage.jsx'
import GuidePage from './pages/GuidePage.jsx'

function NotFound() {
  return (
    <main className="page">
      <h1>页面不存在</h1>
      <Link className="btn" to="/">返回首页</Link>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lessons" element={<LessonsPage />} />
      <Route path="/lessons/:id" element={<LessonPage />} />
      <Route path="/guide" element={<GuidePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
