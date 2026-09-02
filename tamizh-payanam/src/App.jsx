import React, { useEffect, useRef, useState } from 'react'
import useStore from './store/useStore'
import { ROUTES } from './data/routes'

import NightScene from './components/NightScene'
import Road       from './components/Road'
import TNSTCBus   from './components/TNSTCBus'
import DestinationBoard from './components/DestinationBoard'
import TamizhRadio      from './components/TamizhRadio'
import BusTicket        from './components/BusTicket'
import RouteSelector    from './components/RouteSelector'
import ContentPanel     from './components/ContentPanel'
import Toast            from './components/Toast'
import HornButton       from './components/HornButton'
import RouteInfoOverlay from './components/RouteInfoOverlay'
import Dashboard        from './components/Dashboard'
import Intro            from './components/Intro'
import Kolam            from './components/Kolam'
import MobileBar        from './components/MobileBar'
import MobileNotice     from './components/MobileNotice'
import CRTOverlay       from './components/CRTOverlay'
import PaintedBackground from './components/PaintedBackground'
import TopTicker        from './components/TopTicker'
import TapeRack         from './components/TapeRack'

const REDUCED_MOTION = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

export default function App() {
  const {
    currentRoute, transitioning, transitPhase, hornPressed, pressHorn, booted, devMode, toggleDevMode,
    engineOn, headlightsOn, speed, radioPlaying, isPlaying, muted, showTapeRack, toggleTapeRack,
    busHidden, toggleBusHidden, startIntroSong,
  } = useStore()
  const route   = ROUTES[currentRoute]
  const appRef  = useRef()
  const busRef  = useRef()
  const [fullscreen, setFullscreen] = useState(false)
  const [showFsHint, setShowFsHint] = useState(false)
  const musicPlaying = radioPlaying || isPlaying

  // Fullscreen hint — shows as soon as the intro finishes booting, once per visit
  useEffect(() => {
    if (!booted || fullscreen) return
    setShowFsHint(true)
    return undefined
  }, [booted, fullscreen])

  // Welcome song — once the visitor is in fullscreen AND has hidden the bus,
  // start the intro track (TamizhRadio picks this up via the store flag).
  useEffect(() => {
    if (fullscreen && busHidden) startIntroSong()
  }, [fullscreen, busHidden, startIntroSong])

  // Keyboard: H = horn, D = dev overlay, F = fullscreen
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'h' || e.key === 'H') pressHorn()
      if (e.key === 'd' || e.key === 'D') toggleDevMode()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pressHorn, toggleDevMode])

  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const enterFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else appRef.current?.requestFullscreen?.()
    setShowFsHint(false)
  }

  // Shake on crank — scoped to the bus itself, background stays still
  useEffect(() => {
    if (transitPhase === 'cranking' && busRef.current) {
      busRef.current.style.animation = 'none'
      void busRef.current.offsetHeight
      busRef.current.style.animation = 'busShake 0.65s ease'
      const t = setTimeout(() => { if (busRef.current) busRef.current.style.animation = '' }, 700)
      return () => clearTimeout(t)
    }
  }, [transitPhase])

  // Horn shake — scoped to the bus itself, background stays still
  useEffect(() => {
    if (hornPressed && busRef.current) {
      busRef.current.style.animation = 'none'
      void busRef.current.offsetHeight
      busRef.current.style.animation = 'hornShake 0.28s ease'
      const t = setTimeout(() => { if (busRef.current) busRef.current.style.animation = '' }, 300)
      return () => clearTimeout(t)
    }
  }, [hornPressed])

  return (
    <>
      <GlobalCSS />
      <Intro />
      <CRTOverlay />
      {/* Full-screen horn flash — sits above the world, below the CRT overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 140, pointerEvents: 'none',
        background: '#fff', opacity: hornPressed ? 0.06 : 0,
        transition: hornPressed ? 'opacity 0.03s linear' : 'opacity 0.25s ease',
      }} />
      <div ref={appRef} style={styles.root}>

        {/* ── LAYER -1: Painted background — the supplied artwork, full-bleed and clearly visible ── */}
        <PaintedBackground route={route} bright={busHidden} />

        {/* ── LAYER 2: Interactive hotspots (temple bell, tea shop, cinema poster) — near-invisible,
             the painted background already supplies the visuals; this just keeps the clicks alive ── */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
          <NightScene route={route} />
        </div>

        {/* ── LAYER 3: Road — raised on desktop to sit just above the bottom dashboard panel.
             Stays mounted and fades with the bus (not unmounted) so hiding feels cinematic,
             not an abrupt cut. ── */}
        <div className="road-raise" style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          opacity: busHidden ? 0 : 1,
          pointerEvents: busHidden ? 'none' : 'auto',
          transition: 'opacity 0.6s ease',
        }}>
          <Road />
        </div>

        {/* ── KOLAM — self-drawing doorstep pattern, fades after intro ── */}
        <Kolam />

        {/* ── TITLE — huge illuminated sign, top of world, static ── */}
        <div style={styles.titleWrap}>
          <div style={styles.titleTamil}>தமிழ்நாடு</div>
          <div style={styles.titleEng}>TAMIZH NĀDU</div>
          <div style={styles.tagline}>ஒரு பயணம். ஆயிரம் கதைகள்.</div>
        </div>

        {/* ── LAYER 4: TNSTC BUS — centrepiece. Fixed in place (no mouse parallax) —
             motion comes from the road scrolling under it, wheels spinning, and body vibration.
             Fades out over 600ms rather than vanishing instantly when hidden, so the painted
             background can take over cinematically instead of an abrupt cut. ── */}
        <div ref={busRef} className="bus-wrap-raise" style={{
          ...styles.busWrap,
          opacity: busHidden ? 0 : 1,
          pointerEvents: busHidden ? 'none' : 'auto',
          transition: 'opacity 0.6s ease',
          // The bus is always subtly alive — floating at rest, vibrating while moving —
          // it never goes fully static except under prefers-reduced-motion.
          animation: REDUCED_MOTION ? 'none'
            : transitPhase === 'moving' ? 'busVibrate 0.16s linear infinite'
            : 'floatBus 4.5s ease-in-out infinite',
        }}>
          <TNSTCBus route={route} moving={transitPhase === 'moving'} />
        </div>

        {/* ── UI: Hide-the-bus toggle — surfaces while music is playing, so the scene can be enjoyed unobstructed ── */}
        {musicPlaying && (
          <button style={styles.hideBusBtn} onClick={toggleBusHidden} title={busHidden ? 'Show bus' : 'Hide bus'}>
            {busHidden ? '🚌 Show bus' : '🙈 Hide bus'}
          </button>
        )}

        {/* ── HEADLIGHT CONE ── */}
        {!busHidden && (transitPhase === 'cranking' || transitPhase === 'moving') && (
          <div style={styles.headlightCone} />
        )}

        {/* ── Floating notification: nudge toward fullscreen for the full ambience ── */}
        {showFsHint && !fullscreen && (
          <div style={styles.fsHint}>
            <span style={styles.fsHintText}>🌙 Go fullscreen to feel the real environment</span>
            <button style={styles.fsHintBtn} onClick={enterFullscreen}>Go fullscreen</button>
            <button style={styles.fsHintClose} onClick={() => setShowFsHint(false)}>✕</button>
          </div>
        )}

        {/* ── TRANSITION OVERLAY ── */}
        <TransitionOverlay route={route} phase={transitPhase} />

        {/* ── UI: Destination board ── */}
        <DestinationBoard route={route} />

        {/* ── UI: Radio panel ── */}
        <TamizhRadio />

        {/* ── UI: Ticket stub ── */}
        <BusTicket route={route} />

        {/* ── UI: Route buttons ── */}
        <div id="route-selector" className="desktop-only" style={{ display: 'contents' }}>
          <RouteSelector />
        </div>

        {/* ── UI: Mobile bottom bar ── */}
        <MobileBar />
        <MobileNotice />

        {/* ── UI: Horn ── */}
        <HornButton />

        {/* ── UI: Dashboard (ignition / lights / indicators / sound) ── */}
        {!busHidden && <Dashboard />}

        {/* ── UI: Tape Rack (music tapes + region cassettes, toggled from the deck) ── */}
        <TapeRack />

        {/* ── UI: fullscreen toggle ── */}
        <button style={styles.fsBtn} onClick={enterFullscreen} title="Enter Journey Mode">
          {fullscreen ? '⤡' : '⤢'}
        </button>

        {/* ── TOP TICKER — scrolling marquee, always on top ── */}
        <TopTicker route={route} />

        {/* ── DEV overlay (press D) ── */}
        {devMode && (
          <div style={styles.devOverlay}>
            <div>route: {route.name} ({currentRoute})</div>
            <div>phase: {transitPhase}</div>
            <div>speed: {speed} km/h</div>
            <div>engine: {String(engineOn)} · lights: {String(headlightsOn)}</div>
            <div>radio: {radioPlaying ? 'playing' : 'stopped'} · muted: {String(muted)}</div>
            <div>reduced motion: {String(REDUCED_MOTION)}</div>
          </div>
        )}

        {/* ── TOAST notifications ── */}
        <Toast />

        {/* ── CONTENT panel (window click) ── */}
        <ContentPanel />

        {/* ── ROUTE arrival info overlay ── */}
        <RouteInfoOverlay route={route} phase={transitPhase} />

        {/* ── FOOTER watermark ── */}
        <div className="desktop-only" style={styles.footer}>
          TAMIZH PAYANAM · தமிழ் பயணம் · VILLUPURAM TNSTC · © 2025
        </div>
      </div>
    </>
  )
}

/* ──────────────────────────────────────────── */
function TransitionOverlay({ route, phase }) {
  const show = phase === 'moving'
  return (
    <div style={{
      ...styles.overlay,
      opacity: show ? 1 : 0,
      pointerEvents: show ? 'all' : 'none',
      transition: 'opacity 0.55s ease',
    }}>
      {show && (
        <div style={styles.overlayInner}>
          {/* Engine sound visual */}
          <div style={styles.engineIcon}>🚌</div>
          <div style={styles.overlayDest}>{route.nameT} போகிறோம்...</div>
          <div style={styles.overlayEng}>{route.board}</div>
          <div style={styles.overlayDesc}>{route.desc}</div>
          {/* Travelling dots */}
          <div style={styles.dots}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                ...styles.dot,
                animationDelay: `${i * 0.25}s`,
              }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────── */
function Stars() {
  const pts = [
    [80,28,1.1,0.7],[180,50,0.8,0.5],[260,20,1.0,0.9],[360,40,0.7,0.6],
    [460,26,1.2,0.8],[560,46,0.9,0.7],[660,16,1.1,0.9],[760,50,0.8,0.5],
    [860,30,1.0,0.7],[960,22,0.9,0.8],[1060,44,0.7,0.6],[1160,28,1.0,0.9],
    [1260,50,0.8,0.7],[1360,18,1.1,0.8],[110,75,0.7,0.5],[310,82,1.0,0.8],
    [510,90,0.8,0.6],[710,76,1.1,0.7],[910,86,0.9,0.8],[1110,80,0.8,0.6],
    [1310,74,0.7,0.5],[60,108,0.9,0.6],[400,96,0.8,0.7],[800,100,1.0,0.8],
    [1200,93,0.9,0.6],[1400,106,0.7,0.5],[230,115,0.8,0.7],[630,110,0.7,0.6],
    [1030,118,0.8,0.5],[500,130,0.7,0.4],[900,125,0.8,0.5],
  ]
  return (
    <svg viewBox="0 0 1440 320" style={styles.stars}>
      {pts.map(([x,y,r,op],i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={op} />
      ))}
    </svg>
  )
}

/* ──────────────────────────────────────────── */
function GlobalCSS() {
  return (
    <style>{`
      @keyframes busShake {
        0%,100% { transform: translateX(-50%) translate(0,0) rotate(0deg); }
        10%     { transform: translateX(-50%) translate(-5px, 3px) rotate(-0.5deg); }
        20%     { transform: translateX(-50%) translate( 5px,-2px) rotate( 0.4deg); }
        30%     { transform: translateX(-50%) translate(-4px, 4px) rotate(-0.4deg); }
        40%     { transform: translateX(-50%) translate( 4px,-4px) rotate( 0.5deg); }
        50%     { transform: translateX(-50%) translate(-3px, 2px) rotate(-0.2deg); }
        60%     { transform: translateX(-50%) translate( 5px, 3px) rotate( 0.3deg); }
        70%     { transform: translateX(-50%) translate(-5px,-2px) rotate(-0.3deg); }
        80%     { transform: translateX(-50%) translate( 2px, 3px) rotate( 0.2deg); }
        90%     { transform: translateX(-50%) translate(-2px,-3px) rotate(-0.1deg); }
      }
      @keyframes hornShake {
        0%,100% { transform: translateX(-50%) translate(0,0); }
        25%     { transform: translateX(-50%) translate(-3px, 2px); }
        50%     { transform: translateX(-50%) translate( 3px,-2px); }
        75%     { transform: translateX(-50%) translate(-2px, 3px); }
      }
      @keyframes roadScroll {
        from { background-position: 0 0; }
        to   { background-position: -130px 0; }
      }
      @keyframes busVibrate {
        0%   { transform: translateX(-50%) translate(0,0); }
        20%  { transform: translateX(-50%) translate(-1px, 1px); }
        40%  { transform: translateX(-50%) translate(1px, -1px); }
        60%  { transform: translateX(-50%) translate(-1px, 0px); }
        80%  { transform: translateX(-50%) translate(1px, 1px); }
        100% { transform: translateX(-50%) translate(0,0); }
      }
      @keyframes wheelSpin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes hubSpin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes headlightFlicker {
        0%, 100% { opacity: 0.3; }
        50%      { opacity: 0.9; }
      }
      @keyframes floatBus {
        0%,100% { transform: translateX(-50%) translateY(0px);   }
        50%     { transform: translateX(-50%) translateY(-4px);   }
      }
      @keyframes kolamDot {
        from { opacity: 0; transform: scale(0); }
        to   { opacity: 0.5; transform: scale(1); }
      }
      @keyframes reelSpin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes pulseDot {
        0%,100% { opacity: 0.2; transform: scale(0.8); }
        50%     { opacity: 1;   transform: scale(1.2); }
      }
      @keyframes arrivalSlide {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0);    }
      }
      .win-glow { transition: opacity 0.2s ease; }
      g:hover .win-glow { opacity: 0.06 !important; }
      @keyframes cassetteEject {
        0%   { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-40px); opacity: 0; }
      }
      @keyframes tickerScroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-25%); }
      }
      @keyframes bulbPulse {
        0%,100% { opacity: 0.7; }
        50%     { opacity: 1; }
      }
      @keyframes twinkle {
        0%,100% { opacity: 0.3; }
        50%     { opacity: 1; }
      }
      button { box-shadow: 0 4px 0 #0a0a0a; transition: box-shadow 0.1s ease, transform 0.1s ease; }
      button:active { box-shadow: 0 1px 0 #0a0a0a; transform: translateY(3px); }
    `}</style>
  )
}

const styles = {
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: '#0C0F0A',
  },
  stars: {
    position: 'absolute', top: 0, left: 0,
    width: '100%', height: '52%',
    zIndex: 1, pointerEvents: 'none',
  },
  titleWrap: {
    position: 'absolute',
    top: 30,
    left: 28,
    zIndex: 4,
    textAlign: 'left',
    pointerEvents: 'none',
    textShadow: '0 0 30px rgba(216,155,36,0.35), 0 2px 6px rgba(0,0,0,0.8)',
  },
  titleTamil: {
    fontFamily: "'Noto Sans Tamil', sans-serif",
    fontWeight: 700,
    fontSize: 'clamp(24px, 3.4vw, 46px)',
    color: '#F5EDD6',
    letterSpacing: 2,
    lineHeight: 1,
  },
  titleEng: {
    fontFamily: "'Baloo Thambi 2', sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(12px, 1.5vw, 19px)',
    color: '#D89B24',
    letterSpacing: 8,
    lineHeight: 1.4,
  },
  tagline: {
    fontFamily: "'Noto Sans Tamil', sans-serif",
    fontSize: 'clamp(9px, 1vw, 13px)',
    color: '#8C9C7C',
    letterSpacing: 1,
    opacity: 0.75,
  },
  busWrap: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'min(1420px, 74vw)',
    zIndex: 10,
    filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.6))',
  },
  hideBusBtn: {
    position: 'absolute',
    bottom: 170,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(8,8,8,0.8)',
    border: '1px solid rgba(216,155,36,0.3)',
    borderRadius: 20,
    padding: '6px 16px',
    color: '#D89B24',
    fontFamily: "'Courier Prime', monospace",
    fontSize: 11,
    letterSpacing: 1,
    cursor: 'pointer',
    zIndex: 25,
  },
  fsHint: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'rgba(8,8,8,0.92)',
    border: '1px solid rgba(216,155,36,0.4)',
    borderRadius: 10,
    padding: '10px 12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    zIndex: 95,
    animation: 'arrivalSlide 0.4s ease',
  },
  fsHintText: {
    fontFamily: "'Noto Sans Tamil', sans-serif",
    fontSize: 12,
    color: '#F5EDD6',
    whiteSpace: 'nowrap',
  },
  fsHintBtn: {
    background: '#D89B24',
    color: '#0a0a0a',
    border: 'none',
    borderRadius: 6,
    padding: '5px 10px',
    fontFamily: "'Courier Prime', monospace",
    fontSize: 10,
    fontWeight: 700,
    cursor: 'pointer',
  },
  fsHintClose: {
    background: 'transparent',
    border: 'none',
    color: '#666',
    fontSize: 12,
    cursor: 'pointer',
    padding: 2,
  },
  headlightCone: {
    position: 'absolute',
    bottom: 160,
    right: '5%',
    width: 360,
    height: 260,
    background: 'radial-gradient(ellipse at 20% 80%, rgba(243,201,75,0.13) 0%, transparent 65%)',
    pointerEvents: 'none',
    zIndex: 8,
  },
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(8,12,8,0.93)',
    zIndex: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayInner: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  engineIcon: { fontSize: 48, lineHeight: 1 },
  overlayDest: {
    fontFamily: "'Noto Sans Tamil', sans-serif",
    fontSize: 32,
    color: '#D89B24',
    letterSpacing: 2,
    fontWeight: 700,
  },
  overlayEng: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 13,
    color: '#555',
    letterSpacing: 4,
  },
  overlayDesc: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 11,
    color: '#333',
    letterSpacing: 2,
    marginTop: 4,
  },
  dots: { display: 'flex', gap: 10, marginTop: 12 },
  dot: {
    width: 8, height: 8,
    borderRadius: '50%',
    background: '#D89B24',
    animation: 'pulseDot 1s ease infinite',
  },
  fsBtn: {
    position: 'absolute',
    top: 40,
    right: 200,
    width: 30,
    height: 30,
    borderRadius: 6,
    background: 'rgba(8,8,8,0.8)',
    border: '1px solid rgba(216,155,36,0.3)',
    color: '#D89B24',
    fontSize: 15,
    cursor: 'pointer',
    zIndex: 35,
  },
  devOverlay: {
    position: 'absolute',
    top: 40,
    right: 240,
    background: 'rgba(0,0,0,0.85)',
    border: '1px solid #2E8B57',
    borderRadius: 6,
    padding: '8px 12px',
    fontFamily: "'Courier Prime', monospace",
    fontSize: 10,
    color: '#7acca0',
    lineHeight: 1.8,
    zIndex: 90,
    whiteSpace: 'nowrap',
  },
  footer: {
    position: 'absolute',
    bottom: 72,
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: "'Courier Prime', monospace",
    fontSize: 8,
    color: '#1e1e1e',
    letterSpacing: 3,
    zIndex: 5,
    whiteSpace: 'nowrap',
  },
}
