import { useState } from 'react'
import { Link } from 'react-router-dom'
import { scores } from '../data/scores.js'

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'pop', label: '流行歌曲' },
  { key: 'instrumental', label: '钢琴纯音乐' },
]

export default function ScoresPage() {
  const [filter, setFilter] = useState('all')
  const list = scores
    .filter((s) => filter === 'all' || s.category === filter)
    .sort((a, b) => a.difficulty - b.difficulty || a.id.localeCompare(b.id))

  return (
    <main className="page scores-page">
      <h1>曲谱库</h1>
      <p className="muted">30 首流行歌曲与纯音乐简谱，均标注「简化改编 · 仅供学习」；「待校对」曲目暂时无法跟练。</p>
      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`filter-tab${filter === f.key ? ' is-active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="lesson-grid">
        {list.map((s) => (
          <Link key={s.id} to={`/scores/${s.id}`} className="card lesson-card">
            <span className="lesson-no">{s.category === 'pop' ? '流行' : '纯音乐'} · {'★'.repeat(s.difficulty)}{'☆'.repeat(3 - s.difficulty)}</span>
            <h3>{s.title}</h3>
            <p>{s.artist}</p>
            {!s.notes && <span className="pending-badge">待校对</span>}
          </Link>
        ))}
      </div>
    </main>
  )
}
