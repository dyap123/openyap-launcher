import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

// Tracks the user's reduced-motion preference. Used to drop the card tilt.
// (The aurora background also honors it directly via a CSS @media block.)
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof matchMedia !== 'undefined' && matchMedia(QUERY).matches,
  )
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return
    const mq = matchMedia(QUERY)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])
  return reduced
}
