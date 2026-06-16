import { useEffect, useMemo, useState } from 'react'
import { APPS } from './data/apps.js'
import { relativeTime } from './lib/relativeTime.js'
import { FILTERS } from './lib/statusMeta.js'
import { useDebouncedValue } from './hooks/useDebouncedValue.js'
import { useCommitTimes } from './hooks/useCommitTimes.js'
import { useLocalPing } from './hooks/useLocalPing.js'
import { usePageVisible } from './hooks/usePageVisible.js'
import AuroraBackground from './components/AuroraBackground.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import SearchBar from './components/SearchBar.jsx'
import FilterChips from './components/FilterChips.jsx'
import AppGrid from './components/AppGrid.jsx'

export default function App() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('ALL')

  const debouncedQuery = useDebouncedValue(query, 120)
  const commitTimes = useCommitTimes(APPS) // { [repo]: iso }
  const pingStatus = useLocalPing(APPS) //    { [appId]: 'LOCAL' | 'OFFLINE' }
  const visible = usePageVisible()

  // Pause the aurora animation when the tab is hidden (CSS reads [data-paused]).
  useEffect(() => {
    document.documentElement.dataset.paused = visible ? 'false' : 'true'
  }, [visible])

  // Merge live data once; identity only changes when commit/ping data lands, so
  // typing in search does NOT rebuild these objects → memoized cards stay put.
  const enriched = useMemo(
    () =>
      APPS.map((a) => ({
        ...a,
        liveStatus: pingStatus[a.n] || null,
        effStatus: pingStatus[a.n] || a.status,
        liveLast: a.repo && commitTimes[a.repo] ? relativeTime(commitTimes[a.repo]) : a.last,
      })),
    [commitTimes, pingStatus],
  )

  const counts = useMemo(() => {
    const c = { ALL: enriched.length }
    for (const k of FILTERS.slice(1)) c[k] = enriched.filter((a) => a.effStatus === k).length
    return c
  }, [enriched])

  const visibleApps = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    return enriched.filter((a) => {
      if (filter !== 'ALL' && a.effStatus !== filter) return false
      if (!q) return true
      const hay = [a.name, a.jp, a.desc, a.version, a.n].join(' ').toLowerCase()
      return q.split(/\s+/).every((tok) => hay.includes(tok))
    })
  }, [enriched, debouncedQuery, filter])

  return (
    <>
      <AuroraBackground />
      <Header />

      <main className="shell">
        <section className="hero">
          <h1 className="hero__title">Select Application</h1>
          <p className="hero__sub">アプリケーションを選択 · {counts.ALL} applications</p>
        </section>

        <div className="controls">
          <SearchBar value={query} onChange={setQuery} />
          <FilterChips active={filter} counts={counts} onSelect={setFilter} />
        </div>

        <AppGrid apps={visibleApps} />
      </main>

      <Footer />
    </>
  )
}
