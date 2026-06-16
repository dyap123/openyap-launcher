import { memo } from 'react'
import AppCard from './AppCard.jsx'

function AppGrid({ apps }) {
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
        <AppCard key={app.n} app={app} />
      ))}
    </div>
  )
}

export default memo(AppGrid)
