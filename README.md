# தமிழ் பயணம் — Tamizh Payanam
### *ஒரு பயணம். ஆயிரம் கதைகள்.* — (One Journey. A Thousand Stories.)

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-4.5.4-brown.svg)](https://github.com/pmndrs/zustand)
[![Web Audio API](https://img.shields.io/badge/Audio-Web_Audio_API-success.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

---

## 🚌 About The Project

**"தமிழ் பயணம் — Tamizh Payanam"** (Repository: `Oru-Payanam-Aayiram-Kathaigal`) is an atmospheric, highly aesthetic retro-futuristic web experience celebrating the culture, geography, music, literature, cuisine, and nostalgia of Tamil Nadu.

The application frames exploration as a night bus journey departing from **Villupuram Depot** aboard an authentic **TNSTC (Tamil Nadu State Transport Corporation)** bus traveling across six iconic regions of Tamil Nadu.

Combining vector SVG illustration, Web Audio API synthesis, recorded diesel engine audio loops, Zustand state management, layered parallax physics, and vintage CRT monitor styling, *Tamizh Payanam* offers a deeply immersive journey through Tamil heritage.

---

## ✨ Key Features

### 🚍 Authentic TNSTC Bus Model
* **Precision SVG Artwork**: Rebuilt from real reference photographs of TNSTC Villupuram buses.
* **Iconic Design Detail**: Light mint-green body (`#52C87A`), dark forest-green diagonal stripe bands (`#1B5E35`), Tamil fleet lettering (*அரசுப் போக்குவரத்துக்கழகம் - விழுப்புரம்*), black window grilles, front cab marquee (*TNSTC / Destination*), number plates (`TN 32 N 4192`), driver silhouette, rear ladder, roof rack, working 4-headlight cluster, and signature **pink/red wheel hubs** (`#D9534F`) with dynamic spin physics.
* **Interactive Elements**: Clickable bus windows to read regional vignettes (*Outside the Window*), clickable conductor bell, clickable side mirror, and animated indicators.

### 🔊 Hybrid Dual Audio System
* **Web Audio Synthesis** (`src/audio/sound.js`): Procedural Web Audio API sound engine generating diesel starter motor cranking, air horn (320Hz/220Hz saw-wave), indicator ticking, conductor bell chime, and dot-matrix ticket printing sounds.
* **Real Engine Idle Loop**: High-fidelity recorded diesel engine idle MP3 loop (`public/audio/engine-idle.mp3`).
* **Dynamic Spatial Ambience**: Route-specific ambient audio beds with scheduled spatial events:
  * **Chennai**: City traffic hum + periodic vehicle honks.
  * **Thanjavur**: Peaceful lowpass bed + temple bell chimes.
  * **Madurai**: Bustling market chatter + temple bells.
  * **Kanyakumari**: Deep ocean wave surges.
  * **Nilgiris**: Mountain wind + wild bird chirps.
  * **Cauvery Delta**: Rural village atmosphere + bird calls.

### 📻 Nostalgic Cassette Deck & Tamizh Radio
* **Cassette Deck UI**: Dual spinning tape reels, frequency screen readout, EQ visualizer, volume/tuning knob, and mechanical transport buttons (Play, Stop, Rewind, Fast-Forward, Record, Eject).
* **6 Nostalgic Radio Stations**:
  * `FM 88.4` — Punnagai Mannan Radio (1986)
  * `FM 91.1` — Nilgiris Mountain FM (1990s)
  * `FM 93.5` — Ilaiyaraaja Gold (1980s)
  * `FM 101.9` — ARR Chennai Beats (1990s)
  * `FM 107.0` — Kanyakumari Coastal (2000s)
  * `MW 729` — All India Radio Tamil (Classic)

### 🎫 Interactive Bus Ticket & Memory Rack
* **Printed Ticket Stub**: Displays fare, class (`GEN` / `EXP` / `SIT`), route number, origin, destination, and barcode.
* **Flip Journey Map**: Clicking the ticket flips it to reveal an interactive 6-region exploration checklist and progress bar.
* **Memory Rack**: Cassette collection rack displaying visited region tapes. Visited cassettes are saved in browser `localStorage` and can be clicked to quickly switch destinations.

### 🌌 Interactive Regional Backdrops & Landmarks
* **Dynamic Scenery**: Multi-layered background rendering region-specific landmarks:
  * **Gopuram** (Thanjavur, Madurai, Delta) with gold finials.
  * **Lighthouse** (Chennai, Kanyakumari) with red stripes.
  * **Mosque** (Madurai) with gold crescent.
  * **Tea Shop** (*காபி கடை*) with filter coffee tumblers.
  * **Cinema Poster** (*தமிழ் சினிமா / Super Star 1983*).
  * **Ashok Leyland Truck** (*ஆசிரவாகனம் / TAMIL NADU*).
  * **Auto-Rickshaw**.
* **Self-Drawing Kolam**: Interactive doorstep Kolam pattern SVG rendered in gold rice-flour dots at the bottom-left of the screen.

### 📜 Cultural Knowledge Engine
* Slide-in modal drawer providing curated insights into:
  * **Classical Arts**: Bharatanatyam, Carnatic Music, Veena, Nadaswaram.
  * **Tamil Literature**: Sangam Poetry, Thirukkural, Silappathikaram.
  * **History**: Sangam Landscapes (*Kurinji, Mullai, Marutham, Neithal, Paalai*), Chola Empire, Modern Era.
  * **Cuisine**: Filter Coffee ritual, Chettinad Spices, Madurai's Jigarthanda.
  * **Cinema**: MSV era, Maestro Ilaiyaraaja, A.R. Rahman.

---

## 🗺️ Explorable Destinations

| ID | Destination (English) | Destination (Tamil) | Route Num | Fare (₹) | Class | Radio Station | Key Highlights |
|:--:|:---|:---|:---:|:---:|:---:|:---:|:---|
| **0** | **Chennai** | சென்னை | `127` | ₹185 | `GEN` | `FM 93.5` | Marina Beach, George Town, Kapaleeshwarar Temple, Fort St. George |
| **1** | **Thanjavur** | தஞ்சாவூர் | `54A` | ₹142 | `SIT` | `MW 729` | Brihadeeswarar Temple, Tanjore Palace, Saraswathi Mahal, Bronze Museum |
| **2** | **Madurai** | மதுரை | `7` | ₹218 | `SIT` | `FM 101.9` | Meenakshi Amman Temple, Thirumalai Nayakkar Palace, Teppakulam, Flower Market |
| **3** | **Kanyakumari** | கன்னியாகுமரி | `49` | ₹340 | `EXP` | `FM 107` | Vivekananda Rock, Thiruvalluvar Statue, Kumari Amman Temple, Three Seas Meet |
| **4** | **Nilgiris** | நீலகிரி | `12` | ₹276 | `EXP` | `FM 91.1` | Ooty Lake, Botanical Gardens, Doddabetta Peak, Nilgiri Toy Train |
| **5** | **Cauvery Delta** | காவிரி டெல்டா | `36B` | ₹98 | `GEN` | `FM 88.4` | Kumbakonam Temples, Mahamaham Tank, Darasuram, Gangaikondacholapuram |

---

## 🎮 Controls & Keyboard Shortcuts

| Input | Action |
|:---|:---|
| <kbd>H</kbd> | Sound Bus Air Horn (*HORN OK PLEASE / கோவிந்தா!*) |
| <kbd>D</kbd> | Toggle Developer Mode Telemetry Overlay |
| <kbd>F</kbd> | Toggle Fullscreen Journey Mode |
| **Click Windows** | Read "Outside the Window" city stories |
| **Click Mirror** | Trigger side mirror reflection easter egg |
| **Click Bell** | Ring conductor bell (*🔔 அடுத்த நிறுத்தம்!*) |
| **Click Ticket** | Flip ticket to view exploration progress map |
| **Dashboard Switches** | Toggle Ignition (`IGN`), Headlights (`HEAD`), Indicators (`IND`), Mute (`SND`), Ambience (`AMB`) |

---

## 🏗️ Project Architecture & Directory Structure

```
tamizh-payanam-v2/
├── README.md                                                  # Main repository documentation
├── .gitignore                                                 # Root Git ignore rules
├── lesiakower-diesel-engine-idle-bus-engine-idling-408780.mp3  # Engine audio asset
└── tamizh-payanam/                                            # Application source root
    ├── index.html                                             # Entry HTML with Google Fonts
    ├── package.json                                           # Dependencies & npm scripts
    ├── vite.config.js                                         # Vite React plugin configuration
    ├── public/
    │   └── audio/
    │       └── engine-idle.mp3                                # Recorded diesel bus engine idle loop
    └── src/
        ├── main.jsx                                           # React root DOM mounting
        ├── App.jsx                                            # Master layer composition & parallax physics
        ├── index.css                                          # Global design system & CSS animations
        ├── audio/
        │   └── sound.js                                       # Web Audio API sound synthesizer
        ├── data/
        │   ├── routes.js                                      # Destinations & Radio metadata
        │   └── stories.js                                     # City vignette stories data
        ├── store/
        │   └── useStore.js                                    # Zustand state store with persistence
        └── components/
            ├── TNSTCBus.jsx                                   # Authentic TNSTC bus SVG component
            ├── NightScene.jsx                                 # Regional backdrop landmarks SVG
            ├── Sky.jsx                                        # Dynamic sky gradient
            ├── Road.jsx                                       # Animated scrolling road component
            ├── DestinationBoard.jsx                           # Route board marquee component
            ├── TamizhRadio.jsx                                # Cassette deck & FM radio component
            ├── BusTicket.jsx                                  # Ticket stub & progress map component
            ├── Dashboard.jsx                                  # Cockpit switches & gauges
            ├── RouteSelector.jsx                              # Bottom route selector bar
            ├── MemoryRack.jsx                                 # Cassette collector rack
            ├── ContentPanel.jsx                               # Cultural slide-in modal drawer
            ├── RouteInfoOverlay.jsx                           # Destination arrival popup
            ├── Intro.jsx                                      # System diagnostic boot screen
            ├── Kolam.jsx                                      # Self-drawing Kolam pattern SVG
            ├── HornButton.jsx                                 # Floating air horn button
            ├── MobileBar.jsx                                  # Mobile action bar
            ├── CRTOverlay.jsx                                 # Vintage CRT scanline & grain overlay
            └── Toast.jsx                                      # Floating notification popups
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)

### Installation & Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/theflighttechofficial/Oru-Payanam-Aayiram-Kathaigal.git
   cd Oru-Payanam-Aayiram-Kathaigal/tamizh-payanam
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 🛠️ Built With

* **[React](https://reactjs.org/)** — Frontend UI library
* **[Vite](https://vitejs.dev/)** — Next Generation Frontend Tooling
* **[Zustand](https://github.com/pmndrs/zustand)** — Bare-metal state management with persistence
* **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)** — Real-time procedural audio synthesis
* **[Framer Motion](https://www.framer.com/motion/)** & **[GSAP](https://greensock.com/gsap/)** — Smooth motion utilities

---

## ❤️ Credits & Acknowledgements

* Dedicated to **TNSTC (Tamil Nadu State Transport Corporation)** drivers and conductors who connect towns and cities across Tamil Nadu every night.
* Special homage to Tamil musical legends **Ilaiyaraaja**, **A.R. Rahman**, **MSV**, and **T.K. Ramamoorthy**.
* Designed with love for Tamil culture, literature, and geography.

---

<p center><b>TNSTC VILLUPURAM · தமிழ் பயணம் · © 2025</b></p>
