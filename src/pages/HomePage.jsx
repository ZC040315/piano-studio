import { useCallback, useRef, useState } from 'react'
import Hero from '../components/Hero'
import CategoryRail from '../components/CategoryRail'
import MasonryGrid from '../components/MasonryGrid'
import Lightbox from '../components/Lightbox'
import { usePhotos } from '../hooks/usePhotos'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { ALL_CATEGORIES } from '../data/categories'

export default function HomePage() {
  const [selected, setSelected] = useState(null)
  const { items, status, degraded, hasMore, loadMore } = usePhotos({ query: ALL_CATEGORIES.query, category: undefined })
  const sentinelRef = useRef(null)
  const onLoad = useCallback(() => loadMore(), [loadMore])
  useInfiniteScroll(sentinelRef, onLoad, status === 'success' && hasMore && !degraded)

  return (
    <>
      <Hero />
      <CategoryRail active="all" />
      {degraded && (
        <div className="container">
          <p className="notice">当前为内置精选 · 在线聚合暂不可用</p>
        </div>
      )}
      <MasonryGrid
        photos={items}
        loading={status === 'loading'}
        onSelect={setSelected}
        hasMore={hasMore && !degraded}
        sentinelRef={sentinelRef}
      />
      {selected && <Lightbox photo={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
