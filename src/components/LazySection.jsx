import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'

export default function LazySection({ importer, id, placeholderHeight = '60vh', rootMargin = '400px' }) {
  const sentinelRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (shouldLoad) return
    const element = sentinelRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          setShouldLoad(true)
        }
      },
      { rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [shouldLoad, rootMargin])

  const LazyComponent = useMemo(() => lazy(importer), [importer])

  if (!shouldLoad) {
    return <div ref={sentinelRef} id={id} style={{ minHeight: placeholderHeight }} />
  }

  return (
    <Suspense fallback={<div style={{ minHeight: placeholderHeight }} />}>
      <LazyComponent id={id} />
    </Suspense>
  )
}
