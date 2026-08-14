import { useCallback, useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import MasonryGrid from '../components/MasonryGrid'
import Lightbox from '../components/Lightbox'
import { usePhotos } from '../hooks/usePhotos'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = (params.get('q') || '').trim()
  const [selected, setSelected] = useState(null)
  const sentinelRef = useRef(null)
  const { items, status, degraded, hasMore, loadMore } = usePhotos({ query: q || 'weather', category: undefined })
  const onLoad = useCallback(() => loadMore(), [loadMore])
  useInfiniteScroll(sentinelRef, onLoad, status === 'success' && hasMore && !degraded)

  const empty = !q || (status === 'success' && !degraded && items.length === 0)

  return (
    <>
      <div className="container page-head">
        <h2>{q ? `搜索 “${q}”` : '搜索'}</h2>
        <p>来自开放图库的实时结果 · CC 授权</p>
      </div>
      {empty ? (
        <div className="container empty">
          <h3>{q ? `没有找到与 “${q}” 相关的作品` : '输入关键词开始搜索'}</h3>
          <p>试试「极光」「雷暴」「黄山 云海」等关键词。</p>
          <Link className="empty-link" to="/">返回精选</Link>
        </div>
      ) : (
        <>
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
        </>
      )}
      {selected && <Lightbox photo={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
