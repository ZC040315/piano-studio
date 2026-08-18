import { useEffect, useRef } from 'react'

export default function SequencePlayer({ notes, synth, tempo = 90, onNote, onEnd, run }) {
  const timers = useRef([])
  const beatMs = 60000 / tempo

  useEffect(() => {
    if (!run) return
    let i = 0
    const schedule = () => {
      if (i >= notes.length) { onEnd?.(); return }
      const note = notes[i]
      onNote?.(note, i)
      if (note.chord) synth.playChord(note.chord)
      else if (note.midi !== null) synth.play(note.midi)
      const delay = Math.max(120, note.beats * beatMs)
      timers.current.push(setTimeout(() => { i += 1; schedule() }, delay))
    }
    schedule()
    return () => { timers.current.forEach(clearTimeout); timers.current = [] }
  }, [run])

  return null
}
