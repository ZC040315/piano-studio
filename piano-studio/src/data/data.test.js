import { describe, it, expect } from 'vitest'
import { lessons } from './lessons.js'
import { stages } from './stages.js'
import { exercises, getExerciseNotes } from './exercises.js'

describe('课程数据', () => {
  it('共 24 课且 id 唯一', () => {
    expect(lessons).toHaveLength(24)
    expect(new Set(lessons.map((l) => l.id)).size).toBe(24)
  })

  it('每个阶段 8 课且顺序连续', () => {
    for (const s of stages) {
      const inStage = lessons.filter((l) => l.stage === s.id)
      expect(inStage).toHaveLength(8)
    }
    expect(lessons.map((l) => l.order)).toEqual([...Array(24).keys()].map((i) => i + 1))
  })

  it('每课至少 1 个练习，练习 id 存在', () => {
    for (const l of lessons) {
      expect(l.exerciseIds.length).toBeGreaterThanOrEqual(1)
      for (const eid of l.exerciseIds) {
        expect(exercises[eid]).toBeDefined()
      }
    }
  })

  it('所有练习可被解析且音高落在 C3–E5', () => {
    for (const ex of Object.values(exercises)) {
      const notes = getExerciseNotes(ex.id)
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
})
