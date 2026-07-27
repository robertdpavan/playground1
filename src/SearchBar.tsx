import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const PLACEHOLDER = 'Press / to search…'

// TODO(search-data): replace this stub with the real searchable data (from an
// API / app state / context) once the home page has content to search. The
// filtering + keyboard-shortcut wiring below is ready to point at real data --
// just swap SEARCH_ITEMS (and the `filter` predicate) for the real source.
const SEARCH_ITEMS = [
  'Dashboard',
  'Devices',
  'Telemetry',
  'Alerts',
  'Reports',
  'Sites',
  'Users',
  'Settings',
]

// True when the event originated from a field the user is already typing in, so
// the global "/" shortcut doesn't hijack real typing.
function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el || !el.tagName) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
}

export function SearchBar({ box }: { box?: { top: number } | null }) {
  const [query, setQuery] = useState('')
  const [textWidth, setTextWidth] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Measure the placeholder blurb's rendered width so the box can be narrowed
  // to frame it with an equal, modest gap on each side. Re-run on resize and
  // once fonts load.
  useLayoutEffect(() => {
    const measure = () => {
      const el = inputRef.current
      if (!el) return
      const cs = getComputedStyle(el)
      const ctx = document.createElement('canvas').getContext('2d')
      if (!ctx) return
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      let w = ctx.measureText(PLACEHOLDER).width
      const ls = parseFloat(cs.letterSpacing) // canvas ignores letter-spacing
      if (!Number.isNaN(ls)) w += ls * (PLACEHOLDER.length - 1)
      setTextWidth(w)
    }
    measure()
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => window.removeEventListener('resize', measure)
  }, [])

  // top = mirror position from App; width = text + ~40px frame (the input's
  // 16px padding + border + a little slack -> ~20px equal gap each side, and
  // the text is centered via CSS).
  const style =
    box && textWidth != null
      ? {
          position: 'absolute' as const,
          top: box.top,
          left: '50%',
          transform: 'translateX(-50%)',
          width: Math.round(textWidth + 40),
          maxWidth: 'none' as const,
          padding: 0,
        }
      : undefined

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !isTypingTarget(e.target)) {
        // Focus the search box and swallow the "/" so it isn't inserted.
        e.preventDefault()
        inputRef.current?.focus()
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setQuery('')
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const q = query.trim().toLowerCase()
  // Live filter: only show results once there's a query.
  const results = q ? SEARCH_ITEMS.filter((item) => item.toLowerCase().includes(q)) : []

  return (
    <div className="search" role="search" style={style}>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder={PLACEHOLDER}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search"
      />
      {q && (
        <ul className="search-results">
          {results.length > 0 ? (
            results.map((item) => (
              <li key={item} className="search-result">
                {item}
              </li>
            ))
          ) : (
            <li className="search-empty">No results for “{query}”</li>
          )}
        </ul>
      )}
    </div>
  )
}
