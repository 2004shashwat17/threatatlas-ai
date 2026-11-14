import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowUpRight, Check, Database, Info, Plug, Unplug } from 'lucide-react'
import { useIntegrations } from '../hooks/useIntelligence'
import { Modal, PageHeading, QueryState, StatusBadge } from '../components/ui/primitives'
import { Button } from '../components/ui/button'
import type { Integration } from '../types'

export default function IntegrationsPage() {
  const { data = [], error, isPending } = useIntegrations()
  const client = useQueryClient()
  const [selected, setSelected] = useState<Integration | null>(null)
  const [notice, setNotice] = useState('')
  function toggle() {
    if (!selected) return
    const status = selected.status === 'Connected' ? 'Not connected' : 'Connected'
    client.setQueryData<Integration[]>(['integrations', 'demo'], (previous) =>
      previous?.map((item) => (item.id === selected.id ? { ...item, status } : item)),
    )
    setNotice(
      `${selected.name}: demo status changed to "${status}". No connection was made and no API was contacted.`,
    )
    setSelected(null)
  }
  return (
    <>
      <PageHeading
        title="Better together. By design."
        description="Bring your intelligence sources into one connected workspace."
      />
      <div className="notice">
        <Info size={16} />
        <span>
          Connection states and indicator totals are UI demonstrations only. No external APIs,
          credentials, or data feeds are connected. Changes reset on reload.
        </span>
      </div>
      {notice && (
        <div className="notice success" role="status">
          <Check size={15} />
          {notice}
        </div>
      )}
      <div className="integrations-overview">
        <div>
          <span className="eyebrow">YOUR INTELLIGENCE ECOSYSTEM</span>
          <h2>Purpose-built for a connected SOC.</h2>
          <p>Curated sources. Consistent context. A foundation for your future data pipeline.</p>
        </div>
        <div className="integration-totals">
          <strong>
            {data.filter((item) => item.status === 'Connected').length}
            <span>/ {data.length}</span>
          </strong>
          <span>simulated connections</span>
        </div>
      </div>
      <QueryState error={error} loading={isPending} />
      <div className="integrations-grid">
        {data.map((integration) => (
          <article className="panel integration-card" key={integration.id}>
            <div className="integration-card-top">
              <span
                className="integration-logo"
                style={{
                  color: integration.color,
                  background: `${integration.color}12`,
                  borderColor: `${integration.color}28`,
                }}
              >
                {integration.initials}
              </span>
              <StatusBadge status={integration.status} />
            </div>
            <h2>{integration.name}</h2>
            <span className="integration-category">{integration.category}</span>
            <p>{integration.description}</p>
            <div className="integration-metrics">
              <span>
                <Database size={13} />
                Sample indicators
              </span>
              <strong>{integration.indicators}</strong>
            </div>
            <Button variant="outline" onClick={() => setSelected(integration)}>
              <Plug size={14} />
              Configure demo
              <ArrowUpRight size={14} />
            </Button>
          </article>
        ))}
      </div>
      <Modal
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        title={`${selected?.name ?? ''} integration preview`}
        description="Explore the connection state UI. This does not configure a real integration."
      >
        {selected && (
          <div className="form-grid">
            <div className="notice">
              <Info size={16} />
              Do not enter API keys. Authentication and ingestion belong in your future backend.
            </div>
            <dl className="detail-list">
              <div>
                <dt>Source</dt>
                <dd>{selected.name}</dd>
              </div>
              <div>
                <dt>Demo state</dt>
                <dd>
                  <StatusBadge status={selected.status} />
                </dd>
              </div>
            </dl>
            <Button onClick={toggle}>
              {selected.status === 'Connected' ? <Unplug size={15} /> : <Plug size={15} />}
              {selected.status === 'Connected' ? 'Simulate disconnection' : 'Simulate connection'}
            </Button>
          </div>
        )}
      </Modal>
    </>
  )
}
