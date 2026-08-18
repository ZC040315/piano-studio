import { useEffect, useMemo, useRef, useState } from 'react'
import Piano from './Piano.jsx'
import { parseExercise } from '../lib/notes.js'
import { createPianoSynth } from '../lib/audio.js'

export default function AnimatedDemo({ block }) {
  if (block.demoKind === 'posture') {
    return (
      <div className="demo demo-posture" aria-label="手型示意">
        <svg viewBox="0 0 320 120" role="img">
          <rect x="20" y="82" width="280" height="18" rx="4" fill="#FAF6EF" stroke="#8A8178" />
          <rect x="40" y="88" width="10" height="12" fill="#3D3A36" />
          <rect x="80" y="88" width="10" height="12" fill="#3D3A36" />
          <rect x="120" y="88" width="10" height="12" fill="#3D3A36" />
          <g className="hand">
            <ellipse cx="160" cy="52" rx="46" ry="20" fill="#D9A066" />
            <ellipse cx="126" cy="58" rx="9" ry="16" fill="#D9A066" transform="rotate(-18 126 58)" />
            <ellipse cx="146" cy="44" rx="8" ry="17" fill="#D9A066" transform="rotate(-6 146 44)" />
            <ellipse cx="168" cy="42" rx="8" ry="18" fill="#D9A066" transform="rotate(8 168 42)" />
            <ellipse cx="190" cy="48" rx="8" ry="16" fill="#D9A066" transform="rotate(24 190 48)" />
            <ellipse cx="202" cy="60" rx="9" ry="13" fill="#D9A066" transform="rotate(42 202 60)" />
          </g>
        </svg>
        <p>手腕与手背齐平，手指自然弯曲，像握着一个鸡蛋。</p>
      </div>
    )
  }
  return <HighlightDemo notes={block.notes} />
}

function HighlightDemo({ notes: raw }) {
  const notes = useMemo(() => parseExercise(raw), [raw])
  const [i, setI] = useState(0)
  const synthRef = useRef(null)
  if (!synthRef.current) synthRef.current = createPianoSynth()

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % Math.max(notes.length, 1)), 900)
    return () => clearInterval(t)
  }, [notes])

  const current = notes[i]
  const highlight = current ? (current.chord ?? (current.midi !== null ? [current.midi] : [])) : []
  return (
    <div className="demo demo-highlight">
      <Piano highlight={highlight} onPlay={(m) => synthRef.current.play(m)} />
    </div>
  )
}
