import { useEffect, useState } from 'react'
import { usePageVisible } from './usePageVisible.js'

// Localhost ping for LOCAL apps. Returns a { [appId]: 'LOCAL' | 'OFFLINE' } map.
//
// When the launcher is served over https:// (i.e. dyap123.github.io), browsers
// block http://localhost requests as mixed content — every ping would fail and
// every LOCAL app would falsely show OFFLINE. Detect that once and skip pings,
// leaving the cards on their declared LOCAL pill (no green dot).
const PINGS_DISABLED = typeof location !== 'undefined' && location.protocol === 'https:'

function timeoutSignal(ms) {
  if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) return AbortSignal.timeout(ms)
  const c = new AbortController()
  setTimeout(() => c.abort(), ms)
  return c.signal
}

export function useLocalPing(apps) {
  const [pingStatus, setPingStatus] = useState({})
  const visible = usePageVisible()

  useEffect(() => {
    if (PINGS_DISABLED || !visible) return
    const locals = apps.filter((a) => a.status === 'LOCAL')
    if (!locals.length) return

    let cancelled = false

    async function pingOnce() {
      const entries = await Promise.all(
        locals.map(async (a) => {
          // Non-localhost local entries (Cost Codes uses a relative path) — assume up.
          if (!/^https?:\/\/localhost/i.test(a.url)) return [a.n, 'LOCAL']
          try {
            await fetch(a.url, { mode: 'no-cors', signal: timeoutSignal(1500), cache: 'no-store' })
            return [a.n, 'LOCAL']
          } catch {
            return [a.n, 'OFFLINE']
          }
        }),
      )
      if (cancelled) return
      setPingStatus((prev) => {
        const next = { ...prev }
        for (const [n, st] of entries) next[n] = st
        return next
      })
    }

    pingOnce()
    const id = setInterval(pingOnce, 30000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [apps, visible])

  return pingStatus
}
