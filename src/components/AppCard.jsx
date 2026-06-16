import { memo, useRef } from 'react'
import { statusMeta } from '../lib/statusMeta.js'

const prefersReduced = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

// One launcher tile. Memoized so search/filter only re-renders the cards whose
// data actually changed — the other ~21 keep their previous render. Tilt is done
// with direct CSS-variable writes (no React state) and rAF-throttled so pointer
// motion never triggers a re-render or layout thrash.
function AppCard({ app }) {
  const ref = useRef(null)
  const rectRef = useRef(null)
  const rafRef = useRef(0)

  const eff = app.effStatus
  const meta = statusMeta(eff)
  const offline = eff === 'OFFLINE'
  const lastStr = app.liveLast || app.last || '—'
  const showLiveDot = eff === 'LOCAL' && app.liveStatus === 'LOCAL'

  const onEnter = () => {
    if (offline || prefersReduced()) return
    rectRef.current = ref.current?.getBoundingClientRect() || null
  }
  const onMove = (e) => {
    if (offline || prefersReduced()) return
    const rect = rectRef.current
    const el = ref.current
    if (!rect || !el) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', (py * -5).toFixed(2) + 'deg')
      el.style.setProperty('--ry', (px * 5).toFixed(2) + 'deg')
    })
  }
  const reset = () => {
    cancelAnimationFrame(rafRef.current)
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <a
      ref={ref}
      href={offline ? undefined : app.url}
      target={offline ? undefined : '_blank'}
      rel="noopener noreferrer"
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`app-card${app.featured ? ' app-card--featured' : ''}${offline ? ' app-card--offline' : ''}`}
      style={{ '--accent': meta.accent, '--accent-rgb': meta.rgb }}
      data-id={app.n}
    >
      <span className="app-card__corner" aria-hidden="true">{app.n}</span>

      <div className="app-card__top">
        <div className="app-card__icon">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            {app.icon}
          </span>
        </div>
        <span className="app-card__pill">{meta.label}</span>
      </div>

      <div className="app-card__body">
        <h3 className="app-card__title">{app.name}</h3>
        <p className="app-card__jp">{app.jp}</p>
        <p className="app-card__desc">{app.desc}</p>
      </div>

      <div className="app-card__launch">
        <span className="app-card__launch-text">{offline ? 'OFFLINE — START LOCALLY' : 'LAUNCH'}</span>
        <span className="material-symbols-outlined app-card__arrow">arrow_forward</span>
      </div>

      <div className="app-card__strip">
        <span>{showLiveDot && <span className="live-dot" aria-hidden="true" />}{app.version}</span>
        <span>LAST: {lastStr}</span>
      </div>
    </a>
  )
}

export default memo(AppCard)
