import React, { useState, useEffect, useRef, useCallback } from 'react'
import useStore from '../store/useStore'
import { RADIO_STATIONS, SONGS } from '../data/routes'
import { playClick } from '../audio/sound'

// Minimalist single-row cassette deck — one compact bar, no clutter.
export default function TamizhRadio() {
  const {
    radioStation, setRadioStation, radioPlaying, toggleRadio, showToast,
    activeTape, deckTape, isPlaying, setPlaying, nowPlayingTitle, setNowPlaying,
    volume, setVolume, playerMode, setPlayerMode, playerReady, setPlayerReady, ejectTape,
    toggleTapeRack, busHidden,
  } = useStore()

  const [ejecting, setEjecting] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playerLoadFailed, setPlayerLoadFailed] = useState(false)
  const dragRef = useRef(null)
  const ytPlayerRef = useRef(null)
  const hiddenPlayerRef = useRef(null)
  const progressTimerRef = useRef(null)
  const errorStreakRef = useRef(0)

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
            if (e.data === window.YT.PlayerState.PLAYING) {
              setPlaying(true)
              errorStreakRef.current = 0
              // Playlist auto-advances on its own; grab whatever video is now
              // actually loaded so the display always reflects the real track.
              try {
                const data = ytPlayerRef.current.getVideoData()
                const idx = ytPlayerRef.current.getPlaylistIndex()
                setNowPlaying(data?.title || '', idx)
              } catch (err) {}
            } else if (e.data === window.YT.PlayerState.PAUSED) {
              setPlaying(false)
            }
          },
          onError: () => {
            // 101/150 = embedding disabled by the uploader, 100 = video removed/private
            errorStreakRef.current += 1
            if (errorStreakRef.current >= 5) {
              // The whole playlist (or a long run of it) is refusing to embed —
              // stop hammering it and say so clearly instead of looping forever.
              setPlaying(false)
              showToast('⚠ This playlist keeps blocking embedded playback — try a different one')
              errorStreakRef.current = 0
              return
            }
            showToast('⚠ TRACK UNAVAILABLE — skipping')
            try { ytPlayerRef.current.nextVideo() } catch (err) {}
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
    // If the YouTube IFrame API never becomes ready (blocked network/CSP, no
    // internet access), surface that clearly instead of leaving the deck
    // looking stuck with a misleading "load a tape" message.
    const failTimer = setTimeout(() => {
      if (!ytPlayerRef.current) setPlayerLoadFailed(true)
    }, 8000)
    return () => clearTimeout(failTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!deckTape || !playerReady || !ytPlayerRef.current) return
    // Hard-stop whatever was previously loaded before switching, and clear
    // the displayed title immediately — otherwise the old tape's audio (or
    // its stale title) can bleed into the new tape while the new playlist
    // is still loading, making the switch look broken or mixed up.
    try { ytPlayerRef.current.stopVideo() } catch (err) {}
    setPlaying(false)
    setNowPlaying('', 0)
    if (!deckTape.ytPlaylistId || deckTape.ytPlaylistId.startsWith('PLACEHOLDER')) {
      showToast(`⚠ No playlist set for ${deckTape.labelEng} yet`)
      return
    }
    try {
      // Load the full real playlist, starting at the tape's preferred track
      // (if any) and loop it, so ⏭ steps through every track and wraps back
      // around to the start of the whole playlist at the end.
      ytPlayerRef.current.loadPlaylist({ list: deckTape.ytPlaylistId, listType: 'playlist', index: deckTape.ytStartIndex || 0 })
      ytPlayerRef.current.setLoop(true)
      ytPlayerRef.current.setVolume(volume)
    } catch (err) {
      showToast('⚠ TAPE UNREADABLE — check playlist ID')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckTape, playerReady])

  // Hiding the bus is meant to power everything down — pause the actual
  // YouTube tape audio too, which the store can't reach directly since this
  // component owns the player instance.
  useEffect(() => {
    if (busHidden && ytPlayerRef.current && isPlaying) {
      try { ytPlayerRef.current.pauseVideo() } catch (err) {}
    }
  }, [busHidden, isPlaying])

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

  const tuneStation = (dir = 1) => {
    const next = (radioStation + dir + RADIO_STATIONS.length) % RADIO_STATIONS.length
    setRadioStation(next)
  }

  const handlePlayPause = () => {
    playClick()
    if (playerMode === 'radio') { toggleRadio(); return }
    if (!deckTape) { showToast('📼 Load a tape first'); return }
    if (!playerReady) {
      showToast(playerLoadFailed
        ? '⚠ Player unavailable — check your internet connection'
        : '⏳ Player still loading, try again in a moment')
      return
    }
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
  const handleSkip = (dir) => {
    if (!deckTape || !playerReady) return
    playClick()
    try { dir > 0 ? ytPlayerRef.current.nextVideo() : ytPlayerRef.current.previousVideo() } catch (err) {}
  }
  const handleEject = () => {
    playClick()
    if (!deckTape) return
    setEjecting(true)
    try { ytPlayerRef.current.stopVideo() } catch (err) {}
    setPlaying(false)
    showToast('⏏ CASSETTE EJECTED')
    setTimeout(() => { ejectTape(); setEjecting(false) }, 500)
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
  const knobAngle = (volume / 100) * 270 - 135

  const fmt = (s) => {
    if (!isFinite(s) || s < 0) s = 0
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`
  }

  const trackName = deckTape ? (nowPlayingTitle || 'Loading…') : null
  const progressPct = duration ? (elapsed / duration) * 100 : 0
  const playing = playerMode === 'radio' ? radioPlaying : isPlaying

  return (
    <div className="desktop-only" style={styles.wrap}>
      <div ref={hiddenPlayerRef} style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }} />

      {/* Brushed-metal trim line, classic portable-receiver styling */}
      <div style={styles.trimLine} />

      {/* Speaker grille — perforated panel, left end of the set */}
      <div style={styles.grille}>
        {Array.from({ length: 24 }).map((_, i) => <span key={i} style={styles.grilleDot} />)}
      </div>

      {/* Reels — only shown in tape mode, set into the metal panel */}
      {playerMode === 'tape' && (
        <div style={{ ...styles.tapeSlot, animation: ejecting ? 'cassetteEject 0.4s ease forwards' : 'none' }}>
          <Reel spinning={isPlaying} />
          <Reel spinning={isPlaying} />
        </div>
      )}

      {/* Band select — TAPE / FM, styled like a receiver's band switch */}
      <div style={styles.bandSwitch}>
        <button style={{ ...styles.bandBtn, ...(playerMode === 'tape' ? styles.bandBtnActive : {}) }}
          onClick={() => { playClick(); setPlayerMode('tape') }}>TAPE</button>
        <button style={{ ...styles.bandBtn, ...(playerMode === 'radio' ? styles.bandBtnActive : {}) }}
          onClick={() => { playClick(); setPlayerMode('radio') }}>FM</button>
      </div>

      {/* LCD display — recessed glass, backlit digital readout */}
      <div style={styles.lcdBezel}>
        <div style={styles.lcd} onClick={playerMode === 'tape' ? handleScrub : undefined}>
          <div style={styles.lcdTopRow}>
            <span style={styles.lcdBand}>{playerMode === 'tape' ? 'TAPE' : station.freq}</span>
            <span style={{ ...styles.lcdDot, opacity: playing ? 1 : 0.25 }}>● {playing ? 'PLAY' : 'STOP'}</span>
          </div>
          {playerMode === 'tape' ? (
            deckTape ? (
              <>
                <div style={styles.lcdTrack}>{deckTape.labelEng} — {trackName}</div>
                <div style={styles.scrubTrack}><div style={{ ...styles.scrubFill, width: `${progressPct}%` }} /></div>
              </>
            ) : (
              <div style={styles.lcdTrack}>NO TAPE — OPEN RACK ▤</div>
            )
          ) : (
            <div style={styles.lcdTrack}>{song}</div>
          )}
        </div>
      </div>

      {/* Transport — compact icon row, dark control cluster */}
      <div style={styles.transport}>
        <IconBtn label="⏪" onClick={() => { playClick(); playerMode === 'radio' ? tuneStation(-1) : handleSeek(-10) }} title="Rewind" />
        {playerMode === 'tape' && <IconBtn label="⏮" onClick={() => handleSkip(-1)} title="Previous track" />}
        <IconBtn label={playing ? '⏸' : '▶'} onClick={handlePlayPause} active title="Play/Pause" />
        {playerMode === 'tape' && <IconBtn label="⏭" onClick={() => handleSkip(1)} title="Next track" />}
        <IconBtn label="⏩" onClick={() => { playClick(); playerMode === 'radio' ? tuneStation(1) : handleSeek(10) }} title="Forward" />
        {playerMode === 'tape' && <IconBtn label="⏏" onClick={handleEject} title="Eject" />}
      </div>

      {/* Tuning/volume dial assembly, with telescoping-antenna accent behind it */}
      <div style={styles.dialAssembly}>
        <div style={styles.antenna} />
        <div style={styles.knobRing}>
          <div style={styles.knob} onMouseDown={onKnobMouseDown} title="Drag to adjust volume">
            <div style={{ ...styles.knobMark, transform: `translateX(-50%) rotate(${knobAngle}deg)` }} />
          </div>
        </div>
        <span style={styles.volLabel}>VOL {Math.round(volume)}</span>
      </div>

      <button style={styles.rackBtn} onClick={() => { playClick(); toggleTapeRack() }}>TAPE RACK ▤</button>

      {/* Unit nameplate — engraved-style badge, right end of the set */}
      <div style={styles.namePlate}>
        <span style={styles.namePlateBrand}>SONY</span>
        <span style={styles.namePlateModel}>ICF-SW7600</span>
      </div>
    </div>
  )
}

function IconBtn({ label, onClick, active, title }) {
  return (
    <button style={{ ...styles.iconBtn, ...(active ? styles.iconBtnActive : {}) }} onClick={onClick} title={title}>
      {label}
    </button>
  )
}

function Reel({ spinning }) {
  return (
    <div style={{ ...styles.reel, animationPlayState: spinning ? 'running' : 'paused' }}>
      <div style={styles.reelHub} />
    </div>
  )
}

// Retro portable shortwave-receiver styling — brushed silver/graphite body,
// perforated speaker grille, recessed LCD glass, and a chunky tuning dial
// with a telescoping-antenna accent, in place of the old flat toolbar look.
const styles = {
  wrap: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: 78,
    zIndex: 45,
    background: 'linear-gradient(180deg, #4a4d52 0%, #34363a 38%, #232427 100%)',
    borderTop: '1px solid #6a6d72',
    boxShadow: '0 -10px 30px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.12)',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  trimLine: {
    position: 'absolute', top: 6, left: 0, right: 0, height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(216,155,36,0.6) 15%, rgba(216,155,36,0.6) 85%, transparent)',
    pointerEvents: 'none',
  },
  grille: {
    flexShrink: 0, width: 46, height: 44, borderRadius: 4,
    background: '#1c1d1f', border: '1px solid #0a0a0a',
    boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.7)',
    display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2.5,
    padding: 5, alignContent: 'center',
  },
  grilleDot: {
    width: 3.5, height: 3.5, borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 30%, #4a4a4a, #0a0a0a)',
  },
  bandSwitch: {
    display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0,
  },
  bandBtn: {
    background: 'linear-gradient(180deg, #3a3c40 0%, #232427 100%)',
    border: '1px solid #17181a', borderTop: '1px solid #5a5d62',
    borderRadius: 3, color: '#9a9da2', fontFamily: "'Courier Prime', monospace", fontSize: 8,
    padding: '3px 7px', cursor: 'pointer', letterSpacing: 1, fontWeight: 700,
    boxShadow: '0 2px 0 #0a0a0a',
  },
  bandBtnActive: {
    color: '#0a0a0a', background: 'linear-gradient(180deg, #F3C94B 0%, #D89B24 100%)',
    borderTop: '1px solid #ffe9a8', boxShadow: '0 2px 0 #8a6414, 0 0 8px rgba(243,201,75,0.5)',
  },
  tapeSlot: { display: 'flex', gap: 4, flexShrink: 0 },
  reel: {
    width: 20, height: 20, borderRadius: '50%',
    background: 'radial-gradient(circle, #2a2a2a 0%, #111 70%)',
    border: '1px solid #444', position: 'relative',
    animationName: 'reelSpin', animationDuration: '1.4s', animationTimingFunction: 'linear', animationIterationCount: 'infinite',
  },
  reelHub: {
    position: 'absolute', top: '50%', left: '50%', width: 6, height: 6,
    background: '#D89B24', borderRadius: '50%', transform: 'translate(-50%,-50%)',
  },
  lcdBezel: {
    flex: 1, minWidth: 0,
    background: 'linear-gradient(180deg, #17181a 0%, #0d0e0f 100%)',
    borderRadius: 6, padding: 4,
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.06)',
  },
  lcd: {
    background: 'linear-gradient(175deg, #b9c9a8 0%, #a9bc96 100%)',
    borderRadius: 3, padding: '5px 10px', cursor: 'pointer',
    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.35)',
  },
  lcdTopRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2,
  },
  lcdBand: {
    fontFamily: "'Courier Prime', monospace", fontSize: 9, fontWeight: 700,
    color: '#2a3a1a', letterSpacing: 1,
  },
  lcdDot: {
    fontFamily: "'Courier Prime', monospace", fontSize: 7, fontWeight: 700,
    color: '#2a3a1a', letterSpacing: 1,
  },
  lcdTrack: {
    fontFamily: "'Courier Prime', monospace", fontSize: 11, color: '#1e2a12', fontWeight: 700,
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  scrubTrack: { height: 3, background: 'rgba(30,42,18,0.25)', borderRadius: 2, marginTop: 4, overflow: 'hidden' },
  scrubFill: { height: '100%', background: '#2a3a1a', transition: 'width 0.3s linear' },
  transport: { display: 'flex', gap: 4, flexShrink: 0 },
  iconBtn: {
    width: 30, height: 30, borderRadius: '50%',
    background: 'linear-gradient(180deg, #3a3c40 0%, #202124 100%)',
    border: '1px solid #17181a', borderTop: '1px solid #5a5d62', color: '#D89B24',
    fontSize: 12, cursor: 'pointer', boxShadow: '0 3px 0 #0a0a0a, inset 0 1px 0 rgba(255,255,255,0.08)',
    transition: 'box-shadow 0.1s ease, transform 0.1s ease',
  },
  iconBtnActive: { color: '#F3C94B', borderColor: '#5a5d62' },
  dialAssembly: {
    position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
    flexShrink: 0, width: 60,
  },
  antenna: {
    position: 'absolute', top: -34, right: 4, width: 2, height: 34,
    background: 'linear-gradient(180deg, #8a8d92, #4a4d52)',
    transform: 'rotate(18deg)', transformOrigin: 'bottom',
    borderRadius: 1, pointerEvents: 'none',
  },
  knobRing: {
    width: 38, height: 38, borderRadius: '50%',
    background: 'linear-gradient(155deg, #8a8d92 0%, #4a4d52 55%, #2a2b2e 100%)',
    padding: 3, boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
  },
  knob: {
    width: '100%', height: '100%', borderRadius: '50%',
    background: 'radial-gradient(circle at 38% 35%, #666 0%, #2a2a2a 45%, #111 100%)',
    border: '2px solid #17181a', position: 'relative', cursor: 'grab',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
  },
  knobMark: {
    position: 'absolute', top: 3, left: '50%',
    width: 2, height: 7, background: '#D89B24', borderRadius: 2,
  },
  volLabel: {
    fontFamily: "'Courier Prime', monospace", fontSize: 8, color: '#c8cbd0', letterSpacing: 1, marginTop: 3,
  },
  rackBtn: {
    background: 'linear-gradient(180deg, #3a3c40 0%, #232427 100%)',
    border: '1px solid #17181a', borderTop: '1px solid #5a5d62', borderRadius: 4,
    color: '#D89B24', fontFamily: "'Courier Prime', monospace", fontSize: 9,
    padding: '7px 10px', cursor: 'pointer', letterSpacing: 1, flexShrink: 0,
    boxShadow: '0 2px 0 #0a0a0a',
  },
  namePlate: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
    flexShrink: 0, paddingRight: 2,
  },
  namePlateBrand: {
    fontFamily: "'Arial Narrow', 'Helvetica Neue', Arial, sans-serif",
    fontSize: 15, fontWeight: 800, fontStyle: 'italic',
    color: '#eceef0', letterSpacing: 0.5, lineHeight: 1,
    transform: 'scaleY(1.08)',
    textShadow: '0 1px 0 rgba(0,0,0,0.7), 0 0 8px rgba(255,255,255,0.12)',
  },
  namePlateModel: {
    fontFamily: "'Courier Prime', monospace", fontSize: 9, fontWeight: 700,
    color: '#D89B24', letterSpacing: 2, lineHeight: 1.4, marginTop: 1,
  },
}
