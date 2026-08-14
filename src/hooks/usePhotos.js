import { useCallback, useEffect, useReducer, useRef } from 'react'
import { fetchOpenversePhotos } from '../api/openverse'
import { searchCommonsPhotos } from '../api/commons'
import { mergePhotos } from '../lib/photo'
import { photosReducer, initialState } from '../lib/photosReducer'

export function usePhotos({ query, category, enabled = true }) {
  const [state, dispatch] = useReducer(photosReducer, initialState)
  const cache = useRef(new Map())
  const seqRef = useRef(0)

  const run = useCallback(
    async (page) => {
      const key = `${query}:1`
      if (page === 1 && cache.current.has(key)) {
        const cached = cache.current.get(key)
        dispatch({ type: 'OK', items: cached.items, page: cached.page, hasMore: cached.hasMore, append: false })
        return
      }
      const seq = ++seqRef.current
      dispatch({ type: 'LOAD' })
      // 并发请求两路图源：Openverse 优先，失败时用 Wikimedia Commons 结果。
      const [openverse, commons] = await Promise.allSettled([
        fetchOpenversePhotos({ query, category, page }),
        searchCommonsPhotos({ query, category, page }),
      ])
      const data =
        openverse.status === 'fulfilled' && openverse.value.items.length > 0
          ? openverse.value
          : commons.status === 'fulfilled'
            ? commons.value
            : null
      if (seq !== seqRef.current) return
      if (!data || data.items.length === 0) {
        dispatch({ type: 'DEGRADED', items: mergePhotos([], category) })
        return
      }
      if (page === 1) cache.current.set(key, { items: data.items, page: data.page, hasMore: data.hasMore })
      dispatch({ type: 'OK', items: data.items, page: data.page, hasMore: data.hasMore, append: page > 1 })
    },
    [query, category],
  )

  useEffect(() => {
    if (!enabled) return
    dispatch({ type: 'RESET' })
    run(1)
  }, [enabled, run])

  const loadMore = useCallback(() => {
    if (state.status !== 'success' || !state.hasMore || state.degraded) return
    run(state.page + 1)
  }, [state.status, state.hasMore, state.degraded, state.page, run])

  return { ...state, loadMore, retry: () => run(1) }
}
