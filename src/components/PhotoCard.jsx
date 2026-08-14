import { getCategory } from '../data/categories'

export default function PhotoCard({ photo, onSelect }) {
  const cat = getCategory(photo.category)
  const label = cat ? cat.label : '天气摄影'
  const detail = photo.location || photo.photographer || ''
  return (
    <button type="button" className="photo-card" onClick={() => onSelect(photo)} aria-label={photo.title}>
      <img src={photo.thumbnail} alt={photo.title} loading="lazy" />
      <span className="pc-caption">
        <b>{label}</b>
        {detail && ` · ${detail}`}
      </span>
    </button>
  )
}
