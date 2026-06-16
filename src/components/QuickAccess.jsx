import { memo } from 'react'
import { statusMeta } from '../lib/statusMeta.js'

// Compact one-click launch row for pinned apps. Sits above the grid so the
// apps the user lives in are always one tap away. Hidden entirely when nothing
// is pinned.
function QuickAccess({ apps, onTogglePin }) {
  if (!apps.length) return null
  return (
    <section className="quick" aria-label="Quick access">
      <div className="quick__label">
        <span className="material-symbols-outlined">bolt</span>
        Quick Access
      </div>
      <div className="quick__row">
        {apps.map((app) => {
          const meta = statusMeta(app.effStatus)
          return (
            <a
              key={app.n}
              className="quick-tile"
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ '--accent': meta.accent, '--accent-rgb': meta.rgb }}
            >
              <span className="quick-tile__icon">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {app.icon}
                </span>
              </span>
              <span className="quick-tile__name">{app.name}</span>
              <span className="quick-tile__dot" aria-hidden="true" />
              <button
                type="button"
                className="quick-tile__unpin"
                title="Remove from Quick Access"
                aria-label={`Remove ${app.name} from Quick Access`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onTogglePin(app.n)
                }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </a>
          )
        })}
      </div>
    </section>
  )
}

export default memo(QuickAccess)
