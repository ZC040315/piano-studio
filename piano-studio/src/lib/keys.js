import { STEP_TO_SEMITONE } from './notes.js'

export const KEY_TO_MIDI = {
  a: 60, w: 61, s: 62, e: 63, d: 64, f: 65, t: 66, g: 67,
  y: 68, h: 69, u: 70, j: 71, k: 72,
}

export const PIANO_RANGE = { low: 48, high: 76 }

const REVERSE = Object.fromEntries(Object.entries(STEP_TO_SEMITONE).map(([k, v]) => [v, k]))

export function midiToLabel(midi) {
  const semitone = ((midi - 60) % 12 + 12) % 12
  if (REVERSE[semitone] !== undefined) {
    const octaveDelta = Math.floor((midi - 60) / 12)
    return REVERSE[semitone] + (octaveDelta > 0 ? "'".repeat(octaveDelta) : ','.repeat(-octaveDelta))
  }
  const lowerSemitone = ((midi - 1 - 60) % 12 + 12) % 12
  return `#${REVERSE[lowerSemitone] ?? ''}`
}
