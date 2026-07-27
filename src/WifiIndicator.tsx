import { useEffect, useRef, useState } from 'react'

/**
 * Connection-strength indicator driven primarily by MEASURED latency:
 * every few seconds we time a small same-origin round-trip (cache-busted
 * GET of /favicon.svg) and map the RTT into a 0..3 signal level: an inner
 * solid pie wedge (level 1) + two arches above it (levels 2, 3).
 * navigator.onLine and the Network Information API are supplementary signals.
 *
 * Latency -> level thresholds (ms):
 *   < 150        -> 3 (wedge + both arches, strong)
 *   150 .. < 400 -> 2 (wedge + inner arch)
 *   400 .. <1000 -> 1 (wedge only, weak)
 *   >= 1000 / timeout / offline -> 0 (all grey + red no-signal slash)
 */
const T3 = 150
const T2 = 400
const T1 = 1000
const MEASURE_INTERVAL_MS = 4000
const TIMEOUT_MS = 2000
const PING_URL = '/favicon.svg' // tiny same-origin resource

function levelFromLatency(ms: number): number {
  if (ms < T3) return 3
  if (ms < T2) return 2
  if (ms < T1) return 1
  return 0
}

interface ConnState {
  level: number // 0..3
  latencyMs: number | null
  online: boolean
}

interface NetworkInformationLike {
  addEventListener?: (type: 'change', listener: () => void) => void
  removeEventListener?: (type: 'change', listener: () => void) => void
}

function useConnectionStrength(): ConnState {
  const [state, setState] = useState<ConnState>({
    level: 3,
    latencyMs: null,
    online: navigator.onLine,
  })
  const busy = useRef(false)

  useEffect(() => {
    let cancelled = false

    async function measure() {
      if (busy.current) return
      busy.current = true
      try {
        if (!navigator.onLine) {
          if (!cancelled) setState({ level: 0, latencyMs: null, online: false })
          return
        }
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
        const t0 = performance.now()
        try {
          await fetch(`${PING_URL}?_=${t0}`, {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
          })
          const rtt = Math.round(performance.now() - t0)
          if (!cancelled)
            setState({ level: levelFromLatency(rtt), latencyMs: rtt, online: true })
        } catch {
          // abort (timeout) or network error -> treat as no signal
          if (!cancelled)
            setState({ level: 0, latencyMs: null, online: navigator.onLine })
        } finally {
          clearTimeout(timer)
        }
      } finally {
        busy.current = false
      }
    }

    measure()
    const id = setInterval(measure, MEASURE_INTERVAL_MS)

    const onOnline = () => measure()
    const onOffline = () => setState({ level: 0, latencyMs: null, online: false })
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    // Network Information API (supplementary): re-measure when it changes.
    const conn = (navigator as Navigator & { connection?: NetworkInformationLike })
      .connection
    conn?.addEventListener?.('change', onOnline)

    return () => {
      cancelled = true
      clearInterval(id)
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      conn?.removeEventListener?.('change', onOnline)
    }
  }, [])

  return state
}

export function WifiIndicator() {
  const { level, latencyMs, online } = useConnectionStrength()

  const title = !online
    ? 'Offline'
    : latencyMs == null
      ? 'No response (offline)'
      : `Connection: ${latencyMs} ms — ${level}/3`

  // Signal glyph: an inner SOLID PIE WEDGE (apex at the bottom-center point,
  // level 1 = weak) + two ARCHES above it (levels 2 and 3). Elements with
  // index <= level are solid white ("on"); the rest are faint grey. At level 0
  // (offline / timeout / >=1000ms) all are greyed and a red slash is drawn.
  // Three concentric pie bands over the SAME +/-48 deg fan, all ends on the
  // same two radial edges. Drawn as FILLED shapes so every corner can be
  // softened by a small rounding radius RC (quadratic corners) -- subtle, not
  // full round caps. Bands kept at r+/-1.5, so equal 2px gaps are preserved:
  // wedge outer 5.5 | gap 2 | arch 9 (7.5-10.5) | gap 2 | arch 14 (12.5-15.5).
  const C = { x: 12, y: 16 }
  const FAN = (48 * Math.PI) / 180
  const H = 1.5 // half band width (3px bands)
  const RC = 0.8 // small corner-rounding radius
  const f = (n: number) => n.toFixed(2)
  const P = (r: number, a: number) =>
    `${f(C.x + r * Math.sin(a))} ${f(C.y - r * Math.cos(a))}`

  // Filled annular-sector band at radius r, with all four corners rounded.
  const band = (r: number) => {
    const ri = r - H
    const ro = r + H
    const dO = RC / ro
    const dI = RC / ri
    return [
      `M ${P(ro, -FAN + dO)}`,
      `A ${f(ro)} ${f(ro)} 0 0 1 ${P(ro, FAN - dO)}`, // outer arc
      `Q ${P(ro, FAN)} ${P(ro - RC, FAN)}`, // round outer-right
      `L ${P(ri + RC, FAN)}`, // right edge
      `Q ${P(ri, FAN)} ${P(ri, FAN - dI)}`, // round inner-right
      `A ${f(ri)} ${f(ri)} 0 0 0 ${P(ri, -FAN + dI)}`, // inner arc (reverse)
      `Q ${P(ri, -FAN)} ${P(ri + RC, -FAN)}`, // round inner-left
      `L ${P(ro - RC, -FAN)}`, // left edge
      `Q ${P(ro, -FAN)} ${P(ro, -FAN + dO)}`, // round outer-left
      'Z',
    ].join(' ')
  }

  // Filled pie wedge (apex at C), outer corners + apex rounded by RC.
  const wedgeR = 5.5
  const dW = RC / wedgeR
  const wedge = [
    `M ${P(RC, -FAN)}`,
    `L ${P(wedgeR - RC, -FAN)}`, // left edge from near-apex outward
    `Q ${P(wedgeR, -FAN)} ${P(wedgeR, -FAN + dW)}`, // round outer-left
    `A ${f(wedgeR)} ${f(wedgeR)} 0 0 1 ${P(wedgeR, FAN - dW)}`, // outer arc
    `Q ${P(wedgeR, FAN)} ${P(wedgeR - RC, FAN)}`, // round outer-right
    `L ${P(RC, FAN)}`, // right edge back toward apex
    `Q ${f(C.x)} ${f(C.y)} ${P(RC, -FAN)}`, // round apex
    'Z',
  ].join(' ')

  const archRadii = [9, 14] // levels 2, 3

  return (
    <span className="wifi" role="img" aria-label={title} title={title}>
      <svg width="24" height="17" viewBox="0 0 24 17" aria-hidden="true">
        {/* level 1: inner solid pie wedge (weak) */}
        <path d={wedge} fill="#ffffff" opacity={level >= 1 ? 1 : 0.28} />
        {/* levels 2, 3: rounded-corner bands above */}
        {archRadii.map((r, i) => (
          <path key={r} d={band(r)} fill="#ffffff" opacity={level >= i + 2 ? 1 : 0.28} />
        ))}
        {/* No-service (level 0): all grey + red slash (top-right -> bottom-left). */}
        {level === 0 && (
          <line
            x1="21"
            y1="3"
            x2="3"
            y2="15"
            stroke="#ff3b30"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        )}
      </svg>
    </span>
  )
}
