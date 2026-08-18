import { describe, it, expect } from 'vitest'
import { scores, getScore, getScoreNotes } from './scores.js'

describe('曲谱数据', () => {
  it('共 30 首且 id 唯一', () => {
    expect(scores).toHaveLength(30)
    expect(new Set(scores.map((s) => s.id)).size).toBe(30)
  })

  it('分类与难度合法', () => {
    for (const s of scores) {
      expect(['pop', 'instrumental']).toContain(s.category)
      expect([1, 2, 3]).toContain(s.difficulty)
    }
  })

  it('至少 10 首可直接跟练', () => {
    expect(scores.filter((s) => s.notes).length).toBeGreaterThanOrEqual(10)
  })

  it('有 notes 的曲目可解析且音域合法', () => {
    for (const s of scores) {
      if (!s.notes) continue
      const notes = getScoreNotes(s.id)
      expect(notes.length).toBeGreaterThan(0)
      for (const n of notes) {
        const midis = n.chord ?? (n.midi !== null ? [n.midi] : [])
        for (const m of midis) {
          expect(m).toBeGreaterThanOrEqual(48)
          expect(m).toBeLessThanOrEqual(76)
        }
      }
    }
  })

  it('getScore 命中与未命中', () => {
    expect(getScore('score-01').title).toBe('虫儿飞')
    expect(getScore('nope')).toBeNull()
  })
})
