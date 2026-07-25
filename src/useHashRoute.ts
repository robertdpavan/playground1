import { useEffect, useState } from 'react'

// Lightweight hash-based routing (no router dependency). The URL hash is the
// source of truth, so the browser Back button works and links are shareable.
export type Route = 'home' | 'settings'

function parse(hash: string): Route {
  return hash.replace(/^#\/?/, '') === 'settings' ? 'settings' : 'home'
}

export function useHashRoute(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash))

  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = (next: Route) => {
    // Setting the hash pushes a history entry and fires 'hashchange'.
    window.location.hash = next === 'settings' ? '#/settings' : '#/'
  }

  return [route, navigate]
}
