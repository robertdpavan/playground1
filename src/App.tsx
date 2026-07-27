import { useLayoutEffect, useRef, useState } from 'react'
import './App.css'
import { useCurrentUser, initialsFromName } from './useCurrentUser'
import { WifiIndicator } from './WifiIndicator'
import { useHashRoute } from './useHashRoute'
import { Settings } from './Settings'
import { SearchBar } from './SearchBar'

function App() {
  const user = useCurrentUser()
  const initials = initialsFromName(user.name)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [route, navigate] = useHashRoute()

  // Size/position the search box relative to the RAVEN logo: match RAVEN's
  // rendered width, and mirror it across the blue/white boundary (its top edge
  // sits as far below the boundary as RAVEN's bottom edge is above it).
  const brandRef = useRef<HTMLHeadingElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const homeRef = useRef<HTMLElement>(null)
  const [searchBox, setSearchBox] = useState<{ width: number; top: number } | null>(null)

  useLayoutEffect(() => {
    const measure = () => {
      const brand = brandRef.current
      const bar = barRef.current
      const home = homeRef.current
      if (!brand || !bar || !home) return
      const b = brand.getBoundingClientRect() // post-transform RAVEN box
      const barRect = bar.getBoundingClientRect()
      const homeRect = home.getBoundingClientRect()
      const boundary = barRect.bottom // blue/white boundary
      const x = boundary - b.bottom // RAVEN bottom above the boundary
      setSearchBox({
        width: b.width * 1.213, // 1.155 x 1.05 = ~21.3% wider than the logo width
        top: boundary + x - homeRect.top, // same distance x below the boundary
      })
    }
    measure()
    window.addEventListener('resize', measure)
    // RAVEN uses the Aldrich webfont; re-measure once it finishes loading.
    document.fonts?.ready.then(measure).catch(() => {})
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <main className="home" ref={homeRef}>
      <div className="top-border" ref={barRef}>
        <h1 className="brand" aria-label="RAVEN" ref={brandRef}>
          R<span className="brand-a">Λ</span>VEN
        </h1>
        <div className="top-actions">
          <WifiIndicator />
          <button
            type="button"
            className="avatar-btn"
            aria-label={`Account menu for ${user.name}`}
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            {initials}
          </button>
        </div>
      </div>

      {route === 'settings' ? (
        <Settings onBack={() => navigate('home')} />
      ) : (
        <>
          <SearchBar box={searchBox} />
          <div className="face-pile" role="group" aria-label="pile of faces">
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '82px', left: '82px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '68px', left: '63px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '68px', left: '98px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="sad face" style={{ top: '98px', left: '58px' }}>🙁</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '100px', left: '96px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '110px', left: '78px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '88px', left: '108px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="sad face" style={{ top: '120px', left: '104px' }}>🙁</span>
        <span className="smiley" role="img" aria-label="sad face" style={{ top: '96px', left: '118px' }}>🙁</span>
        <span className="smiley" role="img" aria-label="sad face" style={{ top: '112px', left: '96px' }}>🙁</span>
        <span className="smiley" role="img" aria-label="sad face" style={{ top: '78px', left: '112px' }}>🙁</span>
        <span className="smiley" role="img" aria-label="sad face" style={{ top: '104px', left: '70px' }}>🙁</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '122px', left: '86px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '84px', left: '92px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="sad face" style={{ top: '106px', left: '108px' }}>🙁</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '90px', left: '74px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '116px', left: '116px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '94px', left: '66px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '108px', left: '128px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '72px', left: '84px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '100px', left: '120px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '76px', left: '104px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="sad face" style={{ top: '118px', left: '74px' }}>🙁</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '86px', left: '126px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '124px', left: '90px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '80px', left: '70px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '112px', left: '112px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '70px', left: '90px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '128px', left: '100px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '92px', left: '132px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '66px', left: '104px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="sad face" style={{ top: '122px', left: '118px' }}>🙁</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '96px', left: '62px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="sad face" style={{ top: '64px', left: '84px' }}>🙁</span>
        <span className="smiley" role="img" aria-label="sad face" style={{ top: '128px', left: '76px' }}>🙁</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '98px', left: '132px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '134px', left: '96px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '62px', left: '96px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '138px', left: '112px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '58px', left: '110px' }}>🙂</span>
        <span className="smiley" role="img" aria-label="happy face" style={{ top: '142px', left: '80px' }}>🙂</span>
          </div>
        </>
      )}

      {/* Account drawer (slides in from the right) */}
      <div
        className={`drawer-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      />
      <aside
        className={`drawer${drawerOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Account menu"
        aria-hidden={!drawerOpen}
      >
        <button
          type="button"
          className="drawer-close"
          aria-label="Close account menu"
          onClick={() => setDrawerOpen(false)}
        >
          ×
        </button>
        <div className="drawer-content">
          <button
            type="button"
            className="drawer-link"
            onClick={() => {
              navigate('settings')
              setDrawerOpen(false)
            }}
          >
            Settings
          </button>
          <button
            type="button"
            className="signout-btn"
            onClick={() => {
              // TODO(auth): call the real sign-out (clear session / redirect) here.
              setDrawerOpen(false)
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
    </main>
  )
}

export default App
