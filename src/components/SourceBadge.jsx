export default function SourceBadge({ source }) {
  const label = source || 'Openverse'
  return <span className={`source-badge${label === '精选' ? ' curated' : ''}`}>{label}</span>
}
