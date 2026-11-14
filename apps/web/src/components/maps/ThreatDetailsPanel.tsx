import { useState } from 'react'
import { Check, Copy, ExternalLink, Info, MapPin, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ThreatIndicator } from '../../types'
import { SeverityBadge, StatusBadge } from '../ui/primitives'
import { Button } from '../ui/button'

export function ThreatDetailsPanel({
  threat,
  onClose,
}: {
  threat: ThreatIndicator
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')
  async function copy() {
    try {
      await navigator.clipboard.writeText(threat.value)
      setCopied(true)
      setCopyError('')
    } catch {
      setCopyError('Clipboard unavailable. Select and copy the indicator text manually.')
    }
  }
  return (
    <aside className="threat-details" aria-label="Threat indicator details">
      <div className="details-heading">
        <span className="eyebrow">INDICATOR DETAILS · DEMO</span>
        <Button variant="ghost" size="icon" aria-label="Close threat details" onClick={onClose}>
          <X size={17} />
        </Button>
      </div>
      <div className="details-value mono">
        {threat.value}
        <Button
          variant="ghost"
          size="icon"
          aria-label={copied ? 'Indicator copied' : 'Copy indicator'}
          onClick={copy}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </Button>
      </div>
      {copyError && (
        <p role="alert" className="error-text">
          {copyError}
        </p>
      )}
      <div className="details-badges">
        <SeverityBadge severity={threat.severity} />
        <StatusBadge status={threat.status} />
      </div>
      <dl className="detail-list">
        <div>
          <dt>Indicator type</dt>
          <dd>{threat.type}</dd>
        </div>
        <div>
          <dt>Threat category</dt>
          <dd>{threat.category}</dd>
        </div>
        <div>
          <dt>Source (fictional record)</dt>
          <dd>{threat.source}</dd>
        </div>
        <div>
          <dt>First seen (UTC)</dt>
          <dd>{new Date(threat.firstSeen).toISOString().replace('T', ' ').slice(0, 16)}</dd>
        </div>
        <div>
          <dt>Last seen (UTC)</dt>
          <dd>{new Date(threat.lastSeen).toISOString().replace('T', ' ').slice(0, 16)}</dd>
        </div>
        <div>
          <dt>Approximate location</dt>
          <dd>
            <MapPin size={12} />
            {threat.country}
          </dd>
        </div>
      </dl>
      <div className="confidence-label">
        <span>Source confidence</span>
        <strong>{threat.confidence}%</strong>
      </div>
      <div className="progress-track">
        <span style={{ width: `${threat.confidence}%` }} />
      </div>
      <div className="details-note">
        <Info size={14} />
        <p>
          Fictional, country-level placement. IP geolocation does not identify an attacker or a
          precise physical location.
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link to={`/copilot?indicator=${encodeURIComponent(threat.value)}`}>
          Investigate with Copilot
          <ExternalLink size={13} />
        </Link>
      </Button>
    </aside>
  )
}
