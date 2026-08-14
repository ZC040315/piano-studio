import { describe, it, expect, vi } from 'vitest'
import { searchCommonsPhotos } from './commons'

describe('searchCommonsPhotos', () => {
  it('解析 Commons 响应为 Photo 数组并解码作者', async () => {
    const json = {
      query: {
        pages: {
          123: {
            pageid: 123,
            title: 'File:Aurora over mountains.jpg',
            imageinfo: [
              {
                thumburl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/x/1600px-Aurora.jpg',
                descriptionurl: 'https://commons.wikimedia.org/wiki/File:Aurora_over_mountains.jpg',
                extmetadata: {
                  Artist: { value: '<a href="//x">Jane &amp; Doe</a>' },
                  LicenseShortName: { value: 'CC BY-SA 4.0' },
                },
              },
            ],
          },
        },
      },
    }
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(json) })
    const out = await searchCommonsPhotos({ query: 'aurora', category: 'aurora', page: 1 })
    expect(out.items[0]).toMatchObject({
      id: 'wm-123',
      title: 'Aurora over mountains',
      photographer: 'Jane & Doe',
      source: 'Wikimedia',
      license: 'CC BY-SA 4.0',
      category: 'aurora',
    })
  })

  it('网络失败时抛出 NETWORK 错误', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(searchCommonsPhotos({ query: 'rainbow', page: 1 })).rejects.toThrow('NETWORK')
  })
})
