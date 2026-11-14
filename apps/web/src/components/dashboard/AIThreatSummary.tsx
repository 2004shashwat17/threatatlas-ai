import {
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Crosshair,
  Fingerprint,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { regions } from '../../mocks/data'

export function AIThreatSummary() {
  return (
    <section className="panel ai-summary">
      <div className="ai-summary-heading">
        <span className="ai-icon">
          <Sparkles size={17} />
        </span>
        <h2>Intelligence brief</h2>
        <span className="preview-label">AI PREVIEW</span>
      </div>
      <p className="ai-disclaimer">Sample narrative · not AI analysis of live data</p>
      <div className="ai-insights">
        <div>
          <span className="insight-icon teal">
            <TrendingUp size={15} />
          </span>
          <p>
            <strong>A shift in the threat landscape</strong>Illustrative phishing volume is trending
            upward across the sample dataset.
          </p>
        </div>
        <div>
          <span className="insight-icon amber">
            <Crosshair size={15} />
          </span>
          <p>
            <strong>Prioritize high-confidence signals</strong>Review critical botnet and ransomware
            indicators before taking action.
          </p>
        </div>
        <div>
          <span className="insight-icon purple">
            <Fingerprint size={15} />
          </span>
          <p>
            <strong>Connect the dots</strong>Investigate shared infrastructure. Corroborate
            associations with your own telemetry.
          </p>
        </div>
      </div>
      <Button asChild variant="outline" className="copilot-link">
        <Link to="/copilot">
          <Sparkles size={14} />
          Explore with AI Copilot
          <ArrowUpRight size={15} />
        </Link>
      </Button>
    </section>
  )
}
export function RegionalOverview() {
  return (
    <section className="panel regional-panel">
      <div className="compact-heading">
        <h2>Regional overview</h2>
        <Link to="/analytics" aria-label="View regional analytics">
          <ChevronRight size={16} />
        </Link>
      </div>
      {regions.slice(0, 3).map((region) => (
        <div className="region-row" key={region.name}>
          <div>
            <span>{region.name}</span>
            <strong>{region.value}%</strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${region.value * 2}%`, background: region.color }} />
          </div>
        </div>
      ))}
      <p className="subtle-note">Illustrative country-level distribution</p>
    </section>
  )
}
