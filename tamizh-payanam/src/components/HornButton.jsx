import React from 'react'
import useStore from '../store/useStore'

export default function HornButton() {
  const { pressHorn, hornPressed, showToast } = useStore()

  const handleHorn = () => {
    pressHorn()
    showToast('📯 கோவிந்தா! — HORN OK PLEASE')
  }

  return (
    <button
      className="dash-wrap-right"
      onClick={handleHorn}
      style={{
        ...styles.btn,
        transform: hornPressed ? 'scale(0.9)' : 'scale(1)',
        background: hornPressed ? 'rgba(140,48,38,0.5)' : 'rgba(8,8,8,0.88)',
        boxShadow: hornPressed
          ? '0 0 20px rgba(140,48,38,0.5)'
          : '0 4px 16px rgba(0,0,0,0.5)',
      }}
    >
      <span style={styles.icon}>📯</span>
      <span style={styles.label}>HORN</span>
      <span style={styles.subLabel}>OK</span>
    </button>
  )
}

const styles = {
  btn: {
    position: 'absolute',
    right: 16,
    border: '1px solid #8C3026',
    borderRadius: '50%',
    width: 58,
    height: 58,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    cursor: 'pointer',
    zIndex: 30,
    transition: 'all 0.15s ease',
    color: '#8C3026',
  },
  icon: { fontSize: 18, lineHeight: 1 },
  label: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 8,
    letterSpacing: 1,
    color: '#8C3026',
    lineHeight: 1,
  },
  subLabel: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 7,
    color: '#5a1a10',
    lineHeight: 1,
  },
}
