import {
  LayoutDashboard,
  Globe2,
  Radar,
  ShieldAlert,
  ChartNoAxesCombined,
  Sparkles,
  Siren,
  Blocks,
} from 'lucide-react'

export const navigation = [
  { path: '/', label: 'Overview', icon: LayoutDashboard, section: 'Workspace overview' },
  { path: '/map', label: 'Global Threat Map', icon: Globe2, section: 'Geospatial intelligence' },
  {
    path: '/intelligence',
    label: 'Threat Intelligence',
    icon: Radar,
    section: 'Indicator intelligence',
  },
  {
    path: '/vulnerabilities',
    label: 'Vulnerability Intel',
    icon: ShieldAlert,
    section: 'Vulnerability intelligence',
  },
  {
    path: '/analytics',
    label: 'Threat Analytics',
    icon: ChartNoAxesCombined,
    section: 'Intelligence analytics',
  },
  {
    path: '/copilot',
    label: 'AI Security Copilot',
    icon: Sparkles,
    section: 'AI security copilot',
  },
  { path: '/incidents', label: 'Incidents', icon: Siren, section: 'Incident management' },
  {
    path: '/integrations',
    label: 'Integrations',
    icon: Blocks,
    section: 'Data source integrations',
  },
]
