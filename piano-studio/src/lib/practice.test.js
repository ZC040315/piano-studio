import { describe, it, expect } from 'vitest'
import { createInitialPractice, practiceReducer, starsFor } from './practice.js'
import { parseExercise } from './notes.js'

describe('practiceReducer', () => {
  const notes = parseExercise('1 2 3')

  it('输入正确前进', () => {
    let s = createInitialPractice(notes)
    s = practiceReducer(s, { type: 'input', midi: 60 })
    expect(s.index).toBe(1)
    expect(s.status).toBe('ready')
  })

  it('输入错误计数并提示', () => {
    let s = createInitialPractice(notes)
    s = practiceReducer(s, { type: 'input', midi: 62 })
    expect(s.index).toBe(0)
    expect(s.mistakes).toBe(1)
    expect(s.status).toBe('wrong')
    s = practiceReducer(s, { type: 'wrong-clear' })
    expect(s.status).toBe('ready')
  })

  it('最后一个音正确后完成', () => {
    let s = createInitialPractice(notes)
    for (const midi of [60, 62, 64]) s = practiceReducer(s, { type: 'input', midi })
    expect(s.status).toBe('done')
    expect(s.target).toBeNull()
  })

  it('和弦需按齐所有音才前进', () => {
    const chordNotes = parseExercise('[135]')
    let s = createInitialPractice(chordNotes)
    s = practiceReducer(s, { type: 'input', midi: 60 })
    expect(s.index).toBe(0)
    s = practiceReducer(s, { type: 'input', midi: 64 })
    expect(s.index).toBe(0)
    s = practiceReducer(s, { type: 'input', midi: 67 })
    expect(s.index).toBe(1)
  })

  it('休止符自动跳过，无需按键', () => {
    const restNotes = parseExercise('0 0 1 2')
    let s = createInitialPractice(restNotes)
    expect(s.index).toBe(2)
    s = practiceReducer(s, { type: 'input', midi: 60 })
    expect(s.index).toBe(3)
  })

  it('demo-advance 依次推进', () => {
    let s = createInitialPractice(notes)
    s = practiceReducer(s, { type: 'demo-advance' })
    expect(s.index).toBe(1)
    s = practiceReducer(s, { type: 'demo-advance' })
    s = practiceReducer(s, { type: 'demo-advance' })
    expect(s.status).toBe('done')
  })

  it('reset 回到起点', () => {
    let s = createInitialPractice(notes)
    s = practiceReducer(s, { type: 'input', midi: 60 })
    s = practiceReducer(s, { type: 'reset' })
    expect(s.index).toBe(0)
    expect(s.mistakes).toBe(0)
    expect(s.status).toBe('ready')
  })
})

describe('starsFor', () => {
  it('按错误次数给星', () => {
    expect(starsFor(0)).toBe(3)
    expect(starsFor(2)).toBe(2)
    expect(starsFor(4)).toBe(1)
  })
})
