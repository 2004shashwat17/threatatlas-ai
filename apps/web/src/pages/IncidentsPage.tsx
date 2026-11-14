import { useMemo, useState, type FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Check, Plus, Siren } from 'lucide-react'
import { useIncidents } from '../hooks/useIntelligence'
import {
  Modal,
  PageHeading,
  QueryState,
  SearchBar,
  Select,
  SeverityBadge,
  StatusBadge,
} from '../components/ui/primitives'
import { Button } from '../components/ui/button'
import { DataTable, type Column } from '../components/tables/DataTable'
import type { Incident, Severity } from '../types'
import { formatDate, relativeTime, severityRank } from '../utils/threats'
import { DEMO_NOW } from '../mocks/data'

export default function IncidentsPage() {
  const { data = [], error, isPending } = useIncidents()
  const client = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [selected, setSelected] = useState<Incident | null>(null)
  const [creating, setCreating] = useState(false)
  const [notice, setNotice] = useState('')
  const filtered = useMemo(
    () =>
      data.filter(
        (row) =>
          `${row.id} ${row.title} ${row.analyst}`.toLowerCase().includes(search.toLowerCase()) &&
          (status === 'All' || row.status === status),
      ),
    [data, search, status],
  )
  const columns: Column<Incident>[] = [
    {
      key: 'id',
      label: 'Incident ID',
      sortValue: (row) => row.id,
      render: (row) => (
        <button className="text-link mono" onClick={() => setSelected(row)}>
          {row.id}
        </button>
      ),
    },
    {
      key: 'title',
      label: 'Incident',
      sortValue: (row) => row.title,
      render: (row) => (
        <button className="incident-title" onClick={() => setSelected(row)}>
          {row.title}
          <small>{row.indicators} related indicators · demo</small>
        </button>
      ),
    },
    {
      key: 'severity',
      label: 'Severity',
      sortValue: (row) => severityRank[row.severity],
      render: (row) => <SeverityBadge severity={row.severity} />,
    },
    {
      key: 'status',
      label: 'Status',
      sortValue: (row) => row.status,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'analyst',
      label: 'Assigned analyst',
      sortValue: (row) => row.analyst,
      render: (row) => (
        <span className="analyst-cell">
          <span className="avatar avatar-tiny">
            {row.analyst
              .split(' ')
              .map((part) => part[0])
              .join('')}
          </span>
          {row.analyst}
        </span>
      ),
    },
    {
      key: 'created',
      label: 'Created',
      sortValue: (row) => row.createdAt,
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'updated',
      label: 'Last updated',
      sortValue: (row) => row.updatedAt,
      render: (row) => relativeTime(row.updatedAt),
    },
  ]
  function createIncident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const title = String(form.get('title') ?? '').trim()
    if (!title) {
      const input = event.currentTarget.elements.namedItem('title')
      if (input instanceof HTMLInputElement) {
        input.setCustomValidity(
          'Enter an incident title containing at least one non-space character.',
        )
        input.reportValidity()
        input.addEventListener('input', () => input.setCustomValidity(''), { once: true })
      }
      return
    }
    const incident: Incident = {
      id: `INC-${Math.max(...data.map((row) => Number(row.id.slice(4))), 2048) + 1}`,
      title,
      severity: form.get('severity') as Severity,
      status: 'Open',
      analyst: String(form.get('analyst')),
      createdAt: DEMO_NOW.toISOString(),
      updatedAt: DEMO_NOW.toISOString(),
      indicators: 0,
    }
    client.setQueryData<Incident[]>(['incidents', 'demo'], (previous) => [
      incident,
      ...(previous ?? []),
    ])
    setCreating(false)
    setNotice(`${incident.id} created in this demo session. No backend changes were made.`)
  }
  function updateIncident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selected) return
    const form = new FormData(event.currentTarget)
    const updated: Incident = {
      ...selected,
      status: form.get('status') as Incident['status'],
      analyst: String(form.get('analyst')),
      updatedAt: DEMO_NOW.toISOString(),
    }
    client.setQueryData<Incident[]>(['incidents', 'demo'], (previous) =>
      previous?.map((row) => (row.id === updated.id ? updated : row)),
    )
    setSelected(null)
    setNotice(`${updated.id} updated in this demo session. No response actions were taken.`)
  }
  return (
    <>
      <PageHeading
        title="From intelligence to action."
        description="Coordinate investigations and track your team's response."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus size={15} />
            Create demo incident
          </Button>
        }
      />
      <div className="mini-stats-grid">
        <div className="panel mini-stat">
          <Siren size={20} />
          <span>
            Open incidents<strong>{data.filter((row) => row.status === 'Open').length}</strong>
          </span>
        </div>
        <div className="panel mini-stat">
          <Siren size={20} />
          <span>
            Under investigation
            <strong>{data.filter((row) => row.status === 'Investigating').length}</strong>
          </span>
        </div>
        <div className="panel mini-stat">
          <Check size={20} />
          <span>
            Contained or resolved
            <strong>
              {data.filter((row) => ['Contained', 'Resolved'].includes(row.status)).length}
            </strong>
          </span>
        </div>
      </div>
      {notice && (
        <div role="status" className="notice success">
          <Check size={15} />
          {notice}
        </div>
      )}
      <section className="panel">
        <div className="table-toolbar">
          <SearchBar
            value={search}
            onChange={setSearch}
            label="Search incidents"
            placeholder="Search incident ID, title, or analyst..."
          />
          <Select
            label="Incident status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="All">All statuses</option>
            {['Open', 'Investigating', 'Contained', 'Resolved'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
        <QueryState error={error} loading={isPending} />
        {!error && !isPending && <DataTable data={filtered} columns={columns} label="Incidents" />}
      </section>
      <p className="subtle-note">
        Changes are held in memory for this demo session and reset on reload. No real incident
        actions are performed.
      </p>
      <Modal
        open={creating}
        onOpenChange={setCreating}
        title="Create a demo incident"
        description="Create a fictional investigation record. Saved only for this browser session."
      >
        <form className="form-grid" onSubmit={createIncident}>
          <label>
            Incident title
            <input
              name="title"
              placeholder="Describe the investigation"
              required
              maxLength={160}
              pattern={String.raw`.*\S.*`}
            />
          </label>
          <label>
            Severity
            <select name="severity">
              {['Critical', 'High', 'Medium', 'Low'].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <AnalystField />
          <Button type="submit">
            <Plus size={14} />
            Create demo incident
          </Button>
        </form>
      </Modal>
      <Modal
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        title={selected?.id ?? 'Incident'}
        description="Update a fictional incident. No security actions will be performed."
      >
        {selected && (
          <form className="form-grid" onSubmit={updateIncident}>
            <h3>{selected.title}</h3>
            <SeverityBadge severity={selected.severity} />
            <label>
              Status
              <select name="status" defaultValue={selected.status}>
                {['Open', 'Investigating', 'Contained', 'Resolved'].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <AnalystField defaultValue={selected.analyst} />
            <Button type="submit">Save demo changes</Button>
          </form>
        )}
      </Modal>
    </>
  )
}
function AnalystField({ defaultValue = 'Alex Morgan' }: { defaultValue?: string }) {
  return (
    <label>
      Assigned analyst
      <select name="analyst" defaultValue={defaultValue}>
        {['Alex Morgan', 'Sarah Chen', 'James Wilson'].map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>
    </label>
  )
}
