import { describe, it, expect } from 'vitest'
import { photosReducer, initialState } from './photosReducer'

describe('photosReducer', () => {
  it('LOAD 进入 loading', () => {
    expect(photosReducer(initialState, { type: 'LOAD' }).status).toBe('loading')
  })

  it('OK 追加分页数据', () => {
    const state = photosReducer(initialState, { type: 'OK', items: [{ id: '1' }], page: 2, hasMore: true, append: true })
    const next = photosReducer(state, { type: 'OK', items: [{ id: '2' }], page: 3, hasMore: true, append: true })
    expect(next.items.map((i) => i.id)).toEqual(['1', '2'])
    expect(next.page).toBe(3)
  })

  it('DEGRADED 覆盖列表并停止分页', () => {
    const state = photosReducer(initialState, { type: 'DEGRADED', items: [{ id: 'd', degraded: true }] })
    expect(state.status).toBe('success')
    expect(state.degraded).toBe(true)
    expect(state.hasMore).toBe(false)
    expect(state.page).toBe(1)
  })
})
