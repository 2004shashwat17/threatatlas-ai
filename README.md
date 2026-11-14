# THREATATLAS AI

A desktop-first, responsive frontend foundation for a cyber threat intelligence
workspace. The application is in [`apps/web`](./apps/web). No backend is included.

**This is a demonstration environment.** All indicators, incidents, vulnerability
records, metrics, and geographic relationships are fictional. Nothing represents
live attacks, verified telemetry, real source connections, or actual AI analysis.

## Run locally

Requires Node.js **20.19+** (20.x), **22.12+** (22.x), or a newer supported release.
Node.js 22 LTS or newer LTS is recommended.

```bash
cd apps/web
npm ci
npm run dev
```

Open the localhost URL printed by Vite, normally <http://127.0.0.1:5173>.
VS Code also provides **web: dev** and **web: build** tasks.

```bash
npm run typecheck
npm test
npm run build
npm run preview
npm run format:check
```

Production output is written to `apps/web/dist`. The build intentionally splits
Three.js, MapLibre, charts, and individual pages into separate chunks. The two
geographic rendering engines are large, lazy-loaded dependencies; only the selected
engine is requested. Vite reports size warnings for these engine chunks.

### Browser tests

```bash
cd apps/web
npm run test:e2e
```

The Playwright configuration uses an installed Google Chrome and starts a temporary
Vite server on port 5174. If Chrome is not installed, run
`npx playwright install chrome`. Browser tests check navigation, mock workflows,
actual globe hover/click and map marker inspection, geographic filters, and
mobile/reduced-motion behavior. Screenshots and failure traces are written to the
ignored `test-results` directory.

## Included experiences

- **Overview:** five KPI cards, globe/map, intelligence brief, geographic snapshot,
  interactive time-series/severity charts, category distribution, and recent indicators.
- **Global Threat Map:** expanded 3D/2D view, clustering, country/category/severity
  filters, observation windows, and indicator details.
- **Threat Intelligence:** searchable, sortable, filterable, paginated indicator table,
  details, and filtered JSON export.
- **Vulnerability Intelligence:** affected products, CVSS examples, severity and
  exploitation filters, publication dates, and record inspection.
- **Threat Analytics:** activity windows, geographic, category, source, and severity
  distributions with a JSON report export.
- **AI Security Copilot:** conversational UI with cancellable, predefined mock replies.
- **Incidents:** searchable and sortable investigations with local-session creation,
  status updates, and analyst assignment.
- **Integrations:** URLhaus, ThreatFox, AlienVault OTX, CISA KEV, and Cloudflare Radar
  previews with explicitly simulated connection toggles.
- **Settings and Help:** browser-local preferences, profile and organization labels,
  visualization options, and usage/data-integrity documentation.

The shared shell includes a collapsible sidebar, mobile navigation with keyboard
focus management, breadcrumb, Cmd/Ctrl+K workspace search, global time selection,
demo notifications, and an account menu.

## Architecture

```text
apps/web/
  public/                   Local Earth texture, country geography, asset notices
  src/
    components/
      layout/               Shared shell, sidebar, header
      dashboard/            Metrics and intelligence brief
      maps/                 Lazy geographic engines, filters, indicator details
      charts/               Recharts visualizations
      tables/               Generic typed data table and threat table
      ui/                   shadcn-style Button, Radix dialogs, shared primitives
    pages/                  Route-level screens
    hooks/                  Query adapters and animation preferences
    services/               Axios client and replaceable demo adapters
    stores/                 Zustand workspace preferences
    types/                  Strict intelligence, incident, and analytics models
    utils/                  Filtering, timestamps, exports, class merging
    mocks/                  Reproducible fictional fixtures
    routes/                 Navigation metadata and lazy page routes
  tests/                    Playwright browser checks
```

Stack: React 19, strict TypeScript, Vite, Tailwind CSS 4, shadcn-style/Radix
primitives, Lucide, React Router, TanStack Query, Zustand, Recharts, MapLibre,
Axios, Three.js, React Three Fiber, drei, and GSAP. A small GLSL shader provides
the globe atmosphere. The shadcn component manifest is included for future additions.

## Data integrity and behavior

- Fixture time is **14 November 2026, 08:00 UTC**, not the current clock.
- IPs use RFC 5737 documentation ranges; hostnames use `.example`.
- Vulnerabilities use `DEMO-CVE-*` references and fictional product names, never
  counterfeit real CVE assignments.
- Source names describe intended future integration targets, not provenance of real
  ingested records.
- Map placements are illustrative country-level coordinates, not precise IP
  geolocation or attacker attribution.
- Connection animations are fictional associations with explicit endpoints, **not
  traffic flows or attack paths**. Filtered-out endpoints remove the corresponding arcs.
- Aggregate KPI values and distribution snapshots are fixed, illustrative examples,
  independent of the 15 detailed sample records. They do not change with the time
  selector. Time selection updates the map, indicator table, and activity chart.
- Copilot responses are deterministic text samples; no AI model is contacted.
- Sidebar, profile, and visualization preferences persist in local storage.
  Incident/integration changes live only in the TanStack Query cache and reset on reload.
- There is no authentication, authorization, telemetry ingestion, or security response
  execution. This frontend alone is not a production security boundary.

## Visualization and accessibility

The globe uses a local Earth texture, instanced severity-colored markers,
distance-based clustering, animated sample relationship arcs, atmosphere, and
subtle stars. Drag to rotate, scroll or use buttons to zoom, pause auto-rotation,
hover or click markers, and select countries to navigate.

Heavy engines are lazy-loaded, pixel ratio is capped at 1.5, and marker geometry is
shared. Globe animation stops in inactive tabs and honors reduced-motion preferences.
Devices without WebGL2 or with two or fewer reported logical processors default
to the 2D map. A 3D rendering error offers an explicit 2D fallback.
MapLibre also requires WebGL; if no renderer is available, an explicit error and
the keyboard-accessible indicator selector retain access to details.

Country geometry and the Earth texture are served locally. No external tile
service or map API key is needed. See
[`ASSET-NOTICES.txt`](./apps/web/public/ASSET-NOTICES.txt) for asset attribution.

## Future ASP.NET Core integration

Replace the asynchronous adapters in
[`services/api.ts`](./apps/web/src/services/api.ts), preserving their typed results
and query keys. The Axios instance is isolated from presentation components;
`VITE_API_BASE_URL` can configure its public API base URL later.
The demonstration adapters currently make **no API calls**, even if this variable
is set.

Do not place API keys or secrets in `VITE_*` variables: Vite embeds those values in
the public bundle. Authentication, input validation, credential storage, source
ingestion, auditing, and authorization must be implemented server-side before
connecting real data. Configure the production host to serve `index.html` for
client-side routes.

### Dependency compatibility

The lockfile is included for reproducible installs. A targeted
`@mapbox/jsonlint-lines-primitives` override pins 2.0.2 because 2.0.3 requires
Node.js 22 despite MapLibre's broader Node support. Revisit the override when
raising the project's Node minimum.