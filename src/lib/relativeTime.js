// Relative time helper — ported verbatim from the legacy launcher.
export function relativeTime(iso) {
  if (!iso) return '—'
  const ms = Date.now() - new Date(iso).getTime()
  if (isNaN(ms) || ms < 0) return '—'
  const s = Math.round(ms / 1000)
  if (s < 60) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return m + 'M AGO'
  const h = Math.round(m / 60)
  if (h < 24) return h + 'H AGO'
  const d = Math.round(h / 24)
  if (d < 30) return d + 'D AGO'
  const mo = Math.round(d / 30)
  if (mo < 12) return mo + 'MO AGO'
  return Math.round(mo / 12) + 'Y AGO'
}
