import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react'
import {
  Expand,
  Globe2,
  Info,
  LocateFixed,
  Map,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useThreats } from '../../hooks/useIntelligence'
import { useAppStore } from '../../stores/useAppStore'
import { filterThreats } from '../../utils/threats'
import type { ThreatFilters, ThreatIndicator } from '../../types'
import { severityColors } from '../../mocks/data'
import { Button } from '../ui/button'
import { EmptyState, QueryState, Select } from '../ui/primitives'
import { ThreatMapFilters } from './ThreatMapFilters'
import { ThreatDetailsPanel } from './ThreatDetailsPanel'

const GlobeView = lazy(() => import('./GlobeView'))
const MapView = lazy(() => import('./MapView'))

class VisualizationBoundary extends Component<
  { children: ReactNode; onFallback: () => void },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Threat visualization failed:', error, info.componentStack)
  }
  render() {
    if (this.state.failed)
      return (
        <div className="visualization-fallback">
          <Globe2 size={30} />
          <h3>3D rendering is unavailable</h3>
          <p>
            Your browser may not support WebGL. Use the geographic map or the accessible indicator
            selector.
          </p>
          <Button variant="outline" onClick={this.props.onFallback}>
            Switch to 2D map
          </Button>
        </div>
      )
    return this.props.children
  }
}
function supports3D() {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('webgl2')
  if (!context) return false
  context.getExtension('WEBGL_lose_context')?.loseContext()
  return (navigator.hardwareConcurrency ?? 4) > 2
}
export function ThreatMap({ fullscreen = false }: { fullscreen?: boolean }) {
  const { data = [], isPending, error } = useThreats()
  const { timeRange, mapMode, setMapMode, rotationPaused, toggleRotation } = useAppStore()
  const [capable] = useState(supports3D)
  const [filters, setFilters] = useState<ThreatFilters>({
    search: '',
    severity: 'All',
    category: 'All',
    country: 'All',
    timeRange,
  })
  const [selected, setSelected] = useState<ThreatIndicator | null>(null)
  const [zoom, setZoom] = useState(0)
  const [reset, setReset] = useState(0)
  const effectiveFilters = useMemo(() => ({ ...filters, timeRange }), [filters, timeRange])
  const filtered = useMemo(() => filterThreats(data, effectiveFilters), [data, effectiveFilters])
  const countries = useMemo(() => [...new Set(data.map((threat) => threat.country))].sort(), [data])
  const mode = capable ? mapMode : '2d'
  useEffect(() => {
    if (selected && !filtered.some((threat) => threat.id === selected.id)) setSelected(null)
  }, [filtered, selected])
  const props = {
    threats: filtered,
    onSelect: setSelected,
    zoom,
    reset,
    focusCountry: filters.country,
  }
  return (
    <section className={`panel threat-map-panel ${fullscreen ? 'map-fullscreen' : ''}`}>
      <div className="map-panel-heading">
        <div>
          <h2>
            <Globe2 size={16} />
            Global threat landscape
            <span className="map-demo-badge">
              <span />
              SIMULATED
            </span>
          </h2>
          <p>Geographic context. A connected perspective.</p>
        </div>
        <div className="map-heading-actions">
          <div className="segmented-control map-mode">
            <button
              className={mode === '3d' ? 'selected' : ''}
              disabled={!capable}
              title={!capable ? '3D requires a WebGL2-capable device' : '3D globe'}
              onClick={() => setMapMode('3d')}
            >
              <Globe2 size={13} />
              3D
            </button>
            <button className={mode === '2d' ? 'selected' : ''} onClick={() => setMapMode('2d')}>
              <Map size={13} />
              2D
            </button>
          </div>
          {!fullscreen && (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/map" aria-label="Expand global threat map">
                <Expand size={15} />
              </Link>
            </Button>
          )}
        </div>
      </div>
      <ThreatMapFilters filters={effectiveFilters} onChange={setFilters} countries={countries} />
      <div className="map-viewport">
        <QueryState error={error} loading={isPending} />
        {filtered.length === 0 && !isPending && !error ? (
          <EmptyState
            title="No indicators in this view"
            description="Change the category, severity, country, or global time range."
            action={
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({ ...filters, severity: 'All', category: 'All', country: 'All' })
                }
              >
                Reset map filters
              </Button>
            }
          />
        ) : (
          <VisualizationBoundary key={mode} onFallback={() => setMapMode('2d')}>
            <Suspense
              fallback={
                <div className="loading-state">
                  <span className="spinner" />
                  Loading visualization...
                </div>
              }
            >
              {mode === '3d' ? (
                <GlobeView {...props} paused={rotationPaused} />
              ) : (
                <MapView {...props} />
              )}
            </Suspense>
          </VisualizationBoundary>
        )}
        <div className="map-corner-label">
          <span className="tiny-cross">+</span> {filtered.length} SAMPLE INDICATORS
          <span>COUNTRY-LEVEL RESOLUTION</span>
        </div>
        <div className="map-controls">
          {mode === '3d' && (
            <Button
              size="icon"
              variant="secondary"
              aria-label={rotationPaused ? 'Resume globe rotation' : 'Pause globe rotation'}
              onClick={toggleRotation}
            >
              {rotationPaused ? <Play size={14} /> : <Pause size={14} />}
            </Button>
          )}
          <Button
            size="icon"
            variant="secondary"
            aria-label="Zoom in"
            onClick={() => setZoom((value) => Math.abs(value) + 1)}
          >
            <Plus size={16} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            aria-label="Zoom out"
            onClick={() => setZoom((value) => -(Math.abs(value) + 1))}
          >
            <Minus size={16} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            aria-label="Reset map view"
            onClick={() => {
              setReset((value) => value + 1)
              setFilters({ ...filters, country: 'All' })
            }}
          >
            <LocateFixed size={15} />
          </Button>
        </div>
        {selected && (
          <ThreatDetailsPanel
            key={selected.id}
            threat={selected}
            onClose={() => setSelected(null)}
          />
        )}
        <div className="map-bottom-info">
          <span>
            <span className="map-coordinate-dot" />
            {mode === '3d' ? 'Drag to rotate · Scroll to zoom' : 'Drag to pan · Scroll to zoom'}
          </span>
          <span>
            <RotateCcw size={11} />
            FIXTURE: 14 NOV 2026
          </span>
        </div>
      </div>
      <div className="map-legend">
        <div>
          {Object.entries(severityColors).map(([name, color]) => (
            <span key={name}>
              <i style={{ background: color }} />
              {name}
            </span>
          ))}
        </div>
        <span className="map-relations">
          <span className="dashed-line" />
          Fictional associations, not attack paths
        </span>
      </div>
      <div className="map-accessible-row">
        <Select
          label="Inspect a sample indicator"
          value={selected?.id ?? ''}
          onChange={(event) =>
            setSelected(filtered.find((threat) => threat.id === event.target.value) ?? null)
          }
        >
          <option value="">Inspect a sample indicator...</option>
          {filtered.map((threat) => (
            <option key={threat.id} value={threat.id}>
              {threat.country} · {threat.value} · {threat.severity}
            </option>
          ))}
        </Select>
        <span>
          <Info size={12} />
          Approximate locations, not attacker attribution.
        </span>
      </div>
    </section>
  )
}
