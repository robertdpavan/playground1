import { useState } from 'react'
import './App.css'
import { useCurrentUser, initialsFromName } from './useCurrentUser'
import { WifiIndicator } from './WifiIndicator'
import { useHashRoute } from './useHashRoute'
import { Settings } from './Settings'

function App() {
  const user = useCurrentUser()
  const initials = initialsFromName(user.name)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [route, navigate] = useHashRoute()

  return (
    <main className="home">
      <div className="top-border">
        <h1 className="brand" aria-label="RAVEN">
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
      </div>
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
