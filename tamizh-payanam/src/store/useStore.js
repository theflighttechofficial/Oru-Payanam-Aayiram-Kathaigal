import { create } from 'zustand'
import {
  playHorn, playEngineRev, playIndicatorTick, playBell,
  playClick, playTicketPrint, setMuted, startEngineHum, stopEngineHum,
  setAmbientRoute, startAmbient, stopAmbient,
  startRadio, stopRadio, tuneRadio, setRadioVolume,
} from '../audio/sound'

let leftBlinkTimer = null
let rightBlinkTimer = null
let speedTimer = null
let preHideMuted = false
let preHideAmbient = false

const PERSIST_KEY = 'tamizh-payanam-save'

// sessionStorage (not localStorage) on purpose — journey progress should
// survive a reload within the same tab, but reset once the site is actually
// closed, so every fresh visit starts the trip over.
function loadSave() {
  try {
    const raw = sessionStorage.getItem(PERSIST_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch (e) { return {} }
}
function persist(state) {
  try {
    sessionStorage.setItem(PERSIST_KEY, JSON.stringify({
      exploredRoutes: [...state.exploredRoutes],
      muted: state.muted,
      currentRoute: state.currentRoute,
    }))
  } catch (e) {}
}

const saved = loadSave()

const useStore = create((set, get) => ({
  booted: false,          // intro/loading gate
  currentRoute: saved.currentRoute ?? 0,
  transitioning: false,
  transitPhase: 'idle', // idle | cranking | moving | arriving
  speed: 0,
  radioStation: 2,
  radioPlaying: true,
  ambientSound: true,
  muted: saved.muted ?? false,
  hornPressed: false,
  exploredRoutes: new Set(saved.exploredRoutes && saved.exploredRoutes.length ? saved.exploredRoutes : [0]),
  activePanel: null, // null | 'culture' | 'history' | 'places' | 'food' | 'cinema' | 'story'
  storyCity: null,
  infoToast: null,
  devMode: false,

  // ── engine / lights / indicators ──
  engineOn: false,
  headlightsOn: false,
  leftIndicatorOn: false,
  rightIndicatorOn: false,
  leftIndicatorLit: false,
  rightIndicatorLit: false,

  // ── easter eggs ──
  bellClicks: 0,
  knobClicks: 0,
  mirrorClicked: false,

  // ── cassette deck / YouTube player ──
  activeTape: null,       // currently loaded TAPES object
  deckTape: null,         // tape physically in deck slot (null = empty slot)
  isPlaying: false,
  currentTrackIndex: 0,
  nowPlayingTitle: '',
  volume: 75,
  playerMode: 'tape',     // 'tape' | 'radio'
  playerReady: false,
  showTapeRack: false,
  busHidden: false,

  // ── first-visit "welcome song" (fullscreen + hide bus) ──
  introSongTriggered: false,
  introSongActive: false,
  showTapeDeckHint: false,

  boot: () => {
    if (get().muted) setMuted(true)
    setAmbientRoute(get().currentRoute)
    if (get().ambientSound) startAmbient()
    set({ booted: true })
  },

  toggleAmbient: () => set((s) => {
    const next = !s.ambientSound
    if (next) startAmbient()
    else stopAmbient()
    return { ambientSound: next }
  }),

  toggleEngine: () => {
    const { engineOn } = get()
    if (!engineOn) {
      startEngineHum()
      set({ engineOn: true, headlightsOn: true })
      get().showToast('🔑 என்ஜின் ஆன் — ENGINE STARTED')
    } else {
      stopEngineHum()
      if (speedTimer) { clearInterval(speedTimer); speedTimer = null }
      if (leftBlinkTimer) { clearInterval(leftBlinkTimer); leftBlinkTimer = null }
      if (rightBlinkTimer) { clearInterval(rightBlinkTimer); rightBlinkTimer = null }
      set({
        engineOn: false, headlightsOn: false,
        leftIndicatorOn: false, rightIndicatorOn: false, leftIndicatorLit: false, rightIndicatorLit: false,
        transitioning: false, transitPhase: 'idle', speed: 0,
      })
      get().showToast('என்ஜின் ஆஃப் — ENGINE OFF')
    }
  },

  toggleHeadlights: () => {
    set((s) => ({ headlightsOn: !s.headlightsOn }))
  },

  toggleIndicator: (side) => {
    const key = side === 'left' ? 'leftIndicatorOn' : 'rightIndicatorOn'
    const litKey = side === 'left' ? 'leftIndicatorLit' : 'rightIndicatorLit'
    const turningOn = !get()[key]
    if (side === 'left' && leftBlinkTimer) { clearInterval(leftBlinkTimer); leftBlinkTimer = null }
    if (side === 'right' && rightBlinkTimer) { clearInterval(rightBlinkTimer); rightBlinkTimer = null }

    if (turningOn) {
      set({ [key]: true, [litKey]: true })
      const timer = setInterval(() => {
        playIndicatorTick()
        set((s) => ({ [litKey]: !s[litKey] }))
      }, 420)
      if (side === 'left') leftBlinkTimer = timer
      else rightBlinkTimer = timer
    } else {
      set({ [key]: false, [litKey]: false })
    }
  },

  setRoute: (idx) => {
    const { transitioning, currentRoute, engineOn } = get()
    if (transitioning || idx === currentRoute) return
    if (!engineOn) {
      get().showToast('🔑 என்ஜினை முதலில் ஆன் செய்யுங்கள் — start the engine first')
      return
    }
    set({ transitioning: true, transitPhase: 'cranking', headlightsOn: true, speed: 0 })
    playEngineRev()

    if (speedTimer) clearInterval(speedTimer)
    setTimeout(() => set({ transitPhase: 'moving' }), 400)
    let sp = 0
    const cruise = 52 + Math.random() * 10 // ~52-62 km/h cruising speed, varies per trip
    speedTimer = setInterval(() => {
      if (sp < cruise - 6) {
        sp = Math.min(sp + 9, cruise) // ramp up to cruising speed
      } else {
        sp = Math.max(38, Math.min(66, sp + (Math.random() * 10 - 5))) // jitter while cruising
      }
      set({ speed: Math.round(sp) })
    }, 160)
    setTimeout(() => {
      set({
        currentRoute: idx,
        transitPhase: 'arriving',
        exploredRoutes: new Set([...get().exploredRoutes, idx]),
      })
      setAmbientRoute(idx)
      persist(get())
    }, 1000)
    setTimeout(() => {
      clearInterval(speedTimer)
      set({ transitioning: false, transitPhase: 'idle', speed: 0 })
    }, 2400)
  },

  setRadioStation: (idx) => {
    const s = get()
    if (s.playerMode === 'radio' && s.radioPlaying) tuneRadio(idx)
    set({ radioStation: idx })
  },
  toggleRadio: () => set((s) => {
    const next = !s.radioPlaying
    if (s.playerMode === 'radio') { if (next) startRadio(s.radioStation); else stopRadio() }
    return { radioPlaying: next }
  }),
  bumpKnobClicks: () => {
    const n = get().knobClicks + 1
    set({ knobClicks: n })
    if (n === 7) get().showToast('📻 அரிய அலைவரிசை கண்டுபிடிக்கப்பட்டது — secret station found')
  },
  bumpBellClicks: () => {
    const n = get().bellClicks + 1
    set({ bellClicks: n })
    if (n === 5) get().showToast('🔔🔔🔔 கண்டக்டர் எரிச்சலடைகிறார் — conductor is annoyed now')
  },
  clickMirror: () => {
    set({ mirrorClicked: true })
    get().showToast('🪞 நாம் பயணித்த இடங்கள்... — Where we\'ve been...')
  },
  pressHorn: () => {
    playHorn()
    set({ hornPressed: true })
    setTimeout(() => set({ hornPressed: false }), 500)
  },
  ringBell: () => {
    playBell()
    get().bumpBellClicks()
  },
  toggleMute: () => set((s) => {
    const next = !s.muted
    setMuted(next)
    if (next) stopEngineHum()
    else if (s.engineOn) startEngineHum()
    persist({ ...s, muted: next })
    return { muted: next }
  }),
  setActivePanel: (panel) => {
    playClick()
    set((s) => ({ activePanel: s.activePanel === panel ? null : panel }))
  },
  showStory: (city) => {
    playClick()
    set((s) => ({
      activePanel: s.activePanel === 'story' && s.storyCity === city ? null : 'story',
      storyCity: city,
    }))
  },
  showToast: (msg) => {
    set({ infoToast: msg })
    setTimeout(() => set({ infoToast: null }), 3200)
  },
  dismissPanel: () => set({ activePanel: null }),
  printTicket: () => playTicketPrint(),
  toggleDevMode: () => set((s) => ({ devMode: !s.devMode })),

  // ── cassette deck / YouTube player actions ──
  // Track navigation (next/prev/auto-advance) and the now-playing title are
  // driven directly off the real YouTube playlist by TamizhRadio (which owns
  // the player instance) — see setNowPlayingTitle below. currentTrackIndex
  // just mirrors the player's live playlist position for display.
  loadTape: (tape) => {
    playClick()
    set({ deckTape: tape, activeTape: tape, currentTrackIndex: 0, nowPlayingTitle: '', playerMode: 'tape', isPlaying: false })
    get().showToast(`📼 ${tape.labelEng} loaded`)
  },
  ejectTape: () => {
    playClick()
    set({ deckTape: null, activeTape: null, isPlaying: false, nowPlayingTitle: '' })
  },
  setPlaying: (v) => set({ isPlaying: v }),
  setVolume: (v) => {
    const clamped = Math.max(0, Math.min(100, v))
    setRadioVolume(clamped)
    set({ volume: clamped })
  },
  setNowPlaying: (title, index) => set({ nowPlayingTitle: title, currentTrackIndex: index }),
  setPlayerReady: (v) => set({ playerReady: v }),
  toggleTapeRack: () => set((s) => ({ showTapeRack: !s.showTapeRack })),
  startIntroSong: () => {
    const s = get()
    if (s.introSongTriggered) return
    set({ introSongTriggered: true, introSongActive: true })
  },
  endIntroSong: () => set({ introSongActive: false, showTapeDeckHint: true }),
  // A new tape from the deck is itself proof the visitor found it — end
  // intro mode quietly, no need for the hint on top of it.
  cancelIntroSong: () => set({ introSongActive: false }),
  dismissTapeDeckHint: () => set({ showTapeDeckHint: false }),

  toggleBusHidden: () => {
    const s = get()
    const hiding = !s.busHidden
    if (hiding) {
      // Full power-down: engine, lights, indicators, sound, and ambience all off.
      // Remember what mute/ambience were so showing the bus again can restore them.
      preHideMuted = s.muted
      preHideAmbient = s.ambientSound
      if (s.engineOn) stopEngineHum()
      if (speedTimer) { clearInterval(speedTimer); speedTimer = null }
      if (leftBlinkTimer) { clearInterval(leftBlinkTimer); leftBlinkTimer = null }
      if (rightBlinkTimer) { clearInterval(rightBlinkTimer); rightBlinkTimer = null }
      if (s.ambientSound) stopAmbient()
      if (!s.muted) setMuted(true)
      if (s.playerMode === 'radio') stopRadio()
      set({
        busHidden: true,
        engineOn: false, headlightsOn: false,
        leftIndicatorOn: false, rightIndicatorOn: false, leftIndicatorLit: false, rightIndicatorLit: false,
        transitioning: false, transitPhase: 'idle', speed: 0,
        ambientSound: false, muted: true,
        isPlaying: false,
      })
      get().showToast('🚌 பேருந்து மறைக்கப்பட்டது — bus + dashboard fully off')
    } else {
      // Restore whatever mute/ambience state was in effect before hiding.
      if (!preHideMuted) setMuted(false)
      if (preHideAmbient) startAmbient()
      if (s.playerMode === 'radio' && s.radioPlaying) startRadio(s.radioStation)
      set({ busHidden: false, muted: preHideMuted, ambientSound: preHideAmbient })
      persist(get())
    }
  },
  setPlayerMode: (mode) => {
    const s = get()
    if (s.playerMode === 'radio' && mode !== 'radio') stopRadio()
    if (mode === 'radio' && s.radioPlaying) startRadio(s.radioStation)
    // Switching the TAPE/FM tab doesn't touch the YouTube player at all, so
    // don't stomp isPlaying to false if the welcome song is actually still
    // playing in the background — that desync is what left the play/pause
    // button "stuck" (it kept calling playVideo() on an already-playing video).
    set({ playerMode: mode, isPlaying: s.introSongActive ? s.isPlaying : false })
  },
}))

export default useStore
