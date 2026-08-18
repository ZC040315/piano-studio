import { describe, it, expect } from 'vitest'
import { loadProgress, saveProgress, markLessonCompleted, nextLesson } from './progress.js'

function fakeStorage(initial = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
  }
}

describe('progress', () => {
  it('无数据时返回空进度', () => {
    expect(loadProgress(fakeStorage())).toEqual({ completed: {}, lastLessonId: null })
  })

  it('localStorage 不可用时降级为内存', () => {
    const broken = { getItem() { throw new Error('denied') }, setItem() { throw new Error('denied') } }
    const p = loadProgress(broken)
    p.lastLessonId = 'lesson-01'
    expect(p.lastLessonId).toBe('lesson-01')
  })

  it('保存与读取往返一致', () => {
    const s = fakeStorage()
    const p = { completed: { 'lesson-01': { stars: 3, doneAt: '2026-08-18' } }, lastLessonId: 'lesson-01' }
    saveProgress(p, s)
    expect(loadProgress(s)).toEqual(p)
  })

  it('标记完成并保留历史', () => {
    let p = loadProgress(fakeStorage())
    p = markLessonCompleted(p, 'lesson-01', 2)
    p = markLessonCompleted(p, 'lesson-02', 3)
    expect(Object.keys(p.completed)).toEqual(['lesson-01', 'lesson-02'])
    expect(p.completed['lesson-01'].stars).toBe(2)
  })

  it('nextLesson 返回第一门未完成课程', () => {
    let p = loadProgress(fakeStorage())
    p = markLessonCompleted(p, 'lesson-01', 3)
    expect(nextLesson(['lesson-01', 'lesson-02', 'lesson-03'], p)).toBe('lesson-02')
    expect(nextLesson([], p)).toBeNull()
  })
})
