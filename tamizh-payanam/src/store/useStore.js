import { create } from 'zustand'
import {
  playHorn, playEngineStart, playEngineRev, playIndicatorTick, playBell,
  playClick, playTicketPrint, setMuted, startEngineHum, stopEngineHum,
  setAmbientRoute, startAmbient, stopAmbient,
} from '../audio/sound'

let leftBlinkTimer = null
let rightBlinkTimer = null
let speedTimer = null

const PERSIST_KEY = 'tamizh-payanam-save'

function loadSave() {
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch (e) { return {} }
}
function persist(state) {
  try {
    localStorage.setItem(PERSIST_KEY, JSON.stringify({
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
  volume: 75,
  playerMode: 'tape',     // 'tape' | 'radio'
  playerReady: false,
  showTapeRack: false,

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
      playEngineStart()
      setTimeout(() => startEngineHum(), 1700)
      set({ engineOn: true, headlightsOn: true })
      get().showToast('🔑 என்ஜின் ஆன் — ENGINE STARTED')
    } else {
      stopEngineHum()
      set({ engineOn: false, headlightsOn: false, leftIndicatorOn: false, rightIndicatorOn: false })
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
    const { transitioning, currentRoute } = get()
    if (transitioning || idx === currentRoute) return
    set({ transitioning: true, transitPhase: 'cranking', headlightsOn: true, speed: 0 })
    playEngineRev()

    if (speedTimer) clearInterval(speedTimer)
    setTimeout(() => set({ transitPhase: 'moving' }), 400)
    let sp = 0
    speedTimer = setInterval(() => {
      sp = Math.min(sp + 7, 58)
      set({ speed: sp })
    }, 90)
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

  setRadioStation: (idx) => set({ radioStation: idx }),
  toggleRadio: () => set((s) => ({ radioPlaying: !s.radioPlaying })),
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
  loadTape: (tape) => {
    playClick()
    set({ deckTape: tape, activeTape: tape, currentTrackIndex: 0, playerMode: 'tape', isPlaying: false })
    get().showToast(`📼 ${tape.labelEng} loaded`)
  },
  ejectTape: () => {
    playClick()
    set({ deckTape: null, activeTape: null, isPlaying: false })
  },
  setPlaying: (v) => set({ isPlaying: v }),
  setVolume: (v) => set({ volume: Math.max(0, Math.min(100, v)) }),
  nextTrack: () => set((s) => {
    if (!s.activeTape) return {}
    return { currentTrackIndex: (s.currentTrackIndex + 1) % s.activeTape.tracks.length }
  }),
  prevTrack: () => set((s) => {
    if (!s.activeTape) return {}
    const len = s.activeTape.tracks.length
    return { currentTrackIndex: (s.currentTrackIndex - 1 + len) % len }
  }),
  setPlayerReady: (v) => set({ playerReady: v }),
  toggleTapeRack: () => set((s) => ({ showTapeRack: !s.showTapeRack })),
  setPlayerMode: (mode) => set({ playerMode: mode, isPlaying: false }),
}))

export default useStore
