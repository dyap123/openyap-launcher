import { memo } from 'react'

const BASE = import.meta.env.BASE_URL

// Static top bar. The "Open Core" button links to the preserved legacy launcher
// (public/core.html) via BASE_URL so it resolves under the Pages subpath.
function Header() {
  return (
    <header className="site-header">
      <a className="brand" href={BASE}>
        <span className="brand__mark" aria-hidden="true" />
        <span className="brand__word">OPENYAP</span>
        <span className="brand__tag">LAUNCHER</span>
      </a>

      <nav className="site-nav">
        <a className="nav-link" href="https://github.com/dyap123" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a className="nav-link" href={`${BASE}diagnostics.html`}>
          Diagnostics
        </a>
        <a className="core-link" href={`${BASE}core.html`}>
          <span className="material-symbols-outlined core-link__icon">deployed_code</span>
          Open Core
          <span className="material-symbols-outlined core-link__arrow">north_east</span>
        </a>
      </nav>
    </header>
  )
}

export default memo(Header)
