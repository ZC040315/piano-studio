import { describe, it, expect } from 'vitest'
import { mergePhotos } from './photo'
import { CURATED } from '../data/curated'

describe('mergePhotos', () => {
  it('有实时数据时原样返回', () => {
    const live = [{ id: 'x', degraded: false }]
    expect(mergePhotos(live, 'aurora')).toEqual(live)
  })

  it('无实时数据时返回分类兜底并标记 degraded', () => {
    const out = mergePhotos([], 'aurora')
    expect(out.length).toBeGreaterThan(0)
    expect(out.every((p) => p.degraded === true)).toBe(true)
    expect(out.every((p) => p.category === 'aurora')).toBe(true)
  })

  it('无分类时返回全部兜底', () => {
    const out = mergePhotos([], undefined)
    expect(out.length).toBe(CURATED.length)
  })
})
