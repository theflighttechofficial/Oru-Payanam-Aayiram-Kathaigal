import React from 'react'
import useStore from '../store/useStore'

export default function Toast() {
  const { infoToast } = useStore()

  return (
    <div
      style={{
        ...styles.wrap,
        opacity: infoToast ? 1 : 0,
        transform: infoToast ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(10px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: 'none',
      }}
    >
      {infoToast}
    </div>
  )
}

const styles = {
  wrap: {
    position: 'absolute',
    bottom: 80,
    left: '50%',
    background: 'rgba(8,8,8,0.92)',
    border: '1px solid rgba(216,155,36,0.35)',
    borderRadius: 6,
    padding: '8px 20px',
    fontFamily: "'Courier Prime', monospace",
    fontSize: 12,
    color: '#F3C94B',
    letterSpacing: 1,
    whiteSpace: 'nowrap',
    zIndex: 60,
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  },
}
