export function Settings({ onBack }: { onBack: () => void }) {
  return (
    <section className="settings" aria-labelledby="settings-title">
      <h1 id="settings-title" className="settings-title">
        Settings
      </h1>
      <p className="settings-body">
        Settings options will live here. (Placeholder for now.)
      </p>
      <button type="button" className="settings-back" onClick={onBack}>
        ← Back to home
      </button>
    </section>
  )
}
