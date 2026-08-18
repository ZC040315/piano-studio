import { Link } from 'react-router-dom'
import { lessons, lessonsByStage } from '../data/lessons.js'
import { stages } from '../data/stages.js'
import { loadProgress } from '../lib/progress.js'

export default function LessonsPage() {
  const progress = loadProgress()
  const doneCount = Object.keys(progress.completed).filter((id) => /^lesson-\d+$/.test(id)).length
  return (
    <main className="page lessons-page">
      <h1>全部课程</h1>
      <div className="progress-bar"><span style={{ width: `${(doneCount / lessons.length) * 100}%` }} /></div>
      <p className="muted">已完成 {doneCount}/{lessons.length} 课</p>
      {stages.map((stage) => (
        <section key={stage.id} className="stage-group">
          <h2>阶段{stage.id} · {stage.title} <small>{stage.range}</small></h2>
          <div className="lesson-grid">
            {lessonsByStage(stage.id).map((lesson) => {
              const done = Boolean(progress.completed[lesson.id])
              return (
                <Link key={lesson.id} to={`/lessons/${lesson.id}`} className="card lesson-card">
                  <span className="lesson-no">第 {lesson.order} 课</span>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.goal}</p>
                  {done && <span className="done-badge">已学 ✓</span>}
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </main>
  )
}
