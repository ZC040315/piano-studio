import { PIANO_RANGE, midiToLabel } from '../lib/keys.js'

const BLACK_SEMITONES = new Set([1, 3, 6, 8, 10])

export default function Piano({ highlight = [], active = [], range = PIANO_RANGE, onPlay, disabled = false }) {
  const whiteMidis = []
  for (let midi = range.low; midi <= range.high; midi++) {
    if (!BLACK_SEMITONES.has(((midi - 60) % 12 + 12) % 12)) whiteMidis.push(midi)
  }
  const blackMidis = []
  for (let midi = range.low; midi <= range.high; midi++) {
    if (BLACK_SEMITONES.has(((midi - 60) % 12 + 12) % 12)) blackMidis.push(midi)
  }
  const keyWidth = 100 / whiteMidis.length

  return (
    <div className="piano" role="group" aria-label="虚拟钢琴">
      {whiteMidis.map((midi) => {
        const activeCls = active.includes(midi) ? ' is-active' : ''
        const hlCls = highlight.includes(midi) ? ' is-highlight' : ''
        return (
          <button
            key={midi}
            type="button"
            className={`piano-key white${activeCls}${hlCls}`}
            style={{ width: `${keyWidth}%` }}
            onClick={() => !disabled && onPlay?.(midi)}
            aria-label={`琴键 ${midiToLabel(midi)}`}
          >
            <span className="piano-label">{midiToLabel(midi)}</span>
          </button>
        )
      })}
      {blackMidis.map((midi) => {
        const indexInWhites = whiteMidis.indexOf(midi - 1)
        const left = ((indexInWhites + 1) / whiteMidis.length) * 100
        const cls = active.includes(midi) ? ' is-active' : highlight.includes(midi) ? ' is-highlight' : ''
        return (
          <button
            key={midi}
            type="button"
            className={`piano-key black${cls}`}
            style={{ left: `${left}%` }}
            onClick={() => !disabled && onPlay?.(midi)}
            aria-label={`琴键 ${midiToLabel(midi)}`}
          />
        )
      })}
    </div>
  )
}
