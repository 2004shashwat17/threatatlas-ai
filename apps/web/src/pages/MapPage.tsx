import { Globe2, Info } from 'lucide-react'
import { PageHeading } from '../components/ui/primitives'
import { ThreatMap } from '../components/maps/ThreatMap'
import { useAppStore } from '../stores/useAppStore'
import type { TimeRange } from '../types'

export default function MapPage() {
  const { timeRange, setTimeRange } = useAppStore()
  return (
    <>
      <PageHeading
        title="A world of context."
        description="Explore geographic relationships in your demonstration intelligence."
      />
      <ThreatMap fullscreen />
      <section className="panel timeline-panel">
        <div>
          <Globe2 size={17} />
          <strong>Observation window</strong>
          <span>Ending 14 Nov 2026, 08:00 UTC</span>
        </div>
        <div className="timeline-options">
          {(['24h', '7d', '30d'] as TimeRange[]).map((range) => (
            <button
              key={range}
              className={range === timeRange ? 'selected' : ''}
              onClick={() => setTimeRange(range)}
            >
              <span />
              {range === '24h' ? 'Last 24 hours' : range === '7d' ? 'Last 7 days' : 'Last 30 days'}
            </button>
          ))}
        </div>
      </section>
      <div className="notice">
        <Info size={16} />
        <span>
          Markers represent fictional, approximate country-level locations. Connections are sample
          associations with known endpoints, not observed traffic or live attack paths. Use the
          selector below the map for keyboard-accessible inspection.
        </span>
      </div>
    </>
  )
}
