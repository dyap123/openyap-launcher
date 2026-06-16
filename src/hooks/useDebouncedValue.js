import { useEffect, useState } from 'react'

// Debounce a fast-changing value (e.g. the search query) so downstream
// filtering + grid reconciliation doesn't run on every keystroke.
export function useDebouncedValue(value, ms = 120) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}
