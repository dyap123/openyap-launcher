import { useEffect, useState } from 'react'

// True while the tab is visible. Consumed by the ping loop (pause when hidden)
// and by App to pause the aurora animation.
export function usePageVisible() {
  const [visible, setVisible] = useState(
    typeof document === 'undefined' ? true : document.visibilityState === 'visible',
  )
  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])
  return visible
}
