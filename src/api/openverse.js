const BASE = 'https://api.openverse.org/v1/images/'
const TIMEOUT_MS = 8000

function normalizeSource(source) {
  if (!source) return 'Openverse'
  const map = { flickr: 'Flickr', wikimedia: 'Wikimedia', wordpress: 'WordPress' }
  return map[source] || source
}

function normalizeLicense(license) {
  if (!license) return 'CC'
  const short = String(license).toLowerCase().replace(/^cc[-_]?/, '')
  const parts = short.split('-').map((p) => p.toUpperCase()).join(' ')
  return `CC ${parts}`
}

export async function fetchOpenversePhotos({ query, page = 1, signal, timeoutMs = TIMEOUT_MS }) {
  const params = new URLSearchParams({ q: query, page: String(page), per_page: '24' })
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
    const items = (json.results || []).map((r) => {
      const tags = (r.tags || []).map((t) => t.name)
      return {
        id: String(r.id),
        title: r.title || tags.slice(0, 2).join(' · ') || '天气摄影',
        photographer: r.creator || '未知摄影师',
        source: normalizeSource(r.source),
        license: normalizeLicense(r.license),
        url: r.foreign_landing_url || r.url,
        thumbnail: r.thumbnail || r.url,
        image: r.url,
        location: tags.filter((n) => n.length <= 12).slice(0, 2).join(' · '),
        category: query,
        degraded: false,
      }
    })
    return { items, page: json.page || page, hasMore: page < (json.page_count || 1) }
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', onAbort)
  }
}
