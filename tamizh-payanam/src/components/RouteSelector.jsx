import React from 'react'
import useStore from '../store/useStore'
import { ROUTES } from '../data/routes'

export default function RouteSelector() {
  const { currentRoute, setRoute, transitioning, exploredRoutes, engineOn } = useStore()

  return (
    <div className="dash-wrap-center" style={styles.wrap}>
      {/* Route board header */}
      <div style={styles.boardLabel}>
        <span>🚌</span>
        <span style={styles.boardLabelText}>SELECT DESTINATION — இடத்தைத் தேர்ந்தெடுக்கவும்</span>
        <span>🚌</span>
      </div>

      {/* Ignition hint — route buttons stay locked until the engine is started */}
      {!engineOn && (
        <div style={styles.ignHint}>🔑 START THE ENGINE FIRST — என்ஜினை ஆன் செய்யவும்</div>
      )}

      {/* Route buttons */}
      <div style={styles.buttons}>
        {ROUTES.map((route, idx) => {
          const isActive = currentRoute === idx
          const isExplored = exploredRoutes.has(idx)
          const disabled = transitioning || !engineOn
          return (
            <button
              key={idx}
              onClick={() => setRoute(idx)}
              disabled={disabled}
              title={!engineOn ? 'Start the engine first' : route.nameT}
              style={{
                ...styles.btn,
                borderColor: isActive ? '#F3C94B' : isExplored ? 'rgba(46,139,87,0.6)' : 'rgba(216,155,36,0.25)',
                background: isActive
                  ? 'rgba(216,155,36,0.18)'
                  : isExplored ? 'rgba(46,139,87,0.08)' : 'rgba(8,8,8,0.85)',
                color: isActive ? '#F3C94B' : isExplored ? '#7acca0' : '#D89B24',
                boxShadow: isActive ? '0 0 16px rgba(243,201,75,0.3)' : 'none',
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              {/* Route number badge */}
              <span style={{
                ...styles.routeNum,
                background: isActive ? '#8C3026' : '#1a1a1a',
                color: isActive ? '#fff' : '#666',
              }}>
                {route.routeNum}
              </span>

              <span style={styles.btnEng}>{route.name.toUpperCase()}</span>

              {/* Explored checkmark */}
              {isExplored && !isActive && (
                <span style={styles.explored}>✓</span>
              )}

              {/* Active indicator */}
              {isActive && (
                <span style={styles.activeDot} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 30,
    textAlign: 'center',
  },
  boardLabel: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 9,
    letterSpacing: 2,
    color: '#333',
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  boardLabelText: { color: '#444' },
  ignHint: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 9,
    letterSpacing: 1,
    color: '#F3C94B',
    marginBottom: 6,
    textShadow: '0 0 8px rgba(243,201,75,0.4)',
  },
  buttons: {
    display: 'flex',
    gap: 5,
    justifyContent: 'center',
    maxWidth: '92vw',
    overflowX: 'auto',
  },
  btn: {
    background: 'rgba(8,8,8,0.85)',
    border: '1px solid rgba(216,155,36,0.25)',
    borderRadius: 5,
    padding: '5px 8px',
    fontFamily: "'Courier Prime', monospace",
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    position: 'relative',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  routeNum: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 8,
    fontWeight: 700,
    padding: '2px 4px',
    borderRadius: 2,
    letterSpacing: 0.5,
    flexShrink: 0,
  },
  btnEng: {
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: 700,
    lineHeight: 1,
  },
  explored: {
    fontSize: 9,
    color: '#2E8B57',
    fontWeight: 700,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: '#F3C94B',
    boxShadow: '0 0 6px #F3C94B',
    animation: 'pulse 1.5s ease infinite',
    flexShrink: 0,
  },
}
