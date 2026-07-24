import './App.css'

function App() {
  return (
    <main className="home">
      <div className="top-border">
        <h1 className="brand" aria-label="RAVEN">
          R<span className="brand-a">Λ</span>VEN
        </h1>
      </div>
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
      </div>
    </main>
  )
}

export default App
