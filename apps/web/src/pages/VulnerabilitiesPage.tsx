import { useMemo, useState } from 'react'
import { Bug, Check, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useVulnerabilities } from '../hooks/useIntelligence'
import {
  Modal,
  PageHeading,
  QueryState,
  SearchBar,
  Select,
  SeverityBadge,
} from '../components/ui/primitives'
import { DataTable, type Column } from '../components/tables/DataTable'
import type { Severity, Vulnerability } from '../types'
import { formatDate } from '../utils/threats'

export default function VulnerabilitiesPage() {
  const { data = [], error, isPending } = useVulnerabilities()
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState<Severity | 'All'>('All')
  const [kev, setKev] = useState('All')
  const [selected, setSelected] = useState<Vulnerability | null>(null)
  const filtered = useMemo(
    () =>
      data.filter(
        (row) =>
          `${row.id} ${row.product} ${row.description}`
            .toLowerCase()
            .includes(search.toLowerCase()) &&
          (severity === 'All' || severity === row.severity) &&
          (kev === 'All' || row.exploited === (kev === 'Exploited')),
      ),
    [data, search, severity, kev],
  )
  const columns: Column<Vulnerability>[] = [
    {
      key: 'id',
      label: 'CVE / demo reference',
      sortValue: (row) => row.id,
      render: (row) => (
        <button className="text-link mono" onClick={() => setSelected(row)}>
          {row.id}
        </button>
      ),
    },
    {
      key: 'product',
      label: 'Affected product',
      sortValue: (row) => row.product,
      render: (row) => (
        <div className="table-two-line">
          <strong>{row.product}</strong>
          <span>{row.description}</span>
        </div>
      ),
    },
    {
      key: 'score',
      label: 'CVSS',
      sortValue: (row) => row.score,
      render: (row) => (
        <span
          className={`cvss-score ${row.score >= 9 ? 'critical' : row.score >= 7 ? 'high' : ''}`}
        >
          {row.score.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'severity',
      label: 'Severity',
      sortValue: (row) => row.score,
      render: (row) => <SeverityBadge severity={row.severity} />,
    },
    {
      key: 'exploited',
      label: 'Known exploited',
      sortValue: (row) => Number(row.exploited),
      render: (row) =>
        row.exploited ? (
          <span className="kev-badge">
            <Check size={12} />
            Yes · demo
          </span>
        ) : (
          <span className="muted">Not listed</span>
        ),
    },
    {
      key: 'published',
      label: 'Published',
      sortValue: (row) => row.published,
      render: (row) => formatDate(row.published),
    },
  ]
  return (
    <>
      <PageHeading
        title="Know your exposure."
        description="Prioritize vulnerabilities by severity, exploitation, and business context."
      />
      <div className="notice">
        <Bug size={16} />
        All references, affected products, scores, and exploitation flags below are fictional.
        DEMO-CVE identifiers are not real CVE assignments.
      </div>
      <div className="mini-stats-grid">
        <div className="panel mini-stat">
          <ShieldAlert size={20} />
          <span>
            Critical vulnerabilities
            <strong>{data.filter((row) => row.severity === 'Critical').length}</strong>
          </span>
        </div>
        <div className="panel mini-stat">
          <Bug size={20} />
          <span>
            Known exploited · demo<strong>{data.filter((row) => row.exploited).length}</strong>
          </span>
        </div>
        <div className="panel mini-stat">
          <ShieldCheck size={20} />
          <span>
            Tracked vulnerabilities<strong>{data.length}</strong>
          </span>
        </div>
      </div>
      <section className="panel">
        <div className="table-toolbar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search reference, product, or description..."
            label="Search vulnerabilities"
          />
          <div className="table-filter-group">
            <Select
              label="Vulnerability severity"
              value={severity}
              onChange={(event) => setSeverity(event.target.value as Severity | 'All')}
            >
              <option value="All">All severities</option>
              {['Critical', 'High', 'Medium', 'Low'].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
            <Select
              label="Exploitation status"
              value={kev}
              onChange={(event) => setKev(event.target.value)}
            >
              <option value="All">All exploitation states</option>
              <option value="Exploited">Known exploited</option>
              <option value="Not exploited">Not listed</option>
            </Select>
          </div>
        </div>
        <QueryState error={error} loading={isPending} />
        {!error && !isPending && (
          <DataTable data={filtered} columns={columns} label="Vulnerabilities" />
        )}
      </section>
      <Modal
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        title={selected?.id ?? 'Vulnerability'}
        description="Fictional vulnerability record. Not a real CVE advisory."
      >
        {selected && (
          <div className="vulnerability-detail">
            <SeverityBadge severity={selected.severity} />
            <h3>{selected.product}</h3>
            <p>{selected.description}</p>
            <dl className="detail-list">
              <div>
                <dt>CVSS score (demo)</dt>
                <dd>{selected.score.toFixed(1)}</dd>
              </div>
              <div>
                <dt>Known exploited (demo)</dt>
                <dd>{selected.exploited ? 'Yes' : 'Not listed'}</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>{formatDate(selected.published)}</dd>
              </div>
            </dl>
            <div className="notice">
              In production, validate the vendor advisory and affected versions before applying
              mitigations. No remediation recommendation is inferred from this fictional record.
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
