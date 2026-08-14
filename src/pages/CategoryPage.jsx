import { useCallback, useRef, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import CategoryRail from '../components/CategoryRail'
import MasonryGrid from '../components/MasonryGrid'
import Lightbox from '../components/Lightbox'
import { usePhotos } from '../hooks/usePhotos'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { getCategory } from '../data/categories'

export default function CategoryPage() {
  const { slug } = useParams()
  const category = getCategory(slug)
  const [selected, setSelected] = useState(null)
  const sentinelRef = useRef(null)
  const { items, status, degraded, hasMore, loadMore } = usePhotos({
    query: category?.query || '',
    category: category?.slug,
    enabled: Boolean(category),
  })
  const onLoad = useCallback(() => loadMore(), [loadMore])
  useInfiniteScroll(sentinelRef, onLoad, status === 'success' && hasMore && !degraded)

  if (!category) return <Navigate to="/" replace />

  return (
    <>
      <div className="container page-head">
        <h2>{category.label} · 精选</h2>
        <p>来自开放图库 · CC 授权 · 每日更新</p>
      </div>
      <CategoryRail active={category.slug} />
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
