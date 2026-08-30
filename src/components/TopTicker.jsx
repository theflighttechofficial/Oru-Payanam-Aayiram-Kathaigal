import React from 'react'
import useStore from '../store/useStore'
import { RADIO_STATIONS, SONGS } from '../data/routes'

// Scrolling marquee bar, fixed to the very top. CSS-only animation (no JS
// timers) so it stays smooth regardless of main-thread load.
export default function TopTicker({ route }) {
  const { activeTape, nowPlayingTitle, playerMode, radioStation, isPlaying, radioPlaying } = useStore()

  const trackName = playerMode === 'tape' && activeTape
    ? (nowPlayingTitle || 'Loading…')
    : SONGS[radioStation]
  const source = playerMode === 'tape' && activeTape ? activeTape.labelEng : RADIO_STATIONS[radioStation].name
  const playing = playerMode === 'tape' ? isPlaying : radioPlaying

  const text = `♫ ${trackName} — ${source} · ${route.board} · HORN OK PLEASE · `
  const repeated = text.repeat(4)

  return (
    <div style={styles.wrap}>
      <span style={styles.badge}>TNSTC</span>
      <div style={styles.track}>
        <div style={{
          ...styles.scroll,
          animationDuration: playing ? '18s' : '34s',
        }}>
          {repeated}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 28,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
    borderBottom: '1px solid rgba(216,155,36,0.35)',
    overflow: 'hidden',
  },
  badge: {
    flexShrink: 0,
    fontFamily: "'Baloo Thambi 2', sans-serif",
    fontSize: 10, fontWeight: 800, color: '#0a0a0a',
    background: '#D89B24',
    padding: '2px 10px',
    letterSpacing: 1,
  },
  track: { flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' },
  scroll: {
    display: 'inline-block',
    fontFamily: "'Courier Prime', monospace",
    fontSize: 10,
    color: '#7acca0',
    letterSpacing: 1,
    animationName: 'tickerScroll',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
}
