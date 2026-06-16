import { memo } from 'react'
import AppCard from './AppCard.jsx'

function AppGrid({ apps, pinned, onTogglePin }) {
  if (!apps.length) {
    return (
      <div className="grid-empty">
        No apps match — clear filters or try a different term
      </div>
    )
  }
  return (
    <div className="app-grid">
      {apps.map((app) => (
        <AppCard key={app.n} app={app} isPinned={pinned.has(app.n)} onTogglePin={onTogglePin} />
      ))}
    </div>
  )
}

export default memo(AppGrid)
