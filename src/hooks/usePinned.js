import { useCallback, useEffect, useState } from 'react'

// Quick Access pins, persisted to localStorage. Seeded with the apps the user
// reaches for most: Tool Tracker (00), CUP Dashboard (02), Todo (03),
// EmbedYap (18), SuperYap (20). The ★ toggle on each card edits this set.
const STORAGE_KEY = 'oy_pinned'
const DEFAULT_PINNED = ['00', '02', '03', '18', '20']

export function usePinned() {
  const [pinned, setPinned] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const arr = JSON.parse(raw)
        if (Array.isArray(arr)) return new Set(arr)
      }
    } catch {
      /* ignore */
    }
    return new Set(DEFAULT_PINNED)
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...pinned]))
    } catch {
      /* quota / private mode — ignore */
    }
  }, [pinned])

  // Stable identity so memoized cards don't re-render when unrelated state changes.
  const toggle = useCallback((id) => {
    setPinned((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return { pinned, toggle }
}
