export type Severity = 'critical' | 'high' | 'medium'

export type Threat = {
  id: string
  title: string
  category: string
  actor: string
  indicator: string
  source: string
  sourceMark: string
  severity: Severity
  detected: string
  icon: string
}

export const threats: Threat[] = [
  {
    id: 'TA-2401',
    title: 'Credential harvesting campaign',
    category: 'Phishing',
    actor: 'MINT SAND',
    indicator: 'login-northstar.example',
    source: 'OpenPhish',
    sourceMark: '◉',
    severity: 'critical',
    detected: '2 min ago',
    icon: 'pulse',
  },
  {
    id: 'TA-2402',
    title: 'Exposed admin panel detected',
    category: 'Attack surface',
    actor: 'Unattributed',
    indicator: '198.51.100.27',
    source: 'Shodan',
    sourceMark: '◈',
    severity: 'high',
    detected: '18 min ago',
    icon: 'globe',
  },
  {
    id: 'TA-2403',
    title: 'Malicious payload observed',
    category: 'Malware',
    actor: 'EMBER FOX',
    indicator: 'update-service.example',
    source: 'URLhaus',
    sourceMark: '◉',
    severity: 'high',
    detected: '34 min ago',
    icon: 'shield',
  },
  {
    id: 'TA-2404',
    title: 'Suspicious DNS beaconing',
    category: 'Command & control',
    actor: 'Unattributed',
    indicator: '203.0.113.84',
    source: 'ThreatFox',
    sourceMark: '◌',
    severity: 'medium',
    detected: '51 min ago',
    icon: 'nodes',
  },
  {
    id: 'TA-2405',
    title: 'Lookalike domain registered',
    category: 'Brand abuse',
    actor: 'MINT SAND',
    indicator: 'northstar-auth.example',
    source: 'Community',
    sourceMark: '◎',
    severity: 'medium',
    detected: '1 hr ago',
    icon: 'globe',
  },
]

export function filterThreats(
  records: Threat[],
  query: string,
  severity: Severity | 'all',
): Threat[] {
  const normalizedQuery = query.trim().toLowerCase()

  return records.filter((threat) => {
    const matchesSeverity = severity === 'all' || threat.severity === severity
    const searchableText = [
      threat.title,
      threat.category,
      threat.actor,
      threat.indicator,
      threat.source,
    ].join(' ').toLowerCase()

    return matchesSeverity && (!normalizedQuery || searchableText.includes(normalizedQuery))
  })
}
