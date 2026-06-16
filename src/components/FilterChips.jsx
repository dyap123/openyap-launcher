import { memo } from 'react'
import { FILTERS, statusMeta } from '../lib/statusMeta.js'

// Status filter row. Each non-ALL chip tints to its status accent when active.
function FilterChips({ active, counts, onSelect }) {
  return (
    <div className="chips">
      {FILTERS.map((key) => {
        const meta = key === 'ALL' ? null : statusMeta(key)
        const style = meta ? { '--accent': meta.accent, '--accent-rgb': meta.rgb } : undefined
        return (
          <button
            key={key}
            type="button"
            className={`chip${active === key ? ' chip--active' : ''}`}
            style={style}
            onClick={() => onSelect(key)}
          >
            {key}
            <span className="chip__count">{counts[key] ?? 0}</span>
          </button>
        )
      })}
    </div>
  )
}

export default memo(FilterChips)
