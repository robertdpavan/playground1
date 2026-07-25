import { useEffect, useRef, useState } from 'react'

/**
 * Connection-strength indicator driven primarily by MEASURED latency:
 * every few seconds we time a small same-origin round-trip (cache-busted
 * GET of /favicon.svg) and map the RTT into 0..4 wifi bars. navigator.onLine
 * and the Network Information API are used as supplementary signals.
 *
 * Latency -> bars thresholds (ms):
 *   < 100        -> 4 bars (strong)
 *   100 .. < 250 -> 3 bars
 *   250 .. < 500 -> 2 bars
 *   500 .. <1000 -> 1 bar
 *   >= 1000 / timeout / offline -> 0 bars (offline)
 */
const T4 = 100
const T3 = 250
const T2 = 500
const T1 = 1000
const MEASURE_INTERVAL_MS = 4000
const TIMEOUT_MS = 2000
const PING_URL = '/favicon.svg' // tiny same-origin resource

function levelFromLatency(ms: number): number {
  if (ms < T4) return 4
  if (ms < T3) return 3
  if (ms < T2) return 2
  if (ms < T1) return 1
  return 0
}

interface ConnState {
  level: number // 0..4
  latencyMs: number | null
  online: boolean
}

interface NetworkInformationLike {
  addEventListener?: (type: 'change', listener: () => void) => void
  removeEventListener?: (type: 'change', listener: () => void) => void
}

function useConnectionStrength(): ConnState {
  const [state, setState] = useState<ConnState>({
    level: 4,
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
      : `Connection: ${latencyMs} ms — ${level}/4 bars`

  const bars = [1, 2, 3, 4]

  return (
    <span className="wifi" role="img" aria-label={title} title={title}>
      <svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true">
        {bars.map((b) => {
          const w = 3
          const gap = 2
          const x = (b - 1) * (w + gap)
          const h = 3 + (b - 1) * 3.3
          const y = 16 - h
          const active = b <= level
          return (
            <rect
              key={b}
              x={x}
              y={y}
              width={w}
              height={h}
              rx="1"
              fill="#ffffff"
              opacity={active ? 1 : 0.28}
            />
          )
        })}
      </svg>
    </span>
  )
}
