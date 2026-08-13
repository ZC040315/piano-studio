export const CATEGORIES = [
  { slug: 'thunderstorm', label: '雷暴', query: 'lightning storm thunderstorm' },
  { slug: 'rainbow', label: '彩虹', query: 'rainbow' },
  { slug: 'snow', label: '雪', query: 'snow snowfall winter storm' },
  { slug: 'fog', label: '雾', query: 'fog foggy mist' },
  { slug: 'aurora', label: '极光', query: 'aurora northern lights' },
  { slug: 'clouds', label: '云海', query: 'sea of clouds sunrise' },
  { slug: 'typhoon', label: '台风', query: 'typhoon hurricane storm clouds' },
]

export function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || null
}

export const ALL_CATEGORIES = { slug: 'all', label: '全部', query: '' }
