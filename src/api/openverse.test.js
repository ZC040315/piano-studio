import { describe, it, expect, vi } from 'vitest'
import { fetchOpenversePhotos } from './openverse'

describe('fetchOpenversePhotos', () => {
  it('解析 Openverse 响应为 Photo 数组', async () => {
    const json = {
      results: [
        {
          id: 'a1',
          title: 'lightning over plain',
          creator: 'Alice',
          license: 'by',
          url: 'https://image',
          thumbnail: 'https://thumb',
          foreign_landing_url: 'https://landing',
          source: 'flickr',
          tags: [{ name: 'storm' }, { name: 'USA' }],
        },
      ],
      page: 1,
      page_count: 3,
      result_count: 60,
    }
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(json) })
    const out = await fetchOpenversePhotos({ query: 'lightning', page: 1, signal: new AbortController().signal })
    expect(out.items[0]).toMatchObject({ id: 'a1', photographer: 'Alice', source: 'Flickr', license: 'CC BY' })
    expect(out.page).toBe(1)
    expect(out.hasMore).toBe(true)
  })

  it('网络失败时抛出 NETWORK 错误', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(fetchOpenversePhotos({ query: 'rainbow', page: 1 })).rejects.toThrow('NETWORK')
  })

  it('HTTP 错误时抛出对应状态码错误', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 429 })
    await expect(fetchOpenversePhotos({ query: 'rainbow', page: 1 })).rejects.toThrow('HTTP_429')
  })
})
