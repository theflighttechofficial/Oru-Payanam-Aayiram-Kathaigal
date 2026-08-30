# தமிழ் பயணம் — Tamizh Payanam
### *ஒரு பயணம். ஆயிரம் கதைகள்.* — (One Journey. A Thousand Stories.)

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-4.5.4-443E38.svg?style=flat-square)](https://github.com/pmndrs/zustand)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-Procedural_Synthesis-F3C94B.svg?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![YouTube IFrame API](https://img.shields.io/badge/YouTube-IFrame_Player-FF0000.svg?style=flat-square&logo=youtube&logoColor=white)](https://developers.google.com/youtube/iframe_api_reference)
[![License: MIT](https://img.shields.io/badge/License-MIT-2E8B57.svg?style=flat-square)](LICENSE)

---

## 🚌 About The Project

**"தமிழ் பயணம் — Tamizh Payanam"** (Repository: `Oru-Payanam-Aayiram-Kathaigal`) is an atmospheric, highly aesthetic retro-futuristic web experience celebrating the rich culture, geography, music, cinema, literature, cuisine, and timeless nostalgia of Tamil Nadu.

The application frames exploration as a midnight bus journey departing from **Villupuram Depot** aboard an authentic **TNSTC (Tamil Nadu State Transport Corporation)** government bus traveling across six iconic regions of Tamil Nadu.

Combining hand-crafted vector SVG illustrations, procedural Web Audio API synthesis, real recorded diesel engine idle loops, YouTube IFrame API cassette tape playback, Zustand state management with `localStorage` persistence, dynamic spatial ambient audio, interactive window vignettes, and vintage CRT monitor styling, *Tamizh Payanam* delivers a deeply nostalgic homage to night bus travel across Tamil Nadu.

---

## 📑 Table of Contents

- [✨ Key Features & Systems](#-key-features--systems)
  - [🚍 Authentic TNSTC Bus Model](#-authentic-tnstc-bus-model)
  - [🔊 Hybrid Dual Audio System](#-hybrid-dual-audio-system)
  - [📻 Vintage Cassette Deck & Radio Jukebox](#-vintage-cassette-deck--radio-jukebox)
  - [🎫 Interactive Bus Ticket & Journey Progress](#-interactive-bus-ticket--journey-progress)
  - [🕹️ Cockpit Dashboard & Speedometer](#️-cockpit-dashboard--speedometer)
  - [🪟 Outside the Window City Stories](#-outside-the-window-city-stories)
  - [📜 Cultural Knowledge Drawer](#-cultural-knowledge-drawer)
  - [🎨 Atmospheric Visual Layers & CRT Shader](#-atmospheric-visual-layers--crt-shader)
  - [🐣 Easter Eggs & Secrets](#-easter-eggs--secrets)
- [🗺️ Explorable Destinations (The 6 Routes)](#️-explorable-destinations-the-6-routes)
- [🎮 Controls & Keyboard Shortcuts](#-controls--keyboard-shortcuts)
- [🏛️ Architectural Design & Data Flow](#️-architectural-design--data-flow)
- [📁 Project Directory Structure](#-project-directory-structure)
- [🎨 Design System & Color Palette](#-design-system--color-palette)
- [🚀 Getting Started & Installation](#-getting-started--installation)
- [❤️ Credits & Cultural Homage](#️-credits--cultural-homage)

---

## ✨ Key Features & Systems

### 🚍 Authentic TNSTC Bus Model
Rebuilt meticulously as responsive SVG vector artwork based on real reference photographs of Tamil Nadu State Transport Corporation (Villupuram division) buses:
* **True-to-Life Livery**: Classic mint green body (`#4EC87E`), darker roof line (`#3AB56A`), and bold dark green horizontal stripe bands (`#1B6B3A`).
* **Tamil Fleet Lettering**: Crisp Tamil typography reading *"தமிழ்நாடு அரசு போக்குவரத்து கழகம் - விழுப்புரம்"* across the side panels.
* **Signature Details**:
  * Front and rear license plates (`TN 32 N 4192` & `TN 01 AN 5040`).
  * Roof rack cargo frame with front depot code (`439`) and rear service ladder.
  * Iconic **pink/red wheel hubs** (`#D9534F`) with realistic multi-spoke rotational physics tied to the engine and bus velocity.
  * Working 4-pod split headlamps with upper amber parking lights and lower high-beam projector throws.
  * Directional amber indicator lamps (front and rear) that flash in synchronized cadence.
  * Passenger silhouettes with warm interior incandescent window glow (`#F5A623`).
  * Conductor call bell (`#D89B24`) and rear-view mirror.

### 🔊 Hybrid Dual Audio System
A multi-layered sound engine combining real recorded diesel acoustics, procedural Web Audio synthesis, and dynamic environmental beds:
1. **Real Diesel Engine Idle**: High-fidelity loop of a real diesel bus idling engine (`public/audio/engine-idle.mp3`) with custom smooth gain ramps on startup and shutdown.
2. **Procedural Web Audio Synthesis** (`src/audio/sound.js`):
   * **Air Horn**: Dual-tone sawtooth wave synthesis (320Hz + 220Hz) with dynamic decay.
   * **Conductor Bell**: Dual sine wave high chime (1400Hz + 2100Hz).
   * **Engine Rev**: Low-frequency sawtooth sweep (65Hz–95Hz) triggered during gear changes and route transitions.
   * **Indicator Ticking**: Crisp 1200Hz square-wave clicks synchronized with dashboard blinker lights.
   * **Ticket Dot-Matrix Printer**: Staccato frequency-stepped square bursts mimicking vintage bus ticket issuing machines.
3. **Dynamic Spatial Ambience Beds**:
   Continuous filtered noise generator that crossfades frequency profiles based on destination, coupled with randomized spatial sound events:
   * **Chennai**: Bandpass traffic bed + periodic vehicle honks.
   * **Thanjavur**: Lowpass peaceful rumble + authentic temple bell rings.
   * **Madurai**: Mid-frequency market hum + temple bells + bazaar chatter.
   * **Kanyakumari**: Deep lowpass oceanic swell + crashing wave surges.
   * **Nilgiris**: Highpass mountain wind filter + randomized forest bird chirps.
   * **Cauvery Delta**: Rural lowpass breeze + village bird calls.
4. **Algorithmic FM Radio Synthesizer**:
   Procedural analog radio sound generator with highpass white-noise static hiss, dual detuned oscillators, LFO filter breathing, and slow melodic wandering scales.

### 📻 Vintage Cassette Deck & Radio Jukebox
A retro single-row tape deck mounted at the bottom of the cockpit:
* **Interactive Tape Controls**: Dual spinning reels, analog frequency dial, LED level visualizer, volume knob, Play, Pause, Track Skip, Eject, and Tape Rack toggle.
* **YouTube IFrame API Integration**: Fully functional embedded player loading real Tamil music playlists behind a custom retro interface.
* **Curated Music Cassettes**:
  * **இளையராஜா கோல்டு (Ilaiyaraaja Gold)** — 1980s maestro classics.
  * **ஏ.ஆர். ரஹ்மான் (A.R. Rahman Hits)** — 1990s revolutionary melodies.
  * **ஹாரிஸ் ரேடியோ (Harris Radio)** — 2000s iconic soundtrack hits.
  * **நாட்டுப்புற இசை (Tamil Folk Songs)** — Timeless rural folk & kavadi chindu.
* **Side Tape Rack (`TapeRack.jsx`)**: Side-drawer cassette organizer displaying both music tapes and 6 unlockable region cassettes. Clicking any unlocked region tape drives the bus there directly.
* **Zen "Hide Bus" Mode**: A floating `🙈 Hide bus` toggle appears during music playback, gently powering down dashboard telemetry and hiding the bus so users can enjoy the painted scenery and music unobstructed.

### 🎫 Interactive Bus Ticket & Journey Progress
* **Authentic Printed Stub**: Modeled after Tamil Nadu bus conductor tickets, showing Origin (*VILLUPURAM*), Destination, Route Number, Fare in ₹, Pass Class (`GEN` / `EXP` / `SIT`), Tamil destination inscription, perforation line, and printed barcode.
* **Interactive Flip Progress Map**: Clicking the ticket triggers an interactive 3D flip revealing the passenger's journey card:
  * 6-region journey exploration checklist.
  * Real-time progress bar tracking explored destinations.
  * State persisted locally across sessions.

### 🕹️ Cockpit Dashboard & Speedometer
* **Live Instrumentation**:
  * Digital green LCD speedometer that dynamically ramps up to cruising speeds (52–62 km/h) with subtle road jitter physics during transit.
  * Fuel gauge readout (`F` when engine is active).
* **Illuminated Rocker Switches**:
  * `IGN` (Ignition): Starts/stops the diesel engine audio loop and activates vehicle electronics. Route selection is safety-interlocked until ignition is engaged.
  * `HEAD` (Headlights): Toggles main high-beam light throw and cabin lamps.
  * `◀ IND` / `IND ▶` (Indicators): Starts synchronized left/right turn blinkers with audio ticking.
  * `SND` / `MUTE`: Master audio mute toggle.
  * `AMB` (Ambience): Toggles regional background environmental beds.

### 🪟 Outside the Window City Stories
Clicking any of the 9 passenger windows on the bus opens the **"Outside the Window"** story card, presenting poetic vignettes of stops along the route:
* **சென்னை (Chennai)**: First light on Marina Beach, joggers, fishermen, and three centuries of George Town history.
* **விழுப்புரம் (Villupuram)**: The crossroads depot town where every journey begins, known for strong tea and veteran conductors.
* **கும்பகோணம் (Kumbakonam)**: Moonlight over ancient gopurams and the sacred Mahamaham tank.
* **தஞ்சாவூர் (Thanjavur)**: Thousand-year-old mortarless granite architecture of the Brihadeeswarar temple and ancient bronze casting.
* **மதுரை (Madurai)**: The 2,500-year-old city that never sleeps, Meenakshi Amman temple gopurams, and vibrant flower markets.
* **திருநெல்வேலி (Tirunelveli)**: Legendary wheat-and-ghee halwa and the perennial Thamirabarani river.
* **கன்னியாகுமரி (Kanyakumari)**: The meeting point of three seas, Vivekananda Rock Memorial, and twin sunrise/sunset horizons.
* **தேனி (Theni)**: Cardamom hills, grape orchards, and spice routes toward the Western Ghats.
* **ஊட்டி (Ooty)**: Mountain mist, historic Nilgiri Mountain Railway toy train, and endless tea estates.

### 📜 Cultural Knowledge Drawer
A slide-in encyclopedia modal drawer (`ContentPanel.jsx`) offering rich curated insights into Tamil heritage:
* **🎭 Classical Arts & Culture**: Bharatanatyam, Carnatic music, Veena, Nadaswaram, Sangam literature, and morning Kolam traditions.
* **📜 History & Civilizations**: The 5 Sangam landscapes (*Kurinji, Mullai, Marutham, Neithal, Paalai*), the Chola maritime empire, and modern Tamil socio-cultural evolution.
* **🗺️ Iconic Landmarks**: Marina Beach, Madurai Meenakshi Temple's 33,000 sculptures, and the UNESCO-listed Nilgiri Mountain Railway.
* **🍛 Culinary Heritage**: The brass tumbler filter coffee ritual, Chettinad spice traditions (25+ freshly ground spices), and Madurai's iconic Jigarthanda.
* **🎬 Tamil Cinema**: The Golden Era of MSV and Sivaji Ganesan, the prolific genius of Maestro Ilaiyaraaja (1,000+ film scores), and A.R. Rahman's global resonance.

### 🎨 Atmospheric Visual Layers & CRT Shader
* **Painted Artwork Backdrop**: High-resolution hand-painted Tamil night landscape (`public/images/web-background.png`) with radial vignette lighting.
* **Self-Drawing Kolam Pattern (`Kolam.jsx`)**: Traditional rice-flour doorway threshold geometry rendered in glowing gold SVG lines and dots that animate on departure.
* **Wet-Rain Asphalt Road (`Road.jsx`)**: Scrolling center dashes, reflective wet-road sheen, and puddle glow effects.
* **Top Scrolling Marquee (`TopTicker.jsx`)**: Continuous retro electronic ticker streaming live track titles, current station, route info, and *"HORN OK PLEASE"*.
* **Retro CRT Shader (`CRTOverlay.jsx`)**: Non-intrusive scanlines, subtle screen curvature vignette, and analog noise grain.

### 🐣 Easter Eggs & Secrets
* **Conductor Bell Annoyance**: Clicking the conductor bell 5 consecutive times triggers an annoyed conductor notification (*"🔔🔔🔔 கண்டக்டர் எரிச்சலடைகிறார்"*).
* **Rear-View Mirror**: Clicking the side mirror reveals a nostalgic memory toast (*"🪞 நாம் பயணித்த இடங்கள்... — Where we've been..."*).
* **Secret Radio Frequency**: Tuning the radio knob 7 times unlocks a secret frequency toast.
* **Full-Screen Horn Flash**: Pressing the Horn button or pressing <kbd>H</kbd> triggers a dual-frequency air horn, a brief screen-wide light flash, and physical bus cabin shake.

---

## 🗺️ Explorable Destinations (The 6 Routes)

| ID | Destination (English) | Destination (Tamil) | Route | Fare | Class | Radio Station | Ambient Profile | Key Highlights |
|:--:|:---|:---|:---:|:---:|:---:|:---:|:---|:---|
| **0** | **Chennai** | சென்னை | `127` | ₹185 | `GEN` | `FM 93.5` | City traffic, horns, coastal hum | Marina Beach, George Town, Kapaleeshwarar Temple, Fort St. George |
| **1** | **Thanjavur** | தஞ்சாவூர் | `54A` | ₹142 | `SIT` | `MW 729` | Deep lowpass bed, temple bells | Brihadeeswarar Temple, Tanjore Palace, Saraswathi Mahal, Bronze Museum |
| **2** | **Madurai** | மதுரை | `7` | ₹218 | `SIT` | `FM 101.9` | Market buzz, bazaar chatter, bells | Meenakshi Amman Temple, Thirumalai Nayakkar Palace, Teppakulam, Flower Market |
| **3** | **Kanyakumari** | கன்னியாகுமரி | `49` | ₹340 | `EXP` | `FM 107.0` | Heavy ocean waves, coastal wind | Vivekananda Rock, Thiruvalluvar Statue, Kumari Amman Temple, Sunset Point |
| **4** | **Nilgiris** | நீலகிரி | `12` | ₹276 | `EXP` | `FM 91.1` | Highpass mountain wind, birds | Ooty Lake, Botanical Gardens, Doddabetta Peak, Nilgiri Mountain Toy Train |
| **5** | **Cauvery Delta** | காவிரி டெல்டா | `36B` | ₹98 | `GEN` | `FM 88.4` | Rural breeze, village birds, bells | Kumbakonam Temples, Mahamaham Tank, Darasuram, Gangaikondacholapuram |

---

## 🎮 Controls & Keyboard Shortcuts

| Input / Action | Trigger | Description |
|:---|:---:|:---|
| <kbd>H</kbd> | Keyboard | Sound Bus Air Horn (*கோவிந்தா! / HORN OK PLEASE*) + Screen Flash |
| <kbd>D</kbd> | Keyboard | Toggle Developer Telemetry HUD (Speed, Engine, Route, Radio, Phase) |
| <kbd>F</kbd> | Keyboard / Button | Toggle Immersive Fullscreen Journey Mode |
| **Click Ignition Switch (`IGN`)** | Dashboard | Start / Stop diesel engine idle audio and vehicle electricals |
| **Click Headlights (`HEAD`)** | Dashboard | Toggle high-beam projector light throw and cabin lighting |
| **Click Indicators (`IND`)** | Dashboard / Bus | Toggle left/right directional blinkers with audio ticking |
| **Click Route Buttons** | Cockpit Bottom | Initiate bus departure to chosen destination (requires engine on) |
| **Click Bus Windows** | Bus Body | Open "Outside the Window" city vignettes |
| **Click Conductor Bell** | Bus Body | Ring conductor bell (*🔔 அடுத்த நிறுத்தம்!*) |
| **Click Side Mirror** | Bus Body | Trigger rear-view mirror reflection easter egg |
| **Click Bus Ticket** | Ticket Stub | Flip ticket to view 6-region exploration progress checklist |
| **Click Cassette Deck / Rack** | Bottom Deck | Load music tapes or fast-travel using unlocked region tapes |
| **Click "Hide Bus"** | Floating Button | Hide bus and dashboard during music playback for scenery mode |
| **Click Kolam Pattern** | Bottom Left | Open Culture encyclopedia drawer |

---

## 🏛️ Architectural Design & Data Flow

```mermaid
flowchart TD
    subgraph UI_Layer ["User Interface (React Components)"]
        Intro["Intro.jsx (Boot Screen)"]
        Bus["TNSTCBus.jsx (SVG Vector Model)"]
        Board["DestinationBoard.jsx (Marquee)"]
        Radio["TamizhRadio.jsx (Cassette Deck)"]
        TapeRack["TapeRack.jsx (Caravan Organizer)"]
        Ticket["BusTicket.jsx (Ticket Stub & Map)"]
        Dash["Dashboard.jsx (Switches & Speedo)"]
        Road["Road.jsx (Animated Asphalt)"]
        Content["ContentPanel.jsx (Cultural Drawer)"]
        Ticker["TopTicker.jsx (Scrolling Header)"]
        Overlay["RouteInfoOverlay.jsx & Toast.jsx"]
    end

    subgraph State_Layer ["State Management (Zustand)"]
        Store["useStore.js"]
        Storage[("localStorage: tamizh-payanam-save")]
    end

    subgraph Audio_Layer ["Audio Subsystem"]
        SoundEngine["sound.js (Web Audio API Synthesizer)"]
        EngineAudio[("engine-idle.mp3 (Audio Element)")]
        YTPlayer["YouTube IFrame API (Music Stream)"]
    end

    Intro -->|boot()| Store
    Dash -->|toggleEngine, toggleHeadlights, toggleIndicator| Store
    Bus -->|showStory, ringBell, clickMirror| Store
    Radio -->|loadTape, setVolume, setPlaying| Store
    TapeRack -->|loadTape, setRoute| Store
    Ticket -->|printTicket| Store

    Store <-->|Persist / Load Explored Routes| Storage
    Store -->|Transit Phase, Speed, Engine State| Bus
    Store -->|Speed, Active Switches| Dash
    Store -->|Route, Board Text| Board
    Store -->|Active Tape, Play State| Radio

    Store -->|Trigger Air Horn, Bell, Ticks, Printer| SoundEngine
    Store -->|Start / Stop Diesel Hum| EngineAudio
    Radio -->|Load Playlist, Play, Pause, Next| YTPlayer
    Store -->|Crossfade Regional Ambience| SoundEngine
```

---

## 📁 Project Directory Structure

```
tamizh-payanam-v2/
├── README.md                                                  # Complete repository documentation
├── .gitignore                                                 # Workspace Git ignore rules
├── lesiakower-diesel-engine-idle-bus-engine-idling-408780.mp3  # Master engine audio source
├── WebBackground.png                                          # Master artwork backdrop source
└── tamizh-payanam/                                            # Application source root
    ├── index.html                                             # HTML5 entry with Google Fonts
    ├── package.json                                           # Dependencies & build scripts
    ├── vite.config.js                                         # Vite React bundler configuration
    ├── public/
    │   ├── audio/
    │   │   └── engine-idle.mp3                                # Recorded diesel bus engine idle loop
    │   └── images/
    │       └── web-background.png                             # Hand-painted night backdrop
    └── src/
        ├── main.jsx                                           # React root DOM mounting point
        ├── App.jsx                                            # Master layer composition & viewport layout
        ├── index.css                                          # Global design tokens & CSS animations
        ├── audio/
        │   └── sound.js                                       # Web Audio API procedural sound synthesizer
        ├── data/
        │   ├── routes.js                                      # 6 Destination routes, radio & tape data
        │   └── stories.js                                     # 9 "Outside the Window" city vignettes
        ├── store/
        │   └── useStore.js                                    # Zustand state store with persistence
        └── components/
            ├── TNSTCBus.jsx                                   # Authentic TNSTC bus SVG vector model
            ├── NightScene.jsx                                 # Landmark vector silhouettes (Hotspots)
            ├── PaintedBackground.jsx                          # Painted night artwork background layer
            ├── Road.jsx                                       # Animated wet-rain asphalt road
            ├── DestinationBoard.jsx                           # Route board destination marquee
            ├── TamizhRadio.jsx                                # Cassette deck & YouTube player UI
            ├── TapeRack.jsx                                   # Caravan-style cassette organizer rack
            ├── BusTicket.jsx                                  # Printed ticket stub & flip journey map
            ├── Dashboard.jsx                                  # Cockpit rocker switches & digital gauges
            ├── RouteSelector.jsx                              # Cockpit bottom route selection bar
            ├── ContentPanel.jsx                               # Slide-in cultural encyclopedia drawer
            ├── RouteInfoOverlay.jsx                           # Destination arrival popup banner
            ├── TopTicker.jsx                                  # Header scrolling marquee bar
            ├── Intro.jsx                                      # Diagnostic startup boot screen
            ├── Kolam.jsx                                      # Self-drawing rice-flour doorstep Kolam SVG
            ├── HornButton.jsx                                 # Floating air horn action button
            ├── MobileBar.jsx                                  # Responsive mobile bottom dock
            ├── CRTOverlay.jsx                                 # Vintage CRT scanline & vignette shader
            ├── Sky.jsx                                        # Dynamic sky gradient background
            └── Toast.jsx                                      # Non-intrusive floating toast notifications
```

---

## 🎨 Design System & Color Palette

### CSS Variables & Palette Tokens (`src/index.css`)

| Token | Hex Value | Preview | Semantic Purpose |
|:---|:---:|:---:|:---|
| `--ink` | `#0C0F0A` | ⬛ | Dark night background base |
| `--brass` | `#D89B24` | 🟨 | Traditional brass trim, primary Tamil titles, deck accents |
| `--terracotta` | `#8C3026` | 🟥 | Temple terracotta, horn buttons, history headings |
| `--lantern` | `#F3C94B` | 🟨 | Glowing lanterns, destination text, active indicators |
| `--green` | `#315A42` | 🟩 | Lush vegetation, places category accent |
| `--cream` | `#F5EDD6` | ⬜ | Vintage paper ticket stub, primary typography |
| `--tnstc-mint` | `#4EC87E` | 🟩 | TNSTC bus body panels |
| `--tnstc-roof` | `#3AB56A` | 🟩 | TNSTC bus roof panels and bumper |
| `--tnstc-dkgrn` | `#1B6B3A` | 🟩 | TNSTC bus horizontal stripe bands |
| `--tnstc-hub` | `#D9534F` | 🟥 | Signature TNSTC pink/red wheel hubs |
| `--display-green` | `#7ACCA0` | 🟩 | Retro digital LCD gauge readout |

### Typography
* **Display & Marquee**: [Baloo Thambi 2](https://fonts.google.com/specimen/Baloo+Thambi+2) (Weights: 400, 500, 600, 700, 800)
* **Tamil Script**: [Noto Sans Tamil](https://fonts.google.com/specimen/Noto+Sans+Tamil) (Weights: 400, 600, 700)
* **Telemetry & Tickets**: [Courier Prime](https://fonts.google.com/specimen/Courier+Prime) (Weights: 400, 700, Monospace)

---

## 🚀 Getting Started & Installation

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (v9.0.0 or higher) or **yarn** / **pnpm**

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/theflighttechofficial/Oru-Payanam-Aayiram-Kathaigal.git
   cd Oru-Payanam-Aayiram-Kathaigal/tamizh-payanam
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## 🛠️ Technology Stack & Dependencies

* **Core Framework**: [React 18.3.1](https://reactjs.org/)
* **Build Tool**: [Vite 5.4.2](https://vitejs.dev/) with `@vitejs/plugin-react`
* **State Management**: [Zustand 4.5.4](https://github.com/pmndrs/zustand)
* **Audio Processing**: [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) & [Howler.js 2.2.4](https://howlerjs.com/)
* **Video/Audio Streaming**: [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
* **Animation & Motion**: [Framer Motion 11.3.8](https://www.framer.com/motion/) & [GSAP 3.12.5](https://greensock.com/gsap/)

---

## ❤️ Credits & Cultural Homage

* **TNSTC Villupuram**: Dedicated with immense respect to the hardworking drivers, conductors, and depot mechanics of the **Tamil Nadu State Transport Corporation (TNSTC)** who connect towns, villages, and cities across Tamil Nadu through rain and night.
* **Musical Legends**: Special homage to the architects of Tamil film music — **M.S. Viswanathan (MSV)**, **T.K. Ramamoorthy**, Maestro **Ilaiyaraaja**, **A.R. Rahman**, and **Harris Jayaraj**.
* **Tamil Heritage**: Honoring the Sangam poets, classical Carnatic and Bharatanatyam masters, temple architects, and rural folk artists who created the living culture of Tamil Nadu.

---

<p align="center">
  <b>TNSTC VILLUPURAM · தமிழ்நாடு அரசுப் போக்குவரத்துக்கழகம் · தமிழ் பயணம்</b><br>
  <i>ஒரு பயணம். ஆயிரம் கதைகள். — One Journey. A Thousand Stories.</i>
</p>
