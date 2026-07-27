import { useEffect, useRef, useState } from 'react'

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

export function SearchBar() {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

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
    <div className="search" role="search">
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Press / to search…"
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
