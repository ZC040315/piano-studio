import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLesson } from '../data/lessons.js'
import { stages } from '../data/stages.js'
import { exercises } from '../data/exercises.js'
import AnimatedDemo from '../components/AnimatedDemo.jsx'
import ExerciseSection from '../components/ExerciseSection.jsx'
import VideoBlock from '../components/VideoBlock.jsx'
import { loadProgress, markLessonCompleted, saveProgress } from '../lib/progress.js'
import { starsFor } from '../lib/practice.js'

export default function LessonPage() {
  const { id } = useParams()
  const lesson = getLesson(id)
  const [progress, setProgress] = useState(() => loadProgress())
  const [done, setDone] = useState(() => new Set())

  const stage = useMemo(() => stages.find((s) => s.id === lesson?.stage), [lesson])
  if (!lesson) {
    return (
      <main className="page">
        <h1>课程不存在</h1>
        <Link className="btn" to="/lessons">返回课程列表</Link>
      </main>
    )
  }

  const allDone = done.size >= lesson.exerciseIds.length
  const completed = Boolean(progress.completed[lesson.id])

  const finishLesson = () => {
    const stars = Math.min(...lesson.exerciseIds.map((eid) => progress.completed[`${lesson.id}:${eid}`]?.stars ?? 1), 1)
    const next = markLessonCompleted(progress, lesson.id, stars)
    saveProgress(next)
    setProgress(next)
  }

  return (
    <main className="page lesson-page">
      <Link to="/lessons" className="back-link">← 返回课程列表</Link>
      <span className="stage-badge" style={{ background: stage.accent }}>阶段{stage.id} · {stage.title}</span>
      <h1>第 {lesson.order} 课 · {lesson.title}</h1>
      <div className="goal card">学习目标：{lesson.goal}</div>

      <section className="lesson-intro">
        {lesson.intro.map((block, i) => {
          if (block.type === 'demo') return <AnimatedDemo key={i} block={block} />
          if (block.type === 'tip') return <aside key={i} className="tip">{block.text}</aside>
          return <p key={i}>{block.text}</p>
        })}
      </section>

      <VideoBlock video={lesson.video} />

      <h2>跟练练习</h2>
      {lesson.exerciseIds.map((eid) => (
        <ExerciseSection
          key={eid}
          exercise={exercises[eid]}
          onComplete={(exerciseId, stars) => {
            setDone((prev) => new Set(prev).add(exerciseId))
            setProgress((p) => {
              const next = { ...p, completed: { ...p.completed, [`${lesson.id}:${exerciseId}`]: { stars, doneAt: new Date().toISOString().slice(0, 10) } } }
              saveProgress(next)
              return next
            })
          }}
        />
      ))}

      <div className="lesson-finish">
        {completed ? (
          <p className="completed-note">本课已学完 ✓</p>
        ) : allDone ? (
          <button className="btn" onClick={finishLesson}>完成本课</button>
        ) : (
          <p className="muted">完成全部练习后即可打卡本课</p>
        )}
      </div>
    </main>
  )
}
