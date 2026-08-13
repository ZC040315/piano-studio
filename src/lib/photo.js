import { CATEGORIES } from '../data/categories'
import { CURATED } from '../data/curated'

export function mergePhotos(live, categorySlug) {
  if (live.length > 0) return live
  const cat = CATEGORIES.find((c) => c.slug === categorySlug)
  return CURATED.filter((p) => !cat || p.category === categorySlug).map((p) => ({ ...p, degraded: true }))
}
