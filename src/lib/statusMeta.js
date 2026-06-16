// Status → aurora accent mapping. The card sets these as CSS custom properties
// (--accent / --accent-rgb) so all the neon glow/border/pill styling reads from
// one variable instead of dynamic Tailwind classes (which can't be purged-safe
// at runtime). `rgb` is the bare channel triple for use inside rgba().

export const STATUS_META = {
  ONLINE:  { label: 'ONLINE',  accent: '#22d3ee', rgb: '34, 211, 238' },   // cyan
  UPDATE:  { label: 'UPDATE',  accent: '#f472b6', rgb: '244, 114, 182' },  // magenta-pink
  LOCAL:   { label: 'LOCAL',   accent: '#34d399', rgb: '52, 211, 153' },   // emerald
  LEGACY:  { label: 'LEGACY',  accent: '#fbbf24', rgb: '251, 191, 36' },   // amber
  OFFLINE: { label: 'OFFLINE', accent: '#64748b', rgb: '100, 116, 139' },  // slate
}

export function statusMeta(status) {
  return STATUS_META[status] || STATUS_META.OFFLINE
}

// Filter chips, in display order.
export const FILTERS = ['ALL', 'ONLINE', 'UPDATE', 'LOCAL', 'OFFLINE', 'LEGACY']
