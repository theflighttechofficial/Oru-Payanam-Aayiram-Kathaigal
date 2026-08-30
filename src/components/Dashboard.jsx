import React from 'react'
import useStore from '../store/useStore'

export default function Dashboard() {
  const {
    engineOn, toggleEngine, headlightsOn, toggleHeadlights,
    leftIndicatorOn, rightIndicatorOn, toggleIndicator,
    muted, toggleMute, speed, ambientSound, toggleAmbient,
  } = useStore()

  return (
    <div className="dash-wrap" style={styles.wrap}>
      <div style={styles.label}>DASHBOARD · கருவிப்பலகை</div>
      <div style={styles.gaugeRow}>
        <div style={styles.gauge}>
          <span style={styles.gaugeVal}>{speed}</span>
          <span style={styles.gaugeUnit}>km/h</span>
        </div>
        <div style={styles.gauge}>
          <span style={{ ...styles.gaugeVal, fontSize: 13, color: engineOn ? '#7acca0' : '#444' }}>{engineOn ? 'F' : '—'}</span>
          <span style={styles.gaugeUnit}>fuel</span>
        </div>
      </div>
      {!engineOn && (
        <div style={styles.ignCallout}>
          <span style={styles.ignCalloutText}>start engine from here</span>
          <span style={styles.ignArrow}>↓</span>
        </div>
      )}
      <div style={styles.row}>
        <Switch label="IGN" sub="என்ஜின்" on={engineOn} onClick={toggleEngine} activeColor="#F3C94B" />
        <Switch label="HEAD" sub="விளக்கு" on={headlightsOn} onClick={toggleHeadlights} activeColor="#FFF3C0" />
        <Switch label="◀ IND" sub="இடது" on={leftIndicatorOn} onClick={() => toggleIndicator('left')} activeColor="#FFA500" />
        <Switch label="IND ▶" sub="வலது" on={rightIndicatorOn} onClick={() => toggleIndicator('right')} activeColor="#FFA500" />
        <Switch label={muted ? 'MUTE' : 'SND'} sub={muted ? 'அமைதி' : 'ஒலி'} on={!muted} onClick={toggleMute} activeColor="#7acca0" />
        <Switch label="AMB" sub="சூழல்" on={ambientSound} onClick={toggleAmbient} activeColor="#6ab0d8" />
      </div>
    </div>
  )
}

function Switch({ label, sub, on, onClick, activeColor, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.switchBtn,
        borderColor: on ? activeColor : 'rgba(216,155,36,0.25)',
        boxShadow: on ? `0 0 12px ${activeColor}55, inset 0 0 6px ${activeColor}33` : 'inset 0 2px 4px rgba(0,0,0,0.5)',
        opacity: disabled ? 0.4 : 1,
      }}
      title={label}
    >
      <span style={{ ...styles.dot, background: on ? activeColor : '#333', boxShadow: on ? `0 0 6px ${activeColor}` : 'none' }} />
      <span style={styles.switchLabel}>{label}</span>
      <span style={styles.switchSub}>{sub}</span>
    </button>
  )
}

const styles = {
  wrap: {
    position: 'absolute',
    left: 16,
    zIndex: 30,
    background: 'rgba(8,8,8,0.85)',
    border: '1px solid rgba(216,155,36,0.3)',
    borderRadius: 8,
    padding: '8px 10px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
  },
  ignCallout: {
    position: 'absolute',
    top: -46,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 150,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    animation: 'floatBus 1.6s ease-in-out infinite',
    pointerEvents: 'none',
  },
  ignCalloutText: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 10,
    fontWeight: 700,
    color: '#F3C94B',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 1.3,
    background: 'rgba(8,8,8,0.9)',
    border: '1px solid rgba(243,201,75,0.5)',
    borderRadius: 4,
    padding: '3px 6px',
    textShadow: '0 0 8px rgba(243,201,75,0.5)',
  },
  ignArrow: {
    fontSize: 14,
    color: '#F3C94B',
    lineHeight: 1,
    marginTop: 1,
    textShadow: '0 0 8px rgba(243,201,75,0.6)',
  },
  label: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 8,
    letterSpacing: 2,
    color: '#555',
    marginBottom: 6,
    textAlign: 'center',
  },
  row: { display: 'flex', gap: 6 },
  gaugeRow: { display: 'flex', gap: 6, marginBottom: 6, justifyContent: 'center' },
  gauge: {
    background: '#050d05',
    border: '1px solid #1a3a1a',
    borderRadius: 4,
    padding: '3px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 44,
  },
  gaugeVal: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 15,
    fontWeight: 700,
    color: '#7acca0',
    lineHeight: 1.1,
  },
  gaugeUnit: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 7,
    color: '#3a6a3a',
    letterSpacing: 1,
  },
  switchBtn: {
    background: '#111',
    border: '1px solid #333',
    borderRadius: 5,
    padding: '6px 7px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    minWidth: 40,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    transition: 'all 0.15s ease',
  },
  switchLabel: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 8,
    fontWeight: 700,
    color: '#D89B24',
    letterSpacing: 0.5,
  },
  switchSub: {
    fontFamily: "'Noto Sans Tamil', sans-serif",
    fontSize: 7,
    color: '#666',
  },
}
