import React, { useState, useEffect, useRef, useCallback } from 'react'
import useStore from '../store/useStore'
import { RADIO_STATIONS, SONGS } from '../data/routes'
import { playClick } from '../audio/sound'

export default function TamizhRadio() {
  const {
    radioStation, setRadioStation, radioPlaying, toggleRadio, bumpKnobClicks, showToast,
    activeTape, deckTape, isPlaying, setPlaying, currentTrackIndex, nextTrack, prevTrack,
    volume, setVolume, playerMode, setPlayerMode, playerReady, setPlayerReady, ejectTape,
    toggleTapeRack, pressHorn,
  } = useStore()

  const [ejecting, setEjecting] = useState(false)
  const [knobAngle, setKnobAngle] = useState((volume / 100) * 270 - 135)
  const [bars, setBars] = useState(Array(10).fill(false))
  const [tuning, setTuning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [duration, setDuration] = useState(0)
  const animRef = useRef()
  const dragRef = useRef(null)
  const ytPlayerRef = useRef(null)
  const hiddenPlayerRef = useRef(null)
  const progressTimerRef = useRef(null)

  const station = RADIO_STATIONS[radioStation]
  const song = SONGS[radioStation]

  // ── YouTube IFrame API — loaded once, mounted in a hidden 1×1 div ──
  useEffect(() => {
    const initPlayer = () => {
      if (!hiddenPlayerRef.current || ytPlayerRef.current) return
      ytPlayerRef.current = new window.YT.Player(hiddenPlayerRef.current, {
        height: '1', width: '1',
        playerVars: { autoplay: 0, controls: 0, rel: 0 },
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.PLAYING) setPlaying(true)
            else if (e.data === window.YT.PlayerState.PAUSED) setPlaying(false)
            else if (e.data === window.YT.PlayerState.ENDED) nextTrack()
          },
        },
      })
    }
    if (!window.YT || !window.YT.Player) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
      window.onYouTubeIframeAPIReady = initPlayer
    } else {
      initPlayer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load the tape's playlist whenever a new tape is placed in the deck
  useEffect(() => {
    if (!deckTape || !playerReady || !ytPlayerRef.current) return
    try {
      ytPlayerRef.current.loadPlaylist({
        list: deckTape.ytPlaylistId,
        listType: 'playlist',
        index: currentTrackIndex,
      })
      ytPlayerRef.current.setVolume(volume)
    } catch (err) {
      showToast('⚠ TAPE UNREADABLE — check playlist ID')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckTape, playerReady])

  // Jump to the current track index within the loaded playlist
  useEffect(() => {
    if (!deckTape || !playerReady || !ytPlayerRef.current) return
    try { ytPlayerRef.current.playVideoAt(currentTrackIndex) } catch (err) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex])

  // Progress polling while playing
  useEffect(() => {
    clearInterval(progressTimerRef.current)
    if (isPlaying && playerReady && ytPlayerRef.current) {
      progressTimerRef.current = setInterval(() => {
        try {
          setElapsed(ytPlayerRef.current.getCurrentTime() || 0)
          setDuration(ytPlayerRef.current.getDuration() || 0)
        } catch (err) {}
      }, 1000)
    }
    return () => clearInterval(progressTimerRef.current)
  }, [isPlaying, playerReady])

  // Animate EQ bars (radio mode ambience, also runs for tape playback)
  useEffect(() => {
    const active = playerMode === 'radio' ? radioPlaying : isPlaying
    if (!active) { setBars(Array(10).fill(false)); return }
    const animate = () => {
      setBars(prev => prev.map(() => Math.random() > 0.35))
      animRef.current = setTimeout(animate, 300 + Math.random() * 200)
    }
    animate()
    return () => clearTimeout(animRef.current)
  }, [radioPlaying, isPlaying, playerMode])

  const tuneStation = (dir = 1) => {
    const next = (radioStation + dir + RADIO_STATIONS.length) % RADIO_STATIONS.length
    setTuning(true)
    setTimeout(() => { setRadioStation(next); setTuning(false) }, 350)
  }

  // ── Transport actions ──
  const handlePlayPause = () => {
    playClick()
    if (playerMode === 'radio') { toggleRadio(); return }
    if (!deckTape || !playerReady) { showToast('📼 Load a tape first'); return }
    try {
      if (isPlaying) ytPlayerRef.current.pauseVideo()
      else ytPlayerRef.current.playVideo()
    } catch (err) {}
  }
  const handleSeek = (deltaSec) => {
    if (!deckTape || !playerReady) return
    try {
      const t = ytPlayerRef.current.getCurrentTime() || 0
      ytPlayerRef.current.seekTo(Math.max(0, t + deltaSec), true)
    } catch (err) {}
  }
  const handleStop = () => {
    playClick()
    if (!deckTape || !playerReady) return
    try { ytPlayerRef.current.stopVideo() } catch (err) {}
    setElapsed(0)
    setPlaying(false)
  }
  const handleEject = () => {
    playClick()
    if (!deckTape) return
    setEjecting(true)
    handleStop()
    showToast('⏏ CASSETTE EJECTED')
    setTimeout(() => { ejectTape(); setEjecting(false) }, 550)
  }
  const handleScrub = (e) => {
    if (!deckTape || !playerReady || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    try { ytPlayerRef.current.seekTo(frac * duration, true) } catch (err) {}
    setElapsed(frac * duration)
  }

  // ── Draggable volume knob ──
  const onKnobMouseDown = (e) => {
    dragRef.current = { startY: e.clientY, startVol: volume }
    window.addEventListener('mousemove', onKnobMouseMove)
    window.addEventListener('mouseup', onKnobMouseUp)
  }
  const onKnobMouseMove = useCallback((e) => {
    if (!dragRef.current) return
    const delta = dragRef.current.startY - e.clientY
    const v = Math.max(0, Math.min(100, dragRef.current.startVol + delta))
    setVolume(v)
    try { ytPlayerRef.current?.setVolume(v) } catch (err) {}
  }, [setVolume])
  const onKnobMouseUp = useCallback(() => {
    dragRef.current = null
    window.removeEventListener('mousemove', onKnobMouseMove)
    window.removeEventListener('mouseup', onKnobMouseUp)
  }, [onKnobMouseMove])
  useEffect(() => {
    setKnobAngle((volume / 100) * 270 - 135)
  }, [volume])

  const handleHornBar = () => {
    pressHorn()
    showToast('📯 கோவிந்தா! HORN OK PLEASE!')
  }

  const fmt = (s) => {
    if (!isFinite(s) || s < 0) s = 0
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const trackName = deckTape ? deckTape.tracks[currentTrackIndex] : null
  const progressPct = duration ? (elapsed / duration) * 100 : 0
  const reelSpeed = 2 - Math.min(1.6, (progressPct / 100) * 1.6)

  return (
    <div className="desktop-only" style={styles.wrap}>
      {/* Hidden YouTube player mount point — never visible */}
      <div ref={hiddenPlayerRef} style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }} />

      {/* ── Brand bar ── */}
      <div style={styles.brandBar}>
        <span style={styles.brandLogo}>TNSTC</span>
        <span style={styles.brandStatus}>
          <Led on={true} color="#7acca0" /> PWR
          <Led on={playerMode === 'radio' ? radioPlaying : isPlaying} color="#F3C94B" /> PLAY
          <Led on={!!deckTape} color="#D89B24" /> TAPE
        </span>
        <span style={styles.brandVol}>VOL: {Math.round(volume)}%</span>
        <button style={styles.rackBtn} onClick={() => { playClick(); toggleTapeRack() }}>TAPE RACK ▤</button>
      </div>

      {/* ── Three-column deck ── */}
      <div style={styles.columns}>
        {/* CASSETTE DECK */}
        <div style={styles.col}>
          <div style={styles.colLabel}>CASSETTE DECK</div>
          <div style={{
            ...styles.tapeSlot,
            animation: ejecting ? 'cassetteEject 0.5s ease forwards' : 'none',
          }}>
            {deckTape ? (
              <div style={{ ...styles.tapeBody, background: deckTape.color, borderColor: deckTape.accent }}>
                <div style={styles.tapeWindow}>
                  <Reel spinning={isPlaying} speed={reelSpeed} />
                  <div style={styles.tapeStrip} />
                  <Reel spinning={isPlaying} speed={reelSpeed} />
                </div>
                <div style={{ ...styles.tapeLabel, color: deckTape.accent }}>{deckTape.labelEng}</div>
              </div>
            ) : (
              <div style={styles.emptySlot}>NO TAPE — LOAD FROM RACK ▤</div>
            )}
          </div>
          <div style={styles.trackDisplay}>
            {deckTape ? (
              <>
                <div style={styles.trackName}>{trackName}</div>
                <div style={styles.trackTime}>{fmt(elapsed)} / {fmt(duration)}</div>
              </>
            ) : (
              <div style={styles.trackName}>— — —</div>
            )}
          </div>
          {/* Progress scrub bar */}
          <div style={styles.scrubTrack} onClick={handleScrub}>
            <div style={{ ...styles.scrubFill, width: `${progressPct}%` }} />
          </div>
          {/* Mode buttons */}
          <div style={styles.modeRow}>
            <button
              style={{ ...styles.modeBtn, ...(playerMode === 'tape' ? styles.modeBtnActive : {}) }}
              onClick={() => { playClick(); setPlayerMode('tape') }}
            >TAPE</button>
            <button
              style={{ ...styles.modeBtn, ...(playerMode === 'radio' ? styles.modeBtnActive : {}) }}
              onClick={() => { playClick(); setPlayerMode('radio') }}
            >RADIO</button>
          </div>
        </div>

        {/* EQ + METER */}
        <div style={styles.col}>
          <div style={styles.colLabel}>EQ + METER</div>
          <div style={styles.eqWrap}>
            {bars.map((lit, i) => (
              <div key={i} style={{
                ...styles.eqBar,
                height: lit ? (10 + Math.random() * 26) : 4,
                background: lit ? '#3a8a3a' : '#123312',
              }} />
            ))}
          </div>
          <div
            style={{ ...styles.knob, transform: `rotate(${knobAngle}deg)` }}
            onMouseDown={onKnobMouseDown}
            title="Drag to adjust volume"
          >
            <div style={styles.knobMark} />
          </div>
          <div style={styles.knobCaption}>VOLUME</div>
        </div>

        {/* RADIO TUNER */}
        <div style={styles.col}>
          <div style={styles.colLabel}>RADIO TUNER</div>
          <div style={styles.display}>
            {tuning ? (
              <>
                <div style={styles.freqLine}>TUNING...</div>
                <div style={styles.staticLine}>▓▒░▒▓▒░▒▓▒░▒▓</div>
              </>
            ) : (
              <>
                <div style={styles.freqLine}>
                  <span style={{ color: station.color }}>{station.freq}</span>
                  <span style={styles.dot}> ● ON AIR</span>
                </div>
                <div style={styles.songLine}>{song}</div>
                <div style={styles.eraLine}>{station.name} · {station.era}</div>
              </>
            )}
          </div>
          <div style={styles.presetRow}>
            <button style={styles.ctrlBtn} onClick={() => { playClick(); tuneStation(-1); bumpKnobClicks() }}>◀◀</button>
            <div style={styles.stationDots}>
              {RADIO_STATIONS.map((s, i) => (
                <div key={i}
                  style={{ ...styles.stationDot, background: i === radioStation ? s.color : '#333' }}
                  onClick={() => { playClick(); setRadioStation(i) }}
                  title={s.freq}
                />
              ))}
            </div>
            <button style={styles.ctrlBtn} onClick={() => { playClick(); tuneStation(1) }}>▶▶</button>
          </div>
        </div>
      </div>

      {/* ── Transport row ── */}
      <div style={styles.transport}>
        <TransBtn label="REC" onClick={() => { playClick(); showToast('⏺ REC — recording disabled on this deck') }} />
        <TransBtn label="REW" onClick={() => { playClick(); playerMode === 'radio' ? tuneStation(-1) : handleSeek(-10) }} />
        <TransBtn label="FF" onClick={() => { playClick(); playerMode === 'radio' ? tuneStation(1) : handleSeek(10) }} />
        <TransBtn
          label={(playerMode === 'radio' ? radioPlaying : isPlaying) ? '■ PLAY' : '▶ PLAY'}
          active
          onClick={handlePlayPause}
        />
        <TransBtn label="STOP" onClick={handleStop} />
        <TransBtn
          label="PAUSE"
          onClick={() => { playClick(); if ((playerMode === 'radio' ? radioPlaying : isPlaying)) handlePlayPause() }}
        />
        <TransBtn label="EJECT" onClick={handleEject} />
      </div>

      {/* ── Horn bar ── */}
      <div style={styles.hornBar} onClick={handleHornBar}>
        <span style={styles.hornStars}>★ ★ ★</span>
        <span style={styles.hornCaption}>PRESS TO HORN ▼</span>
        <span style={styles.hornMain}>★ HORN OK PLEASE ★</span>
      </div>
    </div>
  )
}

function Led({ on, color }) {
  return <span style={{ ...styles.led, background: on ? color : '#222', boxShadow: on ? `0 0 5px ${color}` : 'none' }} />
}

function TransBtn({ label, onClick, active }) {
  return (
    <button style={{ ...styles.transBtn, ...(active ? styles.transBtnActive : {}) }} onClick={onClick}>
      {label}
    </button>
  )
}

function Reel({ spinning, speed }) {
  return (
    <div style={{
      ...styles.reel,
      animationDuration: `${speed}s`,
      animationPlayState: spinning ? 'running' : 'paused',
    }}>
      <div style={styles.reelHub} />
      {[0, 1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ ...styles.reelSpoke, transform: `rotate(${i * 60}deg)` }} />
      ))}
    </div>
  )
}

const styles = {
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 230,
    zIndex: 45,
    background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)',
    borderTop: '2px solid rgba(216,155,36,0.5)',
    boxShadow: '0 -8px 30px rgba(0,0,0,0.6)',
    padding: '8px 20px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  brandBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    borderBottom: '1px solid #1a2a1a',
    paddingBottom: 6,
  },
  brandLogo: {
    fontFamily: "'Baloo Thambi 2', sans-serif",
    fontWeight: 800, fontSize: 13, color: '#D89B24', letterSpacing: 2,
  },
  brandStatus: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontFamily: "'Courier Prime', monospace", fontSize: 9, color: '#666', letterSpacing: 1,
  },
  brandVol: {
    marginLeft: 'auto',
    fontFamily: "'Courier Prime', monospace", fontSize: 10, color: '#7acca0', letterSpacing: 1,
  },
  rackBtn: {
    background: '#151515', border: '1px solid #333', borderRadius: 4,
    color: '#D89B24', fontFamily: "'Courier Prime', monospace", fontSize: 9,
    padding: '4px 10px', cursor: 'pointer', letterSpacing: 1,
  },
  led: { width: 6, height: 6, borderRadius: '50%', display: 'inline-block', marginRight: 2 },
  columns: {
    display: 'grid',
    gridTemplateColumns: '1.3fr 0.7fr 1fr',
    gap: 14,
    flex: 1,
    minHeight: 0,
  },
  col: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  colLabel: {
    fontFamily: "'Courier Prime', monospace", fontSize: 8, color: '#444',
    letterSpacing: 2, marginBottom: 4, textAlign: 'center',
  },
  tapeSlot: {
    background: '#050505', border: '1px solid #222', borderRadius: 4,
    padding: 6, marginBottom: 4, minHeight: 54, display: 'flex', alignItems: 'center',
  },
  tapeBody: {
    width: '100%', borderRadius: 3, border: '1px solid', padding: '5px 8px',
  },
  tapeWindow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'rgba(0,0,0,0.4)', borderRadius: 3, padding: '3px 8px',
  },
  tapeStrip: { flex: 1, height: 2, background: 'rgba(255,255,255,0.15)', margin: '0 6px' },
  tapeLabel: {
    fontFamily: "'Noto Sans Tamil', sans-serif", fontSize: 9, fontWeight: 700,
    textAlign: 'center', marginTop: 3,
  },
  emptySlot: {
    fontFamily: "'Courier Prime', monospace", fontSize: 9, color: '#3a3a3a',
    textAlign: 'center', width: '100%', letterSpacing: 1,
  },
  trackDisplay: {
    background: '#020d02', border: '1px solid #0d2a0d', borderRadius: 4,
    padding: '5px 8px', marginBottom: 4,
    backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
  },
  trackName: {
    fontFamily: "'Courier Prime', monospace", fontSize: 11, color: '#3a8a3a',
    textShadow: '0 0 8px rgba(58,138,58,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  trackTime: {
    fontFamily: "'Courier Prime', monospace", fontSize: 9, color: '#1a4a1a', marginTop: 2,
  },
  scrubTrack: {
    height: 6, background: '#111', border: '1px solid #222', borderRadius: 3,
    marginBottom: 6, cursor: 'pointer', overflow: 'hidden',
  },
  scrubFill: { height: '100%', background: '#D89B24', transition: 'width 0.3s linear' },
  modeRow: { display: 'flex', gap: 4, marginTop: 'auto' },
  modeBtn: {
    flex: 1, background: '#111', border: '1px solid #333', borderRadius: 3,
    color: '#666', fontFamily: "'Courier Prime', monospace", fontSize: 9,
    padding: '4px 0', cursor: 'pointer', letterSpacing: 1,
  },
  modeBtnActive: { color: '#F3C94B', borderColor: '#D89B24', boxShadow: '0 0 8px rgba(216,155,36,0.3)' },
  eqWrap: {
    display: 'flex', alignItems: 'flex-end', gap: 2, height: 44,
    background: '#020d02', border: '1px solid #0d2a0d', borderRadius: 4, padding: '4px 6px',
    marginBottom: 8,
  },
  eqBar: { flex: 1, borderRadius: 1, transition: 'height 0.15s ease' },
  knob: {
    width: 46, height: 46, borderRadius: '50%', margin: '0 auto',
    background: 'radial-gradient(circle at 38% 35%, #666 0%, #2a2a2a 45%, #111 100%)',
    border: '2px solid #333', position: 'relative', cursor: 'grab',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)',
  },
  knobMark: {
    position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
    width: 3, height: 10, background: '#D89B24', borderRadius: 2,
  },
  knobCaption: {
    fontFamily: "'Courier Prime', monospace", fontSize: 7, color: '#444',
    textAlign: 'center', marginTop: 6, letterSpacing: 2,
  },
  display: {
    background: '#020d02', border: '1px solid #0d2a0d', borderRadius: 4,
    padding: '6px 9px', marginBottom: 6, minHeight: 54,
    backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
  },
  freqLine: {
    fontFamily: "'Courier Prime', monospace", fontSize: 12, color: '#4a9a4a',
    letterSpacing: 2, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4,
    textShadow: '0 0 8px rgba(58,138,58,0.5)',
  },
  dot: { fontSize: 9, color: '#2d5a2d' },
  songLine: {
    fontFamily: "'Courier Prime', monospace", fontSize: 9, color: '#2a6a2a',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2,
  },
  eraLine: { fontFamily: "'Courier Prime', monospace", fontSize: 8, color: '#1a4a1a' },
  staticLine: { fontFamily: "'Courier Prime', monospace", fontSize: 10, color: '#2a5a2a' },
  presetRow: { display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'space-between' },
  ctrlBtn: {
    background: '#111', border: '1px solid #333', borderRadius: 3, padding: '4px 6px',
    color: '#D89B24', fontFamily: "'Courier Prime', monospace", fontSize: 9, cursor: 'pointer',
  },
  stationDots: { display: 'flex', gap: 4 },
  stationDot: { width: 7, height: 7, borderRadius: '50%', cursor: 'pointer' },
  transport: {
    display: 'flex', gap: 4,
    borderTop: '1px solid #1a2a1a', borderBottom: '1px solid #1a2a1a', padding: '6px 0',
  },
  transBtn: {
    flex: 1, background: '#151515', border: '1px solid #333', borderRadius: 4,
    color: '#D89B24', fontFamily: "'Courier Prime', monospace", fontSize: 10, fontWeight: 700,
    padding: '7px 0', cursor: 'pointer', letterSpacing: 1,
    boxShadow: '0 4px 0 #0a0a0a',
    transition: 'box-shadow 0.1s ease, transform 0.1s ease',
  },
  transBtnActive: { color: '#F3C94B', borderColor: '#D89B24' },
  hornBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'linear-gradient(180deg, #2a1010 0%, #1a0808 100%)',
    border: '1px solid rgba(140,48,38,0.5)', borderRadius: 5,
    padding: '6px 16px', cursor: 'pointer',
  },
  hornStars: { color: '#8C3026', fontSize: 11, letterSpacing: 3 },
  hornCaption: {
    fontFamily: "'Courier Prime', monospace", fontSize: 9, color: '#a05040', letterSpacing: 1,
  },
  hornMain: {
    fontFamily: "'Baloo Thambi 2', sans-serif", fontSize: 12, fontWeight: 700,
    color: '#F3C94B', letterSpacing: 1,
  },
  reel: {
    width: 22, height: 22, borderRadius: '50%',
    background: 'radial-gradient(circle, #2a2a2a 0%, #111 70%)',
    border: '1px solid #444', position: 'relative', flexShrink: 0,
    animationName: 'reelSpin', animationTimingFunction: 'linear', animationIterationCount: 'infinite',
  },
  reelHub: {
    position: 'absolute', top: '50%', left: '50%', width: 7, height: 7,
    background: '#D89B24', borderRadius: '50%', transform: 'translate(-50%,-50%)',
  },
  reelSpoke: {
    position: 'absolute', top: '50%', left: '50%', width: 1, height: 9,
    background: '#555', transformOrigin: '0 0',
  },
}
