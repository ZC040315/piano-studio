import PhotoCard from './PhotoCard'
import Skeleton from './Skeleton'

export default function MasonryGrid({ photos, loading, onSelect, hasMore, sentinelRef }) {
  return (
    <div className="container">
      <div className="masonry" id="gallery">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} onSelect={onSelect} />
        ))}
        {loading && <Skeleton count={6} />}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="load-more">
          正在加载更多作品…
        </div>
      )}
    </div>
  )
}
