import { memo, useEffect, useState } from 'react'

// Isolated so the 1s clock tick never re-renders the grid.
function Footer() {
  const [time, setTime] = useState('--:--:--')
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const p = (n) => String(n).padStart(2, '0')
      setTime(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className="site-footer">
      <span className="site-footer__status">
        <span className="site-footer__dot" /> SYSTEM ONLINE · AURORA OS v2.0
      </span>
      <div className="site-footer__meta">
        <span>LOCAL_TIME {time}</span>
        <span>DRIVER D.YAP</span>
      </div>
    </footer>
  )
}

export default memo(Footer)
