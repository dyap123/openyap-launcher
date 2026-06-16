import { memo } from 'react'

// Animated gradient mesh = a few big soft radial-gradient blobs. Each blob's
// blur is applied once (static); only `transform` is animated, so the work stays
// on the compositor — no per-frame paint. Pausing on hidden tabs is handled via
// the document-level [data-paused] attribute (toggled in App), and reduced-motion
// freezes the blobs via a CSS @media block. This component never re-renders.
function AuroraBackground() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="aurora__blob aurora__blob--1" />
      <span className="aurora__blob aurora__blob--2" />
      <span className="aurora__blob aurora__blob--3" />
      <span className="aurora__blob aurora__blob--4" />
      <div className="aurora__grid" />
      <div className="aurora__vignette" />
    </div>
  )
}

export default memo(AuroraBackground)
