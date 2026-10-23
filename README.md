# Kingshot Gathering Finder — Kingdom 1870

A dedicated, real-data radar and analysis dashboard for **Kingshot Kingdom 1870**, tracking verified resource gathering troops from **StratForge** and ranking them by Euclidean distance from a reference coordinate.

![Kingshot Gathering Finder](https://stratforge.tools/brand/logo.svg)

---

## 🎯 Key Features & Requirements Met

1. **Real, Verifiable Gathering Records**:
   - Zero synthetic, fabricated, or simulated placeholder data.
   - 100% sourced from authorized StratForge Kingdom Map inspection for Kingdom 1870.
   - Distinguishes active gathering troops (`kind: "gather"`) from parked encampments (`kind: "camp"`, 17 filtered out) and cities.

2. **Accurate Euclidean Grid Distance**:
   - Default Reference Coordinate: `X: 520, Y: 717` (matching StratForge primary map view).
   - Formula: `distance = sqrt((resourceX - referenceX)^2 + (resourceY - referenceY)^2)`.
   - Distances update dynamically whenever origin coordinates change.
   - Safely guards against `NaN` or `Infinity`.

3. **Multi-Dimension Filtering & Sorting**:
   - Filter by resource type: **All (14)**, **Bread / Food (6)**, **Wood (2)**, **Stone (3)**, **Iron (3)**.
   - Real-time search across player names, alliance tags, alliance names, and `(x, y)` coordinates.
   - Sort orders:
     - Nearest to farthest (Default)
     - Farthest to nearest
     - Resource Level (High → Low)
     - Player / Alliance (A–Z)
     - Resource Type

4. **Interactive Map Actions**:
   - Each row features an "Inspect" button opening the verified StratForge map coordinate:
     `https://stratforge.tools/dashboard/kingshot/tools/kingdom-map?kid=1870&c={x},{y},1.5&layers=marches`

5. **Compliant CSV Export**:
   - Exports the currently active filtered and sorted dataset.
   - Escapes quotation marks, commas, and newlines.
   - Prepends a UTF-8 BOM (`\uFEFF`) for clean Excel rendering.
   - Strictly strips any private authentication cookies, session tokens, or credentials.

6. **Technical Diagnostic Mode**:
   - Explicitly displays data source status, snapshot timestamps, and StratForge Pro tier limitations (explaining why player names on gathering nodes are masked on free accounts while coordinates and alliance tags are fully available).

---

## 🛠️ Data Source & Reverse-Engineering Findings

Through inspection of StratForge's Next.js Turbopack client bundles (`0az6uo_eiti6u.js`, `1t19-ivypszys.js`, `15l-xmxzt-8gj.js`) and network stream:

- **Transport Mechanism**: Next.js App Router React Server Component (RSC) streaming.
- **Request Headers**: `RSC: 1`, `Accept: text/x-component`, and cookie `__Secure-better-auth.session_token`.
- **Payload Schema (`packed`)**:
  ```json
  {
    "kid": 1870,
    "capturedAt": 1792783843261,
    "pro": false,
    "alliances": [
      { "aid": "187900114", "abbr": "AMZ", "name": "Amazonia", "members": 98 }
    ],
    "presence": [
      {
        "x": 508,
        "y": 779,
        "kind": "gather",
        "allianceIdx": 2,
        "resource": 4,
        "level": 7,
        "name": ""
      }
    ]
  }
  ```
- **Resource Code Mapping**:
  - `1`: Bread (Food)
  - `2`: Wood
  - `3`: Stone
  - `4`: Iron
  - `0`: Unknown

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
git clone <repo-url>
cd "gather node finder"
npm install
```

### Development Server
```bash
npm run dev
```
The dashboard will open at `http://localhost:5173/`.

### Running Automated Tests
```bash
npm test
```
Runs 21 unit tests with Vitest covering distance math, sorting, filtering, deduplication, and CSV escaping.

### Production Build
```bash
npm run build
```
Typechecks with `tsc` and bundles optimized static assets to `dist/`.

---

## 📂 Project Architecture

```
gather node finder/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts                   # Proxies live requests and injects session token
├── src/
│   ├── main.tsx
│   ├── App.tsx                      # Main dashboard coordinator
│   ├── index.css                    # Dark strategy game design system
│   ├── types/
│   │   └── gathering.ts             # Normalized & raw schema types
│   ├── data/
│   │   └── verifiedSnapshot1870.json# Real verified snapshot of Kingdom 1870
│   ├── services/
│   │   ├── gatheringDataAdapter.ts  # Clean data adapter with deduplication & validation
│   │   ├── distanceUtils.ts         # Euclidean grid math, sort, filter, search
│   │   └── csvExporter.ts           # Safe CSV generator with escaping
│   ├── components/
│   │   ├── Header.tsx               # Kingdom selector & status indicator
│   │   ├── ReferenceCoordinateForm.tsx # Coordinate inputs & recalculation
│   │   ├── ResourceFilter.tsx       # Resource filter buttons with badges
│   │   ├── SortSelector.tsx         # Ascending/descending & type sorting
│   │   ├── SearchBar.tsx            # Live text & coordinate search
│   │   ├── GatheringSummary.tsx     # Metrics, nearest target, breakdown
│   │   ├── GatheringResultsTable.tsx# Validated rows with map links
│   │   └── DataSourceStatusBanner.tsx # Diagnostic mode & limitations
│   └── tests/
│       ├── distanceUtils.test.ts    # 12 test cases for distance & sorting
│       ├── gatheringDataAdapter.test.ts # 6 test cases for normalization & deduplication
│       └── csvExporter.test.ts      # 3 test cases for CSV escaping & security
```
