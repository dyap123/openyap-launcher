import { useEffect, useState } from 'react'
import { GH_OWNER } from '../data/apps.js'

// GitHub commit-time fetcher with localStorage cache.
// Reuses the exact legacy cache key + 30-min TTL so a returning user keeps a
// warm cache (no "—" flash on first paint). Returns a { [repo]: isoString } map.

const CACHE_TTL_MS = 30 * 60 * 1000
const cacheKey = (repo) => 'lc_repo_lastcommit:' + repo

function readCachedCommit(repo) {
  try {
    const raw = localStorage.getItem(cacheKey(repo))
    if (!raw) return null
    const obj = JSON.parse(raw)
    if (!obj || !obj.iso || !obj.fetchedAt) return null
    return obj // may be stale; caller decides whether to refetch
  } catch {
    return null
  }
}

function writeCachedCommit(repo, iso) {
  try {
    localStorage.setItem(cacheKey(repo), JSON.stringify({ iso, fetchedAt: Date.now() }))
  } catch {
    /* quota / private mode — ignore */
  }
}

export function useCommitTimes(apps) {
  // Hydrate synchronously from cache so the grid renders warm timestamps.
  const [times, setTimes] = useState(() => {
    const init = {}
    for (const a of apps) {
      if (!a.repo || init[a.repo]) continue
      const cached = readCachedCommit(a.repo)
      if (cached) init[a.repo] = cached.iso
    }
    return init
  })

  useEffect(() => {
    const repos = [...new Set(apps.filter((a) => a.repo).map((a) => a.repo))]
    if (!repos.length) return
    const controller = new AbortController()
    let cancelled = false

    ;(async () => {
      const entries = await Promise.all(
        repos.map(async (repo) => {
          const cached = readCachedCommit(repo)
          if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return [repo, cached.iso]
          try {
            const r = await fetch(
              `https://api.github.com/repos/${GH_OWNER}/${repo}/commits?per_page=1`,
              { signal: controller.signal },
            )
            if (!r.ok) throw new Error('http ' + r.status)
            const arr = await r.json()
            const iso = arr[0]?.commit && (arr[0].commit.committer || arr[0].commit.author || {}).date
            if (!iso) throw new Error('no commit date')
            writeCachedCommit(repo, iso)
            return [repo, iso]
          } catch {
            return [repo, cached ? cached.iso : null] // fall back to stale cache
          }
        }),
      )
      if (cancelled) return
      const next = {}
      for (const [repo, iso] of entries) if (iso) next[repo] = iso
      setTimes((prev) => ({ ...prev, ...next }))
    })()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [apps])

  return times
}
