import { DEMO_NOW } from '../mocks/data'
import type { ThreatFilters, ThreatIndicator } from '../types'

export const severityRank = { Critical: 0, High: 1, Medium: 2, Low: 3 }
export function filterThreats(threats: ThreatIndicator[], filters: ThreatFilters) {
  const search = filters.search.trim().toLowerCase()
  const cutoff =
    DEMO_NOW.getTime() - { '24h': 24, '7d': 168, '30d': 720 }[filters.timeRange] * 3_600_000
  return threats.filter(
    (threat) =>
      (!search ||
        [threat.value, threat.type, threat.country, threat.category, threat.source].some((value) =>
          value.toLowerCase().includes(search),
        )) &&
      (filters.severity === 'All' || threat.severity === filters.severity) &&
      (filters.category === 'All' || threat.category === filters.category) &&
      (filters.country === 'All' || threat.country === filters.country) &&
      new Date(threat.lastSeen).getTime() >= cutoff,
  )
}
export function relativeTime(value: string) {
  const minutes = Math.max(1, Math.round((DEMO_NOW.getTime() - new Date(value).getTime()) / 60_000))
  if (minutes < 60) return `${minutes}m ago`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
  return `${Math.floor(minutes / 1440)}d ago`
}
export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}
