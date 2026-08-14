import { useEffect } from 'react'

export function useInfiniteScroll(ref, onLoad, enabled) {
  useEffect(() => {
    if (!enabled || !ref.current || typeof IntersectionObserver === 'undefined') return
    const el = ref.current
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoad()
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled, onLoad, ref])
}
