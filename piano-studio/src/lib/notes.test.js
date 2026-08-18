import { describe, it, expect } from 'vitest'
import { parseExercise, midiToFreq } from './notes.js'

describe('parseExercise', () => {
  it('解析单音与默认时值', () => {
    expect(parseExercise('1 2 3')).toEqual([
      { midi: 60, beats: 1, chord: null, chordLabels: null, label: '1' },
      { midi: 62, beats: 1, chord: null, chordLabels: null, label: '2' },
      { midi: 64, beats: 1, chord: null, chordLabels: null, label: '3' },
    ])
  })

  it('忽略小节线与未知 token', () => {
    expect(parseExercise('1 | 2 ‖: 3 :‖')).toHaveLength(3)
  })

  it('解析高八度/低八度/延长/半拍/附点/休止', () => {
    const out = parseExercise("1' 7, 1- 2_ 3. 0")
    expect(out[0].midi).toBe(72)
    expect(out[1].midi).toBe(59)
    expect(out[2].beats).toBe(2)
    expect(out[3].beats).toBe(0.5)
    expect(out[4].beats).toBe(1.5)
    expect(out[5].midi).toBeNull()
  })

  it('解析和弦', () => {
    const out = parseExercise("[135]- [572']")
    expect(out[0]).toEqual({ midi: null, beats: 2, chord: [60, 64, 67], chordLabels: ['1', '3', '5'], label: '135' })
    expect(out[1].chord).toEqual([67, 71, 74])
    expect(out[1].chordLabels).toEqual(['5', '7', "2'"])
  })

  it('解析中音区常见旋律', () => {
    const out = parseExercise('1 1 5 5 6 6 5-')
    expect(out.map(n => n.midi)).toEqual([60, 60, 67, 67, 69, 69, 67])
    expect(out[6].beats).toBe(2)
  })

  it('解析升号与降号', () => {
    const out = parseExercise('3 2# 3 2# 3 7 2 1 6 | 1 3 6 7 3 5# 7 1\'')
    expect(out.map((n) => n.midi)).toEqual([64, 63, 64, 63, 64, 71, 62, 60, 69, 60, 64, 69, 71, 64, 68, 71, 72])
    expect(out[1].label).toBe('2#')
    expect(parseExercise('b7')[0].midi).toBe(70)
  })
})

describe('midiToFreq', () => {
  it('A4=440Hz，C4≈261.63Hz', () => {
    expect(midiToFreq(69)).toBeCloseTo(440, 2)
    expect(midiToFreq(60)).toBeCloseTo(261.63, 1)
  })
})
