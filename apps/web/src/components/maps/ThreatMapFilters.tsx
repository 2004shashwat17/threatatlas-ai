import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import { categories } from '../../mocks/data'
import type { Severity, ThreatCategory, ThreatFilters } from '../../types'
import { Select } from '../ui/primitives'
import { Button } from '../ui/button'

export function ThreatMapFilters({
  filters,
  onChange,
  countries,
}: {
  filters: ThreatFilters
  onChange: (filters: ThreatFilters) => void
  countries: string[]
}) {
  const filtered =
    filters.country !== 'All' || filters.severity !== 'All' || filters.category !== 'All'
  return (
    <div className="map-filters">
      <SlidersHorizontal size={14} />
      <Select
        label="Map country"
        value={filters.country}
        onChange={(event) => onChange({ ...filters, country: event.target.value })}
      >
        <option value="All">All countries</option>
        {countries.map((country) => (
          <option key={country}>{country}</option>
        ))}
      </Select>
      <Select
        label="Map threat category"
        value={filters.category}
        onChange={(event) =>
          onChange({ ...filters, category: event.target.value as ThreatCategory | 'All' })
        }
      >
        <option value="All">All categories</option>
        {categories.map((category) => (
          <option key={category}>{category}</option>
        ))}
      </Select>
      <Select
        label="Map severity"
        value={filters.severity}
        onChange={(event) =>
          onChange({ ...filters, severity: event.target.value as Severity | 'All' })
        }
      >
        <option value="All">All severities</option>
        {(['Critical', 'High', 'Medium', 'Low'] as const).map((severity) => (
          <option key={severity}>{severity}</option>
        ))}
      </Select>
      {filtered && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Reset map filters"
          onClick={() => onChange({ ...filters, country: 'All', category: 'All', severity: 'All' })}
        >
          <RotateCcw size={14} />
        </Button>
      )}
    </div>
  )
}
