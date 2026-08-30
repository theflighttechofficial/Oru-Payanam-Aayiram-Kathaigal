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
    toggleTapeRack, pressHorn,
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

  const handleHornBar = () => {
    pressHorn()
    showToast('📯 கோவிந்தா! HORN OK PLEASE!')
  }

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

      {/* Mode toggle */}
      <button style={{ ...styles.modeBtn, ...(playerMode === 'tape' ? styles.modeBtnActive : {}) }}
        onClick={() => { playClick(); setPlayerMode('tape') }}>TAPE</button>
      <button style={{ ...styles.modeBtn, ...(playerMode === 'radio' ? styles.modeBtnActive : {}) }}
        onClick={() => { playClick(); setPlayerMode('radio') }}>FM</button>

      {/* Reels — only shown in tape mode */}
      {playerMode === 'tape' && (
        <div style={{ ...styles.tapeSlot, animation: ejecting ? 'cassetteEject 0.4s ease forwards' : 'none' }}>
          <Reel spinning={isPlaying} />
          <Reel spinning={isPlaying} />
        </div>
      )}

      {/* Display */}
      <div style={styles.display} onClick={playerMode === 'tape' ? handleScrub : undefined}>
        {playerMode === 'tape' ? (
          deckTape ? (
            <>
              <div style={styles.trackName}>{deckTape.labelEng} — {trackName}</div>
              <div style={styles.scrubTrack}><div style={{ ...styles.scrubFill, width: `${progressPct}%` }} /></div>
            </>
          ) : (
            <div style={styles.trackName}>NO TAPE — OPEN RACK ▤</div>
          )
        ) : (
          <div style={styles.trackName}>
            <span style={{ color: station.color }}>{station.freq}</span> · {song}
          </div>
        )}
      </div>

      {/* Transport — compact icon row */}
      <div style={styles.transport}>
        <IconBtn label="⏪" onClick={() => { playClick(); playerMode === 'radio' ? tuneStation(-1) : handleSeek(-10) }} title="Rewind" />
        {playerMode === 'tape' && <IconBtn label="⏮" onClick={() => handleSkip(-1)} title="Previous track" />}
        <IconBtn label={playing ? '⏸' : '▶'} onClick={handlePlayPause} active title="Play/Pause" />
        {playerMode === 'tape' && <IconBtn label="⏭" onClick={() => handleSkip(1)} title="Next track" />}
        <IconBtn label="⏩" onClick={() => { playClick(); playerMode === 'radio' ? tuneStation(1) : handleSeek(10) }} title="Forward" />
        {playerMode === 'tape' && <IconBtn label="⏏" onClick={handleEject} title="Eject" />}
      </div>

      {/* Volume knob */}
      <div style={styles.knob} onMouseDown={onKnobMouseDown} title="Drag to adjust volume">
        <div style={{ ...styles.knobMark, transform: `translateX(-50%) rotate(${knobAngle}deg)` }} />
      </div>
      <span style={styles.volLabel}>{Math.round(volume)}%</span>

      <button style={styles.rackBtn} onClick={() => { playClick(); toggleTapeRack() }}>TAPE RACK ▤</button>

      {/* Horn */}
      <button style={styles.hornBtn} onClick={handleHornBar}>★ HORN OK PLEASE ★</button>
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

const styles = {
  wrap: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: 64,
    zIndex: 45,
    background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)',
    borderTop: '2px solid rgba(216,155,36,0.5)',
    boxShadow: '0 -6px 24px rgba(0,0,0,0.6)',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  modeBtn: {
    background: '#151515', border: '1px solid #333', borderRadius: 4,
    color: '#666', fontFamily: "'Courier Prime', monospace", fontSize: 9,
    padding: '5px 8px', cursor: 'pointer', letterSpacing: 1, flexShrink: 0,
  },
  modeBtnActive: { color: '#F3C94B', borderColor: '#D89B24' },
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
  display: {
    flex: 1, minWidth: 0,
    background: '#020d02', border: '1px solid #0d2a0d', borderRadius: 4,
    padding: '6px 10px', cursor: 'pointer',
  },
  trackName: {
    fontFamily: "'Courier Prime', monospace", fontSize: 11, color: '#3a8a3a',
    textShadow: '0 0 8px rgba(58,138,58,0.5)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  scrubTrack: { height: 3, background: '#111', borderRadius: 2, marginTop: 4, overflow: 'hidden' },
  scrubFill: { height: '100%', background: '#D89B24', transition: 'width 0.3s linear' },
  transport: { display: 'flex', gap: 4, flexShrink: 0 },
  iconBtn: {
    width: 30, height: 30, borderRadius: 4,
    background: '#151515', border: '1px solid #333', color: '#D89B24',
    fontSize: 12, cursor: 'pointer', boxShadow: '0 3px 0 #0a0a0a',
    transition: 'box-shadow 0.1s ease, transform 0.1s ease',
  },
  iconBtnActive: { color: '#F3C94B', borderColor: '#D89B24' },
  knob: {
    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
    background: 'radial-gradient(circle at 38% 35%, #666 0%, #2a2a2a 45%, #111 100%)',
    border: '2px solid #333', position: 'relative', cursor: 'grab',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
  },
  knobMark: {
    position: 'absolute', top: 3, left: '50%',
    width: 2, height: 7, background: '#D89B24', borderRadius: 2,
  },
  volLabel: {
    fontFamily: "'Courier Prime', monospace", fontSize: 9, color: '#7acca0', flexShrink: 0, width: 32,
  },
  rackBtn: {
    background: '#151515', border: '1px solid #333', borderRadius: 4,
    color: '#D89B24', fontFamily: "'Courier Prime', monospace", fontSize: 9,
    padding: '6px 10px', cursor: 'pointer', letterSpacing: 1, flexShrink: 0,
  },
  hornBtn: {
    background: 'linear-gradient(180deg, #2a1010 0%, #1a0808 100%)',
    border: '1px solid rgba(140,48,38,0.5)', borderRadius: 5,
    padding: '8px 16px', cursor: 'pointer', flexShrink: 0,
    fontFamily: "'Baloo Thambi 2', sans-serif", fontSize: 11, fontWeight: 700,
    color: '#F3C94B', letterSpacing: 1,
  },
}
