export type Severity = 'Critical' | 'High' | 'Medium' | 'Low'
export type ThreatCategory =
  'Malware' | 'Phishing' | 'Botnet' | 'Ransomware' | 'Exploit' | 'Suspicious IPs'
export type TimeRange = '24h' | '7d' | '30d'
export interface ThreatIndicator {
  id: string
  value: string
  type: 'IPv4' | 'Domain' | 'URL' | 'SHA-256'
  category: ThreatCategory
  severity: Severity
  source: string
  country: string
  countryCode: string
  coordinates: [number, number]
  firstSeen: string
  lastSeen: string
  confidence: number
  status: 'Active' | 'Investigating' | 'Contained'
}
export interface Incident {
  id: string
  title: string
  severity: Severity
  status: 'Open' | 'Investigating' | 'Contained' | 'Resolved'
  analyst: string
  createdAt: string
  updatedAt: string
  indicators: number
}
export interface ActivityPoint {
  label: string
  total: number
  critical: number
  high: number
  medium: number
}
export interface Vulnerability {
  id: string
  score: number
  severity: Severity
  product: string
  description: string
  exploited: boolean
  published: string
}
export interface Integration {
  id: string
  name: string
  category: string
  description: string
  color: string
  initials: string
  indicators: string
  status: 'Connected' | 'Not connected'
}
export interface ThreatFilters {
  search: string
  severity: Severity | 'All'
  category: ThreatCategory | 'All'
  country: string
  timeRange: TimeRange
}
