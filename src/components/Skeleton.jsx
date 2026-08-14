const HEIGHTS = [320, 240, 280, 360, 220, 300, 260, 340]

export default function Skeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skeleton-card" style={{ height: HEIGHTS[i % HEIGHTS.length] }} />
      ))}
    </>
  )
}
