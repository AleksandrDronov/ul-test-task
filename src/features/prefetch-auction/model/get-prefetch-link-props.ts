type PrefetchHandler = () => void

export const getPrefetchLinkProps = (prefetch: PrefetchHandler) => ({
  onMouseEnter: prefetch,
  onFocus: prefetch,
  onTouchStart: prefetch,
  preload: 'intent' as const,
})
