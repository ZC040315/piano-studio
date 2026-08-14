const BASE = 'https://commons.wikimedia.org/w/api.php'
const TIMEOUT_MS = 10000

function decodeHtml(value) {
  if (!value) return ''
  return String(value)
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function searchCommonsPhotos({ query, category, page = 1, signal, timeoutMs = TIMEOUT_MS }) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '20',
    gsroffset: String((page - 1) * 20 + 1),
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '1600',
    format: 'json',
    origin: '*',
  })
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const onAbort = () => controller.abort()
  signal?.addEventListener('abort', onAbort)
  try {
    let res
    try {
      res = await fetch(`${BASE}?${params}`, { signal: controller.signal })
    } catch {
      throw new Error('NETWORK')
    }
    if (!res.ok) throw new Error(`HTTP_${res.status}`)
    const json = await res.json()
    const pages = (json.query && json.query.pages) || {}
    const items = Object.values(pages)
      .filter((p) => p.imageinfo && p.imageinfo[0])
      .map((p) => {
        const info = p.imageinfo[0]
        const meta = info.extmetadata || {}
        const rawTitle = (p.title || '').replace(/^File:/, '')
        const title = rawTitle.replace(/\.(jpe?g|png|gif|webp|tiff?)$/i, '')
        const thumb = info.thumburl || info.url
        return {
          id: `wm-${p.pageid}`,
          title: decodeHtml(title) || '天气摄影',
          photographer: decodeHtml(meta.Artist && meta.Artist.value) || '未知摄影师',
          source: 'Wikimedia',
          license: decodeHtml(meta.LicenseShortName && meta.LicenseShortName.value) || 'CC',
          url: info.descriptionurl || info.url,
          thumbnail: thumb,
          image: thumb,
          location: '',
          category: category || query,
          degraded: false,
        }
      })
    return { items, page, hasMore: items.length >= 20 }
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', onAbort)
  }
}
