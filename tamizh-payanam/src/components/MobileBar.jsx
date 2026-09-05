import React from 'react'
import useStore from '../store/useStore'

export default function MobileBar() {
  const { pressHorn, toggleEngine, setActivePanel, toggleTapeRack } = useStore()

  return (
    <div className="mobile-only" style={styles.wrap}>
      <button style={styles.btn} onClick={toggleTapeRack}>
        <span>🚌</span><span style={styles.lbl}>ROUTE</span>
      </button>
      <button style={styles.btn} onClick={toggleEngine}>
        <span>🔑</span><span style={styles.lbl}>ENGINE</span>
      </button>
      <button style={styles.btn} onClick={pressHorn}>
        <span>📯</span><span style={styles.lbl}>HORN</span>
      </button>
      <button style={styles.btn} onClick={() => setActivePanel('culture')}>
        <span>🎭</span><span style={styles.lbl}>CULTURE</span>
      </button>
    </div>
  )
}

const styles = {
  wrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 54,
    zIndex: 40,
    background: 'rgba(6,8,6,0.95)',
    borderTop: '1px solid rgba(216,155,36,0.3)',
    // No inline `display` here — same lesson as the MobileNotice bug: the
    // .mobile-only class owns display (none by default, flex only under
    // the mobile media query with !important); an inline value would beat
    // that base rule and force this bar to render on desktop too.
  },
  btn: {
    flex: 1,
    background: 'none',
    border: 'none',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    color: '#D89B24',
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    fontSize: 18,
  },
  lbl: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 11,
    letterSpacing: 1,
  },
}
