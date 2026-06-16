import { memo, useEffect, useRef } from 'react'

// Controlled search field. Owns its input ref so it can register the global
// Cmd/Ctrl-K focus hotkey and handle Esc-to-clear locally.
function SearchBar({ value, onChange }) {
  const inputRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const onInputKey = (e) => {
    if (e.key === 'Escape') {
      onChange('')
      e.currentTarget.blur()
    }
  }

  return (
    <div className="search">
      <span className="material-symbols-outlined search__icon">search</span>
      <input
        ref={inputRef}
        className="search__input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onInputKey}
        placeholder="Scan applications · name · kanji · version"
        autoComplete="off"
        aria-label="Search applications"
      />
      <span className="search__hint" aria-hidden="true">⌘K</span>
    </div>
  )
}

export default memo(SearchBar)
