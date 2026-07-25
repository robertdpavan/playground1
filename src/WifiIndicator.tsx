import { useEffect, useRef, useState } from 'react'

/**
 * Connection-strength indicator driven primarily by MEASURED latency:
 * every few seconds we time a small same-origin round-trip (cache-busted
 * GET of /favicon.svg) and map the RTT into a 0..2 signal level (inner solid
 * pie wedge = weak, + one arch above = strong). navigator.onLine and the
 * Network Information API are used as supplementary signals.
 *
 * Latency -> level thresholds (ms):
 *   < 200        -> 2 (wedge + arch, strong)
 *   200 .. <1000 -> 1 (wedge only, weak)
 *   >= 1000 / timeout / offline -> 0 (all grey + red no-signal slash)
 */
const T2 = 200
const T1 = 1000
const MEASURE_INTERVAL_MS = 4000
const TIMEOUT_MS = 2000
const PING_URL = '/favicon.svg' // tiny same-origin resource

function levelFromLatency(ms: number): number {
  if (ms < T2) return 2
  if (ms < T1) return 1
  return 0
}

interface ConnState {
  level: number // 0..2
  latencyMs: number | null
  online: boolean
}

interface NetworkInformationLike {
  addEventListener?: (type: 'change', listener: () => void) => void
  removeEventListener?: (type: 'change', listener: () => void) => void
}

function useConnectionStrength(): ConnState {
  const [state, setState] = useState<ConnState>({
    level: 2,
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
      : `Connection: ${latencyMs} ms — ${level}/2`

  // Signal glyph: an inner SOLID PIE WEDGE (apex at the bottom-center point,
  // level 1 = weak) with one ARCH above it (level 2 = strong). Elements with
  // index <= level are solid white ("on"); the rest are faint grey. At level 0
  // (offline / timeout / >=1000ms) both are greyed and a red slash is drawn.
  const C = { x: 11, y: 14 }
  const FAN = (48 * Math.PI) / 180 // half-angle of the fan
  const wedgeR = 5 // inner solid wedge outer radius (level 1)
  const archR = 10.5 // outer arch radius (level 2); ~5.5 gap from the wedge (+2px vs before)
  const pt = (r: number, sign: number) =>
    `${(C.x + sign * r * Math.sin(FAN)).toFixed(2)} ${(C.y - r * Math.cos(FAN)).toFixed(2)}`
  const wedge = `M ${C.x} ${C.y} L ${pt(wedgeR, -1)} A ${wedgeR} ${wedgeR} 0 0 1 ${pt(wedgeR, 1)} Z`
  const arch = `M ${pt(archR, -1)} A ${archR} ${archR} 0 0 1 ${pt(archR, 1)}`

  return (
    <span className="wifi" role="img" aria-label={title} title={title}>
      <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
        {/* level 1: inner solid pie wedge (weak) */}
        <path d={wedge} fill="#ffffff" opacity={level >= 1 ? 1 : 0.28} />
        {/* level 2: arch above (strong) */}
        <path
          d={arch}
          fill="none"
          stroke="#ffffff"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={level >= 2 ? 1 : 0.28}
        />
        {/* No-service (level 0): all grey + red slash (top-right -> bottom-left). */}
        {level === 0 && (
          <line
            x1="19"
            y1="2"
            x2="3"
            y2="14"
            stroke="#ff3b30"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        )}
      </svg>
    </span>
  )
}
