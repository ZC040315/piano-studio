import { Link } from 'react-router-dom'
import { lessons } from '../data/lessons.js'
import { stages } from '../data/stages.js'
import { loadProgress, nextLesson } from '../lib/progress.js'

export default function HomePage() {
  const progress = loadProgress()
  const next = nextLesson(lessons.map((l) => l.id), progress)
  return (
    <main className="page home">
      <section className="hero">
        <h1>从零开始，弹出第一首歌</h1>
        <p className="hero-sub">没有乐理基础？没关系。24 课循序渐进，每课都有键盘跟练，打开就能学。</p>
        <Link className="btn" to="/lessons">开始学习</Link>
      </section>

      {next && (
        <section className="continue card">
          <p>继续学习</p>
          <Link className="btn" to={`/lessons/${next}`}>第 {lessons.find((l) => l.id === next).order} 课 · {lessons.find((l) => l.id === next).title}</Link>
        </section>
      )}

      <section className="stages">
        <h2>三阶段学习路径</h2>
        <div className="stage-grid">
          {stages.map((s) => (
            <Link key={s.id} to="/lessons" className="card stage-card" style={{ borderTop: `4px solid ${s.accent}` }}>
              <h3>阶段{s.id} · {s.title}</h3>
              <p>{s.range} · {s.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="tips card">
        <h2>给新手的三句话</h2>
        <ul>
          <li>每天 10–15 分钟，比周末练两小时更有效。</li>
          <li>先慢后快，速度是慢慢长出来的。</li>
          <li>弹错了很正常，停下来重新开始就好。</li>
        </ul>
      </section>
    </main>
  )
}
