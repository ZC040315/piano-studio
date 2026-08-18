import { midiToFreq } from './notes.js'

export function createPianoSynth() {
  let ctx = null

  function ensureContext() {
    if (!ctx) {
      const AC = globalThis.AudioContext || globalThis.webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  }

  function playNote(midi, when = 0) {
    const c = ensureContext()
    if (!c) return
    const t = c.currentTime + when
    const freq = midiToFreq(midi)
    const master = c.createGain()
    master.gain.setValueAtTime(0.0001, t)
    master.gain.exponentialRampToValueAtTime(0.22, t + 0.012)
    master.gain.exponentialRampToValueAtTime(0.0001, t + 1.6)
    master.connect(c.destination)
    const partials = [
      { ratio: 1, gain: 1 },
      { ratio: 2, gain: 0.35 },
      { ratio: 3, gain: 0.12 },
    ]
    for (const p of partials) {
      const osc = c.createOscillator()
      const g = c.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq * p.ratio
      g.gain.value = p.gain
      osc.connect(g)
      g.connect(master)
      osc.start(t)
      osc.stop(t + 1.7)
    }
  }

  function playChord(midis, when = 0) {
    midis.forEach((m) => playNote(m, when))
  }

  return { play: playNote, playChord, ensureContext }
}
