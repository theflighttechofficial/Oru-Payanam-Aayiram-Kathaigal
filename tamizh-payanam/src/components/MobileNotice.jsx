import React, { useState } from 'react'

// The full experience (bus SVG, bottom dashboard, tape rack) is laid out for
// desktop landscape and gets cramped on a phone. Rather than a half-built
// dedicated mobile layout, surface an honest, dismissible heads-up instead —
// the mobile-only bottom bar still works, this just sets expectations.
export default function MobileNotice() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="mobile-only" style={styles.wrap}>
      <span style={styles.text}>🖥️ Best experienced on a desktop — some panels are cramped on small screens</span>
      <button style={styles.close} onClick={() => setDismissed(true)}>✕</button>
    </div>
  )
}

const styles = {
  wrap: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    zIndex: 96,
    background: 'rgba(8,8,8,0.92)',
    border: '1px solid rgba(216,155,36,0.4)',
    borderRadius: 8,
    padding: '8px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
  },
  text: {
    flex: 1,
    fontFamily: "'Courier Prime', monospace",
    fontSize: 10,
    lineHeight: 1.4,
    color: '#D89B24',
  },
  close: {
    background: 'none',
    border: '1px solid #333',
    borderRadius: '50%',
    width: 20,
    height: 20,
    color: '#888',
    fontSize: 10,
    cursor: 'pointer',
    flexShrink: 0,
  },
}
