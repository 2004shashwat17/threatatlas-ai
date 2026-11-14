import { useMemo, useState } from 'react'
import { ArrowUpRight, Download, Globe2, Hash, Link2, Network } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useThreats } from '../../hooks/useIntelligence'
import { useAppStore } from '../../stores/useAppStore'
import type { Severity, ThreatCategory, ThreatIndicator } from '../../types'
import { categories } from '../../mocks/data'
import { filterThreats, relativeTime, severityRank } from '../../utils/threats'
import { downloadJSON } from '../../utils/export'
import { Button } from '../ui/button'
import {
  Modal,
  QueryState,
  SearchBar,
  SectionHeading,
  Select,
  SeverityBadge,
  StatusBadge,
} from '../ui/primitives'
import { DataTable, type Column } from './DataTable'
import { ThreatDetailsPanel } from '../maps/ThreatDetailsPanel'

const icons = { IPv4: Network, Domain: Globe2, URL: Link2, 'SHA-256': Hash }
export function RecentThreatTable({
  full = false,
  initialSearch = '',
}: {
  full?: boolean
  initialSearch?: string
}) {
  const { data = [], error, isPending } = useThreats()
  const timeRange = useAppStore((state) => state.timeRange)
  const [search, setSearch] = useState(initialSearch)
  const [severity, setSeverity] = useState<Severity | 'All'>('All')
  const [category, setCategory] = useState<ThreatCategory | 'All'>('All')
  const [selected, setSelected] = useState<ThreatIndicator | null>(null)
  const filtered = useMemo(
    () => filterThreats(data, { search, severity, category, country: 'All', timeRange }),
    [data, search, severity, category, timeRange],
  )
  const columns: Column<ThreatIndicator>[] = [
    {
      key: 'value',
      label: 'Indicator',
      sortValue: (row) => row.value,
      render: (row) => {
        const Icon = icons[row.type]
        return (
          <button
            className="indicator-cell"
            onClick={() => setSelected(row)}
            title={`Inspect ${row.value}`}
          >
            <span className="indicator-type-icon">
              <Icon size={13} />
            </span>
            <span className="mono truncate">{row.value}</span>
          </button>
        )
      },
    },
    {
      key: 'type',
      label: 'Type',
      sortValue: (row) => row.type,
      render: (row) => <span className="type-tag">{row.type}</span>,
    },
    {
      key: 'category',
      label: 'Category',
      sortValue: (row) => row.category,
      render: (row) => row.category,
    },
    {
      key: 'severity',
      label: 'Severity',
      sortValue: (row) => severityRank[row.severity],
      render: (row) => <SeverityBadge severity={row.severity} />,
    },
    {
      key: 'source',
      label: 'Source',
      sortValue: (row) => row.source,
      render: (row) => (
        <span className="source-name">
          <span />
          {row.source}
        </span>
      ),
    },
    {
      key: 'country',
      label: 'Country',
      sortValue: (row) => row.country,
      render: (row) => (
        <span className="country-cell">
          <span className="country-code">{row.countryCode}</span>
          {row.country}
        </span>
      ),
    },
    {
      key: 'seen',
      label: 'First seen',
      sortValue: (row) => row.firstSeen,
      render: (row) => (
        <span title={`${row.firstSeen} (relative to fixture time)`}>
          {relativeTime(row.firstSeen)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortValue: (row) => row.status,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ]
  return (
    <section className="panel intelligence-table-panel">
      <SectionHeading
        title={full ? 'Indicator intelligence' : 'Recent threat intelligence'}
        description="Fictional indicators · reserved addresses and example domains"
        action={
          full ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadJSON('threatatlas-demo-indicators.json', filtered)}
            >
              <Download size={13} />
              Export JSON
            </Button>
          ) : (
            <Link className="text-link" to="/intelligence">
              View all intelligence
              <ArrowUpRight size={14} />
            </Link>
          )
        }
      />
      <div className="table-toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <div className="table-filter-group">
          <Select
            label="Table severity"
            value={severity}
            onChange={(event) => setSeverity(event.target.value as Severity | 'All')}
          >
            <option value="All">All severities</option>
            {(['Critical', 'High', 'Medium', 'Low'] as const).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Select
            label="Table category"
            value={category}
            onChange={(event) => setCategory(event.target.value as ThreatCategory | 'All')}
          >
            <option value="All">All categories</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
      </div>
      <QueryState error={error} loading={isPending} />
      {!error && !isPending && (
        <DataTable
          data={filtered}
          columns={columns}
          label="Threat indicators"
          pageSize={full ? 10 : 6}
        />
      )}
      <Modal
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        title="Threat intelligence record"
        description="A fictional indicator for exploring the investigation workflow."
      >
        {selected && (
          <ThreatDetailsPanel
            key={selected.id}
            threat={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </Modal>
    </section>
  )
}
