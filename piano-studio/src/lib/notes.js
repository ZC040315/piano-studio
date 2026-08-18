export const STEP_TO_SEMITONE = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11 }

export function midiToFreq(midi) {
  return 440 * 2 ** ((midi - 69) / 12)
}

function beatsFromSuffix(suffix) {
  let beats = 1
  for (const c of suffix) {
    if (c === '-') beats += 1
    if (c === '_') beats /= 2
    if (c === '.') beats += 0.5
  }
  return beats
}

function parseSingleToken(token) {
  // 和弦：[135]、[572']、[61'3'] 等
  if (token.startsWith('[')) {
    const close = token.indexOf(']')
    if (close === -1) return null
    const inner = token.slice(1, close)
    const suffix = token.slice(close + 1)
    const m = inner.match(/^([0-7',#b]+)$/)
    if (!m) return null
    const midis = []
    const chordLabels = []
    let i = 0
    while (i < m[1].length) {
      const ch = m[1][i]
      i += 1
      if (ch === '0') { chordLabels.push('0'); continue }
      const step = Number(ch)
      let oct = 0
      let acc = 0
      let label = ch
      while (i < m[1].length && "',#b".includes(m[1][i])) {
        if (m[1][i] === "'") oct += 1
        else if (m[1][i] === ',') oct -= 1
        else if (m[1][i] === '#') acc += 1
        else if (m[1][i] === 'b') acc -= 1
        label += m[1][i]
        i += 1
      }
      midis.push(60 + STEP_TO_SEMITONE[step] + acc + oct * 12)
      chordLabels.push(label)
    }
    const beats = beatsFromSuffix(suffix)
    return { midi: null, beats, chord: midis, chordLabels, label: chordLabels.join('') }
  }

  const m = token.match(/^([#b]?)([0-7])([' ,#b]*)([-_.]*)$/)
  if (!m) return null
  const step = Number(m[2])
  let oct = 0
  let acc = m[1] === '#' ? 1 : m[1] === 'b' ? -1 : 0
  for (const c of m[3]) {
    if (c === "'") oct += 1
    else if (c === ',') oct -= 1
    else if (c === '#') acc += 1
    else if (c === 'b') acc -= 1
  }
  if (step === 0) {
    return { midi: null, beats: beatsFromSuffix(m[4]), chord: null, chordLabels: null, label: '0' }
  }
  const midi = 60 + STEP_TO_SEMITONE[step] + acc + oct * 12
  return { midi, beats: beatsFromSuffix(m[4]), chord: null, chordLabels: null, label: m[1] + m[2] + m[3] }
}

export function parseExercise(str) {
  return str
    .split(/\s+/)
    .map(parseSingleToken)
    .filter(Boolean)
}
