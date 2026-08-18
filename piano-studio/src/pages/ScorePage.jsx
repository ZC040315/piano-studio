import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getScore, getScoreNotes } from '../data/scores.js'
import Practice from '../components/Practice.jsx'

export default function ScorePage() {
  const { id } = useParams()
  const score = getScore(id)
  const notes = useMemo(() => (score ? getScoreNotes(score.id) : null), [score])

  if (!score) {
    return (
      <main className="page">
        <h1>曲目不存在</h1>
        <Link className="btn" to="/scores">返回曲谱库</Link>
      </main>
    )
  }

  return (
    <main className="page score-page">
      <Link to="/scores" className="back-link">← 返回曲谱库</Link>
      <h1>{score.title}</h1>
      <p className="muted">{score.artist} · {score.category === 'pop' ? '流行歌曲' : '钢琴纯音乐'} · 难度 {'★'.repeat(score.difficulty)}{'☆'.repeat(3 - score.difficulty)}</p>
      {score.sourceNote && <p className="source-note">来源说明：{score.sourceNote}</p>}
      <p className="muted">简化改编 · 仅供学习</p>
      {notes ? (
        <Practice notesProp={notes} exerciseId={null} />
      ) : (
        <section className="card pending-card">
          <h2>待校对</h2>
          <p>这首曲子的简谱还在校对中，暂时无法跟练。如果你有可靠的谱面，可以发给我们补全。</p>
        </section>
      )}
    </main>
  )
}
