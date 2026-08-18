import { describe, it, expect } from 'vitest'
import { KEY_TO_MIDI, midiToLabel } from './keys.js'

describe('keys', () => {
  it('字母键映射到中央 C 八度', () => {
    expect(KEY_TO_MIDI.a).toBe(60)
    expect(KEY_TO_MIDI.j).toBe(71)
    expect(KEY_TO_MIDI.k).toBe(72)
  })

  it('黑键映射', () => {
    expect(KEY_TO_MIDI.w).toBe(61)
    expect(KEY_TO_MIDI.u).toBe(70)
  })

  it('midiToLabel 输出简谱编号', () => {
    expect(midiToLabel(60)).toBe('1')
    expect(midiToLabel(72)).toBe("1'")
    expect(midiToLabel(48)).toBe('1,')
    expect(midiToLabel(61)).toBe('#1')
  })
})
