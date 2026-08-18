import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import Piano from './Piano.jsx'
import SheetDisplay from './SheetDisplay.jsx'
import SequencePlayer from './SequencePlayer.jsx'
import { getExerciseNotes } from '../data/exercises.js'
import { createInitialPractice, practiceReducer, starsFor } from '../lib/practice.js'
import { createPianoSynth } from '../lib/audio.js'
import { KEY_TO_MIDI } from '../lib/keys.js'

export default function Practice({ exerciseId, onComplete }) {
  const notes = useMemo(() => getExerciseNotes(exerciseId), [exerciseId])
  const [state, dispatch] = useReducer(practiceReducer, notes, createInitialPractice)
  const [demoRun, setDemoRun] = useState(false)
  const [wrongTick, setWrongTick] = useState(0)
  const synthRef = useRef(null)
  if (!synthRef.current) synthRef.current = createPianoSynth()
  const synth = synthRef.current

  useEffect(() => {
    const onKey = (e) => {
      const midi = KEY_TO_MIDI[e.key.toLowerCase()]
      if (midi === undefined) return
      e.preventDefault()
      handleInput(midi)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state])

  useEffect(() => {
    if (state.status === 'done') onComplete?.(exerciseId, starsFor(state.mistakes))
  }, [state.status])

  const current = state.notes[state.index]
  const highlight = current
    ? (current.chord ?? (current.midi !== null ? [current.midi] : []))
    : []

  function handleInput(midi) {
    if (state.status === 'done') return
    const note = state.notes[state.index]
    const target = note.chord ?? (note.midi !== null ? [note.midi] : [])
    if (target.includes(midi)) {
      synth.play(midi)
    } else {
      synth.play(48)
      setWrongTick((t) => t + 1)
      setTimeout(() => dispatch({ type: 'wrong-clear' }), 650)
    }
    dispatch({ type: 'input', midi })
  }

  return (
    <section className="practice card">
      <SheetDisplay notes={state.notes} currentIndex={state.index} />
      <div className="piano-scroll">
        <Piano
          highlight={highlight}
          active={[]}
          onPlay={handleInput}
        />
      </div>
      <div className="practice-controls">
        <button className="btn btn-ghost" onClick={() => { setDemoRun(true); dispatch({ type: 'reset' }) }}>
          ▶ 演示
        </button>
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'reset' })}>
          ↺ 重置
        </button>
        {state.status === 'wrong' && <span className="practice-feedback" key={wrongTick}>再试一次，注意看高亮的键</span>}
      </div>
      {state.status === 'done' && (
        <div className="practice-done">
          <p>完成！{starsFor(state.mistakes)} 颗星</p>
          <button className="btn" onClick={() => dispatch({ type: 'reset' })}>
            再练一次
          </button>
        </div>
      )}
      <SequencePlayer
        notes={notes}
        synth={synth}
        run={demoRun}
        onNote={() => dispatch({ type: 'demo-advance' })}
        onEnd={() => { setDemoRun(false); dispatch({ type: 'reset' }) }}
      />
    </section>
  )
}
