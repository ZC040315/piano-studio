import { useEffect } from 'react'
import { getCategory } from '../data/categories'
import SourceBadge from './SourceBadge'

export default function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const cat = getCategory(photo.category)
  const isExternal = photo.url && photo.url !== '#'

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label={photo.title}>
      <button className="lb-close" onClick={onClose} aria-label="关闭详情">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <div className="lb-frame" onClick={(e) => e.stopPropagation()}>
        <div className="lb-media">
          <img src={photo.image} alt={photo.title} />
        </div>
        <aside className="lb-side">
          <p className="lb-kicker">PHOTO DETAIL</p>
          <h3 className="lb-title">{photo.title}</h3>
          <div className="lb-row">
            <span>天气现象</span>
            <b>{cat ? cat.label : '天气摄影'}</b>
          </div>
          <div className="lb-row">
            <span>地点</span>
            <b>{photo.location || '—'}</b>
          </div>
          <div className="lb-row">
            <span>摄影师</span>
            <b>{photo.photographer}</b>
          </div>
          <div className="lb-row">
            <span>来源图库</span>
            <SourceBadge source={photo.source} />
          </div>
          <div className="lb-row">
            <span>授权</span>
            <b>{photo.license}</b>
          </div>
          <div className="lb-actions">
            {isExternal ? (
              <a className="lb-btn-primary" href={photo.url} target="_blank" rel="noreferrer">
                查看原图 ↗
              </a>
            ) : (
              <span className="lb-btn-primary disabled">内置精选</span>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
