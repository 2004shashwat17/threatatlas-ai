import { describe, expect, it } from 'vitest'
import { activity, demoConnections, threats } from '../mocks/data'
import type { ThreatFilters } from '../types'
import { filterThreats, relativeTime } from './threats'
import { getDemoResponse } from '../services/copilot'

const filters: ThreatFilters = {
  search: '',
  severity: 'All',
  category: 'All',
  country: 'All',
  timeRange: '24h',
}
describe('demonstration intelligence', () => {
  it('filters against fixture time, not the current clock', () => {
    expect(filterThreats(threats, filters)).toHaveLength(10)
    expect(filterThreats(threats, { ...filters, timeRange: '7d' })).toHaveLength(13)
    expect(filterThreats(threats, { ...filters, timeRange: '30d' })).toHaveLength(15)
  })
  it('combines country, category, severity and case-insensitive search', () => {
    expect(
      filterThreats(threats, {
        ...filters,
        country: 'United States',
        severity: 'Critical',
        category: 'Botnet',
        search: '  198.51.100  ',
      }).map((t) => t.id),
    ).toEqual(['ioc-001'])
    expect(filterThreats(threats, { ...filters, country: 'Japan', severity: 'Critical' })).toEqual(
      [],
    )
  })
  it('searches source, country, type and domain values', () => {
    for (const search of ['ThreatFox', 'Germany', 'IPv4', 'secure-update.example']) {
      expect(filterThreats(threats, { ...filters, search }).length).toBeGreaterThan(0)
    }
  })
  it('only draws associations with explicit valid endpoints', () => {
    const ids = new Set(threats.map((t) => t.id))
    for (const connection of demoConnections) {
      expect(ids.has(connection.from)).toBe(true)
      expect(ids.has(connection.to)).toBe(true)
      expect(connection.label).toContain('Fictional')
    }
  })
  it('uses safe, fictional network indicators', () => {
    for (const threat of threats) {
      if (threat.type === 'IPv4')
        expect(threat.value).toMatch(/^(192\.0\.2|198\.51\.100|203\.0\.113)\./)
      if (threat.type === 'Domain' || threat.type === 'URL')
        expect(threat.value).toContain('.example')
      expect(threat.coordinates[0]).toBeGreaterThanOrEqual(-180)
      expect(threat.coordinates[0]).toBeLessThanOrEqual(180)
      expect(threat.confidence).toBeLessThanOrEqual(100)
    }
  })
  it('keeps chart severity totals consistent', () => {
    for (const rows of Object.values(activity))
      for (const row of rows) {
        expect(row.total).toBe(row.critical + row.high + row.medium)
      }
  })
  it('formats relative timestamps from the fixture', () => {
    expect(relativeTime('2026-11-14T07:48:00Z')).toBe('12m ago')
    expect(relativeTime('2026-11-13T08:00:00Z')).toBe('1d ago')
  })
  it('labels mock responses and does not invent an attacker location', () => {
    expect(getDemoResponse('Explain 198.51.100.24')).toContain('reserved documentation address')
    expect(getDemoResponse('Explain 198.51.100.24')).toContain('not an attacker location')
    expect(getDemoResponse('random prompt')).toContain('predefined examples')
    expect(getDemoResponse('related indicators')).toContain('not observed traffic')
  })
})
